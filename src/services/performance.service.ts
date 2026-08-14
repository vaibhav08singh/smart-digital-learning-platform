import { readStore, uid, writeStore } from "@/lib/storage";
import { getQuiz, getQuizResults } from "./quiz.service";
import { getAnalyticsSnapshot, recordActivity } from "./analytics.service";
import { addStudyMinutes } from "./student.service";
import type {
  PlannedActivity,
  TopicStatus,
  TopicStatusLevel,
  WeaknessAnalysis,
} from "@/types";
import type { ActivityEvent } from "@/types";

// ============================================================
// AI Weakness Detector.
// Aggregates quiz results, stored topic performance and coding
// practice into per-topic status (weak / improving / strong),
// explains the weakest topic and generates improvement steps.
// This single source of truth feeds the Study Planner and the
// dashboard recommendation, keeping every feature connected.
// ============================================================

const CODING_KEY = "codezen:coding-practice";

export interface CodingPracticeRecord {
  id: string;
  topicId: string;
  topicName: string;
  passed: boolean;
  language: string;
  completedAt: string;
}

export function getCodingPractice(): CodingPracticeRecord[] {
  return readStore<CodingPracticeRecord[]>(CODING_KEY, []);
}

export function recordCodingPractice(args: {
  topicId: string;
  topicName: string;
  passed: boolean;
  language: string;
}): void {
  const records = getCodingPractice();
  records.push({
    id: uid("cp"),
    topicId: args.topicId,
    topicName: args.topicName,
    passed: args.passed,
    language: args.language,
    completedAt: new Date().toISOString(),
  });
  writeStore(CODING_KEY, records.slice(-200));
}

interface TopicAccum {
  topicId: string;
  topicName: string;
  correct: number;
  attempts: number;
  recentCorrect: number;
  recentAttempts: number;
  hasRealData: boolean;
}

function accuracyOf(a: TopicAccum): number {
  if (a.attempts === 0) return 0;
  return Math.round((a.correct / a.attempts) * 100);
}

export function classifyTopic(accuracy: number): TopicStatusLevel {
  if (accuracy < 60) return "weak";
  if (accuracy < 85) return "improving";
  return "strong";
}

function mergeInto(
  map: Map<string, TopicAccum>,
  topicId: string,
  topicName: string,
  correct: number,
  attempts: number,
  recent: boolean,
  real: boolean,
): void {
  if (attempts <= 0) return;
  const entry = map.get(topicId) ?? {
    topicId,
    topicName,
    correct: 0,
    attempts: 0,
    recentCorrect: 0,
    recentAttempts: 0,
    hasRealData: false,
  };
  entry.topicName = topicName;
  entry.correct += correct;
  entry.attempts += attempts;
  if (recent) {
    entry.recentCorrect += correct;
    entry.recentAttempts += attempts;
  }
  if (real) entry.hasRealData = true;
  map.set(topicId, entry);
}

/** Aggregate quiz results (with real per-question counts). */
function aggregateFromQuizzes(map: Map<string, TopicAccum>): void {
  const results = getQuizResults();
  const recentCutoff = results.slice(0, Math.min(3, results.length));
  for (const result of results) {
    const quiz = getQuiz(result.quizId);
    const byTopic = new Map<string, { name: string; total: number; correct: number }>();
    for (const question of quiz?.questions ?? []) {
      const key = question.topicId ?? "general";
      const entry = byTopic.get(key) ?? { name: question.topicName ?? "General", total: 0, correct: 0 };
      entry.total += 1;
      entry.name = question.topicName ?? entry.name;
      byTopic.set(key, entry);
    }
    for (const tp of result.topicBreakdown) {
      const stats = byTopic.get(tp.topicId);
      if (!stats) continue;
      const correct = Math.round((tp.score / 100) * stats.total);
      const recent = recentCutoff.some((r) => r.quizId === result.quizId);
      mergeInto(map, tp.topicId, tp.topicName, correct, stats.total, recent, true);
    }
  }
}

/** Seed demo topic performance so the detector is useful before first quiz. */
function aggregateFromAnalytics(map: Map<string, TopicAccum>): void {
  const analytics = getAnalyticsSnapshot();
  for (const tp of analytics.topicPerformance) {
    if (map.has(tp.topicId)) continue; // real data wins
    mergeInto(map, tp.topicId, tp.topicName, Math.round(tp.score / 10), 10, false, false);
  }
}

function aggregateFromCoding(map: Map<string, TopicAccum>): void {
  for (const record of getCodingPractice()) {
    mergeInto(map, record.topicId, record.topicName, record.passed ? 1 : 0, 1, true, true);
  }
}

export function getTopicStatus(): TopicStatus[] {
  const map = new Map<string, TopicAccum>();
  aggregateFromQuizzes(map);
  aggregateFromAnalytics(map);
  aggregateFromCoding(map);

  return Array.from(map.values())
    .map((acc) => {
      const accuracy = accuracyOf(acc);
      const recent =
        acc.recentAttempts > 0 ? Math.round((acc.recentCorrect / acc.recentAttempts) * 100) : accuracy;
      const trend = recent - accuracy;
      return {
        topicId: acc.topicId,
        topicName: acc.topicName,
        accuracy,
        attempts: acc.attempts,
        status: classifyTopic(accuracy),
        trend: Math.max(-30, Math.min(30, trend)),
      } satisfies TopicStatus;
    })
    .sort((a, b) => a.accuracy - b.accuracy);
}

const WEAK_AREA: Record<string, string> = {
  "Dynamic Programming": "recurrence relations, overlapping subproblems and memoization",
  "Binary Trees": "tree traversals and recursion on node-based structures",
  "Graphs": "graph representations and BFS/DFS traversal order",
  "AVL Trees": "balance factors and the LL/LR/RR/RL rotations",
  "Linked Lists": "pointer manipulation and edge cases at the head and tail",
  "Stacks": "stack invariants and balancing/parsing problems",
  "Queues": "circular buffers and enqueue/dequeue edge cases",
  Recursion: "base cases and how recursive calls unwind",
  Arrays: "index bounds and in-place algorithms",
  Sorting: "partitioning and the stability of each algorithm",
  "Operating Systems": "scheduling, deadlock and memory-management concepts",
  Databases: "normalization and SQL joins",
};

export function getWeaknessAnalysis(): WeaknessAnalysis {
  const topics = getTopicStatus();
  const weakest = topics[0] && topics[0].accuracy < 60 ? topics[0] : topics.find((t) => t.accuracy < 60);
  const weakestTopic = weakest ?? topics[0];

  let explanation = "";
  if (weakestTopic) {
    const area =
      WEAK_AREA[weakestTopic.topicName] ??
      "the core concepts and edge cases";
    explanation =
      `Your recent quizzes and coding practice show that ${weakestTopic.topicName} is your ` +
      `weakest area at ${weakestTopic.accuracy}% accuracy across ${weakestTopic.attempts} attempts. ` +
      `You are making mistakes with ${area}. Focus here first — it will raise your overall progress fastest.`;
  } else {
    explanation =
      "You are on a strong run — no topic is below 60% accuracy. Keep your streak going with mixed practice.";
  }

  const steps =
    weakestTopic && weakestTopic.accuracy < 60
      ? [
          `Revise ${weakestTopic.topicName} basics`,
          `Study ${weakestTopic.topicName} examples and solved problems`,
          `Solve 5 beginner ${weakestTopic.topicName} problems`,
          `Take a ${weakestTopic.topicName} quiz`,
          `Move to your next topic after reaching 75% accuracy`,
        ]
      : [
          "Revise the fundamentals of your next target topic",
          "Do 15 minutes of mixed practice daily",
          "Take a weekly quiz to measure accuracy",
          "Teach someone a topic you scored over 85% on",
        ];

  return { topics, weakest, explanation, steps, generatedAt: new Date().toISOString() };
}

/** Count topics per status for UI badges. */
export function statusCounts(topics: TopicStatus[]): Record<TopicStatusLevel, number> {
  const counts: Record<TopicStatusLevel, number> = { weak: 0, improving: 0, strong: 0 };
  for (const t of topics) counts[t.status] += 1;
  return counts;
}

// ------------------------------------------------------------
// Progress glue shared by the planner + dashboard.
// ------------------------------------------------------------

export function completeActivity(activity: PlannedActivity): PlannedActivity {
  if (activity.status === "completed") return activity;
  addStudyMinutes(activity.durationMinutes);
  const event: Omit<ActivityEvent, "id"> = {
    type: "practice",
    title: `Completed: ${activity.title}`,
    detail: `${activity.subject} · ${activity.durationMinutes} min`,
    timestamp: "Just now",
    xp: Math.max(5, Math.round(activity.durationMinutes / 2)),
  };
  recordActivity(event);
  return { ...activity, status: "completed" };
}

/** Weekly mixed-practice plan for the "Improve Weak Areas" button. */
export function buildImprovementWeek(focus: TopicStatus): PlannedActivity[] {
  const monday = startOfWeek(new Date());
  const slot = (offsetDays: number, title: string, subject: string, minutes: number, emoji: string, startTime: string) =>
    ({
      id: uid("act"),
      title,
      subject,
      emoji,
      durationMinutes: minutes,
      date: toISODate(addDays(monday, offsetDays)),
      startTime,
      status: "pending",
      source: "weakness",
    }) satisfies PlannedActivity;

  return [
    slot(0, `${focus.topicName} Basics`, focus.topicName, 30, "📘", "17:00"),
    slot(1, `Recursive ${focus.topicName} Functions`, focus.topicName, 30, "🧩", "17:00"),
    slot(2, `${focus.topicName} Problems`, focus.topicName, 45, "💻", "17:00"),
    slot(3, `${focus.topicName} Quiz`, focus.topicName, 20, "🧠", "17:00"),
    slot(4, "Revision", focus.topicName, 20, "🔄", "17:00"),
    slot(5, "Mixed Practice", focus.topicName, 30, "🏋️", "17:00"),
    slot(6, "Assessment", focus.topicName, 30, "📝", "17:00"),
  ];
}

export function toISODate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

export function startOfWeek(date: Date): Date {
  const day = (date.getDay() + 6) % 7; // Monday = 0
  return addDays(date, -day);
}
