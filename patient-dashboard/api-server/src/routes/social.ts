import { Router } from "express";

const router = Router();

router.get("/social/groups", async (req, res): Promise<void> => {
  res.json([
    {
      id: 1,
      name: "Southside Morning Walkers",
      description: "Friendly walking group for all fitness levels. We meet at Riverside Park and walk 5km at a comfortable pace.",
      memberCount: 24,
      distanceKm: 1.2,
      nextMeeting: "Tomorrow at 07:00",
      category: "walking",
    },
    {
      id: 2,
      name: "First Responders Fitness",
      description: "Fitness community specifically for emergency services workers. Low-impact sessions designed around shift patterns.",
      memberCount: 61,
      distanceKm: 3.4,
      nextMeeting: "Saturday at 09:30",
      category: "fitness",
    },
    {
      id: 3,
      name: "Diabetes Prevention Circle",
      description: "Community group focused on lifestyle interventions for pre-diabetes and T2D management through movement and nutrition.",
      memberCount: 38,
      distanceKm: 2.1,
      nextMeeting: "Wednesday at 18:00",
      category: "health",
    },
    {
      id: 4,
      name: "Mindful Movement",
      description: "Gentle yoga, stretching, and breathwork sessions. Particularly suitable for those managing respiratory conditions.",
      memberCount: 19,
      distanceKm: 0.8,
      nextMeeting: "Thursday at 07:30",
      category: "wellness",
    },
  ]);
});

router.get("/social/challenges", async (req, res): Promise<void> => {
  res.json([
    {
      id: 1,
      title: "10,000 Steps for 30 Days",
      description: "Walk at least 10,000 steps every day for a month. Track your progress and support your teammates.",
      participants: 412,
      daysRemaining: 18,
      userProgress: 62,
      category: "movement",
    },
    {
      id: 2,
      title: "7-Day Sleep Consistency",
      description: "Maintain a consistent sleep and wake time within 30 minutes for 7 consecutive days.",
      participants: 287,
      daysRemaining: 5,
      userProgress: 71,
      category: "sleep",
    },
    {
      id: 3,
      title: "Hydration Hero",
      description: "Hit your daily hydration target for 21 days. Log your intake each day to participate.",
      participants: 198,
      daysRemaining: 14,
      userProgress: 48,
      category: "nutrition",
    },
    {
      id: 4,
      title: "Mindfulness Month",
      description: "Complete at least 10 minutes of mindfulness or breathwork each day for 30 days.",
      participants: 156,
      daysRemaining: 22,
      userProgress: 27,
      category: "mental",
    },
  ]);
});

router.get("/social/partners", async (req, res): Promise<void> => {
  res.json([
    {
      id: 1,
      name: "Marcus T.",
      sharedGoals: ["Improve sleep quality", "Manage pre-diabetes"],
      healthScoreSimilarity: 94,
      streak: 14,
    },
    {
      id: 2,
      name: "Priya K.",
      sharedGoals: ["Reduce respiratory risk", "Increase daily activity"],
      healthScoreSimilarity: 88,
      streak: 7,
    },
    {
      id: 3,
      name: "James R.",
      sharedGoals: ["Improve recovery scores", "Manage occupational stress"],
      healthScoreSimilarity: 91,
      streak: 21,
    },
  ]);
});

export default router;
