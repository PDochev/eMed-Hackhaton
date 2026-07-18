"""Export engine output as the Elevera patient dashboard's data files.

The Elevera app (patient-dashboard/) reads everything through its Express api-server, which in
turn reads static JSON from ``api-server/data/``. This script regenerates those JSON files from
the concordance engine, so the whole dashboard — metrics, 14-day trends, clinical summary, risk
flags — is driven by the model instead of hand-authored numbers, with no Node changes.

Patient: Emma, an ICU night-shift nurse with PCOS + insulin resistance. Modelled on the
``attunefm`` pack (which carries real physiological signals — HRV, resting HR, sleep, work load)
with the ``metabolic_pcos`` synthetic profile: a planted concordant flare near "today" surfaces
as a recent recovery dip the dashboard reads as elevated occupational/metabolic risk.

Run:  uv run attune-export           # writes into patient-dashboard/api-server/data/
      uv run attune-export --out /path/to/data
"""

from __future__ import annotations

import json
from datetime import date, datetime, timedelta, timezone
from pathlib import Path

import typer
from rich import print as rprint

from attune.attunefm import monitoring_scores
from attune.concordance_engine.engine import Engine
from attune.concordance_engine.memory import Memory
from attune.packs.attunefm import ATTUNEFM_PACK
from attune.synth import PatientProfile, flare_window, generate

DAYS = 90
HISTORY = 21  # calendar days of metrics to emit (covers the app's 14-day + 7/7 trend windows)
_FLARE = flare_window(DAYS)  # FlareWindow(onset=78, length=5)
END_DAY = _FLARE.end - 1  # "today" sits at the tail of the flare → a live, visible concern

# Emma — ICU night-shift nurse with PCOS. A bespoke profile on the attunefm pack: a slightly
# strained baseline (shift-worn sleep/HRV) plus a recent night-shift cluster that flares a
# realistic *subset* of axes together — sleep, autonomic (HRV/resting-HR), occupational load,
# metabolic (glucose/diet), and fatigue. Flaring a subset (not all 17 signals) keeps the
# monitoring load out of saturation, so the dashboard shows an elevated dip, not a 0/100 crash.
EMMA_PROFILE = PatientProfile(
    name="emma_shift_pcos",
    label="ICU night-shift nurse / PCOS",
    story="Rotating ICU night shifts with PCOS + insulin resistance; a recent night-shift "
    "cluster drives a concordant recovery, sleep, autonomic, and metabolic dip.",
    seed=71,
    offsets={
        "hrv": -6.0,
        "resting_hr": 4.0,
        "sleep_hours": -0.4,
        "work_burden": 0.10,
        "glucose_variability": 0.05,
        "voice_fatigue": 0.03,
    },
    # Multipliers are calibrated (peak monitoring load ~12, recovery ~0.23) so the flare reads as
    # a genuine multi-axis "High Risk" dip without saturating scores to a flatlined 0. The
    # low-noise self-report channels get deliberately small multipliers — their tiny noise makes
    # any flare a huge z — so they add concordant axes without dominating the load.
    flare_multipliers={
        "sleep_hours": 0.85,
        "hrv": 1.15,
        "resting_hr": 1.2,
        "work_burden": 0.7,
        "glucose_variability": 0.7,
        "diet_response": 0.4,
        "cognitive_fog": 0.28,
        "voice_fatigue": 0.3,
    },
)
PROFILE = EMMA_PROFILE

# Default output: patient-dashboard/api-server/data (repo_root/patient-dashboard/...).
# elevera.py → attune → src → model → repo root.
DEFAULT_OUT = (
    Path(__file__).resolve().parents[3] / "patient-dashboard" / "api-server" / "data"
)


def _clip01(value: float) -> float:
    return max(0.0, min(1.0, value))


def _clamp_score(value: float) -> int:
    return max(10, min(100, round(value)))


def _latest(mem: Memory, key: str, day: int) -> float:
    series = [s for s in mem.series(key) if s.day <= day]
    return series[-1].value if series else 0.0


def _condition_status(anomaly: float) -> str:
    if anomaly > 0.66:
        return "High Risk"
    if anomaly > 0.45:
        return "Elevated"
    if anomaly > 0.28:
        return "Moderate"
    return "Stable"


def _metric_row(engine: Engine, day: int, metric_id: int, recorded_at: str) -> dict:
    """Map one engine day onto the Elevera `Metric` shape."""
    mem = engine.memory
    scores = monitoring_scores(engine, day=day)
    recovery = scores.recovery_capacity
    fatigue = scores.fatigue_risk
    anomaly = scores.anomaly_score

    hrv = _latest(mem, "hrv", day)
    resting_hr = _latest(mem, "resting_hr", day)
    sleep_hours = _latest(mem, "sleep_hours", day)
    work_burden = _clip01(_latest(mem, "work_burden", day))
    voice_fatigue = _clip01(_latest(mem, "voice_fatigue", day))

    return {
        "id": metric_id,
        "healthScore": _clamp_score(100 * (0.55 * recovery + 0.45 * (1 - anomaly))),
        "recoveryScore": _clamp_score(100 * recovery),
        "readinessScore": _clamp_score(100 * (1 - fatigue)),
        "sleepQuality": _clamp_score(100 * _clip01(sleep_hours / 9.0)),
        "mentalWellbeing": _clamp_score(100 * (1 - voice_fatigue)),
        "occupationalImpact": _clamp_score(100 * work_burden),
        "conditionStatus": _condition_status(anomaly),
        "restingHeartRate": round(resting_hr),
        "hrv": round(hrv),
        "stepsToday": round(2500 + 5500 * (1 - fatigue)),
        "activeMinutes": round(15 + 45 * (1 - fatigue)),
        "recordedAt": recorded_at,
    }


def build_metrics(today: date | None = None) -> list[dict]:
    """Emit HISTORY days of engine-driven metrics ending at `today` (defaults to the real date)."""
    today = today or date.today()
    engine = Engine(ATTUNEFM_PACK, generate(ATTUNEFM_PACK, days=DAYS, profile=PROFILE))
    rows: list[dict] = []
    for i in range(HISTORY):
        day = END_DAY - (HISTORY - 1 - i)  # oldest → newest
        recorded = today - timedelta(days=(HISTORY - 1 - i))
        rows.append(
            _metric_row(engine, day, i + 1, f"{recorded.isoformat()}T06:00:00.000Z")
        )
    return rows


def build_occupational_events(now: datetime | None = None) -> list[dict]:
    """A night-shift exposure logged today, coherent with the flare-driven recovery dip."""
    now = now or datetime.now(timezone.utc)
    stamp = now.isoformat().replace("+00:00", "Z")
    return [
        {
            "id": 1,
            "eventType": "night_shift",
            "description": "Consecutive ICU night shift — high patient acuity, disrupted sleep window.",
            "smokeExposure": "low",
            "heatExposure": "low",
            "fatigueLevel": "high",
            "duration": 12,
            "occurredAt": stamp,
        }
    ]


def export(out: Path = DEFAULT_OUT) -> None:
    out.mkdir(parents=True, exist_ok=True)
    metrics = build_metrics()
    events = build_occupational_events()
    (out / "health_metrics.json").write_text(json.dumps(metrics, indent=2))
    (out / "occupational_events.json").write_text(json.dumps(events, indent=2))
    latest = metrics[-1]
    rprint(
        f"[green]exported[/] {len(metrics)} metrics + {len(events)} event(s) → {out}\n"
        f"  today: health {latest['healthScore']} · recovery {latest['recoveryScore']} · "
        f"occ-impact {latest['occupationalImpact']} · status {latest['conditionStatus']} "
        f"(profile: {PROFILE.label})"
    )


def run() -> None:
    typer.run(export)


if __name__ == "__main__":
    run()
