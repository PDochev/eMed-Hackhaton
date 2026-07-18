# Attune Dashboard

AI-powered clinician dashboard for at-home chronic condition management (eMed hackathon).

## Overview

Attune fuses daily voice check-ins, photos, and wearable data into per-patient longitudinal memory and fires early warnings when ≥2 signal axes drift together against the patient's own baseline ("concordance").

### Features

- **Red/Amber/Green tier system** — Green (autonomous AI coaching), Amber (multi-axis drift, brief awaiting review), Red (crisis detected, warm handoff initiated)
- **Concordance scoring** — z-scores per axis vs patient's personal baseline; flagged when axes move together
- **AI clinician brief** — Rotterdam-criteria-mapped summaries with drafted patient-facing plans (Approve/Edit/Request labs)
- **Voice check-ins** — Daily transcripts with extracted signals (adherence, mood, symptoms)
- **Programme support** — PCOS (cycle, glucose, mood, skin) and GLP-1 weight management (tolerance, mood, weight)
- **Asynchronous workflow** — Clinicians review AI-drafted briefs; approved replies delivered to patients via voice agent

## Quick Start

1. Open `Attune Dashboard.dc.html` in a browser (standalone, no build required)
2. Explore the worklist, patient records, and configuration tabs
3. View source in `src/` folder for customization

## Files

- `Attune Dashboard.dc.html` — Bundled Design Component (self-contained)
- `support.js` — DC runtime
- `src/template.html` — Patient UI template
- `src/logic.js` — State, data, and business logic
- `src/helmet.html` — Styles and fonts

## Editing

Extract and edit `src/` files, then reassemble via the build process (documented in the main project).

---

Built for eMed hackathon. Proof of concept.
