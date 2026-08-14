import { readStore, simulateLatency, uid, writeStore } from "@/lib/storage";
import { getQuiz, quizzes } from "@/data/quiz";
import { getTopicPerformanceFromAnswers } from "./analytics.service";
import type { Quiz, QuizResult } from "@/types";

// ============================================================
// Quiz service — quizzes, submission and stored results.
// ============================================================

const RESULTS_KEY = "codezen:quiz-results";

export async function getQuizById(id: string): Promise<Quiz | undefined> {
  await simulateLatency(200);
  return getQuiz(id);
}

export async function getQuizzes(): Promise<Quiz[]> {
  await simulateLatency(200);
  return quizzes;
}

export interface QuizSubmission {
  answers: Record<string, number>;
  timeTakenSeconds: number;
}

export async function submitQuiz(
  quizId: string,
  submission: QuizSubmission,
): Promise<QuizResult> {
  await simulateLatency(400);
  const quiz = getQuiz(quizId);
  if (!quiz) throw new Error("Quiz not found");

  const correct: string[] = [];
  const incorrect: string[] = [];
  const topicScores = new Map<string, { total: number; correct: number; name: string }>();

  for (const question of quiz.questions) {
    const answer = submission.answers[question.id];
    const isCorrect = answer === question.answerIndex;
    if (isCorrect) correct.push(question.id);
    else incorrect.push(question.id);

    const key = question.topicId ?? "general";
    const entry = topicScores.get(key) ?? { total: 0, correct: 0, name: question.topicName ?? "General" };
    entry.total += 1;
    if (isCorrect) entry.correct += 1;
    topicScores.set(key, entry);
  }

  const result: QuizResult = {
    quizId,
    quizTitle: quiz.title,
    score: Math.round((correct.length / quiz.questions.length) * 100),
    total: quiz.questions.length,
    correct: correct.length,
    incorrect: incorrect.length,
    timeTakenSeconds: submission.timeTakenSeconds,
    passingScore: quiz.passingScore,
    topicBreakdown: getTopicPerformanceFromAnswers(Array.from(topicScores.entries())),
    masteryGained: masteryLabel(Math.round((correct.length / quiz.questions.length) * 100)),
    completedAt: new Date().toISOString(),
  };

  const results = readStore<QuizResult[]>(RESULTS_KEY, []);
  results.unshift(result);
  writeStore(RESULTS_KEY, results.slice(0, 30));

  return result;
}

export function getQuizResults(): QuizResult[] {
  return readStore<QuizResult[]>(RESULTS_KEY, []);
}

/** Synchronous quiz lookup for analytic/aggregate code. */
export { getQuiz } from "@/data/quiz";

function masteryLabel(score: number): string {
  if (score >= 90) return "Mastered";
  if (score >= 75) return "Strong";
  if (score >= 50) return "Needs Practice";
  return "Learning";
}

/** Reset stored results (used by the demo/tests). */
export function clearResults(): void {
  writeStore(RESULTS_KEY, []);
}

export { uid };
