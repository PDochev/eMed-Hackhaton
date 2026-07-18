# eMed Hackathon

Built for the **eMed × OpenAI** hackathon (London, 17–18 Jul 2026).

| Path                                          | What it is                                                               |
| --------------------------------------------- | ------------------------------------------------------------------------ |
| [`model/`](./model)                           | **Attune** — concordance engine for at-home chronic condition management |
| [`patient-dashboard/`](./patient-dashboard)   | **Elevera** — patient health dashboard (React UI + Express API)          |
| [`clinical-dashboard/`](./clinical-dashboard) | **Attune Dashboard** — clinician caseload mockup (standalone HTML)       |

Attune **feeds Elevera** via `attune-export`: the concordance engine runs over a synthetic patient and writes the dashboard’s JSON data files, so metrics, trends, and clinical views are driven by real engine output. See [Model-driven data](#model-driven-data-attune--elevera).

---

## Run locally

### Elevera (dashboard)

**Prerequisites:** Node.js 24+, [pnpm](https://pnpm.io/installation). For fresh model data: Python 3.13 + [uv](https://docs.astral.sh/uv/).

```bash
# from repo root
cd patient-dashboard
pnpm install

# (recommended) regenerate dashboard data from the Attune model
( cd ../model && uv run attune-export )

# Terminal 1 — API → http://localhost:3000
cd api-server
pnpm run dev

# Terminal 2 — frontend → http://localhost:5173
cd ../elevera
pnpm run dev
```

Open **[http://localhost:5173](http://localhost:5173)**. Vite proxies `/api` to the API on port 3000.

From `patient-dashboard/` without `cd`ing into packages:

```bash
pnpm --filter @workspace/api-server run dev
pnpm --filter @workspace/elevera run dev
```

### Attune (concordance engine)

**Prerequisites:** Python 3.13, [uv](https://docs.astral.sh/uv/). Optional: [mise](https://mise.jdx.dev/)

```bash
cd model
mise run init              # or: uv venv && uv pip install -e ".[dev]"
uv run attune-demo         # narrate demo end-to-end
uv run attune-demo attunefm
uv run attune-export       # push engine output into Elevera’s data/
uv run pytest
```

### Clinical dashboard

Open `clinical-dashboard/Attune Dashboard.dc.html` in a browser (standalone, no build).

---

## Model-driven data (Attune → Elevera)

There is no live HTTP call from Node to Python. Integration is an **offline export bridge**:

```
model/ (Attune engine)
    │  uv run attune-export
    ▼
patient-dashboard/api-server/data/
    ├── health_metrics.json        ← overwritten
    └── occupational_events.json   ← overwritten
    │
    ▼  Express reads JSON at runtime
/api/*  (:3000)  →  Vite proxy  →  Elevera UI (:5173)
```

| Piece                   | Detail                                                                                                                                                                             |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **CLI**                 | `uv run attune-export` ([`model/src/attune/elevera.py`](./model/src/attune/elevera.py))                                                                                            |
| **Optional**            | `uv run attune-export --out /path/to/data`                                                                                                                                         |
| **Pack / patient**      | AttuneFM pack · **Emma** — ICU night-shift nurse with PCOS + insulin resistance                                                                                                    |
| **What it does**        | Synthesizes ~90 days of signals, plants a concordant flare near “today”, maps `monitoring_scores()` + wearables into 21 days of Elevera metrics + a night-shift occupational event |
| **Unchanged by export** | `profile.json`, `care_plan_items.json`, `chat_messages.json` (hand-authored / app-managed)                                                                                         |

Re-run `attune-export` after changing the model, pack, or Emma profile so the dashboard stays in sync. No `MODEL_URL` or extra env vars are required.

---

## Attune (`model/`)

Condition-agnostic concordance engine: personal baselines, cross-axis drift detection, tiered safety escalation, and clinician briefs. Swappable condition packs (PCOS, veteran mind-body, AttuneFM-lite) without changing engine code.

**Stack:** Python 3.13 · uv · mise · Pydantic · OpenAI · Typer · Rich · pytest · ruff · pre-commit

**CLIs:** `attune-seed` · `attune-demo` · `attune-export`

---

## Elevera (`patient-dashboard/`)

Patient-facing dashboard: health metrics, occupational impact, care plan, AI chat, social, and clinical views. pnpm workspace with a Vite frontend and Express API (JSON-backed for the hackathon).

### Stack

| Layer                     | Technologies                                                                                                                              |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| **Frontend** (`elevera/`) | React 19, TypeScript, Vite 7, Tailwind CSS 4, Radix UI / shadcn-style components, TanStack Query, Wouter, Recharts, Framer Motion, Lucide |
| **API** (`api-server/`)   | Node.js 24, Express 5, esbuild, Pino, Zod validators                                                                                      |
| **Shared** (`lib/`)       | OpenAPI spec → Orval codegen → `@workspace/api-client-react` (hooks) + `@workspace/api-zod` (schemas)                                     |
| **Model bridge**          | `attune-export` → JSON in `api-server/data/` (see above)                                                                                  |
| **Tooling**               | pnpm workspaces, TypeScript project references                                                                                            |

### Layout

```
patient-dashboard/
├── elevera/          # React app (Vite) — http://localhost:5173
├── api-server/       # Express API — http://localhost:3000
│   └── data/         # JSON store (health_metrics + occupational_events from Attune)
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
