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
  Copy,
  ExternalLink,
  FileText,
  Lightbulb,
  ListVideo,
  Mic,
  NotebookPen,
  Play,
  Printer,
  Sparkles,
  Video,
  Volume2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ErrorState } from "@/components/ui/state";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getTopic, getLesson, getChapter, getSubject } from "@/data/subjects";
import { getVideoForLesson } from "@/data/videos";
import { getCourseSync } from "@/services/course.service";
import { getEducationLevel } from "@/data/education";
import { readStore, writeStore } from "@/lib/storage";
import { recordActivity } from "@/services/analytics.service";
import { cn } from "@/lib/utils";
import type { LessonResource } from "@/types";

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

  // Resources Modals state
  const [selectedResource, setSelectedResource] = useState<LessonResource | null>(null);
  const [copiedNotes, setCopiedNotes] = useState(false);
  const [savedToNotesMsg, setSavedToNotesMsg] = useState(false);
  const [summaryTimestamp, setSummaryTimestamp] = useState(0);

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

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

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

  function handleToggleReadAloud() {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      alert("Text-to-speech is not supported in your browser.");
      return;
    }

    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
    } else if (lesson) {
      window.speechSynthesis.cancel();
      const textToSpeak = `${lesson.title}. ${lesson.content}`;
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.rate = 0.95;
      utterance.onend = () => setSpeaking(false);
      utterance.onerror = () => setSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setSpeaking(true);
    }
  }

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

  function handleResourceClick(resource: LessonResource) {
    if (resource.url && resource.url.startsWith("http")) {
      window.open(resource.url, "_blank", "noopener,noreferrer");
      return;
    }
    setSelectedResource(resource);
    setSummaryTimestamp(0);
  }

  const handlePrintNotes = () => {
    if (!lesson) return;
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Lesson Notes - ${lesson.title}</title>
          <style>
            body { font-family: system-ui, -apple-system, sans-serif; padding: 40px; color: #0f172a; max-width: 800px; margin: 0 auto; line-height: 1.6; }
            h1 { color: #0284c7; border-bottom: 2px solid #e2e8f0; padding-bottom: 12px; margin-bottom: 8px; font-size: 24px; }
            .meta { color: #64748b; font-size: 13px; margin-bottom: 24px; text-transform: uppercase; tracking: 0.05em; font-weight: 600; }
            .section { margin-bottom: 24px; background: #f8fafc; padding: 20px; border-radius: 12px; border: 1px solid #e2e8f0; }
            .section h2 { font-size: 15px; margin-top: 0; color: #1e293b; border-bottom: 1px solid #cbd5e1; padding-bottom: 6px; }
            ul { padding-left: 20px; color: #334155; }
            li { margin-bottom: 6px; }
            .footer { margin-top: 40px; font-size: 11px; color: #94a3b8; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 16px; }
          </style>
        </head>
        <body>
          <h1>${lesson.title} — Study Notes</h1>
          <div class="meta">Topic: ${topic?.name} | Subject: ${subject?.name || "CodeZen Study Guide"}</div>
          <div class="section">
            <h2>1. Lesson Content & Overview</h2>
            <p>${lesson.content}</p>
          </div>
          <div class="section">
            <h2>2. Key Takeaways & Exam Tips</h2>
            <ul>
              <li>Understand the core principles of ${lesson.title} thoroughly.</li>
              <li>Revisit these concepts before taking the end-of-topic quiz.</li>
              <li>Practice step-by-step problem solving as covered in the curriculum.</li>
            </ul>
          </div>
          ${
            notes[lesson.id]
              ? `<div class="section"><h2>3. Saved Personal Notes</h2><p>${notes[lesson.id]}</p></div>`
              : ""
          }
          <div class="footer">Generated by CodeZen Smart Digital Learning Platform</div>
          <script>
            window.onload = function() { window.print(); };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleCopyNotes = () => {
    if (!lesson) return;
    const textToCopy = `# ${lesson.title} - Notes\n\nTopic: ${topic?.name}\nSubject: ${subject?.name || "CodeZen"}\n\n## Content Overview\n${lesson.content}\n\n## Key Takeaways\n- Revisit this lesson before attempting the topic quiz.\n${notes[lesson.id] ? `\n## Personal Notes\n${notes[lesson.id]}` : ""}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedNotes(true);
    setTimeout(() => setCopiedNotes(false), 2500);
  };

  const handleAppendToMyNotes = () => {
    if (!lesson) return;
    const addition = `\n\n--- [Lesson Notes: ${lesson.title}] ---\n${lesson.content}`;
    setNotes((prev) => ({
      ...prev,
      [lesson.id]: (prev[lesson.id] || "") + addition,
    }));
    setSavedToNotesMsg(true);
    setTimeout(() => setSavedToNotesMsg(false), 2500);
  };

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
          <div className="space-y-2">
            <div className="relative aspect-video overflow-hidden rounded-2xl border bg-black shadow-lg">
              {isPlaying ? (
                <div className="relative h-full w-full">
                  <iframe
                    src={`https://www.youtube.com/embed/${videoInfo.youtubeId}?autoplay=1&rel=0`}
                    title={videoInfo.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="h-full w-full border-0"
                  />
                  <a
                    href={`https://www.youtube.com/watch?v=${videoInfo.youtubeId}`}
                    target="_blank"
                    rel="noreferrer"
                    className="absolute right-3 top-3 z-10 flex items-center gap-1.5 rounded-full bg-black/80 px-3 py-1 text-xs font-medium text-white shadow-md backdrop-blur transition-all hover:bg-black/90 hover:scale-105"
                  >
                    Watch on YouTube <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
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
          </div>

          {/* Title + actions */}
          <div className="flex flex-col gap-4 rounded-2xl border bg-card p-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1.5 flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  variant={isComplete ? "success" : "outline"}
                  className={cn(isComplete && "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 font-semibold")}
                >
                  {isComplete ? "✓ Completed" : "In progress"}
                </Badge>
                <Badge variant="outline" className="capitalize">{topic.difficulty}</Badge>
                {subject && <Badge variant="secondary" className="text-xs">{subject.name}</Badge>}
              </div>
              <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl break-words">
                {lesson.title || topic.name}
              </h1>
              <p className="text-xs text-muted-foreground">
                Topic: <span className="font-medium text-foreground">{topic.name}</span> • {lesson.durationMinutes} min lesson
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0 pt-1 sm:pt-0">
              <Button
                onClick={toggleComplete}
                variant={isComplete ? "outline" : "default"}
                size="default"
                className={cn(
                  "gap-2 shadow-sm font-semibold transition-all",
                  isComplete
                    ? "border-emerald-500/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10"
                    : "bg-primary text-primary-foreground hover:bg-primary/90"
                )}
              >
                {isComplete ? (
                  <><Check className="h-4 w-4 text-emerald-500" /> Completed</>
                ) : (
                  <><CheckCircle2 className="h-4 w-4" /> Mark complete</>
                )}
              </Button>
            </div>
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
          <div className="rounded-2xl border bg-card p-6 space-y-4">
            <div className="flex flex-wrap items-center gap-2.5">
              <Button
                variant={showCaptions ? "secondary" : "outline"}
                size="sm"
                onClick={() => setShowCaptions((v) => !v)}
                className={cn(showCaptions && "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-300 dark:border-purple-800")}
              >
                <Captions className="h-4 w-4" /> {showCaptions ? "Hide captions" : "Show captions"}
              </Button>
              <Button
                variant={showTranscript ? "secondary" : "outline"}
                size="sm"
                onClick={() => setShowTranscript((v) => !v)}
                className={cn(showTranscript && "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-300 dark:border-indigo-800")}
              >
                <FileText className="h-4 w-4" /> {showTranscript ? "Hide transcript" : "Show transcript"}
              </Button>
              <Button
                variant={speaking ? "default" : "outline"}
                size="sm"
                onClick={handleToggleReadAloud}
                aria-pressed={speaking}
                className={cn(speaking && "bg-rose-500 text-white hover:bg-rose-600 animate-pulse")}
              >
                <Volume2 className="h-4 w-4" /> {speaking ? "Stop" : "Read aloud"}
              </Button>
            </div>

            {/* Closed Captions Display */}
            {showCaptions && (
              <div className="rounded-xl border border-purple-500/30 bg-purple-500/5 p-4 text-sm text-foreground transition-all">
                <div className="mb-1.5 flex items-center justify-between text-xs font-semibold text-purple-600 dark:text-purple-400">
                  <span className="flex items-center gap-1.5"><Captions className="h-3.5 w-3.5" /> Closed Captions Banner</span>
                  <span className="text-[10px] uppercase tracking-wider bg-purple-500/15 px-2 py-0.5 rounded-md">Live Subtitles</span>
                </div>
                <p className="leading-relaxed text-foreground font-medium">
                  {lesson.captions ?? `"[00:15] Welcome to ${lesson.title}. In this lesson we explore core principles: ${lesson.content.slice(0, 160)}..."`}
                </p>
              </div>
            )}

            {/* Full Spoken Transcript Display */}
            {showTranscript && (
              <div className="rounded-xl border bg-muted/40 p-4 text-sm space-y-3 transition-all">
                <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
                  <span className="flex items-center gap-1.5"><FileText className="h-3.5 w-3.5 text-primary" /> Full Lesson Transcript & Notes</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 text-[11px] px-2 text-primary"
                    onClick={() => navigator.clipboard.writeText(lesson.transcript ?? `${lesson.title}\n\n${lesson.content}`)}
                  >
                    <Copy className="mr-1 h-3 w-3" /> Copy transcript
                  </Button>
                </div>
                <div className="rounded-lg bg-card p-3 border text-muted-foreground leading-relaxed whitespace-pre-line max-h-64 overflow-y-auto text-xs">
                  {lesson.transcript ?? `[00:00] Overview & Introduction to ${lesson.title}\n[00:45] Core Concepts & Definitions\n${lesson.content}\n\n[04:30] Key Takeaway: Revisit practice questions to solidify your understanding of this topic.`}
                </div>
              </div>
            )}

            <p className="text-xs text-muted-foreground">
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
              <div className="grid gap-2.5 sm:grid-cols-2">
                {lesson.resources.map((resource) => (
                  <button
                    key={resource.title}
                    type="button"
                    onClick={() => handleResourceClick(resource)}
                    className="flex items-center gap-2.5 rounded-xl border bg-card/60 px-4 py-3.5 text-sm font-medium transition-all hover:border-primary/50 hover:bg-primary/5 hover:shadow-sm"
                  >
                    {resource.type === "video" ? (
                      <Video className="h-4 w-4 text-purple-500 shrink-0" />
                    ) : resource.type === "pdf" || resource.type === "note" ? (
                      <FileText className="h-4 w-4 text-indigo-500 shrink-0" />
                    ) : (
                      <ExternalLink className="h-4 w-4 text-blue-500 shrink-0" />
                    )}
                    <span className="truncate">{resource.title}</span>
                    <Badge variant="outline" className="ml-auto capitalize shrink-0 text-xs font-semibold px-2 py-0.5">
                      {resource.type}
                    </Badge>
                  </button>
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
            variant={speaking ? "default" : "outline"}
            className={cn("w-full gap-2", speaking && "bg-rose-500 text-white hover:bg-rose-600 animate-pulse")}
            onClick={handleToggleReadAloud}
          >
            <Mic className="h-4 w-4" /> {speaking ? "Stop reading" : "Read aloud"}
          </Button>
        </aside>
      </div>

      {/* Resource Viewer Modal */}
      <Dialog open={!!selectedResource} onOpenChange={(open) => !open && setSelectedResource(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedResource?.type === "video" ? (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200">
                    <Video className="mr-1 h-3.5 w-3.5" /> Video Summary
                  </Badge>
                </div>
                <DialogTitle className="text-xl font-bold">{selectedResource.title}: {lesson.title}</DialogTitle>
                <DialogDescription>
                  Watch the video summary and key chapter timestamps for {topic.name}.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 my-2">
                {/* Video Player */}
                <div className="relative aspect-video w-full overflow-hidden rounded-xl border bg-black shadow-md">
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${videoInfo?.youtubeId || "rfscVS0vtbw"}?autoplay=1&start=${summaryTimestamp}`}
                    title={selectedResource.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="h-full w-full border-0"
                  />
                </div>

                {/* Timestamps / Chapters */}
                <div className="rounded-xl border bg-muted/40 p-4">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-primary" /> Key Timestamps & Chapters
                  </p>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 text-xs">
                    {[
                      { time: 0, label: "00:00 Overview" },
                      { time: 75, label: "01:15 Core Concept" },
                      { time: 210, label: "03:30 Example" },
                      { time: 300, label: "05:00 Summary" },
                    ].map((chap) => (
                      <button
                        key={chap.label}
                        type="button"
                        onClick={() => setSummaryTimestamp(chap.time)}
                        className="flex items-center gap-1.5 rounded-lg border bg-background px-2.5 py-1.5 font-medium transition-colors hover:bg-primary/10 hover:text-primary"
                      >
                        <Play className="h-3 w-3 text-primary fill-primary" />
                        <span>{chap.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Key Summary Highlights */}
                <div className="rounded-xl border bg-card p-4 space-y-2">
                  <p className="text-sm font-semibold flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-amber-500" /> Video Highlights
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1.5 list-disc pl-5">
                    <li>Comprehensive overview of {lesson.title} principles.</li>
                    <li>Visual diagrams and real-world examples explaining key ideas.</li>
                    <li>Essential revision points for the end-of-topic quiz.</li>
                  </ul>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t">
                <Button variant="outline" size="sm" onClick={() => setSelectedResource(null)}>
                  Close
                </Button>
                <Button size="sm" onClick={() => router.push(`/resources?q=${encodeURIComponent(lesson.title)}`)}>
                  <ExternalLink className="mr-1.5 h-3.5 w-3.5" /> Explore in Resource Hub
                </Button>
              </div>
            </>
          ) : (
            <>
              {/* PDF / Note Modal */}
              <DialogHeader>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-200">
                    <FileText className="mr-1 h-3.5 w-3.5" /> PDF Study Notes
                  </Badge>
                </div>
                <DialogTitle className="text-xl font-bold">{selectedResource?.title}: {lesson.title}</DialogTitle>
                <DialogDescription>
                  Curated study notes & revision sheet for {topic.name}.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 my-2">
                {/* Action Toolbar */}
                <div className="flex flex-wrap items-center gap-2 rounded-xl border bg-muted/30 p-2.5">
                  <Button size="sm" variant="default" onClick={handlePrintNotes} className="gap-1.5 text-xs">
                    <Printer className="h-3.5 w-3.5" /> Save / Print PDF
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleCopyNotes} className="gap-1.5 text-xs">
                    {copiedNotes ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                    {copiedNotes ? "Copied!" : "Copy Notes"}
                  </Button>
                  <Button size="sm" variant="secondary" onClick={handleAppendToMyNotes} className="gap-1.5 text-xs ml-auto">
                    <NotebookPen className="h-3.5 w-3.5 text-primary" />
                    {savedToNotesMsg ? "Added to Notes!" : "Add to My Notes"}
                  </Button>
                </div>

                {/* Notes View Paper */}
                <div className="rounded-xl border bg-card p-5 space-y-4 text-sm leading-relaxed max-h-[50vh] overflow-y-auto shadow-inner">
                  <div className="border-b pb-3">
                    <h3 className="font-bold text-base text-foreground">{lesson.title}</h3>
                    <p className="text-xs text-muted-foreground">Topic: {topic.name} • Subject: {subject?.name || "CodeZen"}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-xs uppercase tracking-wider text-primary mb-1.5">1. Overview & Core Concept</h4>
                    <p className="text-muted-foreground whitespace-pre-line bg-muted/30 p-3 rounded-lg border">{lesson.content}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-xs uppercase tracking-wider text-primary mb-1.5">2. Key Takeaways & Exam Points</h4>
                    <ul className="list-disc pl-5 text-muted-foreground space-y-1">
                      <li>Understand how {lesson.title} fits into the broader context of {topic.name}.</li>
                      <li>Review formula derivations and sample problems before taking the practice quiz.</li>
                      <li>Practice coding or step-by-step calculations as demonstrated in the lesson.</li>
                    </ul>
                  </div>

                  {notes[lesson.id] && (
                    <div className="border-t pt-3">
                      <h4 className="font-semibold text-xs uppercase tracking-wider text-indigo-500 mb-1.5">3. Your Personal Saved Notes</h4>
                      <p className="text-xs text-muted-foreground italic bg-indigo-50/50 dark:bg-indigo-950/30 p-2.5 rounded-lg border border-indigo-200/50">
                        {notes[lesson.id]}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t">
                <Button variant="outline" size="sm" onClick={() => setSelectedResource(null)}>
                  Close
                </Button>
                <Button size="sm" onClick={handlePrintNotes}>
                  <Printer className="mr-1.5 h-3.5 w-3.5" /> Print / Export PDF
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
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
