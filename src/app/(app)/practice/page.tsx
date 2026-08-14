"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  Clock,
  ListChecks,
  Sparkles,
  Trophy,
  Zap,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState, ErrorState, LoadingState } from "@/components/ui/state";
import { getQuizzes } from "@/services/quiz.service";
import { useStudentProfile } from "@/services/auth.service";
import { getEducationLevel } from "@/data/education";
import type { Quiz } from "@/types";

const difficultyVariant = {
  Beginner: "secondary",
  Intermediate: "info",
  Advanced: "warning",
  Expert: "destructive",
} as const;

export default function PracticePage() {
  const [quizzes, setQuizzes] = useState<Quiz[] | null>(null);
  const [error, setError] = useState(false);
  const profile = useStudentProfile();

  useEffect(() => {
    let mounted = true;
    getQuizzes()
      .then((qs) => mounted && setQuizzes(qs))
      .catch(() => mounted && setError(true));
    return () => {
      mounted = false;
    };
  }, []);

  if (error) return <ErrorState message="Couldn't load practice quizzes." onRetry={() => window.location.reload()} />;
  if (!quizzes) return <LoadingState label="Loading practice…" />;

  const level = getEducationLevel(profile.levelId);
  const practice = quizzes.filter((q) => q.type === "practice");
  const assessments = quizzes.filter((q) => q.type === "quiz");

  return (
    <div className="mx-auto max-w-7xl space-y-10">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-medium text-primary">Practice & Assessments</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">Sharpen your skills</h1>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            Practice sets and timed assessments tuned to your {level?.shortLabel} level.
            Keep practising to level up your mastery.
          </p>
        </div>
        <Button asChild variant="gradient">
          <Link href="/analytics">
            <BarChart3 className="h-4 w-4" /> Track my progress
          </Link>
        </Button>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <QuickStat icon={<ListChecks className="h-4 w-4" />} label="Practice sets" value={String(practice.length)} />
        <QuickStat icon={<Trophy className="h-4 w-4" />} label="Assessments" value={String(assessments.length)} />
        <QuickStat icon={<Clock className="h-4 w-4" />} label="Total questions" value={String(quizzes.reduce((n, q) => n + q.questions.length, 0))} />
        <QuickStat icon={<Zap className="h-4 w-4" />} label="Weekly goal" value="4 sets" />
      </div>

      {/* Practice sets */}
      <section>
        <SectionHeading title="Practice sets" description="No timer, instant explanations, learn as you go." />
        {practice.length === 0 ? (
          <EmptyState title="No practice sets yet" description="Check back soon." />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {practice.map((quiz, i) => (
              <motion.div key={quiz.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <QuizCard quiz={quiz} cta="Start practice" />
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Assessments */}
      <section>
        <SectionHeading title="Timed assessments" description="Test yourself under a timer and earn XP." />
        {assessments.length === 0 ? (
          <EmptyState title="No assessments yet" description="Check back soon." />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {assessments.map((quiz, i) => (
              <motion.div key={quiz.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <QuizCard quiz={quiz} cta="Take assessment" />
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function QuizCard({ quiz, cta }: { quiz: Quiz; cta: string }) {
  return (
    <Card className="h-full transition-shadow hover:shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <Badge variant={difficultyVariant[quiz.difficulty as keyof typeof difficultyVariant] ?? "secondary"}>
            {quiz.difficulty}
          </Badge>
          <span className="text-xs text-muted-foreground">{quiz.questions.length} questions</span>
        </div>
        <CardTitle className="mt-2 flex items-center gap-2 text-lg">
          {quiz.type === "quiz" ? <Trophy className="h-4 w-4 text-primary" /> : <Sparkles className="h-4 w-4 text-primary" />}
          {quiz.title}
        </CardTitle>
        <CardDescription className="line-clamp-2 text-xs">{quiz.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex items-center justify-between">
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {quiz.timeLimitMinutes} min</span>
          <span className="flex items-center gap-1"><Trophy className="h-3.5 w-3.5" /> Pass {quiz.passingScore}%</span>
        </div>
        <Button asChild size="sm">
          <Link href={`/quiz/${quiz.id}`}>
            {cta} <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

function QuickStat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <Card>
      <CardContent className="flex items-center gap-3 p-4">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">{icon}</span>
        <div>
          <p className="text-xl font-bold leading-none">{value}</p>
          <p className="mt-1 text-xs text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function SectionHeading({ title, description }: { title: string; description: string }) {
  return (
    <div className="mb-4">
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
