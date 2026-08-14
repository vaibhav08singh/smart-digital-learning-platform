import { readStore, uid, writeStore } from "@/lib/storage";
import { addDays, startOfWeek, toISODate } from "./performance.service";
import { completeActivity } from "./performance.service";
import type { PlannedActivity, WeekPlanInput } from "@/types";

// ============================================================
// Study Planner — daily/weekly schedule, calendar data and
// smart rescheduling. Activities are the single store that the
// dashboard "Today" plan, the planner page and the weakness
// improvement plan all read from.
// ============================================================

const PLANNER_KEY = "codezen:planner";

const EMOJIS = ["🔥", "☕", "🧠", "🔄", "📘", "💻", "📝", "🏋️"];

export function getActivities(): PlannedActivity[] {
  const stored = readStore<PlannedActivity[]>(PLANNER_KEY, []);
  return stored;
}

export function saveActivities(activities: PlannedActivity[]): void {
  writeStore(PLANNER_KEY, activities);
}

export function addActivities(activities: PlannedActivity[]): PlannedActivity[] {
  const next = [...getActivities(), ...activities];
  saveActivities(next);
  return next;
}

export function getActivity(id: string): PlannedActivity | undefined {
  return getActivities().find((a) => a.id === id);
}

/** Mark an activity completed and fold its minutes into the profile. */
export function setActivityStatus(id: string, status: PlannedActivity["status"]): PlannedActivity[] {
  const next = getActivities().map((a) =>
    a.id === id ? (status === "completed" ? completeActivity(a) : { ...a, status }) : a,
  );
  saveActivities(next);
  return next;
}

/** Skip an activity (kept in the list, not counted). */
export function skipActivity(id: string): PlannedActivity[] {
  return setActivityStatus(id, "skipped");
}

export function rescheduleActivity(id: string, date: string, startTime: string): PlannedActivity[] {
  const next = getActivities().map((a) =>
    a.id === id ? { ...a, date, startTime, status: a.status === "skipped" ? "pending" : a.status } : a,
  );
  saveActivities(next);
  return next;
}

export function deleteActivity(id: string): PlannedActivity[] {
  const next = getActivities().filter((a) => a.id !== id);
  saveActivities(next);
  return next;
}

// ------------------------------------------------------------
// Generation
// ------------------------------------------------------------

/**
 * Generate a Monday–Sunday schedule from the student's inputs:
 * focus topic (weak area) + subject sessions + quiz + revision,
 * sized to the daily goal and preferred time.
 */
export function generateWeekPlan(input: WeekPlanInput): PlannedActivity[] {
  const monday = startOfWeek(new Date());
  const preferred = input.preferredTime || "17:00";
  const minutes = Math.max(20, input.minutesPerDay);
  const quizMin = Math.max(10, input.quizMinutes ?? Math.round(minutes * 0.15));
  const revisionMin = Math.max(10, Math.round(minutes * 0.1));
  const remaining = minutes - quizMin - revisionMin;
  const focusMin = Math.round(remaining * 0.55);
  const subjectMin = remaining - focusMin;

  const subjects = input.subjects.length > 0 ? input.subjects : ["Computer Science"];

  const slot = (
    offsetDays: number,
    startOffsetMin: number,
    title: string,
    subject: string,
    durationMinutes: number,
    emoji: string,
    href?: string,
  ): PlannedActivity => {
    const [h, m] = preferred.split(":").map(Number);
    const start = new Date(0);
    start.setHours(h, m + startOffsetMin, 0, 0);
    return {
      id: uid("act"),
      title,
      subject,
      emoji,
      durationMinutes,
      date: toISODate(addDays(monday, offsetDays)),
      startTime: `${String(start.getHours()).padStart(2, "0")}:${String(start.getMinutes()).padStart(2, "0")}`,
      status: "pending",
      source: "ai",
      href,
    };
  };

  const week: PlannedActivity[] = [];
  for (let day = 0; day < 7; day++) {
    const focusTitle = input.focusTopic ? `${input.focusTopic} Deep Work` : "DSA Deep Work";
    week.push(slot(day, 0, focusTitle, input.focusTopic ?? "DSA", focusMin, "🔥", "/coding-lab"));
    week.push(
      slot(day, focusMin, subjects[day % subjects.length], subjects[day % subjects.length], subjectMin, "☕", "/learning/tp-dsa/tp-dsa-l1"),
    );
    week.push(slot(day, focusMin + subjectMin, "Quiz", "Assessment", quizMin, "🧠", "/practice"));
    week.push(slot(day, minutes - revisionMin, "Revision", "Revision", revisionMin, "🔄"));
  }
  saveActivities([...getActivities(), ...week]);
  return week;
}

/** Add a single focused session (e.g. from the weakness detector). */
export function addFocusSession(title: string, subject: string, minutes: number, emoji = "📘", href?: string): PlannedActivity {
  const today = toISODate(new Date());
  const existing = getActivities().find(
    (a) => a.date === today && a.title.toLowerCase() === title.toLowerCase() && a.status !== "skipped",
  );
  if (existing) return existing;
  const activity: PlannedActivity = {
    id: uid("act"),
    title,
    subject,
    emoji,
    durationMinutes: minutes,
    date: today,
    startTime: "17:00",
    status: "pending",
    source: "weakness",
    href,
  };
  addActivities([activity]);
  return activity;
}

/** Activities for a given local date, sorted by start time. */
export function activitiesForDate(date: string): PlannedActivity[] {
  return getActivities()
    .filter((a) => a.date === date)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));
}

/** Today's plan (completed included) — used by the dashboard. */
export function todayPlan(): PlannedActivity[] {
  return activitiesForDate(toISODate(new Date()));
}

// ------------------------------------------------------------
// Smart rescheduling
// ------------------------------------------------------------

/**
 * If the student missed tasks, move them to the next free day and
 * shorten a later revision slot so the weekly goal stays achievable.
 */
export function rescheduleMissed(): { activities: PlannedActivity[]; message: string } {
  const today = new Date();
  const todayIso = toISODate(today);
  const tomorrowIso = toISODate(addDays(today, 1));

  const next = getActivities();
  const missed = next.filter((a) => a.date < todayIso && a.status === "pending");
  let message = "";

  if (missed.length === 0) {
    return { activities: next, message: "You're all caught up — no missed tasks." };
  }

  const occupied = new Set(
    next.filter((a) => a.date === tomorrowIso && a.status === "pending").map((a) => a.startTime),
  );

  for (const task of missed) {
    let time = task.startTime;
    let guard = 0;
    while (occupied.has(time) && guard < 6) {
      time = bumpTime(time, 30);
      guard += 1;
    }
    occupied.add(time);
    next[next.indexOf(task)] = { ...task, date: tomorrowIso, startTime: time };
  }

  // Shorten a later revision session by 15 min to stay on target.
  const revision = next.find(
    (a) => a.status === "pending" && a.date >= tomorrowIso && /revision/i.test(a.title),
  );
  if (revision) {
    next[next.indexOf(revision)] = {
      ...revision,
      durationMinutes: Math.max(10, revision.durationMinutes - 15),
    };
  }

  saveActivities(next);
  message =
    missed.length === 1
      ? `You missed today's ${missed[0].title}. I've moved it to tomorrow` +
        (revision ? " and shortened your revision session to keep your weekly goal achievable." : ".")
      : `You missed ${missed.length} tasks. I've moved them to tomorrow` +
        (revision ? " and shortened your revision session to keep your weekly goal achievable." : ".");

  return { activities: next, message };
}

/** Add minutes to an "HH:mm" string. */
export function bumpTime(time: string, minutes: number): string {
  const [h, m] = time.split(":").map(Number);
  const total = h * 60 + m + minutes;
  const hh = String(Math.floor(total / 60) % 24).padStart(2, "0");
  const mm = String(total % 60).padStart(2, "0");
  return `${hh}:${mm}`;
}

/** Total planned minutes for a date. */
export function plannedMinutesFor(date: string): number {
  return activitiesForDate(date)
    .filter((a) => a.status !== "skipped")
    .reduce((sum, a) => sum + a.durationMinutes, 0);
}

/** Minutes actually completed on a date. */
export function completedMinutesFor(date: string): number {
  return activitiesForDate(date)
    .filter((a) => a.status === "completed")
    .reduce((sum, a) => sum + a.durationMinutes, 0);
}

export const plannerEmojis = EMOJIS;

// Re-exported date helpers used across feature services.
export { addDays, startOfWeek, toISODate } from "./performance.service";
