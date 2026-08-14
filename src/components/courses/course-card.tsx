"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Bookmark, BookOpen, Clock, PlayCircle, Star } from "lucide-react";
import type { Course } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

function TiltCard({ children, disabled }: { children: React.ReactNode; disabled?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [5, -5]), { stiffness: 250, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-5, 5]), { stiffness: 250, damping: 20 });

  if (disabled) return <>{children}</>;

  return (
    <motion.div
      ref={ref}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      onMouseMove={(e) => {
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;
        x.set((e.clientX - rect.left) / rect.width - 0.5);
        y.set((e.clientY - rect.top) / rect.height - 0.5);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      className="perspective-1200 h-full"
    >
      {children}
    </motion.div>
  );
}

export function CourseCard({
  course,
  onToggleBookmark,
}: {
  course: Course;
  onToggleBookmark?: (course: Course) => void;
}) {
  const showTilt = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: no-preference)").matches;

  const card = (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl border bg-card transition-all hover:shadow-lg">
      <div className={cn("relative flex h-32 items-center justify-center bg-gradient-to-br text-white", course.gradient)}>
        <BookOpen className="h-10 w-10 opacity-80 transition-transform group-hover:scale-110" />
        <button
          type="button"
          aria-label={course.bookmarked ? "Remove bookmark" : "Bookmark course"}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggleBookmark?.(course);
          }}
          className={cn(
            "absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/25 text-white backdrop-blur transition-colors hover:bg-black/40",
            course.bookmarked && "text-amber-300",
          )}
        >
          <Bookmark className={cn("h-4 w-4", course.bookmarked && "fill-current")} />
        </button>
        {course.progress > 0 && (
          <Badge className="absolute left-3 top-3 bg-black/25 text-white backdrop-blur">
            {course.progress}% done
          </Badge>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="mb-2 flex items-center gap-2">
          <Badge variant="secondary">{course.difficulty}</Badge>
          <Badge variant="outline">{course.subjectName}</Badge>
        </div>
        <Link href={`/courses/${course.id}`} className="line-clamp-2 font-semibold hover:text-primary">
          {course.title}
        </Link>
        <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{course.description}</p>

        <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {course.durationHours}h</span>
          <span className="flex items-center gap-1"><Star className="h-3 w-3 text-amber-400" /> {course.rating}</span>
          <span className="truncate">{course.instructor}</span>
        </div>

        <div className="mt-4">
          <div className="mb-1 flex justify-between text-xs">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium tabular-nums">{course.progress}%</span>
          </div>
          <Progress value={course.progress} />
        </div>

        <div className="mt-4 flex gap-2">
          <Link
            href={`/learning/${course.id}/next`}
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <PlayCircle className="h-4 w-4" />
            {course.progress > 0 ? "Continue" : "Start"}
          </Link>
          <Link
            href={`/courses/${course.id}`}
            className="inline-flex items-center justify-center rounded-lg border px-3 py-2 text-sm font-medium hover:bg-accent"
          >
            Details
          </Link>
        </div>
      </div>
    </div>
  );

  return <TiltCard disabled={!showTilt}>{card}</TiltCard>;
}
