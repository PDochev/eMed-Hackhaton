import { Router } from "express";
import { readJson, writeJson, nextId } from "../lib/store";

const router = Router();

interface CarePlanItem {
  id: number;
  planDate: string;
  category: string;
  title: string;
  description: string;
  explanation: string;
  scheduledTime: string | null;
  completed: boolean;
  priority: string;
  isAdjustedForOccupation: boolean;
}

interface OccupationalEvent {
  id: number;
  fatigueLevel: string;
  smokeExposure: string;
  heatExposure: string;
  occurredAt: string;
}

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

function getTodayStart(): string {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

function buildDefaultPlan(adjusted: boolean, id_start: number): CarePlanItem[] {
  const date = todayStr();
  let id = id_start;

  if (adjusted) {
    return [
      { id: id++, planDate: date, category: "sleep", title: "Post-shift sleep priority — 7–8h window", description: "Go straight to bed after your shift. Use blackout blinds and earplugs. Do not set alarms — let your body sleep its full cycle.", explanation: "Post-shift sleep quality is the highest-impact modifiable risk factor for PCOS. Each hour of sleep lost increases fasting insulin by ~4% and worsens LH pulsatility.", scheduledTime: "08:00", completed: false, priority: "high", isAdjustedForOccupation: true },
      { id: id++, planDate: date, category: "medication", title: "Metformin 1500mg — shift-day step-up", description: "Take 1500mg (1×1000mg + 1×500mg) with your first meal after waking.", explanation: "Night shifts impair insulin sensitivity by 20–30% in PCOS. A targeted dose increase on shift days better matches the increased metabolic demand. Resume 1000mg on rest days.", scheduledTime: "12:00", completed: false, priority: "high", isAdjustedForOccupation: true },
      { id: id++, planDate: date, category: "medication", title: "Yasmin OCP — take at usual time", description: "Set a phone reminder. Maintain OCP timing within ±2 hours even on shift days.", explanation: "Missed or delayed OCP doses reduce drospirenone's anti-androgenic effect, worsening hyperandrogenism symptoms during high-stress periods.", scheduledTime: "07:15", completed: false, priority: "high", isAdjustedForOccupation: true },
      { id: id++, planDate: date, category: "supplement", title: "Myo-Inositol 2g with first meal", description: "Dissolve 2g in water. Take with your first meal when you wake.", explanation: "Post-night-shift insulin resistance is at its peak. Inositol at the first meal targets this window and reduces post-meal glucose excursion.", scheduledTime: "12:30", completed: false, priority: "normal", isAdjustedForOccupation: true },
      { id: id++, planDate: date, category: "nutrition", title: "Anti-inflammatory recovery meal", description: "Salmon or sardines with leafy greens, walnuts, and turmeric. Avoid alcohol, refined sugar, and processed foods today.", explanation: "Chronic ICU stress elevates IL-6 and TNF-α, worsening insulin resistance in PCOS. Anti-inflammatory foods reduce systemic inflammation and support metabolic recovery.", scheduledTime: "13:00", completed: false, priority: "high", isAdjustedForOccupation: true },
      { id: id++, planDate: date, category: "exercise", title: "Light walk only — no HIIT post-shift", description: "20-minute easy walk at conversational pace. Avoid heart rate zones 3–5.", explanation: "Post-shift cortisol is already elevated. HIIT would amplify cortisol further and antagonise insulin sensitisation. Light movement improves circulation without adding stress.", scheduledTime: "15:00", completed: false, priority: "normal", isAdjustedForOccupation: true },
      { id: id++, planDate: date, category: "supplement", title: "Myo-Inositol 2g with dinner", description: "Take evening dose with your dinner meal.", explanation: "Evening dose maintains glucose regulation through the overnight recovery window and supports the next morning's metabolic baseline.", scheduledTime: "19:00", completed: false, priority: "normal", isAdjustedForOccupation: true },
      { id: id++, planDate: date, category: "sleep", title: "Early bedtime — target 21:00", description: "Begin wind-down at 20:30. No screens. Keep room below 18°C.", explanation: "Earlier bedtime on recovery nights increases slow-wave sleep, when cortisol drops and ovarian follicular activity resumes. Critical for cycle regulation in shift-working PCOS patients.", scheduledTime: "21:00", completed: false, priority: "high", isAdjustedForOccupation: true },
    ];
  }

  return [
    { id: id++, planDate: date, category: "medication", title: "Metformin 1000mg with breakfast", description: "Take with food to minimise GI side effects. Do not skip — consistent dosing is essential for IR management.", explanation: "Consistent Metformin timing maximises insulin-sensitising effect throughout the day. Taking with food reduces nausea and improves tolerability.", scheduledTime: "07:00", completed: false, priority: "high", isAdjustedForOccupation: false },
    { id: id++, planDate: date, category: "medication", title: "Yasmin OCP daily dose", description: "Take at the same time every day. Consistency within ±2h window is critical for anti-androgenic efficacy.", explanation: "Drospirenone (in Yasmin) requires stable serum levels for anti-androgenic effect on acne and hirsutism. Irregular timing reduces efficacy.", scheduledTime: "07:15", completed: false, priority: "high", isAdjustedForOccupation: false },
    { id: id++, planDate: date, category: "supplement", title: "Myo-Inositol 2g — morning dose", description: "Dissolve 2g in water and drink with breakfast.", explanation: "Morning dose targets the post-breakfast insulin spike — the most relevant window for PCOS insulin resistance management.", scheduledTime: "07:30", completed: false, priority: "normal", isAdjustedForOccupation: false },
    { id: id++, planDate: date, category: "nutrition", title: "Low-GI breakfast", description: "Oats with mixed berries, ground flaxseed, and a boiled egg. Avoid refined carbohydrates before noon.", explanation: "Low-GI foods reduce post-meal glucose spikes. Protein at breakfast blunts the insulin response, directly supporting IR management in PCOS.", scheduledTime: "07:45", completed: false, priority: "normal", isAdjustedForOccupation: false },
    { id: id++, planDate: date, category: "exercise", title: "HIIT session — rest days only", description: "20–25 min interval training: 8 rounds of 40s effort / 80s recovery. Keep heart rate at 75–85% max.", explanation: "HIIT improves insulin sensitivity by 25–30% in PCOS (PMID 30221960). Must be scheduled on rest days only — post-shift exercise elevates cortisol and negates the benefit.", scheduledTime: "09:00", completed: false, priority: "high", isAdjustedForOccupation: false },
    { id: id++, planDate: date, category: "supplement", title: "Vitamin D3 2000IU with lunch", description: "Take with a meal containing fat for optimal absorption.", explanation: "Night shift workers have chronically low sun exposure. Vitamin D deficiency worsens insulin resistance and is independently associated with higher AMH levels in PCOS.", scheduledTime: "13:00", completed: false, priority: "normal", isAdjustedForOccupation: false },
    { id: id++, planDate: date, category: "supplement", title: "Myo-Inositol 2g — evening dose", description: "Dissolve 2g in water and drink with dinner.", explanation: "Evening dose targets post-dinner glucose response and supports overnight glucose regulation, critical for PCOS metabolic control.", scheduledTime: "18:00", completed: false, priority: "normal", isAdjustedForOccupation: false },
    { id: id++, planDate: date, category: "nutrition", title: "Mediterranean dinner", description: "Salmon or legumes with leafy greens, olive oil, and whole grains. Avoid refined sugar after 16:00.", explanation: "Mediterranean dietary pattern reduces androgenic markers by 22% in PCOS over 12 weeks. Combined with Metformin, the glycaemic effect is additive.", scheduledTime: "19:00", completed: false, priority: "normal", isAdjustedForOccupation: false },
    { id: id++, planDate: date, category: "sleep", title: "Wind-down routine — screens off", description: "No screens after 21:30. Blue light suppresses melatonin, disrupting circadian rhythm already fragile in shift workers.", explanation: "Protecting non-shift nights from circadian disruption improves melatonin-cortisol balance and LH pulsatility — both directly relevant to PCOS cycle regulation.", scheduledTime: "21:30", completed: false, priority: "normal", isAdjustedForOccupation: false },
    { id: id++, planDate: date, category: "sleep", title: "Target bedtime: 22:30", description: "Consistent sleep schedule supports circadian rhythm and hormonal balance.", explanation: "Sleep regularity reduces overnight cortisol and supports the hypothalamic-pituitary-ovarian axis, directly improving cycle regularity in PCOS.", scheduledTime: "22:30", completed: false, priority: "high", isAdjustedForOccupation: false },
    { id: id++, planDate: date, category: "monitoring", title: "Symptom log — acne, hair, cycle day", description: "Note any changes in acne, hair texture, or energy. Record current cycle day in your tracker.", explanation: "Androgenic symptoms are the earliest signal of hormonal dysregulation. Tracking allows correlation with shift patterns and medication timing.", scheduledTime: null, completed: false, priority: "normal", isAdjustedForOccupation: false },
  ];
}

router.get("/care-plan", (_req, res): void => {
  const date = todayStr();
  const todayStart = getTodayStart();
  const allItems = readJson<CarePlanItem[]>("care_plan_items.json");
  const todayItems = allItems.filter((i) => i.planDate === date);

  let items = todayItems;
  if (items.length === 0) {
    const events = readJson<OccupationalEvent[]>("occupational_events.json");
    const hasHighExposure = events
      .filter((e) => e.occurredAt >= todayStart)
      .some((e) => e.fatigueLevel === "high" || e.smokeExposure === "high" || e.heatExposure === "high");

    const idStart = allItems.length === 0 ? 1 : Math.max(...allItems.map((i) => i.id)) + 1;
    items = buildDefaultPlan(hasHighExposure, idStart);
    writeJson("care_plan_items.json", [...allItems, ...items]);
  }

  const sorted = [...items].sort((a, b) => (a.scheduledTime ?? "99:99").localeCompare(b.scheduledTime ?? "99:99"));
  const adjusted = sorted.some((i) => i.isAdjustedForOccupation);

  res.json({
    id: 1,
    date,
    generatedAt: new Date().toISOString(),
    isAdjustedForOccupation: adjusted,
    items: sorted.map((i) => ({
      id: i.id,
      category: i.category,
      title: i.title,
      description: i.description,
      explanation: i.explanation,
      scheduledTime: i.scheduledTime,
      completed: i.completed,
      priority: i.priority,
    })),
  });
});

router.post("/care-plan/regenerate", (_req, res): void => {
  const date = todayStr();
  const todayStart = getTodayStart();
  const allItems = readJson<CarePlanItem[]>("care_plan_items.json");
  const remaining = allItems.filter((i) => i.planDate !== date);

  const events = readJson<OccupationalEvent[]>("occupational_events.json");
  const hasHighExposure = events
    .filter((e) => e.occurredAt >= todayStart)
    .some((e) => e.fatigueLevel === "high" || e.smokeExposure === "high" || e.heatExposure === "high");

  const idStart = remaining.length === 0 ? 1 : Math.max(...remaining.map((i) => i.id)) + 1;
  const newItems = buildDefaultPlan(hasHighExposure, idStart);
  writeJson("care_plan_items.json", [...remaining, ...newItems]);

  const adjusted = newItems.some((i) => i.isAdjustedForOccupation);
  res.json({
    id: 1,
    date,
    generatedAt: new Date().toISOString(),
    isAdjustedForOccupation: adjusted,
    items: newItems.map((i) => ({
      id: i.id,
      category: i.category,
      title: i.title,
      description: i.description,
      explanation: i.explanation,
      scheduledTime: i.scheduledTime,
      completed: i.completed,
      priority: i.priority,
    })),
  });
});

router.patch("/care-plan/items/:itemId/complete", (req, res): void => {
  const itemId = parseInt(req.params.itemId as string, 10);
  if (isNaN(itemId)) { res.status(400).json({ error: "Invalid item ID" }); return; }

  const allItems = readJson<CarePlanItem[]>("care_plan_items.json");
  const idx = allItems.findIndex((i) => i.id === itemId);
  if (idx === -1) { res.status(404).json({ error: "Item not found" }); return; }

  allItems[idx].completed = true;
  writeJson("care_plan_items.json", allItems);

  const i = allItems[idx];
  res.json({ id: i.id, category: i.category, title: i.title, description: i.description, explanation: i.explanation, scheduledTime: i.scheduledTime, completed: i.completed, priority: i.priority });
});

export default router;
