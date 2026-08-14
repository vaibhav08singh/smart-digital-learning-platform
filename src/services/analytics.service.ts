import { readStore, simulateLatency, uid, writeStore } from "@/lib/storage";
import { demoActivity, demoAnalytics } from "@/data/student";
import type {
  ActivityEvent,
  AnalyticsSummary,
  QuizResult,
  TopicPerformance,
} from "@/types";

// ============================================================
// Analytics service — activity log + aggregate summaries.
// ============================================================

const ACTIVITY_KEY = "codezen:activity";
const ANALYTICS_KEY = "codezen:analytics-overrides";

export async function getAnalytics(): Promise<AnalyticsSummary> {
  await simulateLatency(300);
  return getAnalyticsSnapshot();
}

/** Synchronous read of the current summary (no simulated latency). */
export function getAnalyticsSnapshot(): AnalyticsSummary {
  const overrides = readStore<Partial<AnalyticsSummary>>(ANALYTICS_KEY, {});
  return { ...demoAnalytics, ...overrides };
}

export function getActivity(): ActivityEvent[] {
  return readStore<ActivityEvent[]>(ACTIVITY_KEY, demoActivity);
}

export function recordActivity(event: Omit<ActivityEvent, "id">): void {
  const activity = getActivity();
  activity.unshift({ ...event, id: uid("act") });
  writeStore(ACTIVITY_KEY, activity.slice(0, 30));
}

/** Derive topic-level mastery from a finished quiz. */
export function getTopicPerformanceFromAnswers(
  topicStats: Array<[string, { total: number; correct: number; name: string }]>,
): TopicPerformance[] {
  return topicStats.map(([topicId, stat]) => {
    const score = stat.total === 0 ? 0 : Math.round((stat.correct / stat.total) * 100);
    return {
      topicId,
      topicName: stat.name,
      score,
      mastery:
        score >= 90 ? "Mastered"
        : score >= 75 ? "Strong"
        : score >= 50 ? "Needs Practice"
        : "Learning",
    };
  });
}

/** Fold a completed quiz into the analytics summary. */
export function mergeQuizResult(result: QuizResult): void {
  const overrides = readStore<Partial<AnalyticsSummary>>(ANALYTICS_KEY, {});
  const quizPerformance = [...(overrides.quizPerformance ?? demoAnalytics.quizPerformance)];
  quizPerformance.unshift({
    quiz: result.quizTitle,
    score: result.score,
    date: new Date(result.completedAt).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
  });
  const topicPerformance = [...(overrides.topicPerformance ?? demoAnalytics.topicPerformance)];
  for (const tp of result.topicBreakdown) {
    const idx = topicPerformance.findIndex((t) => t.topicId === tp.topicId);
    if (idx >= 0) topicPerformance[idx] = tp;
    else topicPerformance.push(tp);
  }
  writeStore(ANALYTICS_KEY, { ...overrides, quizPerformance, topicPerformance });
}
