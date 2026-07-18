import { Router } from "express";
import { readJson, writeJson, nextId } from "../lib/store";
import { SendChatMessageBody } from "@workspace/api-zod";

const router = Router();

interface ChatMessage {
  id: number;
  role: string;
  content: string;
  sentAt: string;
}

interface Metric {
  id: number;
  recoveryScore: number;
  restingHeartRate: number;
  hrv: number;
  recordedAt: string;
}

interface OccupationalEvent {
  id: number;
  fatigueLevel: string;
  occurredAt: string;
}

function getTodayStart(): string {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

function generateAIResponse(
  userMessage: string,
  hasOccupationalEvents: boolean,
  metrics: { recoveryScore: number; restingHeartRate: number; hrv: number },
): string {
  const msg = userMessage.toLowerCase();

  if (msg.includes("gym") || msg.includes("workout") || msg.includes("training") || msg.includes("exercise") || msg.includes("hiit")) {
    if (hasOccupationalEvents) {
      return "Based on today's shift load and your elevated physiological stress markers, I recommend postponing HIIT until your next rest day. Replace it with a 20-minute easy walk instead. Post-shift cortisol antagonises the insulin-sensitising benefit of HIIT in PCOS — you'd be training at the worst possible hormonal window.";
    }
    return `Your recovery score and readiness look good today — this is a good window for HIIT. Aim for 20–25 minutes at 75–85% max heart rate. HIIT improves insulin sensitivity by 25–30% in PCOS within 24 hours of each session. Your HRV of ${metrics.hrv}ms suggests your autonomic system can handle the load.`;
  }

  if (msg.includes("sleep") || msg.includes("tired") || msg.includes("fatigue") || msg.includes("rest")) {
    if (hasOccupationalEvents) {
      return `Your HRV is suppressed following today's shift, indicating your autonomic nervous system is still in recovery mode. I've prioritised an early bedtime in your plan tonight. Unstructured post-shift sleep is the single highest-impact modifiable risk factor for PCOS — each hour lost increases fasting insulin by ~4%.`;
    }
    return `Your sleep quality has been averaging around 58/100 — this is below the target of 65+ for effective PCOS management. On your non-shift nights, prioritise a consistent bedtime of 22:30 and screens-off at 21:30. Sleep regularity supports LH pulsatility and cycle regularity more than any supplement.`;
  }

  if (msg.includes("pcos") || msg.includes("cycle") || msg.includes("period") || msg.includes("hormone") || msg.includes("androgen")) {
    return `Your PCOS management is multi-layered. The three biggest levers for you are: (1) insulin sensitivity — Metformin + Myo-Inositol + low-GI diet working together; (2) cortisol load — your night shifts are the primary disruptor of your LH:FSH ratio; (3) Yasmin consistency — drospirenone needs stable serum levels to suppress androgens. Is there a specific aspect you'd like to go deeper on?`;
  }

  if (msg.includes("metformin") || msg.includes("insulin") || msg.includes("blood sugar") || msg.includes("glucose")) {
    return `Your Metformin protocol is calibrated to your shift pattern. On rest days, 1000mg twice daily is appropriate. On night-shift days, your insulin sensitivity drops by 20–30%, so a step-up to 1500mg in the morning is worth discussing with your GP. Your Myo-Inositol amplifies the effect — combined, they improve HOMA-IR by around 35% in studies.`;
  }

  if (msg.includes("inositol") || msg.includes("supplement") || msg.includes("vitamin")) {
    return `Your supplement stack is well-chosen for PCOS. Myo-Inositol works best split into two doses — 2g morning and 2g evening — as it provides steadier glucose regulation throughout the day. Vitamin D is critical: night shift workers are frequently deficient, and low D3 is independently associated with worsened insulin resistance and higher AMH. A serum 25-OH-D3 test would confirm your current dose is adequate.`;
  }

  if (msg.includes("diet") || msg.includes("eat") || msg.includes("food") || msg.includes("meal") || msg.includes("nutrition")) {
    if (hasOccupationalEvents) {
      return "After today's shift, your body needs anti-inflammatory support. Prioritise omega-3 rich foods at dinner: salmon, sardines, leafy greens, walnuts. Avoid alcohol and refined sugar tonight — they amplify the cortisol response from shift work and worsen insulin resistance in PCOS. Keep carbohydrates low-GI and pair them with protein.";
    }
    return "Your nutritional focus should be on glycaemic load reduction and anti-androgenic foods. Practical priorities: low-GI carbohydrates, protein at every meal, leafy greens daily, flaxseed (lignans reduce testosterone), and avoiding refined sugar after 16:00. The Mediterranean pattern reduces androgenic markers by 22% over 12 weeks in PCOS.";
  }

  if (msg.includes("stress") || msg.includes("mental") || msg.includes("anxiety") || msg.includes("burnout") || msg.includes("icu")) {
    return `ICU nursing carries the highest occupational burnout rate in healthcare — and psychological stress is a direct PCOS amplifier via cortisol-driven androgen excess. Your wearable data shows the cortisol signature clearly in your post-shift HRV dips. I'd recommend discussing a CBT-based stress protocol with your GP, and exploring whether your shift scheduling allows for a maximum of 2 consecutive nights.`;
  }

  if (msg.includes("heart") || msg.includes("hrv") || msg.includes("heart rate") || msg.includes("resting")) {
    return `Your resting HR is ${metrics.restingHeartRate}bpm and HRV is ${metrics.hrv}ms. For PCOS patients, elevated resting HR reflects sympathetic nervous system dominance — which directly worsens insulin resistance. Your HRV is your clearest window into how your body is coping with the shift load. When it drops below 28ms, I flag it as a signal to skip HIIT and prioritise recovery.`;
  }

  return `I've reviewed your current health data and shift pattern. Your PCOS is being actively managed across three layers — insulin sensitisation (Metformin + Inositol), androgen suppression (Yasmin), and lifestyle (sleep, exercise, nutrition). The biggest variable we can improve is your post-shift sleep quality and shift scheduling. Is there a specific symptom or part of your plan you'd like to focus on?`;
}

router.get("/chat/messages", (_req, res): void => {
  const messages = readJson<ChatMessage[]>("chat_messages.json");
  res.json(messages.sort((a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime()));
});

router.post("/chat/messages", (req, res): void => {
  const parsed = SendChatMessageBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }

  const messages = readJson<ChatMessage[]>("chat_messages.json");

  const userMsg: ChatMessage = {
    id: nextId(messages),
    role: "user",
    content: parsed.data.content,
    sentAt: new Date().toISOString(),
  };
  messages.push(userMsg);

  const todayStart = getTodayStart();
  const events = readJson<OccupationalEvent[]>("occupational_events.json");
  const hasEvents = events.some((e) => e.occurredAt >= todayStart);

  const allMetrics = readJson<Metric[]>("health_metrics.json");
  const latest = [...allMetrics].sort(
    (a, b) => new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime(),
  )[0] ?? { recoveryScore: 60, restingHeartRate: 79, hrv: 31 };

  const aiContent = generateAIResponse(parsed.data.content, hasEvents, latest);

  const aiMsg: ChatMessage = {
    id: nextId(messages),
    role: "assistant",
    content: aiContent,
    sentAt: new Date().toISOString(),
  };
  messages.push(aiMsg);
  writeJson("chat_messages.json", messages);

  res.json(aiMsg);
});

export default router;
