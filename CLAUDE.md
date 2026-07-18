# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository shape

Two **independent** subprojects with separate toolchains, not wired together:

- `model/` — **Attune AI**, the actual hackathon deliverable. A Python 3.13 concordance engine (`attune` package). This is where the product lives.
- `frontend/` — a pnpm/Replit workspace scaffold (Express API + Drizzle/Postgres + Orval codegen + Vite React sandbox). Mostly boilerplate so far: the DB schema is an empty stub and `replit.md` is still an unfilled template.

Built for the eMed × OpenAI hackathon (London, 17–18 Jul 2026).

## model/ — Attune concordance engine

Managed with `uv` (deps) and `mise` (task runner). Python 3.13, pytest, ruff, pre-commit.

```bash
mise run init                       # uv sync --extra dev + pre-commit install
# or: uv venv && uv pip install -e ".[dev]"

uv run pytest                       # full suite
uv run pytest tests/test_concordance.py::test_single_axis_blip_does_not_fire   # one test
mise run test                       # branch-scoped pre-commit + pytest

uv run attune-seed                  # write seeded synthetic patients to data/
uv run attune-demo                  # narrate PCOS + veteran packs end-to-end
uv run attune-demo attunefm         # AttuneFM-lite multimodal pack
mise run demo-attunefm-profile firefighter_recovery   # a single named profile
```

### Architecture (the big idea)

**One engine, swappable config packs.** Everything condition-specific lives in a `ConditionPack`; everything else is shared engine code. This is the pitch — the same code becomes PCOS care, veteran mind-body care, or a general "AttuneFM-lite" nurse layer by swapping configuration, not engine code.

Pipeline (`src/attune/concordance_engine/`), each stage reads the previous:

- `memory.py` — typed longitudinal `Signal` store; window/baseline queries per person.
- `concordance.py` — personal baselines (robust median/MAD z-scores) + cross-axis drift.
- `safety.py` — tiered escalation (Green/Amber/Red) with a **deterministic crisis floor**.
- `brief.py` — maps memory onto the pack's `BriefTemplate` → clinician sections.
- `engine.py` — ties memory + pack together; exposes `ingest / reflect / assess / brief`. `PACKS` registry + `load(name)`.

`packs/base.py` is the swappable surface (`ConditionPack`: signal→axis map, coupling hypotheses, brief template, persona, escalation contract, voice-first `checkin` routine). Concrete packs: `pcos.py`, `veteran.py`, `attunefm.py`. Axes live in `packs/axes.py`.

Around the engine: `checkin.py` (voice-first daily routine → typed `Signal`s via `record_checkin`), `attunefm.py` (monitoring scores over the shared memory), `capture/` (audio/text/image transports — currently the roadmap step: wiring Realtime voice + GPT-4o vision into `record_checkin`), `datasets.py` (public-dataset registry grounding each modality), `synth.py` (seeded patients with a *planted* concordant flare), `reporting.py` (render a `Brief` to clinician markdown).

Two invariants that are load-bearing (tests lock them):

- **Concordance = specificity.** Early-warning fires only when **≥2 axes deteriorate together** vs the patient's own baseline — never on a single noisy channel. See `test_single_axis_blip_does_not_fire`.
- **Fail-safe safety.** Red tier fires on the **union** of a deterministic keyword floor and the LLM classifier, so an LLM miss can't silently drop a crisis. Safety-critical decisions never rest on the LLM alone; the agent does a warm human handoff rather than treating acute risk.

Public entry points are re-exported from `attune/__init__.py` (`load`, `Signal`, `Axis`, `Engine`, `build_brief`, `render`, …).

## frontend/ — pnpm workspace

**pnpm only** — `preinstall` hard-fails under npm/yarn. Node 24, TypeScript 5.9. Workspace packages live under `lib/*`, `artifacts/*`, `scripts`. Shared deps are pinned via the pnpm `catalog:` in `pnpm-workspace.yaml`.

```bash
pnpm install
pnpm run typecheck                                  # tsc --build across all packages
pnpm run build                                      # typecheck + per-package build
pnpm --filter @workspace/api-server run dev         # Express API on port 5000
pnpm --filter @workspace/mockup-sandbox run dev     # Vite React UI sandbox
pnpm --filter @workspace/api-spec run codegen       # regen API hooks + Zod from OpenAPI
pnpm --filter @workspace/db run push                # push Drizzle schema (dev only)
```

### API contract flow (source-of-truth is the spec, not hand-written clients)

`lib/api-spec/openapi.yaml` is the single source of truth. `codegen` runs Orval to generate, from that spec:

- `lib/api-client-react/src/generated/` — TanStack Query hooks (react-query client), baseURL `/api`.
- `lib/api-zod/src/generated/` — Zod validators + TypeScript types.

**After editing `openapi.yaml`, run `codegen`** — never hand-edit the `generated/` dirs. The custom fetch mutator is `lib/api-client-react/src/custom-fetch.ts`.

The Express server (`artifacts/api-server`) mounts all routes under `/api`, builds a CJS bundle with esbuild + `esbuild-plugin-pino`, and consumes the workspace packages `@workspace/db` and `@workspace/api-zod`. DB access is Drizzle over `node-postgres`; requires `DATABASE_URL`. Define tables in `lib/db/src/schema/` (currently an empty stub — follow the commented template: Drizzle table + `drizzle-zod` insert schema + inferred types, one table per file).

### Gotchas

- The pnpm `overrides` block strips all non-`linux-x64` native binaries (esbuild, rollup, lightningcss, tailwind oxide) because the target is Replit. Installs on other platforms rely on this.
- `minimumReleaseAge: 1440` in `pnpm-workspace.yaml` blocks npm packages younger than 1 day (supply-chain defense). Do not disable it; use `minimumReleaseAgeExclude` for trusted urgent exceptions.
- `mockup-sandbox` is a design/prototyping surface (shadcn/Radix UI components under `src/components/ui/`), separate from the API server.
