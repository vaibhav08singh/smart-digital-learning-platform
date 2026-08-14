"use client";

import Link from "next/link";
import { CheckCircle2, Clock, PlayCircle } from "lucide-react";
import type { Lesson } from "@/types";
import { cn } from "@/lib/utils";

export function LessonCard({
  lesson,
  topicId,
  completed = false,
}: {
  lesson: Lesson;
  topicId: string;
  completed?: boolean;
}) {
  return (
    <Link
      href={`/learning/${topicId}/${lesson.id}`}
      className={cn(
        "group flex items-center gap-3 rounded-xl border bg-card p-4 transition-all",
        completed ? "border-emerald-500/30" : "hover:border-primary/40 hover:shadow-sm",
      )}
    >
      {completed ? (
        <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />
      ) : (
        <PlayCircle className="h-5 w-5 shrink-0 text-primary" />
      )}
      <div className="min-w-0 flex-1">
        <p className={cn("truncate text-sm font-medium", completed && "text-muted-foreground line-through")}>
          {lesson.order}. {lesson.title}
        </p>
        <p className="flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" /> {lesson.durationMinutes} min
        </p>
      </div>
    </Link>
  );
}
