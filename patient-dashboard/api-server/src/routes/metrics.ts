import { Router } from "express";
import { readJson } from "../lib/store";

const router = Router();

interface Metric {
  id: number;
  healthScore: number;
  recoveryScore: number;
  readinessScore: number;
  sleepQuality: number;
  mentalWellbeing: number;
  occupationalImpact: number;
  conditionStatus: string;
  restingHeartRate: number;
  hrv: number;
  stepsToday: number;
  activeMinutes: number;
  recordedAt: string;
}

router.get("/metrics", (_req, res): void => {
  const all = readJson<Metric[]>("health_metrics.json");
  const sorted = [...all].sort(
    (a, b) => new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime(),
  );
  const m = sorted[0];
  if (!m) { res.status(404).json({ error: "No metrics found" }); return; }
  res.json(m);
});

router.get("/metrics/history", (_req, res): void => {
  const all = readJson<Metric[]>("health_metrics.json");
  const sorted = [...all]
    .sort((a, b) => new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime())
    .slice(0, 14)
    .reverse();

  res.json(
    sorted.map((m) => ({
      date: m.recordedAt.slice(0, 10),
      healthScore: m.healthScore,
      recoveryScore: m.recoveryScore,
      sleepQuality: m.sleepQuality,
      readinessScore: m.readinessScore,
      mentalWellbeing: m.mentalWellbeing,
    })),
  );
});

router.get("/metrics/summary", (_req, res): void => {
  const all = readJson<Metric[]>("health_metrics.json");
  const rows = [...all]
    .sort((a, b) => new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime())
    .slice(0, 7);

  if (rows.length === 0) {
    res.json({ weeklyAvgHealth: 0, weeklyAvgRecovery: 0, weeklyAvgSleep: 0, bestDay: "N/A", worstDay: "N/A", trend: "stable" });
    return;
  }

  const avg = (arr: number[]) => Math.round(arr.reduce((a, b) => a + b, 0) / arr.length);
  const weeklyAvgHealth = avg(rows.map((r) => r.healthScore));
  const weeklyAvgRecovery = avg(rows.map((r) => r.recoveryScore));
  const weeklyAvgSleep = avg(rows.map((r) => r.sleepQuality));

  const sorted = [...rows].sort((a, b) => b.healthScore - a.healthScore);
  const bestDay = sorted[0]?.recordedAt.slice(0, 10) ?? "N/A";
  const worstDay = sorted[sorted.length - 1]?.recordedAt.slice(0, 10) ?? "N/A";

  const first = rows[rows.length - 1]?.healthScore ?? 0;
  const last = rows[0]?.healthScore ?? 0;
  const trend = last > first + 3 ? "improving" : last < first - 3 ? "declining" : "stable";

  res.json({ weeklyAvgHealth, weeklyAvgRecovery, weeklyAvgSleep, bestDay, worstDay, trend });
});

export default router;
