"use client";

import { useMemo, useReducer, useState } from "react";
import { CalendarDays, Check, CheckCircle2, Loader2, Plus, RotateCcw, SkipForward, X, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  activitiesForDate,
  addFocusSession,
  completedMinutesFor,
  deleteActivity,
  plannedMinutesFor,
  rescheduleMissed,
  setActivityStatus,
} from "@/services/planner.service";
import { addDays, startOfWeek, toISODate } from "@/services/performance.service";
import type { PlannedActivity } from "@/types";

export default function PlannerPage() {
  const monday = useMemo(() => startOfWeek(new Date()), []);
  const days = useMemo(
    () => Array.from({ length: 7 }, (_, i) => addDays(monday, i)),
    [monday],
  );
  const todayIso = toISODate(new Date());

  const [, reload] = useReducer((n: number) => n + 1, 0);

  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ title: "", subject: "", minutes: "30" });
  const [notice, setNotice] = useState<string | null>(null);
  const [rescheduling, setRescheduling] = useState(false);

  const weekMinutes = days.reduce(
    (sum, day) => sum + plannedMinutesFor(toISODate(day)),
    0,
  );
  const weekCompleted = days.reduce(
    (sum, day) => sum + completedMinutesFor(toISODate(day)),
    0,
  );
  const weekPct = weekMinutes > 0 ? Math.round((weekCompleted / weekMinutes) * 100) : 0;

  function handleAdd() {
    const title = form.title.trim();
    if (!title) return;
    addFocusSession(title, form.subject.trim() || "Custom", Number(form.minutes) || 30, "📌");
    setForm({ title: "", subject: "", minutes: "30" });
    setAdding(false);
    reload();
  }

  function handleReschedule() {
    setRescheduling(true);
    window.setTimeout(() => {
      const { message } = rescheduleMissed();
      setNotice(message);
      setRescheduling(false);
      reload();
    }, 350);
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight sm:text-3xl">
            <CalendarDays className="h-6 w-6 text-primary" /> Study Planner
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Plan, complete and reschedule your weekly study sessions.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={handleReschedule} disabled={rescheduling}>
            {rescheduling ? <Loader2 className="h-4 w-4 animate-spin" /> : <RotateCcw className="h-4 w-4" />}
            Smart reschedule
          </Button>
          <Button variant="gradient" onClick={() => setAdding((v) => !v)}>
            <Plus className="h-4 w-4" /> Add session
          </Button>
        </div>
      </div>

      {notice && (
        <div className="flex items-start gap-2 rounded-lg border border-primary/30 bg-primary/5 px-3 py-2 text-sm text-primary">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
          {notice}
          <button onClick={() => setNotice(null)} className="ml-auto text-muted-foreground hover:text-foreground" aria-label="Dismiss">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {adding && (
        <Card>
          <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-end">
            <div className="flex-1 space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Session</label>
              <Input
                placeholder="e.g. Arrays practice"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              />
            </div>
            <div className="flex-1 space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Subject</label>
              <Input
                placeholder="e.g. DSA"
                value={form.subject}
                onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
              />
            </div>
            <div className="w-24 space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Minutes</label>
              <Input
                type="number"
                min={5}
                value={form.minutes}
                onChange={(e) => setForm((f) => ({ ...f, minutes: e.target.value }))}
              />
            </div>
            <Button onClick={handleAdd} disabled={!form.title.trim()}>
              Add
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Week progress */}
      <Card>
        <CardContent className="p-4">
          <div className="mb-2 flex items-center justify-between text-sm">
            <p className="font-medium">
              Week completion{" "}
              <span className="text-muted-foreground">
                · {weekCompleted} / {weekMinutes} min
              </span>
            </p>
            <span className="font-semibold tabular-nums text-primary">{weekPct}%</span>
          </div>
          <Progress value={weekPct} className="h-2.5" />
        </CardContent>
      </Card>

      {/* Week calendar */}
      <div className="grid gap-3 lg:grid-cols-7">
        {days.map((day) => {
          const iso = toISODate(day);
          const items = activitiesForDate(iso);
          const completed = completedMinutesFor(iso);
          const planned = plannedMinutesFor(iso);
          const pct = planned > 0 ? Math.round((completed / planned) * 100) : 0;
          const isToday = iso === todayIso;
          return (
            <Card key={iso} className={cn("flex flex-col", isToday && "border-primary/50 ring-1 ring-primary/20")}>
              <CardHeader className="p-3 pb-2">
                <CardTitle className="flex items-center justify-between text-sm">
                  <span className={cn("font-semibold", isToday && "text-primary")}>
                    {day.toLocaleDateString(undefined, { weekday: "short" })}
                  </span>
                  {isToday && <Badge variant="info">Today</Badge>}
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  {day.toLocaleDateString(undefined, { day: "numeric", month: "short" })}
                </p>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col gap-2 p-3 pt-1">
                {items.length === 0 && (
                  <p className="py-3 text-center text-xs text-muted-foreground">No sessions</p>
                )}
                {items.map((item) => (
                  <ActivityCard
                    key={item.id}
                    activity={item}
                    onComplete={() => {
                      setActivityStatus(item.id, "completed");
                      reload();
                    }}
                    onSkip={() => {
                      setActivityStatus(item.id, "skipped");
                      reload();
                    }}
                    onRestore={() => {
                      setActivityStatus(item.id, "pending");
                      reload();
                    }}
                    onDelete={() => {
                      deleteActivity(item.id);
                      reload();
                    }}
                  />
                ))}
                <div className="mt-auto flex items-center gap-1 pt-1 text-[11px] text-muted-foreground">
                  <Progress value={pct} className="h-1 flex-1" />
                  <span className="tabular-nums">
                    {completed}/{planned}m
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function ActivityCard({
  activity,
  onComplete,
  onSkip,
  onRestore,
  onDelete,
}: {
  activity: PlannedActivity;
  onComplete: () => void;
  onSkip: () => void;
  onRestore: () => void;
  onDelete: () => void;
}) {
  const done = activity.status === "completed";
  const skipped = activity.status === "skipped";
  return (
    <div
      className={cn(
        "group rounded-lg border p-2 text-xs transition-colors",
        done && "border-emerald-500/40 bg-emerald-500/10",
        skipped && "border-dashed opacity-50",
      )}
    >
      <div className="flex items-start gap-1.5">
        <span className="text-sm">{activity.emoji}</span>
        <div className="min-w-0 flex-1">
          <p className={cn("truncate font-medium", (done || skipped) && "line-through")}>
            {activity.title}
          </p>
          <p className="truncate text-muted-foreground">
            {activity.startTime} · {activity.durationMinutes}m
          </p>
        </div>
      </div>
      <div className="mt-1.5 flex gap-1 opacity-100 lg:opacity-0 lg:transition-opacity lg:group-hover:opacity-100">
        {!done && (
          <Button variant="ghost" size="iconSm" onClick={onComplete} aria-label="Mark complete" className="h-6 w-6 text-emerald-600">
            <Check className="h-3.5 w-3.5" />
          </Button>
        )}
        {!skipped && (
          <Button variant="ghost" size="iconSm" onClick={onSkip} aria-label="Skip" className="h-6 w-6 text-muted-foreground">
            <SkipForward className="h-3.5 w-3.5" />
          </Button>
        )}
        {(done || skipped) && (
          <Button variant="ghost" size="iconSm" onClick={onRestore} aria-label="Restore" className="h-6 w-6 text-muted-foreground">
            <RotateCcw className="h-3.5 w-3.5" />
          </Button>
        )}
        <Button variant="ghost" size="iconSm" onClick={onDelete} aria-label="Delete" className="h-6 w-6 text-destructive">
          <XCircle className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
