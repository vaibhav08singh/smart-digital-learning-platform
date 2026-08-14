"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  Check,
  Loader2,
  LogOut,
  Palette,
  Save,
  Target,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { UserAvatar } from "@/components/profile/user-avatar";
import { AvatarPicker } from "@/components/profile/avatar-picker";
import { saveStudentProfile, useStudentProfile, logout, updateAccountEmail } from "@/services/auth.service";
import { levelLabel } from "@/services/student.service";
import { educationLevels, streams } from "@/data/education";
import { isValidAvatarId } from "@/data/avatars";
import type { StudentProfile } from "@/types";

const GOALS = ["Understand concepts", "Prepare for exams", "Improve weak subjects", "Build skills", "Competitive exam preparation", "University preparation", "Professional learning", "Research"];

const CLASS_YEARS = ["1st Year", "2nd Year", "3rd Year", "4th Year", "Class 9", "Class 10", "Class 11", "Class 12"];

export default function SettingsPage() {
  const router = useRouter();
  const profile = useStudentProfile();

  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [avatarId, setAvatarId] = useState(profile.avatarId);
  const [classYear, setClassYear] = useState(profile.classYear);
  const [branch, setBranch] = useState(profile.branch);
  const [institution, setInstitution] = useState(profile.institution);
  const [institutionUrl, setInstitutionUrl] = useState(profile.institutionUrl ?? "");
  const [dailyGoal, setDailyGoal] = useState(profile.dailyGoalMinutes);
  const [goals, setGoals] = useState<string[]>(profile.goals);
  const [levelId, setLevelId] = useState<string>(profile.levelId);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const levels = educationLevels;

  function toggleGoal(goal: string) {
    setGoals((prev) => (prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal]));
  }

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    setEmailError(null);

    const cleanEmail = email.trim();
    if (cleanEmail && cleanEmail.toLowerCase() !== profile.email.toLowerCase()) {
      try {
        await updateAccountEmail(cleanEmail);
      } catch (err) {
        setEmailError(err instanceof Error ? err.message : String(err));
        setSaving(false);
        return;
      }
    }

    saveStudentProfile({
      ...profile,
      email: cleanEmail || profile.email,
      name: name.trim() || profile.name,
      avatarId: isValidAvatarId(avatarId) ? avatarId : profile.avatarId,
      classYear: classYear || profile.classYear,
      branch: branch || profile.branch,
      institution: institution || profile.institution,
      institutionUrl,
      dailyGoalMinutes: dailyGoal,
      goals,
      levelId: (levelId || profile.levelId) as StudentProfile["levelId"],
    });

    setSaving(false);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2500);
  }

  async function handleLogout() {
    setLoggingOut(true);
    await logout();
    router.push("/");
  }

  if (!profile) {
    return (
      <div className="mx-auto max-w-3xl space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-64" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your profile, learning preferences and account.
        </p>
      </div>

      {/* Profile */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-4 w-4 text-primary" /> Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setPickerOpen(true)}
              className="group relative shrink-0 rounded-full"
              aria-label="Change avatar"
            >
              <UserAvatar avatarId={avatarId} name={name || profile.name} className="h-14 w-14" />
              <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 text-[10px] font-semibold text-white opacity-0 transition-opacity group-hover:opacity-100">
                Edit
              </span>
            </button>
            <div className="min-w-0">
              <p className="font-semibold">{profile.name}</p>
              <p className="truncate text-sm text-muted-foreground">{email || profile.email}</p>
              <p className="text-xs text-muted-foreground">Level: {levelLabel(profile.levelId)}</p>
            </div>
          </div>

          <div>
            <label htmlFor="name" className="mb-1.5 block text-sm font-medium">
              Display name
            </label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailError(null);
              }}
              placeholder="you@example.com"
            />
            {emailError && (
              <p className="mt-1.5 text-xs font-medium text-destructive">{emailError}</p>
            )}
          </div>

          <div>
            <label htmlFor="class-year" className="mb-1.5 block text-sm font-medium">
              Class / Year
            </label>
            <div className="flex flex-wrap gap-2">
              {CLASS_YEARS.map((year) => (
                <button
                  key={year}
                  type="button"
                  onClick={() => setClassYear(year)}
                  aria-pressed={classYear === year}
                  className={
                    classYear === year
                      ? "rounded-full border border-primary bg-primary/10 px-3 py-1.5 text-sm font-medium"
                      : "rounded-full border px-3 py-1.5 text-sm text-muted-foreground hover:border-primary/40"
                  }
                >
                  {year}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="branch" className="mb-1.5 block text-sm font-medium">
              Branch / Stream
            </label>
            <Input
              id="branch"
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              placeholder="e.g. Computer Science, Science, Commerce"
              list="branch-suggestions"
            />
            <datalist id="branch-suggestions">
              {streams.map((s) => (
                <option key={s.id} value={s.name} />
              ))}
            </datalist>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="institution" className="mb-1.5 block text-sm font-medium">
                School / College
              </label>
              <Input
                id="institution"
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                placeholder="e.g. Delhi Public School"
              />
            </div>
            <div>
              <label htmlFor="institution-url" className="mb-1.5 block text-sm font-medium">
                Institution website <span className="text-xs text-muted-foreground">(optional)</span>
              </label>
              <Input
                id="institution-url"
                type="url"
                value={institutionUrl}
                onChange={(e) => setInstitutionUrl(e.target.value)}
                placeholder="https://…"
              />
            </div>
          </div>

          <div>
            <label htmlFor="goal" className="mb-1.5 block text-sm font-medium">
              Daily study goal (minutes)
            </label>
            <div className="flex items-center gap-3">
              <input
                id="goal"
                type="range"
                min={10}
                max={120}
                step={10}
                value={dailyGoal}
                onChange={(e) => setDailyGoal(Number(e.target.value))}
                className="w-full accent-primary"
                aria-label="Daily study goal"
              />
              <span className="w-12 text-right text-sm font-semibold tabular-nums">{dailyGoal}m</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Learning preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-4 w-4 text-primary" /> Learning preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Education level</label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {levels.map((lvl) => (
                <button
                  key={lvl.id}
                  type="button"
                  onClick={() => setLevelId(lvl.id)}
                  aria-pressed={levelId === lvl.id}
                  className={
                    levelId === lvl.id
                      ? "rounded-xl border border-primary bg-primary/10 px-3 py-2 text-left text-sm font-medium"
                      : "rounded-xl border px-3 py-2 text-left text-sm text-muted-foreground hover:border-primary/40"
                  }
                >
                  {lvl.shortLabel}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">Goals</label>
            <div className="flex flex-wrap gap-2">
              {GOALS.map((goal) => (
                <button
                  key={goal}
                  type="button"
                  onClick={() => toggleGoal(goal)}
                  aria-pressed={goals.includes(goal)}
                  className={
                    goals.includes(goal)
                      ? "rounded-full border border-primary bg-primary/10 px-3 py-1.5 text-sm font-medium"
                      : "rounded-full border px-3 py-1.5 text-sm text-muted-foreground hover:border-primary/40"
                  }
                >
                  {goals.includes(goal) && <Check className="mr-1 inline h-3.5 w-3.5" />}
                  {goal}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-4 w-4 text-primary" /> Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between rounded-xl border px-4 py-3">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Reminder notifications</p>
                <p className="text-xs text-muted-foreground">Get nudged to keep your streak alive.</p>
              </div>
            </div>
            <input type="checkbox" defaultChecked className="h-4 w-4 accent-primary" aria-label="Enable notifications" />
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button variant="destructive" onClick={() => void handleLogout()} disabled={loggingOut}>
          {loggingOut ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />} Log out
        </Button>
        <div className="flex items-center gap-3">
          {saved && (
            <span className="flex items-center gap-1 text-sm font-medium text-emerald-500">
              <Check className="h-4 w-4" /> Saved
            </span>
          )}
          <Button variant="gradient" onClick={() => void handleSave()} disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save changes
          </Button>
        </div>
      </div>

      <AvatarPicker open={pickerOpen} onOpenChange={setPickerOpen} value={avatarId || "student-orange"} onSelect={setAvatarId} />
    </div>
  );
}
