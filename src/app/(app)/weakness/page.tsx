"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Brain, CalendarDays, Check, Loader2, TrendingDown, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { getWeaknessAnalysis, statusCounts, buildImprovementWeek } from "@/services/performance.service";
import { addActivities } from "@/services/planner.service";
import type { TopicStatusLevel } from "@/types";

const STATUS_META: Record<TopicStatusLevel, { label: string; emoji: string; badge: "destructive" | "warning" | "success"; bar: string }> = {
  weak: { label: "WEAK", emoji: "🔴", badge: "destructive", bar: "bg-destructive" },
  improving: { label: "IMPROVING", emoji: "🟡", badge: "warning", bar: "bg-amber-500" },
  strong: { label: "STRONG", emoji: "🟢", badge: "success", bar: "bg-emerald-500" },
};

export default function WeaknessPage() {
  const analysis = useMemo(() => getWeaknessAnalysis(), []);
  const counts = statusCounts(analysis.topics);
  const [plan, setPlan] = useState<ReturnType<typeof buildImprovementWeek> | null>(null);
  const [planning, setPlanning] = useState(false);
  const [planSaved, setPlanSaved] = useState(false);

  function handleImprove() {
    if (!analysis.weakest) return;
    setPlanning(true);
    window.setTimeout(() => {
      const week = buildImprovementWeek(analysis.weakest!);
      addActivities(week);
      setPlan(week);
      setPlanSaved(true);
      setPlanning(false);
    }, 500);
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">AI Weakness Detector</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Analyzed from your quiz scores, topic accuracy, attempts and coding practice.
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <SummaryCard label="Weak topics" value={counts.weak} emoji="🔴" tone="text-destructive" />
        <SummaryCard label="Improving" value={counts.improving} emoji="🟡" tone="text-amber-500" />
        <SummaryCard label="Strong topics" value={counts.strong} emoji="🟢" tone="text-emerald-500" />
        <SummaryCard
          label="Weakest"
          value={analysis.weakest?.topicName ?? "None"}
          emoji="🎯"
          tone="text-foreground"
          small
        />
      </div>

      {/* Classification */}
      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-4 w-4 text-primary" /> Topic accuracy
          </CardTitle>
          <Badge variant="secondary">Attempts included</Badge>
        </CardHeader>
        <CardContent className="space-y-3">
          {analysis.topics.map((topic) => {
            const meta = STATUS_META[topic.status];
            return (
              <div key={topic.topicId} className="rounded-xl border bg-card p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-semibold">{topic.topicName}</span>
                  <Badge variant={meta.badge}>
                    {meta.emoji} {meta.label}
                  </Badge>
                  <span className="ml-auto text-sm font-semibold tabular-nums">{topic.accuracy}%</span>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    {topic.trend > 0 ? (
                      <>
                        <TrendingUp className="h-3.5 w-3.5 text-emerald-500" /> +{topic.trend}%
                      </>
                    ) : topic.trend < 0 ? (
                      <>
                        <TrendingDown className="h-3.5 w-3.5 text-destructive" /> {topic.trend}%
                      </>
                    ) : (
                      <span>stable</span>
                    )}
                  </span>
                </div>
                <div className="mt-2 flex items-center gap-3">
                  <Progress value={topic.accuracy} className="h-2" indicatorClassName={meta.bar} />
                  <span className="text-xs text-muted-foreground">{topic.attempts} attempts</span>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Weakest explanation */}
      {analysis.weakest && analysis.weakest.status === "weak" && (
        <Card className="border-destructive/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🎯 Why {analysis.weakest.topicName} is weak
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm leading-relaxed text-muted-foreground">{analysis.explanation}</p>
            <div>
              <p className="mb-2 text-sm font-medium">Recommended steps</p>
              <ol className="space-y-2">
                {analysis.steps.map((step, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[11px] font-bold text-primary">
                      {i + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
            <Button variant="gradient" onClick={handleImprove} disabled={planning}>
              {planning ? <Loader2 className="h-4 w-4 animate-spin" /> : <CalendarDays className="h-4 w-4" />}
              Improve Weak Areas
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Generated plan */}
      {plan && (
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle className="flex items-center gap-2">
              <Check className="h-4 w-4 text-emerald-500" /> Your improvement week
            </CardTitle>
            <Button asChild variant="outline" size="sm">
              <Link href="/planner">
                Open in Study Planner <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {planSaved && (
              <p className="mb-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-600 dark:text-emerald-400">
                A 7-day improvement plan for {analysis.weakest?.topicName} has been added to your Study
                Planner. Complete each session to update your progress.
              </p>
            )}
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
              {plan.map((activity) => (
                <div key={activity.id} className="rounded-xl border bg-card p-3">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    {new Date(`${activity.date}T00:00:00`).toLocaleDateString(undefined, { weekday: "short" })}
                  </p>
                  <p className="mt-1 text-sm font-medium">
                    {activity.emoji} {activity.title}
                  </p>
                  <p className="text-xs text-muted-foreground">{activity.durationMinutes} min</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {(!analysis.weakest || analysis.weakest.status !== "weak") && (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-3xl">🎉</p>
            <p className="mt-2 font-medium">No weak topics detected</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Every topic is above 60% accuracy. Keep the streak alive with mixed practice.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function SummaryCard({ label, value, emoji, tone, small }: { label: string; value: number | string; emoji: string; tone: string; small?: boolean }) {
  return (
    <Card>
      <CardContent className="flex items-center gap-3 p-4">
        <span className="text-2xl">{emoji}</span>
        <div className="min-w-0">
          <p className={small ? "truncate text-sm font-semibold" : "text-xl font-bold tabular-nums"}>{value}</p>
          <p className={`text-xs text-muted-foreground ${tone}`}>{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}
