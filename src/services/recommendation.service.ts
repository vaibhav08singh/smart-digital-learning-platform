import { getTopicStatus } from "./performance.service";
import { completedMinutesFor, todayPlan, toISODate, plannedMinutesFor } from "./planner.service";
import { getQuizResults } from "./quiz.service";
import { getStudentProfile } from "./auth.service";

// ============================================================
// AI Recommendation — a single dynamic recommendation computed
// from real student data: quiz results, weak topics, today's
// plan and study time. Drives the dashboard recommendation card.
// ============================================================

export interface AiRecommendation {
  headline: string;
  reason: string;
  buttons: { label: string; href: string }[];
  topicName?: string;
}

export function getAiRecommendation(): AiRecommendation {
  const topics = getTopicStatus();
  const weakest = topics.find((t) => t.status === "weak") ?? topics[0];
  const quizResults = getQuizResults();
  const todayIso = toISODate(new Date());
  const doneToday = completedMinutesFor(todayIso);
  const plannedToday = plannedMinutesFor(todayIso);
  const profile = getStudentProfile();

  // 1) Weak topic present → recommend revising it.
  if (weakest && weakest.status === "weak") {
    const quizHint =
      quizResults.length > 0
        ? `Your last ${quizResults.length} quiz${quizResults.length === 1 ? "" : "zes"} and coding practice`
        : "Your recent practice";
    return {
      headline: `Revise ${weakest.topicName} before moving on`,
      reason: `${quizHint} show that you're struggling with ${weakest.topicName} (${weakest.accuracy}% accuracy). Focus here first — it unlocks your next topic fastest.`,
      topicName: weakest.topicName,
      buttons: [
        { label: "Start Learning", href: `/learning/tp-${weakest.topicId.replace(/^tp-/, "")}/tp-${weakest.topicId.replace(/^tp-/, "")}-l1` },
        { label: "Ask AI Tutor", href: `/ai-tutor?prompt=${encodeURIComponent(`Teach me ${weakest.topicName} from scratch`)}` },
        { label: "Take Quiz", href: "/practice" },
      ],
    };
  }

  // 2) Today's plan exists but not finished → keep the streak going.
  if (plannedToday > 0 && doneToday < plannedToday) {
    return {
      headline: `${Math.max(0, plannedToday - doneToday)} minutes left in today's plan`,
      reason: "Your study planner has time banked for today. Knock out the next session to protect your streak and hit your daily goal.",
      buttons: [
        { label: "Continue Plan", href: "/planner" },
        { label: "Ask AI Tutor", href: "/ai-tutor" },
        { label: "Open Coding Lab", href: "/coding-lab" },
      ],
    };
  }

  // 3) Everything strong → suggest mixed practice.
  return {
    headline: `Great streak — keep it going, ${profile.name.split(" ")[0]}`,
    reason: "You've kept every topic at 85%+ accuracy. Mixed practice and a weekly quiz will lock in your mastery.",
    buttons: [
      { label: "Take Quiz", href: "/practice" },
      { label: "Ask AI Tutor", href: "/ai-tutor" },
      { label: "Open Coding Lab", href: "/coding-lab" },
    ],
  };
}

/** Seed today's plan with a weak-topic focus session when empty. */
export function ensureTodayFocusSession(): void {
  const topics = getTopicStatus();
  const weakest = topics.find((t) => t.status === "weak") ?? topics[0];
  const todayIso = toISODate(new Date());
  if (!weakest || plannedMinutesFor(todayIso) > 0) return;
  // addFocusSession imported lazily to avoid a cycle at module load
  void import("./planner.service").then(({ addFocusSession }) => {
    addFocusSession(
      `${weakest.topicName} — 30 min`,
      weakest.topicName,
      30,
      "📘",
      `/learning/tp-${weakest.topicId.replace(/^tp-/, "")}/tp-${weakest.topicId.replace(/^tp-/, "")}-l1`,
    );
  });
}

export { todayPlan };
