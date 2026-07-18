import { Router } from "express";
import { readJson, writeJson, nextId } from "../lib/store";
import { AddOccupationalEventBody } from "@workspace/api-zod";

const router = Router();

interface OccupationalEvent {
  id: number;
  eventType: string;
  description: string;
  smokeExposure: string;
  heatExposure: string;
  fatigueLevel: string;
  duration: number;
  occurredAt: string;
}

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

function getTodayStart(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

router.get("/occupational/events", (_req, res): void => {
  const all = readJson<OccupationalEvent[]>("occupational_events.json");
  const todayStart = getTodayStart().toISOString();
  const events = all.filter((e) => e.occurredAt >= todayStart);
  res.json(events);
});

router.post("/occupational/events", (req, res): void => {
  const parsed = AddOccupationalEventBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const data = parsed.data;
  const all = readJson<OccupationalEvent[]>("occupational_events.json");

  const event: OccupationalEvent = {
    id: nextId(all),
    eventType: data.eventType,
    description: data.description,
    smokeExposure: data.smokeExposure,
    heatExposure: data.heatExposure,
    fatigueLevel: data.fatigueLevel,
    duration: data.duration,
    occurredAt: new Date().toISOString(),
  };

  all.push(event);
  writeJson("occupational_events.json", all);

  // Recalculate latest metric
  const metrics = readJson<Metric[]>("health_metrics.json");
  const sorted = [...metrics].sort(
    (a, b) => new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime(),
  );
  const base = sorted[0] ?? {
    healthScore: 65, recoveryScore: 60, readinessScore: 62, sleepQuality: 58,
    mentalWellbeing: 63, occupationalImpact: 58, conditionStatus: "Stable",
    restingHeartRate: 79, hrv: 31, stepsToday: 4100, activeMinutes: 32,
  };

  const smokePenalty = data.smokeExposure === "high" ? 12 : data.smokeExposure === "moderate" ? 6 : 2;
  const heatPenalty = data.heatExposure === "high" ? 10 : data.heatExposure === "moderate" ? 5 : 2;
  const fatiguePenalty = data.fatigueLevel === "high" ? 8 : data.fatigueLevel === "moderate" ? 4 : 1;
  const totalPenalty = smokePenalty + heatPenalty + fatiguePenalty;
  const clamp = (v: number) => Math.max(10, Math.min(100, v));

  const updatedMetric: Metric = {
    id: nextId(metrics),
    healthScore: clamp(base.healthScore - Math.round(totalPenalty * 0.6)),
    recoveryScore: clamp(base.recoveryScore - Math.round(totalPenalty * 0.8)),
    readinessScore: clamp(base.readinessScore - Math.round(totalPenalty * 0.5)),
    sleepQuality: clamp(base.sleepQuality - Math.round(totalPenalty * 0.3)),
    mentalWellbeing: clamp(base.mentalWellbeing - Math.round(totalPenalty * 0.4)),
    occupationalImpact: clamp(base.occupationalImpact + Math.round(totalPenalty * 1.2)),
    conditionStatus: totalPenalty > 20 ? "High Risk" : totalPenalty > 12 ? "Elevated" : "Moderate",
    restingHeartRate: Math.min(100, base.restingHeartRate + Math.round(heatPenalty * 0.8)),
    hrv: Math.max(15, base.hrv - Math.round(totalPenalty * 0.6)),
    stepsToday: base.stepsToday,
    activeMinutes: base.activeMinutes,
    recordedAt: new Date().toISOString(),
  };

  metrics.push(updatedMetric);
  writeJson("health_metrics.json", metrics);

  const aiExplanation =
    `Today's occupational exposure has significantly increased physiological stress and delayed recovery. ` +
    `Fatigue (${data.fatigueLevel}) from the ${data.eventType} has reduced your recovery score by ${Math.round(totalPenalty * 0.8)} points ` +
    `and elevated cortisol burden. Today's care plan has been automatically adjusted to support your recovery.`;

  res.status(201).json({ event, updatedMetrics: updatedMetric, aiExplanation });
});

router.get("/occupational/impact", (_req, res): void => {
  const all = readJson<OccupationalEvent[]>("occupational_events.json");
  const todayStart = getTodayStart().toISOString();
  const events = all.filter((e) => e.occurredAt >= todayStart);

  const hasMajorEvent = events.some((e) => e.smokeExposure === "high" || e.heatExposure === "high" || e.fatigueLevel === "high");
  const highest = (levels: string[]) => {
    if (levels.includes("high")) return "high";
    if (levels.includes("moderate")) return "moderate";
    return levels.length > 0 ? "low" : "minimal";
  };

  const smokeLevel = highest(events.map((e) => e.smokeExposure));
  const heatLevel = highest(events.map((e) => e.heatExposure));
  const fatigueLevel = highest(events.map((e) => e.fatigueLevel));
  const overallRisk = hasMajorEvent ? "high" : events.length > 0 ? "moderate" : "low";

  res.json({
    overallRiskLevel: overallRisk,
    aiExplanation: events.length > 0
      ? `Today's occupational exposure has elevated stress markers and delayed recovery. Your care plan has been automatically adjusted.`
      : `No significant occupational exposures recorded today. Your health metrics are tracking within normal ranges.`,
    factors: [
      { name: "Smoke Exposure", level: smokeLevel, change: smokeLevel !== "minimal" ? `+${smokeLevel === "high" ? 45 : 20}%` : "normal", direction: smokeLevel !== "minimal" ? "up" : "stable" },
      { name: "Heat Exposure", level: heatLevel, change: heatLevel !== "minimal" ? `+${heatLevel === "high" ? 38 : 18}%` : "normal", direction: heatLevel !== "minimal" ? "up" : "stable" },
      { name: "Fatigue", level: fatigueLevel, change: fatigueLevel !== "minimal" ? `+${fatigueLevel === "high" ? 32 : 15}%` : "normal", direction: fatigueLevel !== "minimal" ? "up" : "stable" },
      { name: "Recovery", level: overallRisk === "high" ? "low" : overallRisk === "moderate" ? "moderate" : "good", change: overallRisk !== "low" ? `-${overallRisk === "high" ? 28 : 12}%` : "normal", direction: overallRisk !== "low" ? "down" : "stable" },
      { name: "Cortisol Burden", level: fatigueLevel === "high" ? "elevated" : fatigueLevel === "moderate" ? "moderate" : "low", change: fatigueLevel !== "minimal" ? `+${fatigueLevel === "high" ? 52 : 22}%` : "normal", direction: fatigueLevel !== "minimal" ? "up" : "stable" },
    ],
    adjustedMetrics: {
      smokeExposureLevel: smokeLevel,
      heatExposureLevel: heatLevel,
      fatigueLevel,
      recoveryDelay: hasMajorEvent ? "8-12 hours" : events.length > 0 ? "3-5 hours" : "minimal",
      respiratoryRisk: smokeLevel === "high" ? "elevated" : smokeLevel === "moderate" ? "moderate" : "low",
    },
  });
});

export default router;
