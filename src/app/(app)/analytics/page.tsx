"use client";

import { useEffect, useState } from "react";
import {
  Activity,
  Brain,
  CalendarDays,
  Clock,
  Flame,
  Target,
  TrendingUp,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/ui/state";
import { getAnalytics } from "@/services/analytics.service";
import { formatMinutes } from "@/lib/utils";
import type { AnalyticsSummary } from "@/types";

const masteryVariant: Record<string, "success" | "warning" | "destructive" | "info" | "secondary"> = {
  Mastered: "success",
  Strong: "info",
  "Needs Practice": "warning",
  Learning: "warning",
  "Not Started": "secondary",
};

const tooltipStyle = {
  borderRadius: "12px",
  border: "1px solid var(--border)",
  background: "var(--popover)",
  color: "var(--popover-foreground)",
  fontSize: "12px",
};

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let mounted = true;
    getAnalytics()
      .then((a) => mounted && setAnalytics(a))
      .catch(() => mounted && setError(true));
    return () => {
      mounted = false;
    };
  }, []);

  if (error) return <ErrorState message="Couldn't load analytics." onRetry={() => window.location.reload()} />;
  if (!analytics) return <AnalyticsSkeleton />;

  const weekTotal = analytics.weeklyActivity.reduce((sum, d) => sum + d.minutes, 0);

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div>
        <p className="text-sm font-medium text-primary">Analytics</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">Your learning dashboard</h1>
        <p className="mt-2 max-w-xl text-sm text-muted-foreground">
          See how your practice, quizzes and lessons are building long-term mastery.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={<Flame className="h-4 w-4" />} label="Learning streak" value={`${analytics.learningStreakDays} days`} />
        <StatCard icon={<Clock className="h-4 w-4" />} label="Total study time" value={formatMinutes(analytics.studyMinutesTotal)} />
        <StatCard icon={<CalendarDays className="h-4 w-4" />} label="Last week" value={formatMinutes(analytics.studyMinutesLastWeek)} />
        <StatCard icon={<Target className="h-4 w-4" />} label="Daily goal" value={`${analytics.dailyGoalMinutes} min`} />
      </div>

      {/* Activity + progress */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" /> Weekly activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-xs text-muted-foreground">{weekTotal} minutes this week</p>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.weeklyActivity} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="day" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "var(--muted)", opacity: 0.4 }} />
                  <Bar dataKey="minutes" name="Minutes" radius={[6, 6, 0, 0]}>
                    {analytics.weeklyActivity.map((entry) => (
                      <Cell key={entry.day} fill={entry.minutes > 0 ? "var(--primary)" : "var(--muted)"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" /> Progress over time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analytics.progressOverTime} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="progressFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="week" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} unit="%" domain={[0, 100]} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Area type="monotone" dataKey="progress" name="Progress" stroke="var(--primary)" strokeWidth={2} fill="url(#progressFill)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quiz performance + subjects */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-4 w-4 text-primary" /> Quiz performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analytics.quizPerformance} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="quiz" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} interval="preserveStartEnd" />
                  <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} unit="%" domain={[0, 100]} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Line type="monotone" dataKey="score" name="Score" stroke="var(--chart-2, #10b981)" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-4 w-4 text-primary" /> Subject performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {analytics.subjectPerformance.map((s) => (
              <div key={s.subjectId}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="font-medium">{s.subjectName}</span>
                  <span className="font-semibold tabular-nums">{s.score}%</span>
                </div>
                <Progress value={s.score} className="h-2" />
              </div>
            ))}
            {analytics.subjectPerformance.length === 0 && (
              <p className="py-8 text-center text-sm text-muted-foreground">No subject data yet.</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Topic mastery */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-4 w-4 text-primary" /> Topic mastery
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {analytics.topicPerformance.map((t) => (
            <div key={t.topicId} className="rounded-xl border p-4">
              <div className="mb-2 flex items-center justify-between gap-2">
                <p className="truncate text-sm font-medium">{t.topicName}</p>
                <Badge variant={masteryVariant[t.mastery] ?? "secondary"}>{t.mastery}</Badge>
              </div>
              <Progress value={t.score} className="h-1.5" />
              <p className="mt-1.5 text-xs text-muted-foreground">{t.score}% mastery</p>
            </div>
          ))}
          {analytics.topicPerformance.length === 0 && (
            <p className="py-8 text-center text-sm text-muted-foreground sm:col-span-2 lg:col-span-3">
              Complete a quiz to start building your topic mastery map.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <Card>
      <CardContent className="flex items-center gap-3 p-4">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">{icon}</span>
        <div className="min-w-0">
          <p className="truncate text-xl font-bold leading-none">{value}</p>
          <p className="mt-1 text-xs text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function AnalyticsSkeleton() {
  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <Skeleton className="h-9 w-64" />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-20" />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Skeleton className="h-72" />
        <Skeleton className="h-72" />
      </div>
    </div>
  );
}
