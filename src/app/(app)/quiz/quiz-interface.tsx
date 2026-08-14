"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  Clock,
  Flag,
  ListChecks,
  Send,
  Trophy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ErrorState, LoadingState } from "@/components/ui/state";
import { getQuizById } from "@/services/quiz.service";
import { submitQuiz } from "@/services/quiz.service";
import { recordActivity, mergeQuizResult } from "@/services/analytics.service";
import type { Quiz } from "@/types";
import { cn } from "@/lib/utils";

type QuizStatus = "intro" | "active" | "submitting";

export function QuizInterface({ id }: { id: string }) {
  const router = useRouter();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [error, setError] = useState(false);
  const [status, setStatus] = useState<QuizStatus>("intro");
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const submittedRef = useRef(false);

  useEffect(() => {
    let mounted = true;
    getQuizById(id)
      .then((q) => {
        if (!mounted) return;
        if (!q) setError(true);
        else setQuiz(q);
      })
      .catch(() => mounted && setError(true));
    return () => {
      mounted = false;
    };
  }, [id]);

  // Timer
  useEffect(() => {
    if (status !== "active") return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => (t <= 1 ? 0 : t - 1));
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [status]);

  // Auto-submit when the timer reaches zero.
  useEffect(() => {
    if (status !== "active" || timeLeft !== 0) return;
    void doSubmit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, status]);

  if (error) return <ErrorState message="Quiz not found." onRetry={() => router.push("/practice")} />;
  if (!quiz) return <LoadingState label="Loading quiz…" />;

  const currentQuiz = quiz;
  const total = currentQuiz.questions.length;
  const answered = Object.keys(answers).length;
  const question = currentQuiz.questions[current];
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  function start() {
    setTimeLeft(currentQuiz.timeLimitMinutes * 60);
    setStatus("active");
  }

  function selectOption(optionIndex: number) {
    setAnswers((prev) => ({ ...prev, [question.id]: optionIndex }));
  }

  async function doSubmit() {
    if (status === "submitting" || submittedRef.current) return;
    submittedRef.current = true;
    setStatus("submitting");
    try {
      const startedAt = Date.now() - (currentQuiz.timeLimitMinutes * 60 - timeLeft) * 1000;
      const elapsed = Math.max(0, Math.round((Date.now() - startedAt) / 1000));
      const result = await submitQuiz(id, {
        answers,
        timeTakenSeconds: elapsed || currentQuiz.timeLimitMinutes * 60,
      });
      mergeQuizResult(result);
      recordActivity({
        type: "quiz",
        title: `Quiz: ${result.quizTitle}`,
        detail: `Scored ${result.score}%`,
        timestamp: "Just now",
        xp: result.score,
      });
      router.push(`/results?quiz=${id}&t=${result.timeTakenSeconds}`);
    } catch {
      submittedRef.current = false;
      setStatus("active");
    }
  }

  // Intro screen
  if (status === "intro") {
    return (
      <div className="mx-auto max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl border bg-card p-8 text-center sm:p-10">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 text-white shadow-lg shadow-indigo-500/25">
            <ListChecks className="h-7 w-7" />
          </div>
          <Badge variant="secondary">{currentQuiz.type === "quiz" ? "Timed assessment" : "Practice set"}</Badge>
          <h1 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">{currentQuiz.title}</h1>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">{currentQuiz.description}</p>

          <div className="mx-auto mt-6 grid max-w-md grid-cols-2 gap-3 text-left sm:grid-cols-4">
            <QuizStat icon={<ListChecks className="h-4 w-4" />} label="Questions" value={String(total)} />
            <QuizStat icon={<Clock className="h-4 w-4" />} label="Time" value={`${currentQuiz.timeLimitMinutes}m`} />
            <QuizStat icon={<Trophy className="h-4 w-4" />} label="Pass" value={`${currentQuiz.passingScore}%`} />
            <QuizStat icon={<AlertCircle className="h-4 w-4" />} label="Level" value={currentQuiz.difficulty} />
          </div>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button size="lg" onClick={start}>
              <Flag className="h-4 w-4" /> Start quiz
            </Button>
            <Button asChild size="lg" variant="ghost">
              <Link href="/practice">
                <ArrowLeft className="h-4 w-4" /> Back to practice
              </Link>
            </Button>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            The timer starts when you begin. You can navigate freely between questions.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      {/* Header */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.push("/practice")} aria-label="Back to practice">
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-lg font-bold leading-tight">{currentQuiz.title}</h1>
            <p className="text-xs text-muted-foreground">
              Question {current + 1} of {total}
            </p>
          </div>
        </div>
        <span
          className={cn(
            "flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-semibold tabular-nums",
            timeLeft <= 30 ? "border-destructive text-destructive" : "text-muted-foreground",
          )}
          role="timer"
          aria-live="polite"
        >
          <Clock className="h-4 w-4" /> {minutes}:{seconds.toString().padStart(2, "0")}
        </span>
      </div>

      <Progress value={(answered / total) * 100} className="mb-6" aria-label={`${answered} of ${total} answered`} />

      <div className="grid gap-6 md:grid-cols-[1fr_180px]">
        {/* Question */}
        <motion.div
          key={question.id}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          className="rounded-2xl border bg-card p-6"
        >
          <div className="mb-4 flex items-center justify-between gap-2">
            <Badge variant="outline">Q{current + 1}</Badge>
            <Badge variant="secondary">{question.difficulty}</Badge>
          </div>
          <p className="text-base font-medium leading-relaxed sm:text-lg">{question.prompt}</p>

          <div className="mt-6 space-y-2.5" role="radiogroup" aria-label={`Options for question ${current + 1}`}>
            {question.options.map((option, optionIndex) => {
              const selected = answers[question.id] === optionIndex;
              return (
                <button
                  key={optionIndex}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => selectOption(optionIndex)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-all",
                    selected
                      ? "border-primary bg-primary/10 ring-1 ring-primary"
                      : "hover:border-primary/40 hover:bg-accent/50",
                  )}
                >
                  <span
                    className={cn(
                      "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-semibold",
                      selected ? "border-primary bg-primary text-primary-foreground" : "text-muted-foreground",
                    )}
                  >
                    {String.fromCharCode(65 + optionIndex)}
                  </span>
                  {option}
                  {selected && <CheckCircle2 className="ml-auto h-4 w-4 text-primary" />}
                </button>
              );
            })}
          </div>

          {/* Explanation after answering */}
          {answers[question.id] !== undefined && (
            <div className="mt-4 rounded-xl border border-primary/20 bg-primary/5 p-4 text-sm">
              <p className="font-semibold text-primary">Explanation</p>
              <p className="mt-1 text-muted-foreground">{question.explanation}</p>
            </div>
          )}

          <div className="mt-6 flex items-center justify-between">
            <Button variant="outline" onClick={() => setCurrent((c) => Math.max(0, c - 1))} disabled={current === 0 || status === "submitting"}>
              <ArrowLeft className="h-4 w-4" /> Previous
            </Button>
            {current < total - 1 ? (
              <Button onClick={() => setCurrent((c) => Math.min(total - 1, c + 1))} disabled={status === "submitting"}>
                Next <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button variant="gradient" onClick={() => setConfirmOpen(true)} disabled={status === "submitting"}>
                <Send className="h-4 w-4" /> Submit quiz
              </Button>
            )}
          </div>
        </motion.div>

        {/* Question navigator */}
        <aside className="rounded-2xl border bg-card p-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Navigator
          </p>
          <div className="grid grid-cols-5 gap-2 md:grid-cols-4">
            {currentQuiz.questions.map((q, i) => (
              <button
                key={q.id}
                type="button"
                onClick={() => setCurrent(i)}
                aria-label={`Go to question ${i + 1}${answers[q.id] !== undefined ? ", answered" : ""}`}
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-lg border text-xs font-semibold transition-colors",
                  i === current
                    ? "border-primary bg-primary text-primary-foreground"
                    : answers[q.id] !== undefined
                      ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                      : "hover:border-primary/50",
                )}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            <span className="mr-1 inline-block h-2.5 w-2.5 rounded-full bg-emerald-500/60 align-middle" /> answered
            <span className="ml-2 mr-1 inline-block h-2.5 w-2.5 rounded-full bg-muted align-middle ring-1 ring-border" /> unanswered
          </p>
          <div className="mt-4">
            <Button variant="gradient" className="w-full" onClick={() => setConfirmOpen(true)} disabled={status === "submitting"}>
              <Send className="h-4 w-4" /> Submit
            </Button>
          </div>
        </aside>
      </div>

      {/* Submit confirmation */}
      {confirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true" aria-labelledby="submit-title">
          <div className="w-full max-w-md rounded-2xl border bg-card p-6 shadow-xl">
            <h2 id="submit-title" className="text-lg font-bold">Submit quiz?</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              You&apos;ve answered <strong>{answered}</strong> of <strong>{total}</strong> questions
              {answered < total && " — some are unanswered"}. You can&apos;t change answers after submitting.
            </p>
            <div className="mt-6 flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setConfirmOpen(false)}>Keep going</Button>
              <Button variant="gradient" onClick={() => void doSubmit()} disabled={status === "submitting"}>
                {status === "submitting" ? "Submitting…" : "Yes, submit"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function QuizStat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-xl border bg-muted/40 p-3">
      <div className="flex items-center gap-1 text-muted-foreground">{icon}<span className="text-[10px] uppercase tracking-wide">{label}</span></div>
      <p className="mt-1 text-sm font-bold">{value}</p>
    </div>
  );
}
