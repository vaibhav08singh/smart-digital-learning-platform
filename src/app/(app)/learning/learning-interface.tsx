"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bookmark,
  Captions,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Circle,
  Clock,
  ExternalLink,
  FileText,
  Lightbulb,
  ListVideo,
  Mic,
  NotebookPen,
  Play,
  Sparkles,
  Volume2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ErrorState } from "@/components/ui/state";
import { getTopic, getLesson, getChapter, getSubject } from "@/data/subjects";
import { getVideoForLesson } from "@/data/videos";
import { getCourseSync } from "@/services/course.service";
import { getEducationLevel } from "@/data/education";
import { readStore, writeStore } from "@/lib/storage";
import { recordActivity } from "@/services/analytics.service";
import { cn } from "@/lib/utils";

interface Notes {
  [lessonId: string]: string;
}

interface CompletedMap {
  [lessonId: string]: boolean;
}

export function LearningInterface({ topicId, lessonId }: { topicId: string; lessonId: string }) {
  const router = useRouter();

  // Resolve topicId and lessonId (including "next" shortcuts or topic-first URLs).
  const directTopic = useMemo(() => getTopic(topicId), [topicId]);
  const directLesson = useMemo(() => getLesson(lessonId), [lessonId]);

  let resolvedTopicId = topicId;
  let resolvedLessonId = lessonId;

  if (lessonId === "next" || (!directLesson && directTopic)) {
    if (directTopic && directTopic.lessons.length > 0) {
      resolvedTopicId = directTopic.id;
      resolvedLessonId = directTopic.lessons[0].id;
    } else {
      const course = getCourseSync(topicId);
      const firstLessonId = course?.modules[0]?.lessonIds[0];
      if (firstLessonId) {
        const firstLesson = getLesson(firstLessonId);
        resolvedTopicId = firstLesson?.topicId ?? topicId;
        resolvedLessonId = firstLessonId;
      }
    }
  }

  const lesson = useMemo(() => getLesson(resolvedLessonId) ?? directLesson, [resolvedLessonId, directLesson]);
  const topic = useMemo(
    () => getTopic(resolvedTopicId) ?? directTopic ?? (lesson ? getTopic(lesson.topicId) : undefined) ?? getTopic("tp-sci-light"),
    [resolvedTopicId, directTopic, lesson],
  );
  const chapter = useMemo(() => (topic ? getChapter(topic.chapterId) ?? getChapter("ch-sci-light") : undefined), [topic]);
  const subject = useMemo(() => (chapter ? getSubject(chapter.subjectId) ?? getSubject("sub-science") : undefined), [chapter]);

  const [notes, setNotes] = useState<Notes>(() => readStore<Notes>("codezen:notes", {}));
  const [completed, setCompleted] = useState<CompletedMap>(() => readStore<CompletedMap>("codezen:completed-lessons", {}));
  const [showCaptions, setShowCaptions] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [prevLessonId, setPrevLessonId] = useState(resolvedLessonId);

  if (prevLessonId !== resolvedLessonId) {
    setPrevLessonId(resolvedLessonId);
    setIsPlaying(false);
  }

  const videoInfo = useMemo(
    () => getVideoForLesson(resolvedTopicId, resolvedLessonId),
    [resolvedTopicId, resolvedLessonId],
  );

  useEffect(() => {
    writeStore("codezen:notes", notes);
  }, [notes]);

  useEffect(() => {
    writeStore("codezen:completed-lessons", completed);
  }, [completed]);

  if (!lesson || !topic) {
    return <ErrorState message="Lesson not found." onRetry={() => router.push("/explore")} />;
  }

  const activeLesson = lesson;
  const activeTopic = topic;
  const topicLessons = topic.lessons;
  const index = topicLessons.findIndex((l) => l.id === resolvedLessonId);
  const prevLesson = index > 0 ? topicLessons[index - 1] : undefined;
  const nextLesson = index >= 0 && index < topicLessons.length - 1 ? topicLessons[index + 1] : undefined;
  const isComplete = !!completed[resolvedLessonId];
  const completedCount = topicLessons.filter((l) => completed[l.id]).length;
  const topicProgress = Math.round((completedCount / topicLessons.length) * 100);

  const effectiveLessonId = resolvedLessonId;

  function toggleComplete() {
    setCompleted((prev) => {
      const next = { ...prev, [effectiveLessonId]: !prev[effectiveLessonId] };
      return next;
    });
    if (!isComplete) {
      recordActivity({
        type: "lesson",
        title: `Completed: ${activeLesson.title}`,
        detail: `${activeTopic.name} · ${activeLesson.durationMinutes} min`,
        timestamp: "Just now",
        xp: 25,
      });
    }
  }

  function goToLesson(target: { topicId: string; lessonId: string }) {
    router.push(`/learning/${target.topicId}/${target.lessonId}`);
  }

  const level = subject ? getEducationLevel(subject.levelId) : undefined;

  return (
    <div className="mx-auto max-w-6xl">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-4 flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
        <Link href={`/explore?subject=${subject?.id}`} className="hover:text-foreground">{subject?.name}</Link>
        <span>/</span>
        <Link href={`/explore?chapter=${chapter?.id}`} className="hover:text-foreground">{chapter?.name}</Link>
        <span>/</span>
        <Link href={`/explore?topic=${topic.id}`} className="hover:text-foreground">{topic.name}</Link>
        <span>/</span>
        <span aria-current="page" className="font-medium text-foreground">{lesson.title}</span>
      </nav>

      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        {/* Main lesson area */}
        <div className="space-y-6">
          {/* Video / media area */}
          <div className="relative aspect-video overflow-hidden rounded-2xl border bg-black shadow-lg">
            {isPlaying ? (
              <iframe
                src={`https://www.youtube.com/embed/${videoInfo.youtubeId}?autoplay=1&rel=0`}
                title={videoInfo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="h-full w-full border-0"
              />
            ) : (
              <div className="relative h-full w-full">
                <Image
                  src={`https://i.ytimg.com/vi/${videoInfo.youtubeId}/hqdefault.jpg`}
                  alt={videoInfo.title}
                  fill
                  unoptimized
                  className="object-cover opacity-70 transition-opacity hover:opacity-85"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3.5 p-6 text-center text-white">
                  <button
                    type="button"
                    onClick={() => setIsPlaying(true)}
                    className="group flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xl transition-transform hover:scale-110 hover:bg-primary/90"
                    aria-label={`Play video: ${videoInfo.title}`}
                  >
                    <Play className="h-7 w-7 translate-x-0.5 fill-current" />
                  </button>
                  <div>
                    <p className="text-base font-bold text-white drop-shadow-md">{videoInfo.title}</p>
                    <p className="mt-1 text-xs text-white/80">
                      {videoInfo.channel} · {videoInfo.duration ?? `${lesson.durationMinutes} min`}
                    </p>
                  </div>
                </div>
                {showCaptions && (
                  <div className="absolute inset-x-0 bottom-0 bg-black/80 px-4 py-2 text-center text-sm text-white backdrop-blur">
                    {lesson.captions ?? "Welcome to this lesson. Follow along and take notes."}
                  </div>
                )}
                <span className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-black/60 px-2.5 py-1 text-[11px] text-white/90 backdrop-blur">
                  <Badge variant="secondary" className="bg-transparent p-0 text-white/90">{level?.shortLabel}</Badge>
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {lesson.durationMinutes} min</span>
                </span>
                <a
                  href={`https://www.youtube.com/watch?v=${videoInfo.youtubeId}`}
                  target="_blank"
                  rel="noreferrer"
                  className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-[11px] text-white/90 backdrop-blur transition-colors hover:bg-black/80"
                >
                  Watch on YouTube <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            )}
          </div>

          {/* Title + actions */}
          <div className="flex flex-col gap-4 rounded-2xl border bg-card p-6 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <Badge variant={isComplete ? "success" : "outline"}>
                  {isComplete ? "Completed" : "In progress"}
                </Badge>
                <Badge variant="outline">{topic.difficulty}</Badge>
              </div>
              <h1 className="text-2xl font-bold tracking-tight">{lesson.title}</h1>
              <p className="mt-1 text-sm text-muted-foreground">{topic.name}</p>
            </div>
            <Button onClick={toggleComplete} variant={isComplete ? "outline" : "default"}>
              {isComplete ? <><Check className="h-4 w-4" /> Completed</> : <><CheckCircle2 className="h-4 w-4" /> Mark complete</>}
            </Button>
          </div>

          {/* Content */}
          <article className="prose prose-slate max-w-none dark:prose-invert">
            <div className="rounded-2xl border bg-card p-6">
              <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold">
                <Lightbulb className="h-5 w-5 text-primary" /> Lesson content
              </h2>
              <p className="whitespace-pre-line leading-7 text-muted-foreground">{lesson.content}</p>

              <div className="mt-6 rounded-xl border border-primary/20 bg-primary/5 p-4">
                <p className="flex items-center gap-2 text-sm font-semibold text-primary">
                  <Sparkles className="h-4 w-4" /> Key takeaway
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Revisit this lesson before attempting the practice quiz to lock in the concepts.
                </p>
              </div>
            </div>
          </article>

          {/* Notes */}
          <div className="rounded-2xl border bg-card p-6">
            <p className="mb-3 flex items-center gap-2 text-sm font-semibold">
              <NotebookPen className="h-4 w-4 text-primary" /> Your notes
            </p>
            <textarea
              value={notes[lesson.id] ?? ""}
              onChange={(e) => setNotes((prev) => ({ ...prev, [lesson.id]: e.target.value }))}
              placeholder="Write your own notes here — they are saved automatically…"
              rows={4}
              aria-label="Lesson notes"
              className="w-full resize-y rounded-xl border bg-transparent p-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>

          {/* Transcript + captions */}
          <div className="rounded-2xl border bg-card p-6">
            <div className="mb-3 flex flex-wrap gap-2">
              <Button variant={showCaptions ? "secondary" : "outline"} size="sm" onClick={() => setShowCaptions((v) => !v)}>
                <Captions className="h-4 w-4" /> {showCaptions ? "Hide" : "Show"} captions
              </Button>
              <Button variant={showTranscript ? "secondary" : "outline"} size="sm" onClick={() => setShowTranscript((v) => !v)}>
                <FileText className="h-4 w-4" /> {showTranscript ? "Hide" : "Show"} transcript
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSpeaking((v) => !v)}
                aria-pressed={speaking}
              >
                <Volume2 className="h-4 w-4" /> {speaking ? "Stop" : "Read aloud"}
              </Button>
            </div>
            {showTranscript && (
              <div className="rounded-xl bg-muted/50 p-4 text-sm text-muted-foreground">
                {lesson.transcript ?? "This is a sample transcript. In a live course this area would contain the full spoken script of the lesson, synced to the video timeline."}
              </div>
            )}
            <p className="mt-2 text-xs text-muted-foreground">
              Accessibility tip: use the Read aloud button for text-to-speech, captions and
              transcript for video content.
            </p>
          </div>

          {/* Resources */}
          {lesson.resources.length > 0 && (
            <div className="rounded-2xl border bg-card p-6">
              <p className="mb-3 flex items-center gap-2 text-sm font-semibold">
                <Bookmark className="h-4 w-4 text-primary" /> Resources
              </p>
              <div className="grid gap-2 sm:grid-cols-2">
                {lesson.resources.map((resource) => (
                  <a
                    key={resource.title}
                    href={resource.url}
                    className="flex items-center gap-2 rounded-xl border px-4 py-3 text-sm transition-colors hover:border-primary/40 hover:bg-accent/50"
                  >
                    <FileText className="h-4 w-4 text-primary" /> {resource.title}
                    <Badge variant="outline" className="ml-auto">{resource.type}</Badge>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Prev / Next */}
          <div className="flex items-center justify-between gap-3">
            {prevLesson ? (
              <Button variant="outline" onClick={() => goToLesson({ topicId: topic.id, lessonId: prevLesson.id })}>
                <ChevronLeft className="h-4 w-4" /> Previous
              </Button>
            ) : <span />}
            {nextLesson ? (
              <Button onClick={() => goToLesson({ topicId: topic.id, lessonId: nextLesson.id })}>
                Next <ChevronRight className="h-4 w-4" />
              </Button>
            ) : topicQuizFor(topic.id) ? (
              <Button asChild>
                <Link href={`/quiz/${topicQuizFor(topic.id)}`}>
                  Take the topic quiz <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
            ) : (
              <span />
            )}
          </div>
        </div>

        {/* Sidebar: topic navigation */}
        <aside className="space-y-4">
          <div className="rounded-2xl border bg-card p-4">
            <p className="mb-2 flex items-center gap-2 text-sm font-semibold">
              <ListVideo className="h-4 w-4 text-primary" /> Topic progress
            </p>
            <div className="mb-1 flex justify-between text-xs text-muted-foreground">
              <span>{completedCount}/{topicLessons.length} lessons</span>
              <span>{topicProgress}%</span>
            </div>
            <Progress value={topicProgress} />
          </div>

          <nav className="rounded-2xl border bg-card p-3" aria-label="Topic lessons">
            <p className="px-2 pb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {topic.name}
            </p>
            <ul className="space-y-1">
              {topicLessons.map((l, i) => {
                const active = l.id === effectiveLessonId;
                const done = !!completed[l.id];
                return (
                  <li key={l.id}>
                    <button
                      type="button"
                      onClick={() => goToLesson({ topicId: topic.id, lessonId: l.id })}
                      aria-current={active ? "step" : undefined}
                      className={cn(
                        "flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-left text-sm transition-colors",
                        active ? "bg-primary/10 font-medium text-primary" : "hover:bg-accent",
                      )}
                    >
                      {done ? <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" /> : <Circle className="h-4 w-4 shrink-0 text-muted-foreground" />}
                      <span className="min-w-0 flex-1 truncate">{i + 1}. {l.title}</span>
                      <span className="text-[10px] text-muted-foreground">{l.durationMinutes}m</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              if ("speechSynthesis" in window && !speaking) {
                window.speechSynthesis.speak(new SpeechSynthesisUtterance(lesson.content));
                setSpeaking(true);
              } else if ("speechSynthesis" in window) {
                window.speechSynthesis.cancel();
                setSpeaking(false);
              }
            }}
          >
            <Mic className="h-4 w-4" /> Read aloud
          </Button>
        </aside>
      </div>
    </div>
  );
}

function topicQuizFor(topicId: string): string | undefined {
  // Map topic → a practice/quiz id for the "Take the quiz" CTA.
  // Unmapped topics have no quiz yet, so the CTA is hidden rather than
  // sending the learner to an unrelated quiz.
  const map: Record<string, string> = {
    "tp-avl": "quiz-trees",
    "tp-trees": "quiz-trees",
    "tp-graphs": "quiz-trees",
    "tp-quadratic": "quiz-quadratic",
    "tp-emi": "quiz-emi",
    "tp-sci-light": "quiz-light",
    "tp-nn-arch": "quiz-dl",
    "tp-research": "quiz-dl",
    "tp-dp": "quiz-dp",
    "tp-eng-noun": "quiz-english5",
  };
  return map[topicId];
}
