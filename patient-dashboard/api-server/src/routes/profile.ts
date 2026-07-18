import { Router } from "express";
import { readJson, writeJson } from "../lib/store";
import { SaveProfileBody } from "@workspace/api-zod";

const router = Router();

interface Profile {
  id: number;
  name: string;
  age: number;
  heightCm: number;
  weightKg: number;
  occupation: string;
  conditions: string[];
  medications: string[];
  goals: string[];
  lifestyleHabits: string[];
  wearableConnected: boolean;
  wearableType: string | null;
  createdAt: string;
}

router.get("/profile", (_req, res): void => {
  const profile = readJson<Profile>("profile.json");
  res.json(profile);
});

router.post("/profile", (req, res): void => {
  const parsed = SaveProfileBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const data = parsed.data;
  const updated: Profile = {
    id: 1,
    name: data.name,
    age: data.age,
    heightCm: data.heightCm,
    weightKg: data.weightKg,
    occupation: data.occupation,
    conditions: data.conditions ?? [],
    medications: data.medications ?? [],
    goals: data.goals ?? [],
    lifestyleHabits: data.lifestyleHabits ?? [],
    wearableConnected: data.wearableConnected ?? false,
    wearableType: data.wearableType ?? null,
    createdAt: new Date().toISOString(),
  };

  writeJson("profile.json", updated);
  res.json(updated);
});

export default router;
