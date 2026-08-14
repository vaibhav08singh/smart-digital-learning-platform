"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bookmark,
  CheckCircle2,
  ChevronRight,
  Clock,
  Download,
  ExternalLink,
  FileText,
  GraduationCap,
  MonitorPlay,
  PlayCircle,
  Star,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/ui/state";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getCourse } from "@/services/course.service";
import { toggleBookmark, enroll } from "@/services/student.service";
import { getLesson } from "@/data/subjects";
import { getEducationLevel } from "@/data/education";
import { courses } from "@/data/courses";
import { videosForCourse } from "@/data/videos";
import { resourcesForCourse } from "@/data/resources";
import { initials } from "@/lib/utils";
import type { Course } from "@/types";
import { cn } from "@/lib/utils";

export function CourseDetail({ id }: { id: string }) {
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);
  const [related, setRelated] = useState<Course[]>([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    let mounted = true;
    getCourse(id)
      .then((c) => {
        if (!mounted) return;
        if (!c) {
          setError(true);
          return;
        }
        setCourse(c);
        setRelated(coursesWithProgress(c));
      })
      .catch(() => mounted && setError(true));
    return () => {
      mounted = false;
    };
  }, [id]);

  async function handleBookmark() {
    if (!course) return;
    await toggleBookmark(course.id);
    const fresh = await getCourse(course.id);
    if (fresh) setCourse(fresh);
  }

  async function handleEnroll() {
    if (!course) return;
    await enroll(course.id);
    const targetUrl = firstLesson
      ? `/learning/${firstLesson.topicId}/${firstLesson.id}`
      : `/learning/${course.id}/next`;
    router.push(targetUrl);
  }

  if (error) {
    return (
      <ErrorState
        message="We couldn't find that course."
        onRetry={() => router.push("/courses")}
      />
    );
  }

  if (!course) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-64" />
        <Skeleton className="h-40" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  const level = getEducationLevel(course.levelId);
  const firstModule = course.modules[0];
  const firstLessonId = firstModule?.lessonIds[0];
  const firstLesson = firstLessonId ? getLesson(firstLessonId) : undefined;
  const startLearningUrl = firstLesson
    ? `/learning/${firstLesson.topicId}/${firstLesson.id}`
    : `/learning/${course.id}/next`;

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Hero */}
      <div className="overflow-hidden rounded-3xl border">
        <div className={cn("relative bg-gradient-to-br p-8 text-white sm:p-10", course.gradient)}>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="bg-white/20 text-white">{level?.shortLabel}</Badge>
            <Badge variant="secondary" className="bg-white/20 text-white">{course.difficulty}</Badge>
            <Badge variant="secondary" className="bg-white/20 text-white">{course.subjectName}</Badge>
          </div>
          <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">{course.title}</h1>
          <p className="mt-3 max-w-2xl text-white/85">{course.description}</p>
          <div className="mt-6 flex flex-wrap items-center gap-5 text-sm text-white/85">
            <span className="flex items-center gap-1.5"><Star className="h-4 w-4 text-amber-300" /> {course.rating} ({course.reviewCount})</span>
            <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> {course.durationHours}h</span>
            <span className="flex items-center gap-1.5"><Users className="h-4 w-4" /> 12,400 learners</span>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main column */}
        <div className="space-y-8 lg:col-span-2">
          {/* Progress + CTA */}
          <div className="rounded-2xl border bg-card p-6">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm font-medium">Your progress</p>
              <span className="text-sm font-semibold text-primary">{course.progress}%</span>
            </div>
            <Progress value={course.progress} className="h-2.5" />
            <div className="mt-5 flex flex-wrap gap-3">
              {course.progress > 0 || course.enrolled ? (
                <Button onClick={() => router.push(startLearningUrl)}>
                  <PlayCircle className="h-4 w-4" /> Continue learning
                </Button>
              ) : (
                <Button onClick={handleEnroll}>
                  <PlayCircle className="h-4 w-4" /> Enroll now — free
                </Button>
              )}
              <Button variant="outline" onClick={handleBookmark}>
                <Bookmark className={cn("h-4 w-4", course.bookmarked && "fill-amber-400 text-amber-400")} />
                {course.bookmarked ? "Saved" : "Save"}
              </Button>
            </div>
          </div>

          {/* What you'll learn */}
          <div className="rounded-2xl border bg-card p-6">
            <h2 className="mb-4 text-lg font-semibold">What you&apos;ll learn</h2>
            <div className="grid gap-2 sm:grid-cols-2">
              {[
                "Core concepts explained step by step",
                "Hands-on practice after every lesson",
                "Quizzes that measure true mastery",
                "Personalised AI tutor support",
              ].map((item) => (
                <p key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" /> {item}
                </p>
              ))}
            </div>
          </div>

          {/* Modules */}
          <div className="rounded-2xl border bg-card p-6">
            <h2 className="mb-4 text-lg font-semibold">Course content</h2>
            <div className="space-y-4">
              {course.modules.map((module, moduleIndex) => (
                <div key={module.id}>
                  <p className="mb-2 text-sm font-semibold">
                    Module {moduleIndex + 1}: {module.title}
                  </p>
                  <div className="space-y-1">
                    {module.lessonIds.map((lessonId, lessonIndex) => {
                      const lesson = getLesson(lessonId);
                      return (
                        <Link
                          key={lessonId}
                          href={`/learning/${lesson?.topicId ?? ""}/${lessonId}`}
                          className="flex items-center gap-3 rounded-lg border px-3 py-2.5 text-sm transition-colors hover:border-primary/40 hover:bg-accent/50"
                        >
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                            {lessonIndex + 1}
                          </span>
                          <span className="min-w-0 flex-1 truncate">{lesson?.title ?? lessonId}</span>
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" /> {lesson?.durationMinutes ?? "-"} min
                          </span>
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended videos */}
          <VideoSection courseId={course.id} />

          {/* Notes & resources */}
          <ResourceSection courseId={course.id} />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="rounded-2xl border bg-card p-6">
            <h2 className="mb-4 text-lg font-semibold">Instructor</h2>
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarFallback>{initials(course.instructor)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">{course.instructor}</p>
                <p className="text-xs text-muted-foreground">{course.instructorTitle}</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border bg-card p-6">
            <h2 className="mb-3 text-lg font-semibold">Tags</h2>
            <div className="flex flex-wrap gap-2">
              {course.tags.map((tag) => (
                <Badge key={tag} variant="outline">{tag}</Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div>
          <h2 className="mb-4 text-lg font-semibold">Related courses</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((c) => (
              <Link
                key={c.id}
                href={`/courses/${c.id}`}
                className="group flex items-center gap-3 rounded-2xl border bg-card p-4 transition-all hover:border-primary/40 hover:shadow-sm"
              >
                <span className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-white", c.gradient)}>
                  <PlayCircle className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold group-hover:text-primary">{c.title}</p>
                  <p className="text-xs text-muted-foreground">{c.subjectName} · {c.difficulty}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Related courses from real data: same subject first, else same level.
function coursesWithProgress(course: Course): Course[] {
  const related = courses.filter((c) => c.subjectId === course.subjectId && c.id !== course.id);
  if (related.length === 0) {
    related.push(...courses.filter((c) => c.levelId === course.levelId && c.id !== course.id));
  }
  return related.slice(0, 3).map((c) => ({ ...c, progress: 0, bookmarked: false, enrolled: false }));
}

// ------------------------------------------------------------
// Recommended videos
// ------------------------------------------------------------

function VideoSection({ courseId }: { courseId: string }) {
  const videos = videosForCourse(courseId);
  const [active, setActive] = useState(videos[0]?.id ?? null);

  const current = videos.find((v) => v.id === active) ?? videos[0];

  // If the course changed and the old tab no longer exists, reset the selection
  // during render (React re-renders immediately) instead of syncing in an effect.
  if (current && active !== current.id) {
    setActive(current.id);
  }

  if (videos.length === 0) return null;

  return (
    <div className="rounded-2xl border bg-card p-6">
      <h2 className="mb-1 flex items-center gap-2 text-lg font-semibold">
        <MonitorPlay className="h-5 w-5 text-red-500" /> Recommended videos
      </h2>
      <p className="mb-4 text-sm text-muted-foreground">
        Hand-picked lessons from trusted channels to deepen your understanding.
      </p>
      <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
        <div className="aspect-video overflow-hidden rounded-xl border bg-black">
          <iframe
            key={current.id}
            src={`https://www.youtube-nocookie.com/embed/${current.youtubeId}?rel=0`}
            title={current.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="h-full w-full"
            loading="lazy"
          />
        </div>
        <div className="space-y-2">
          {videos.map((video) => (
            <button
              key={video.id}
              type="button"
              onClick={() => setActive(video.id)}
              className={cn(
                "flex w-full flex-col gap-1 rounded-xl border px-3 py-2.5 text-left transition-colors",
                video.id === current.id
                  ? "border-primary/50 bg-primary/5"
                  : "hover:border-primary/30 hover:bg-accent/50",
              )}
            >
              <span className="line-clamp-2 text-sm font-medium">{video.title}</span>
              <span className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <PlayCircle className="h-3 w-3" /> {video.channel}
                </span>
                {video.duration && <span className="rounded-full bg-muted px-1.5 py-0.5 tabular-nums">{video.duration}</span>}
              </span>
            </button>
          ))}
          <a
            href={`https://www.youtube.com/results?search_query=${encodeURIComponent(current.title.split("—")[0].trim())}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 rounded-xl border border-dashed px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
          >
            <ExternalLink className="h-3.5 w-3.5" /> Watch on YouTube
          </a>
        </div>
      </div>
    </div>
  );
}

// ------------------------------------------------------------
// Notes & resources
// ------------------------------------------------------------

function ResourceSection({ courseId }: { courseId: string }) {
  const resources = resourcesForCourse(courseId);
  if (resources.length === 0) return null;

  return (
    <div className="rounded-2xl border bg-card p-6">
      <h2 className="mb-1 flex items-center gap-2 text-lg font-semibold">
        <FileText className="h-5 w-5 text-primary" /> Notes & resources
      </h2>
      <p className="mb-4 text-sm text-muted-foreground">
        Free, official and trusted sources — no sign-ups required.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        {resources.map((resource) => (
          <a
            key={resource.id}
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col gap-2 rounded-xl border p-4 transition-colors hover:border-primary/40 hover:bg-accent/50"
          >
            <div className="flex items-start justify-between gap-2">
              <span className="flex items-center gap-2 font-medium">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  {resourceTypeIcon(resource.type)}
                </span>
                <span className="line-clamp-2">{resource.title}</span>
              </span>
              <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
            </div>
            <p className="line-clamp-2 text-sm text-muted-foreground">{resource.description}</p>
            <div className="mt-auto flex items-center gap-2">
              <Badge variant="outline">{resource.source}</Badge>
              {resource.downloadUrl && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Download className="h-3 w-3" /> Free PDF
                </Badge>
              )}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

function resourceTypeIcon(type: string): React.ReactNode {
  switch (type) {
    case "docs":
      return <FileText className="h-4 w-4" />;
    case "textbook":
      return <GraduationCap className="h-4 w-4" />;
    case "course":
      return <GraduationCap className="h-4 w-4" />;
    case "official":
      return <FileText className="h-4 w-4" />;
    case "practice":
      return <CheckCircle2 className="h-4 w-4" />;
    default:
      return <FileText className="h-4 w-4" />;
  }
}
