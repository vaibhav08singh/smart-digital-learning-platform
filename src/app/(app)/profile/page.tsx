"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Award,
  BookOpen,
  Building2,
  Clock,
  ExternalLink,
  Flame,
  GraduationCap,
  Mail,
  MapPin,
  Pencil,
  Settings,
  Sparkles,
  Target,
  Trophy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { UserAvatar } from "@/components/profile/user-avatar";
import { getProfile, levelLabel } from "@/services/student.service";
import { getSubject } from "@/data/subjects";
import { getActivity } from "@/services/analytics.service";
import { getCourses } from "@/services/course.service";
import { formatMinutes, timeAgo } from "@/lib/utils";
import type { ActivityEvent, Course, StudentProfile } from "@/types";

export default function ProfilePage() {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [courses, setCourses] = useState<Course[] | null>(null);
  const [activity, setActivity] = useState<ActivityEvent[]>([]);

  useEffect(() => {
    let mounted = true;
    Promise.all([getProfile(), getCourses(), Promise.resolve(getActivity())]).then(
      ([p, c, a]) => {
        if (!mounted) return;
        setProfile(p);
        setCourses(c);
        setActivity(a);
      },
    );
    return () => {
      mounted = false;
    };
  }, []);

  if (!profile || !courses) {
    return (
      <div className="mx-auto max-w-6xl space-y-6">
        <Skeleton className="h-40" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  const level = levelLabel(profile.levelId);
  const enrolled = courses.filter((c) => profile.enrolledCourseIds.includes(c.id));
  const bookmarked = courses.filter((c) => profile.bookmarkedCourseIds.includes(c.id));
  const institution = profile.institution;
  const classYear = profile.classYear;
  const branch = profile.branch;
  const locationBits = [classYear, branch, institution].filter(Boolean);

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      {/* Header card */}
      <Card className="overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600" />
        <CardContent className="relative px-6 pb-6 pt-0">
          <div className="-mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-center">
              <UserAvatar
                avatarId={profile.avatarId}
                name={profile.name}
                className="h-20 w-20 shrink-0 border-4 border-card shadow-lg"
              />
              <div className="space-y-1.5 text-center sm:text-left">
                <h1 className="text-2xl font-bold leading-snug">{profile.name}</h1>
                <p className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground sm:justify-start">
                  <Mail className="h-3.5 w-3.5 shrink-0" />{profile.email}
                </p>
                {locationBits.length > 0 && (
                  <p className="flex flex-wrap items-center justify-center gap-1.5 text-sm text-muted-foreground sm:justify-start">
                    <GraduationCap className="h-3.5 w-3.5 shrink-0" />
                    <span>{locationBits.join(" · ")}</span>
                    {profile.institutionUrl && (
                      <a
                        href={profile.institutionUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-0.5 text-primary hover:underline"
                      >
                        <ExternalLink className="h-3 w-3" /> site
                      </a>
                    )}
                  </p>
                )}
                <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                  <Badge variant="info">{level}</Badge>
                  <Badge variant="secondary">{profile.goals.length} goal{profile.goals.length !== 1 && "s"}</Badge>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Button asChild variant="outline">
                <Link href="/settings">
                  <Settings className="h-4 w-4" /> Settings
                </Link>
              </Button>
              <Button asChild>
                <Link href="/settings">
                  <Pencil className="h-4 w-4" /> Edit profile
                </Link>
              </Button>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <MiniStat icon={<Flame className="h-4 w-4" />} label="Day streak" value={`${profile.learningStreakDays}`} />
            <MiniStat icon={<Trophy className="h-4 w-4" />} label="Overall progress" value={`${profile.overallProgress}%`} />
            <MiniStat icon={<Clock className="h-4 w-4" />} label="Study time" value={formatMinutes(profile.totalStudyMinutes)} />
            <MiniStat icon={<Target className="h-4 w-4" />} label="Daily goal" value={`${profile.dailyGoalMinutes} min`} />
          </div>
        </CardContent>
      </Card>

      {/* About: education summary */}
      {locationBits.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-primary" /> About
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-3">
              <AboutItem icon={<GraduationCap className="h-4 w-4" />} label="Class / Year" value={classYear} />
              <AboutItem icon={<MapPin className="h-4 w-4" />} label="Branch / Stream" value={branch} />
              <AboutItem
                icon={<Building2 className="h-4 w-4" />}
                label="School / College"
                value={institution}
                url={profile.institutionUrl}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Goals + strong/weak */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" /> Learning goals
            </CardTitle>
          </CardHeader>
          <CardContent>
            {profile.goals.length === 0 ? (
              <p className="text-sm text-muted-foreground">No goals set yet.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {profile.goals.map((g) => (
                  <Badge key={g} variant="outline">{g}</Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-4 w-4 text-primary" /> Subject strengths
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {profile.strongSubjectIds.map((id) => (
                <p key={id} className="flex items-center gap-2 text-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> {getSubject(id)?.name ?? id}
                </p>
              ))}
              {profile.weakSubjectIds.map((id) => (
                <p key={id} className="flex items-center gap-2 text-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500" /> {getSubject(id)?.name ?? id}
                </p>
              ))}
              {profile.strongSubjectIds.length === 0 && profile.weakSubjectIds.length === 0 && (
                <p className="text-sm text-muted-foreground">Complete a quiz to unlock your subject insights.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enrolled / bookmarked */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-primary" /> Enrolled courses ({enrolled.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {enrolled.length === 0 && (
              <p className="text-sm text-muted-foreground">
                You haven&apos;t enrolled yet.{" "}
                <Link href="/courses" className="font-medium text-primary hover:underline">
                  Browse courses
                </Link>
              </p>
            )}
            {enrolled.map((c) => (
              <Link
                key={c.id}
                href={`/courses/${c.id}`}
                className="flex items-center justify-between gap-3 rounded-xl border px-4 py-3 text-sm transition-colors hover:border-primary/40 hover:bg-accent/50"
              >
                <span className="truncate font-medium">{c.title}</span>
                <span className="flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
                  <Progress value={c.progress} className="h-1.5 w-20" />
                  {c.progress}%
                </span>
              </Link>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-primary" /> Bookmarks ({bookmarked.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {bookmarked.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Nothing saved yet.{" "}
                <Link href="/courses" className="font-medium text-primary hover:underline">
                  Find something to save
                </Link>
              </p>
            )}
            {bookmarked.map((c) => (
              <Link
                key={c.id}
                href={`/courses/${c.id}`}
                className="flex items-center justify-between gap-3 rounded-xl border px-4 py-3 text-sm transition-colors hover:border-primary/40 hover:bg-accent/50"
              >
                <span className="truncate font-medium">{c.title}</span>
                <Badge variant="outline" className="shrink-0">{c.subjectName ?? "Course"}</Badge>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" /> Recent activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activity.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Start learning to see activity here — try a{" "}
              <Link href="/practice" className="font-medium text-primary hover:underline">
                practice set
              </Link>
              .
            </p>
          ) : (
            <ul className="space-y-3">
              {activity.slice(0, 8).map((a) => (
                <li key={a.id} className="flex items-center gap-3 text-sm">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    {activityIcon(a.type)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{a.title}</p>
                    <p className="truncate text-xs text-muted-foreground">{a.detail}</p>
                  </div>
                  <span className="shrink-0 text-xs text-muted-foreground">{timeAgo(a.timestamp)}</span>
                  {a.xp > 0 && <Badge variant="info" className="shrink-0">+{a.xp} XP</Badge>}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function MiniStat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border bg-muted/30 p-3">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">{icon}</span>
      <div>
        <p className="text-lg font-bold leading-none">{value}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

function AboutItem({
  icon,
  label,
  value,
  url,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string;
  url?: string;
}) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3 rounded-xl border bg-muted/30 p-3">
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        {url ? (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="break-words text-sm font-medium text-primary hover:underline"
          >
            {value}
          </a>
        ) : (
          <p className="break-words text-sm font-medium">{value}</p>
        )}
      </div>
    </div>
  );
}

function activityIcon(type: ActivityEvent["type"]): React.ReactNode {
  switch (type) {
    case "lesson":
      return <BookOpen className="h-4 w-4" />;
    case "quiz":
    case "practice":
      return <Trophy className="h-4 w-4" />;
    case "course":
      return <Sparkles className="h-4 w-4" />;
    case "streak":
      return <Flame className="h-4 w-4" />;
    default:
      return <Sparkles className="h-4 w-4" />;
  }
}
