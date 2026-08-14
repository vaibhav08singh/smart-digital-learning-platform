"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Clock,
  Flame,
  MessageSquare,
  RotateCcw,
  Sparkles,
  TrendingUp,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { EmptyState } from "@/components/ui/state";
import { getQuizResults } from "@/services/quiz.service";
import { recordActivity } from "@/services/analytics.service";
import { formatDuration } from "@/lib/utils";
import type { QuizResult, TopicPerformance } from "@/types";

const masteryVariant = {
  "Not Started": "secondary",
  Learning: "info",
  "Needs Practice": "warning",
  Strong: "success",
  Mastered: "success",
} as const;

export default function ResultsPage() {
  return (
    <Suspense fallback={<div className="py-16 text-center text-sm text-muted-foreground">Loading results…</div>}>
      <ResultsContent />
    </Suspense>
  );
}

function ResultsContent() {
  const params = useSearchParams();
  const quizId = params.get("quiz");
  const [results, setResults] = useState<QuizResult[] | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setResults(getQuizResults()), 0);
    return () => window.clearTimeout(timer);
  }, [quizId]);

  const result = useMemo(() => {
    if (!results) return undefined;
    return quizId ? results.find((r) => r.quizId === quizId) ?? results[0] : results[0];
  }, [results, quizId]);

  // Record a "results viewed" activity once per quiz result.
  useEffect(() => {
    if (!result || !quizId) return;
    const key = `viewed:${result.quizId}:${result.completedAt}`;
    if (localStorage.getItem(key)) return;
    localStorage.setItem(key, "1");
    recordActivity({ type: "practice", title: `Viewed results: ${result.quizTitle}`, detail: `Scored ${result.score}%`, timestamp: "Just now", xp: 0 });
  }, [result, quizId]);

  if (!results || results.length === 0) {
    return (
      <div className="mx-auto max-w-xl">
        <EmptyState
          title="No results yet"
          description="Complete a practice set or assessment to see your results here."
          action={
            <Button asChild variant="gradient">
              <Link href="/practice">Browse practice</Link>
            </Button>
          }
        />
      </div>
    );
  }

  if (!result) {
    return <EmptyState title="Result not found" description="That quiz result could not be found." />;
  }

  const passed = result.score >= (result.passingScore ?? 60);
  const strongest = [...result.topicBreakdown].sort((a, b) => b.score - a.score)[0];
  const weakest = [...result.topicBreakdown].sort((a, b) => a.score - b.score)[0];

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      {/* Score hero */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative overflow-hidden rounded-3xl border bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 p-8 text-center text-white"
      >
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
        <p className="text-sm font-medium text-white/80">{result.quizTitle}</p>
        <div className="mx-auto mt-4 flex items-end justify-center gap-2">
          <span className="text-6xl font-extrabold tracking-tight sm:text-7xl">{result.score}%</span>
        </div>
        <div className="mx-auto mt-4 flex items-center justify-center gap-2">
          <Badge variant={passed ? "success" : "destructive"} className="bg-white/20 text-white backdrop-blur">
            {passed ? "Passed" : "Keep practising"}
          </Badge>
          <Badge className="bg-white/20 text-white backdrop-blur">{result.masteryGained}</Badge>
        </div>
        <p className="mt-4 text-sm text-white/80">
          {result.correct} correct · {result.incorrect} incorrect · {formatDuration(result.timeTakenSeconds)} taken
        </p>
      </motion.div>

      {/* Stat row */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <ResultStat icon={<CheckCircle2 className="h-4 w-4 text-emerald-500" />} label="Correct" value={String(result.correct)} />
        <ResultStat icon={<XCircle className="h-4 w-4 text-rose-500" />} label="Incorrect" value={String(result.incorrect)} />
        <ResultStat icon={<Clock className="h-4 w-4 text-primary" />} label="Time taken" value={formatDuration(result.timeTakenSeconds)} />
        <ResultStat icon={<Sparkles className="h-4 w-4 text-amber-500" />} label="XP earned" value={`+${result.correct * 10}`} />
      </div>

      {/* Topic breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" /> Topic breakdown
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {result.topicBreakdown.map((topic) => (
            <TopicRow key={topic.topicId} topic={topic} />
          ))}
        </CardContent>
      </Card>

      {/* Strongest / weakest */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardContent className="p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Strongest topic</p>
            {strongest ? (
              <p className="mt-2 font-semibold">{strongest.topicName} <span className="text-emerald-500">· {strongest.score}%</span></p>
            ) : (
              <p className="mt-2 text-sm text-muted-foreground">—</p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              <Flame className="h-3.5 w-3.5 text-amber-500" /> Needs focus
            </p>
            {weakest && weakest.score < 80 ? (
              <p className="mt-2 font-semibold">{weakest.topicName} <span className="text-amber-500">· {weakest.score}%</span></p>
            ) : (
              <p className="mt-2 text-sm text-muted-foreground">No weak topics — nice work!</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recommended next steps */}
      <Card className="border-primary/30 bg-gradient-to-br from-primary/10 to-transparent">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" /> Recommended next steps
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button asChild variant="gradient">
            <Link href="/practice"><ArrowRight className="h-4 w-4" /> Practice weak topics</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href={`/quiz/${result.quizId}`}><RotateCcw className="h-4 w-4" /> Retake quiz</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/ai-tutor"><MessageSquare className="h-4 w-4" /> Ask AI Tutor</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/analytics"><BarChart3 className="h-4 w-4" /> View analytics</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function TopicRow({ topic }: { topic: TopicPerformance }) {
  const variant = masteryVariant[topic.mastery as keyof typeof masteryVariant] ?? "secondary";
  return (
    <div>
      <div className="mb-1 flex items-center justify-between gap-2">
        <p className="text-sm font-medium">{topic.topicName}</p>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold tabular-nums">{topic.score}%</span>
          <Badge variant={variant}>{topic.mastery}</Badge>
        </div>
      </div>
      <Progress value={topic.score} className="h-2" />
    </div>
  );
}

function ResultStat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <Card>
      <CardContent className="flex items-center gap-3 p-4">
        {icon}
        <div>
          <p className="text-lg font-bold leading-none">{value}</p>
          <p className="mt-1 text-xs text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}
