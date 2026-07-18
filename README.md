# eMed Hackathon

Built for the **eMed × OpenAI** hackathon (London, 17–18 Jul 2026).

| Path                                        | What it is                                                               |
| ------------------------------------------- | ------------------------------------------------------------------------ |
| [`model/`](./model)                         | **Attune** — concordance engine for at-home chronic condition management |
| [`patient-dashboard/`](./patient-dashboard) | **Elevera** — patient health dashboard (React UI + Express API)          |

---

## Run locally

### Elevera (dashboard)

**Prerequisites:** Node.js 24+, [pnpm](https://pnpm.io/installation)

```bash
# from repo root
cd patient-dashboard
pnpm install

# Terminal 1 — API → http://localhost:3000
cd api-server
pnpm run dev

# Terminal 2 — frontend → http://localhost:5173
cd ../elevera
pnpm run dev
```

Open **[http://localhost:5173](http://localhost:5173)**. Vite proxies `/api` requests to the API on port 3000.

From `patient-dashboard/` you can also run:

```bash
pnpm --filter @workspace/api-server run dev
pnpm --filter @workspace/elevera run dev
```

### Attune (concordance engine)

**Prerequisites:** Python 3.13, [uv](https://docs.astral.sh/uv/). Optional: [mise](https://mise.jdx.dev/)

```bash
cd model
mise run init          # or: uv venv && uv pip install -e ".[dev]"
uv run attune-demo     # narrate demo end-to-end
uv run pytest          # run tests
```

---

## Attune (`model/`)

Condition-agnostic concordance engine: personal baselines, cross-axis drift detection, tiered safety escalation, and clinician briefs. Swappable condition packs (PCOS, veteran mind-body, AttuneFM-lite) without changing engine code.

**Stack:** Python 3.13 · uv · mise · Pydantic · OpenAI · Typer · Rich · pytest · ruff · pre-commit

---

## Elevera (`patient-dashboard/`)

Patient-facing dashboard: health metrics, occupational impact, care plan, AI chat, social, and clinical views. pnpm workspace with a Vite frontend and Express API (JSON-backed for the hackathon).

### Stack

| Layer                     | Technologies                                                                                                                              |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| **Frontend** (`elevera/`) | React 19, TypeScript, Vite 7, Tailwind CSS 4, Radix UI / shadcn-style components, TanStack Query, Wouter, Recharts, Framer Motion, Lucide |
| **API** (`api-server/`)   | Node.js 24, Express 5, esbuild, Pino, Zod validators                                                                                      |
| **Shared** (`lib/`)       | OpenAPI spec → Orval codegen → `@workspace/api-client-react` (hooks) + `@workspace/api-zod` (schemas)                                     |
| **Tooling**               | pnpm workspaces, TypeScript project references                                                                                            |

### Layout

```
patient-dashboard/
├── elevera/          # React app (Vite) — http://localhost:5173
├── api-server/       # Express API — http://localhost:3000
└── lib/
    ├── api-spec/     # OpenAPI source of truth + Orval codegen
    ├── api-client-react/
    └── api-zod/
```

### Regenerate API clients

After editing `lib/api-spec/openapi.yaml`:

```bash
pnpm --filter @workspace/api-spec run codegen
```

Do not hand-edit files under `lib/*/src/generated/`.
