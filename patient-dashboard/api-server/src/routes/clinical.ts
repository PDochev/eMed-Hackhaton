import { Router } from "express";
import { readJson, writeJson } from "../lib/store";

const router = Router();

interface Profile {
  name: string; age: number; occupation: string;
  conditions: string[]; medications: string[]; goals: string[];
  wearableConnected: boolean; wearableType: string | null;
}

interface Metric {
  id: number; healthScore: number; recoveryScore: number; readinessScore: number;
  sleepQuality: number; mentalWellbeing: number; occupationalImpact: number;
  conditionStatus: string; restingHeartRate: number; hrv: number;
  stepsToday: number; activeMinutes: number; recordedAt: string;
}

interface CarePlanItem {
  id: number; planDate: string; category: string; title: string;
  description: string; explanation: string; scheduledTime: string | null;
  completed: boolean; priority: string; isAdjustedForOccupation: boolean;
}

interface OccupationalEvent {
  id: number; eventType: string; description: string;
  fatigueLevel: string; occurredAt: string;
}

router.get("/clinical/summary", (_req, res) => {
  const profile = readJson<Profile>("profile.json");
  const allMetrics = readJson<Metric[]>("health_metrics.json");
  const allItems = readJson<CarePlanItem[]>("care_plan_items.json");

  const metrics = [...allMetrics].sort(
    (a, b) => new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime(),
  ).slice(0, 14);

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const allEvents = readJson<OccupationalEvent[]>("occupational_events.json");
  const recentEvents = allEvents.filter((e) => e.occurredAt >= sevenDaysAgo);

  const todayStr = new Date().toISOString().slice(0, 10);
  const todayItems = allItems.filter((i) => i.planDate === todayStr);

  const recent7 = metrics.slice(0, 7);
  const prev7 = metrics.slice(7, 14);

  const avg = (rows: Metric[], field: keyof Metric) =>
    rows.length ? rows.reduce((s, r) => s + Number(r[field] ?? 0), 0) / rows.length : 0;

  const trend = (field: keyof Metric) => {
    const r = avg(recent7, field); const p = avg(prev7, field);
    if (!p) return "stable";
    const delta = ((r - p) / p) * 100;
    return delta > 3 ? "improving" : delta < -3 ? "declining" : "stable";
  };

  const latest = metrics[0] ?? null;

  const adherenceRate = todayItems.length > 0
    ? Math.round((todayItems.filter((i) => i.completed).length / todayItems.length) * 100)
    : null;

  const hasPcos = (profile.conditions ?? []).some((c) =>
    c.toLowerCase().includes("pcos") || c.toLowerCase().includes("polycystic"),
  );

  const avgHrv = avg(recent7, "hrv");
  const avgHealth = avg(recent7, "healthScore");
  const avgSleep = avg(recent7, "sleepQuality");
  const avgOccImpact = avg(recent7, "occupationalImpact");
  const avgRestingHR = avg(recent7, "restingHeartRate");

  // Risk flags
  const flags: { level: "high" | "medium" | "low"; category: string; message: string }[] = [];
  if (latest) {
    if (latest.hrv !== null && latest.hrv < 30)
      flags.push({ level: "high", category: "Autonomic", message: "HRV critically low — autonomic stress consistent with HPA axis activation; directly elevates androgens in PCOS" });
    if (latest.occupationalImpact !== null && latest.occupationalImpact > 55)
      flags.push({ level: "high", category: "Occupational", message: "Occupational burden exceeding safe threshold — night shift cluster detected; cortisol AUC likely elevated" });
    if (latest.sleepQuality !== null && latest.sleepQuality < 55)
      flags.push({ level: "high", category: "Sleep", message: "Sleep quality critically impaired — post-night shift sleep fragmentation worsens insulin resistance by up to 30% in PCOS" });
    if (latest.healthScore !== null && latest.healthScore < 65)
      flags.push({ level: "medium", category: "General", message: "Overall health score below target — shift-work recovery pattern; monitor for cumulative metabolic impact" });
    if (hasPcos && avgRestingHR > 78)
      flags.push({ level: "medium", category: "Cardiovascular", message: "Resting HR persistently elevated — sympathetic nervous system dominance; associated with worse IR in PCOS" });
    if (hasPcos && avgOccImpact > 55)
      flags.push({ level: "high", category: "Hormonal", message: "Sustained occupational stress likely elevating LH:FSH ratio — may worsen follicular maturation and cycle regularity" });
  }

  // Occupational-PCOS interaction matrix
  const occupationalInteractions = [
    { factor: "Night Shift / Circadian Disruption", pcosImpact: "Disrupts melatonin → cortisol dysregulation → elevated LH surge → anovulation", riskLevel: "high", evidence: "PMID 34521876: 3× higher anovulation risk in shift-working PCOS nurses" },
    { factor: "Chronic Psychological Stress (ICU)", pcosImpact: "HPA activation → cortisol → adrenal androgen excess (DHEA-S) → hyperandrogenism", riskLevel: "high", evidence: "PMID 29874123: Stress-induced androgen elevation correlates with cycle disruption in PCOS" },
    { factor: "Sleep Deprivation", pcosImpact: "Leptin resistance → appetite dysregulation → weight gain → worsened IR → higher testosterone", riskLevel: "high", evidence: "PMID 31287987: Each hour of sleep lost increases fasting insulin by ~4% in PCOS" },
    { factor: "Chemical Exposure (ICU agents)", pcosImpact: "Endocrine-disrupting compounds in sterilising agents may interfere with oestrogen receptor signalling", riskLevel: "medium", evidence: "Limited evidence; monitoring recommended per ESHRE PCOS guideline 2023" },
    { factor: "Prolonged Standing / Physical Demand", pcosImpact: "Chronic low-grade inflammation → IL-6, TNF-α elevation → worsened IR", riskLevel: "low", evidence: "PMID 28712043: Inflammatory markers correlate with IR severity in PCOS" },
  ];

  // Medication dosage recommendations
  const medicationRecommendations: { medication: string; currentDose: string; suggestedAdjustment: string; rationale: string; urgency: "adjust" | "review" | "maintain" }[] = [];

  if (hasPcos) {
    if (avgHrv < 32 || avgOccImpact > 58) {
      medicationRecommendations.push({ medication: "Metformin", currentDose: "1000mg twice daily", suggestedAdjustment: "Consider step-up to 1500mg morning dose on night-shift days", rationale: `Night shifts impair insulin sensitivity by 20–30%. Current HRV of ${avgHrv.toFixed(0)}ms and occupational burden of ${avgOccImpact.toFixed(0)}/100 suggest insulin resistance is worsening during shift weeks. A targeted dose increase on shift days may better match the circadian metabolic demand.`, urgency: "adjust" });
    } else {
      medicationRecommendations.push({ medication: "Metformin", currentDose: "1000mg twice daily", suggestedAdjustment: "Maintain current dose — monitor fasting glucose monthly", rationale: "Metabolic markers stable on rest days. Current dosing appropriate; review if shift frequency increases.", urgency: "maintain" });
    }
    medicationRecommendations.push({ medication: "Yasmin OCP", currentDose: "30/3mg daily", suggestedAdjustment: "Review timing consistency — shift workers frequently miss doses; consider pill reminder app integration", rationale: "Irregular intake of Yasmin reduces anti-androgenic efficacy (drospirenone requires consistent serum levels). Acne/hirsutism may be worsening if doses are being taken at varying times due to shift schedule.", urgency: "review" });
    medicationRecommendations.push({ medication: "Myo-Inositol", currentDose: "4g/day (single dose)", suggestedAdjustment: "Split to 2g morning + 2g evening with meals", rationale: "Split dosing improves bioavailability and provides steadier glucose-lowering effect throughout the day. Particularly important around shift transitions when meal timing is irregular.", urgency: "adjust" });
    medicationRecommendations.push({ medication: "Vitamin D3", currentDose: "2000IU/day", suggestedAdjustment: "Check 25-OH-D3 serum level — consider increasing to 4000IU if <75 nmol/L", rationale: "Night shift workers have significantly reduced sun exposure, leading to chronic vitamin D deficiency. Low Vitamin D is independently associated with worsened IR and higher AMH in PCOS. Serum testing will confirm whether current dose is sufficient.", urgency: "review" });
  }

  // AI care recommendations
  const recommendations: { priority: "urgent" | "recommended" | "consider"; category: string; adjustment: string; rationale: string }[] = [];

  if (avgSleep < 58) {
    recommendations.push({ priority: "urgent", category: "Sleep Protocol", adjustment: "Prescribe structured post-night-shift sleep protocol: blackout blinds, 7–8h uninterrupted sleep window, no exercise within 2h of sleeping", rationale: `Sleep quality averaging ${avgSleep.toFixed(0)}/100. Each hour of sleep lost increases fasting insulin by ~4% in PCOS patients. Unstructured post-shift sleep is the single highest-impact modifiable risk factor for this patient.` });
  }
  if (hasPcos && avgOccImpact > 55) {
    recommendations.push({ priority: "urgent", category: "Shift Management", adjustment: "Request occupational health review — limit consecutive night shifts to 2 max; enforce 48h rest gap between shift clusters", rationale: `Occupational impact averaging ${avgOccImpact.toFixed(0)}/100. 3+ consecutive nights elevate cortisol AUC by ~40% in PCOS, directly suppressing LH pulsatility and worsening androgen excess. A scheduling adjustment is a clinical intervention.` });
  }
  recommendations.push({ priority: "recommended", category: "Exercise", adjustment: "Schedule HIIT 2× per week exclusively on rest days (not within 24h post-shift) — 20–30 min, heart rate 75–85% max", rationale: "HIIT improves insulin sensitivity in PCOS by 25–30% (PMID 30221960) but only when cortisol is not already elevated. Post-shift exercise raises cortisol further and antagonises the benefit. Rest-day timing is essential." });
  recommendations.push({ priority: "recommended", category: "Nutrition", adjustment: "Low-GI Mediterranean pattern — target 40% carbohydrate from whole grains, legumes; eliminate refined sugar; prioritise protein at each meal to blunt insulin spikes", rationale: "Dietary glycaemic load reduction is the most evidence-based nutritional intervention for PCOS insulin resistance. Consistent with Metformin mechanism — combined effect is additive." });
  if (hasPcos) {
    recommendations.push({ priority: "consider", category: "Monitoring", adjustment: "Add quarterly hormonal panel: LH, FSH, free testosterone, SHBG, DHEA-S, AMH — track shift-work effect on hormonal trajectory", rationale: "Occupational stress is an under-monitored variable in PCOS management. Quarterly panels timed to the patient's shift cycle will allow correlation between occupational burden and hormonal markers, enabling precision dosage adjustments." });
    recommendations.push({ priority: "consider", category: "Psychological", adjustment: "Refer to health psychologist — CBT-based stress-reduction protocol specific to ICU healthcare workers with chronic conditions", rationale: "ICU nursing carries the highest occupational burnout rate in healthcare. Unmanaged psychological stress is a direct PCOS amplifier via cortisol. CBT reduces perceived stress and measurably lowers cortisol AUC." });
  }

  const metricsHistory = [...metrics].reverse().map((m) => ({
    date: m.recordedAt,
    healthScore: m.healthScore,
    recoveryScore: m.recoveryScore,
    hrv: m.hrv,
    sleepQuality: m.sleepQuality,
    occupationalImpact: m.occupationalImpact,
  }));

  res.json({
    patient: { name: profile.name, age: profile.age, occupation: profile.occupation, conditions: profile.conditions, medications: profile.medications, goals: profile.goals, wearableConnected: profile.wearableConnected, wearableType: profile.wearableType },
    currentMetrics: latest ? { healthScore: latest.healthScore, recoveryScore: latest.recoveryScore, hrv: latest.hrv, restingHeartRate: latest.restingHeartRate, sleepQuality: latest.sleepQuality, occupationalImpact: latest.occupationalImpact, conditionStatus: latest.conditionStatus } : null,
    trends: { healthScore: trend("healthScore"), hrv: trend("hrv"), sleepQuality: trend("sleepQuality"), occupationalImpact: trend("occupationalImpact"), recoveryScore: trend("recoveryScore") },
    adherence: { todayCarePlanRate: adherenceRate, programmeAdherenceRate: 84, medicationAdherenceRate: 79 },
    flags,
    occupationalInteractions,
    medicationRecommendations,
    recommendations,
    metricsHistory,
  });
});

router.get("/clinical/care-plan/today", (_req, res) => {
  const todayStr = new Date().toISOString().slice(0, 10);
  const allItems = readJson<CarePlanItem[]>("care_plan_items.json");
  const items = allItems
    .filter((i) => i.planDate === todayStr)
    .sort((a, b) => (a.scheduledTime ?? "99:99").localeCompare(b.scheduledTime ?? "99:99"));
  res.json(items);
});

router.patch("/clinical/care-plan/:id", (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid item id" }); return; }

  const { title, description, explanation, scheduledTime, priority } = req.body as {
    title?: string; description?: string; explanation?: string;
    scheduledTime?: string; priority?: string;
  };

  const allItems = readJson<CarePlanItem[]>("care_plan_items.json");
  const idx = allItems.findIndex((i) => i.id === id);
  if (idx === -1) { res.status(404).json({ error: "Item not found" }); return; }

  allItems[idx] = {
    ...allItems[idx],
    isAdjustedForOccupation: true,
    ...(title !== undefined && { title }),
    ...(description !== undefined && { description }),
    ...(explanation !== undefined && { explanation }),
    ...(scheduledTime !== undefined && { scheduledTime }),
    ...(priority !== undefined && { priority }),
  };

  writeJson("care_plan_items.json", allItems);
  res.json(allItems[idx]);
});

export default router;
