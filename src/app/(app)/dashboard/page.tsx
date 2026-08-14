"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Flame, Clock, Gauge, Target, Trophy, TrendingUp, ArrowRight, Bot, BookOpen, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { StatCard } from "@/components/dashboard/stat-card";
import { LearningPath } from "@/components/dashboard/learning-path";
import { RecommendationCard } from "@/components/dashboard/recommendation-card";
import { getProfile } from "@/services/student.service";
import { getCourses } from "@/services/course.service";
import { getActivity } from "@/services/analytics.service";
import { levelLabel } from "@/services/student.service";
import { getQuizResults } from "@/services/quiz.service";
import { UserAvatar } from "@/components/profile/user-avatar";
import { subjectsForLevel, subjectLessons, getSubject } from "@/data/subjects";
import { getEducationLevel } from "@/data/education";
import { demoPath, demoRecommendations } from "@/data/student";
import { getAiRecommendation, ensureTodayFocusSession } from "@/services/recommendation.service";
import { cn } from "@/lib/utils";
import type { StudentProfile, Subject } from "@/types";

export default function DashboardPage() {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [continueCourses, setContinueCourses] = useState<Awaited<ReturnType<typeof getCourses>>>([]);
  const [activity] = useState(getActivity());

  useEffect(() => {
    ensureTodayFocusSession();
    let mounted = true;
    Promise.all([getProfile(), getCourses()]).then(([p, courses]) => {
      if (!mounted) return;
      setProfile(p);
      const inProgress = courses
        .filter((c) => c.progress > 0 && c.progress < 100)
        .sort((a, b) => b.progress - a.progress);
      const enrolledNotStarted = courses
        .filter((c) => c.enrolled && c.progress === 0)
        .sort((a, b) => Number(b.bookmarked) - Number(a.bookmarked) || b.rating - a.rating);
      const bookmarked = courses
        .filter((c) => c.bookmarked && c.progress === 0)
        .sort((a, b) => b.rating - a.rating);
      const remaining = courses
        .filter((c) => !c.enrolled && !c.bookmarked)
        .sort((a, b) => b.rating - a.rating);

      setContinueCourses([...inProgress, ...enrolledNotStarted, ...bookmarked, ...remaining].slice(0, 6));
    });
    return () => {
      mounted = false;
    };
  }, []);

  if (!profile) {
    return (
      <div className="space-y-4">
        <div className="h-10 w-72 animate-pulse rounded-md bg-muted" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
        <Skeleton className="h-72" />
      </div>
    );
  }

  const level = getEducationLevel(profile.levelId);
  const preferredSubjects = (profile.preferredSubjectIds ?? [])
    .map((id) => getSubject(id))
    .filter((s): s is Subject => !!s);
  const levelSubjects =
    preferredSubjects.length > 0
      ? preferredSubjects
      : subjectsForLevel(profile.levelId).length > 0
      ? subjectsForLevel(profile.levelId)
      : subjectsForLevel("btech");
  const quizResults = getQuizResults();
  const averageQuiz =
    quizResults.length > 0
      ? Math.round(quizResults.reduce((sum, r) => sum + r.score, 0) / quizResults.length)
      : 78;
  const progressedCourses = continueCourses.filter((c) => c.progress > 0);
  const averageProgress =
    progressedCourses.length > 0
      ? Math.round(progressedCourses.reduce((s, c) => s + c.progress, 0) / progressedCourses.length)
      : profile.overallProgress;

  // Demo "today" study minutes — persisted session would replace this.
  const todayMinutes = 38;

  const recommendations = demoRecommendations;
  const learningPath = demoPath;
  const aiRecommendation = getAiRecommendation();

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            {new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}
          </p>
          <h1 className="mt-1 flex items-center gap-3 text-2xl font-bold tracking-tight sm:text-3xl">
            <UserAvatar avatarId={profile.avatarId} name={profile.name} className="h-10 w-10" />
            <span>Welcome back, {profile.name.split(" ")[0]} 👋</span>
          </h1>
          <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
            Learning at <Badge variant="info">{levelLabel(profile.levelId)}</Badge>
            {level && <span>· {level.description}</span>}
          </div>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/explore">Explore</Link>
          </Button>
          <Button asChild>
            <Link href="/ai-tutor">
              <Bot className="h-4 w-4" /> Ask AI Tutor
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Learning streak" value={`${profile.learningStreakDays} days`} hint="Keep it going!" icon={<Flame className="h-4 w-4 text-amber-500" />} />
        <StatCard label="Overall progress" value={`${averageProgress}%`} hint="Across enrolled courses" icon={<Gauge className="h-4 w-4 text-primary" />} />
        <StatCard label="Average quiz score" value={`${averageQuiz}%`} hint="Last attempts" icon={<Trophy className="h-4 w-4 text-violet-500" />} />
        <StatCard label="Study time" value={formatHours(profile.totalStudyMinutes)} hint={`Goal: ${profile.dailyGoalMinutes} min/day`} icon={<Clock className="h-4 w-4 text-sky-500" />} />
      </div>

      {/* Daily goal */}
      <Card>
        <CardContent className="p-5">
          <div className="mb-2 flex items-center justify-between">
            <p className="flex items-center gap-2 text-sm font-medium">
              <Target className="h-4 w-4 text-primary" /> Daily learning goal
            </p>
            <span className="text-sm font-semibold text-primary">
              {todayMinutes} / {profile.dailyGoalMinutes} min
            </span>
          </div>
          <Progress value={Math.min(100, (todayMinutes / profile.dailyGoalMinutes) * 100)} />
        </CardContent>
      </Card>

      {/* AI recommendation */}
      <div className="rounded-2xl border border-primary/20 bg-gradient-to-r from-indigo-500/10 via-violet-500/10 to-fuchsia-500/10 p-5 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 text-white shadow-lg shadow-indigo-500/30">
              <Sparkles className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
                AI recommendation
                {aiRecommendation.topicName && (
                  <Badge variant="warning">{aiRecommendation.topicName}</Badge>
                )}
              </div>
              <h2 className="mt-1 text-lg font-bold sm:text-xl">{aiRecommendation.headline}</h2>
              <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{aiRecommendation.reason}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {aiRecommendation.buttons.map((button) => (
              <Button key={button.label} asChild variant={button.label.startsWith("Ask AI Tutor") ? "gradient" : "outline"}>
                <Link href={button.href}>
                  {button.label.startsWith("Ask AI Tutor") ? <Bot className="h-4 w-4" /> : null}
                  {button.label}
                </Link>
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Continue + recommended */}
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <CardTitle>Continue learning</CardTitle>
              <Button asChild variant="ghost" size="sm">
                <Link href="/courses">
                  All courses <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {continueCourses.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  You&apos;re all caught up! Explore new courses to keep going.
                </p>
              )}
              {continueCourses.map((course) => (
                <Link
                  key={course.id}
                  href={`/courses/${course.id}`}
                  className="group flex flex-col gap-3 rounded-xl border bg-card p-4 transition-all hover:border-primary/40 sm:flex-row sm:items-center"
                >
                  <span className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-white", course.gradient)}>
                    <BookOpen className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold group-hover:text-primary">{course.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {course.subjectName} · {course.instructor}
                    </p>
                    <div className="mt-2 flex items-center gap-3">
                      <Progress value={course.progress} className="h-1.5" />
                      <span className="text-xs font-medium tabular-nums">{course.progress}%</span>
                    </div>
                  </div>
                  <Badge variant="secondary">{course.difficulty}</Badge>
                </Link>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <CardTitle>Recommended for you</CardTitle>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <TrendingUp className="h-3.5 w-3.5" /> Based on your progress
              </span>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2">
              {recommendations.map((rec) => (
                <RecommendationCard key={rec.id} recommendation={rec} />
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right rail */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" /> Learning roadmap
              </CardTitle>
            </CardHeader>
            <CardContent>
              <LearningPath nodes={learningPath} />
            </CardContent>
          </Card>

          {/* Subjects by level */}
          <Card>
            <CardHeader>
              <CardTitle>Your subjects</CardTitle>
              <p className="text-xs text-muted-foreground">Adapted to {levelLabel(profile.levelId)}</p>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {levelSubjects.length === 0 &&
                subjectsForLevel("btech")
                  .map((s) => (
                    <Link key={s.id} href={`/explore?subject=${s.id}`} className="rounded-full border bg-card px-3 py-1 text-xs font-medium hover:border-primary/50 hover:text-primary">
                      {s.name}
                    </Link>
                  ))}
              {levelSubjects.map((s) => {
                const lessons = subjectLessons(s);
                return (
                  <Link
                    key={s.id}
                    href={`/explore?subject=${s.id}`}
                    className="flex flex-col gap-1 rounded-xl border bg-card px-3 py-2 text-xs font-medium hover:border-primary/50 hover:text-primary"
                  >
                    {s.name}
                    <span className="font-normal text-muted-foreground">{lessons.length} lessons</span>
                  </Link>
                );
              })}
            </CardContent>
          </Card>

          {/* Strong / weak */}
          <Card>
            <CardHeader>
              <CardTitle>Subject performance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="mb-2 text-xs font-medium text-emerald-500">Strong subjects</p>
                {profile.strongSubjectIds.map((id) => {
                  const subject = getSubject(id);
                  return subject ? (
                    <div key={id} className="flex items-center justify-between py-1 text-sm">
                      <span>{subject.name}</span>
                      <Badge variant="success">Strong</Badge>
                    </div>
                  ) : null;
                })}
              </div>
              <div>
                <p className="mb-2 text-xs font-medium text-amber-500">Need practice</p>
                {profile.weakSubjectIds.map((id) => {
                  const subject = getSubject(id);
                  return subject ? (
                    <div key={id} className="flex items-center justify-between py-1 text-sm">
                      <span>{subject.name}</span>
                      <Badge variant="warning">Practice</Badge>
                    </div>
                  ) : null;
                })}
              </div>
            </CardContent>
          </Card>

          {/* Recent activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {activity.slice(0, 5).map((event) => (
                <div key={event.id} className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
                  <div>
                    <p className="text-sm">{event.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {event.detail} · {event.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function formatHours(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
}
