"use client";

import Link from "next/link";
import { ArrowRight, Target } from "lucide-react";
import type { Topic } from "@/types";
import { Badge } from "@/components/ui/badge";

const difficultyColor: Record<string, string> = {
  Beginner: "info",
  Intermediate: "default",
  Advanced: "warning",
  Expert: "destructive",
};

export function TopicCard({ topic }: { topic: Topic }) {
  const lessonCount = topic.lessons.length;
  return (
    <Link
      href={`/explore?topic=${topic.id}`}
      className="group flex h-full flex-col rounded-2xl border bg-card p-5 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-md"
    >
      <div className="mb-3 flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/50 text-accent-foreground">
          <Target className="h-5 w-5" />
        </div>
        <Badge variant={difficultyColor[topic.difficulty] as "info" | "default" | "warning" | "destructive"}>
          {topic.difficulty}
        </Badge>
      </div>
      <p className="font-semibold">{topic.name}</p>
      <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{topic.description}</p>
      <div className="mt-auto flex items-center justify-between pt-3">
        <span className="text-[11px] text-muted-foreground">{lessonCount} lessons</span>
        <span className="flex items-center gap-1 text-xs font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
          Learn <ArrowRight className="h-3 w-3" />
        </span>
      </div>
    </Link>
  );
}
