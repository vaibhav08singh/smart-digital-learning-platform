"use client";

import Link from "next/link";
import { ArrowRight, GraduationCap } from "lucide-react";
import type { EducationLevel } from "@/types";
import { cn } from "@/lib/utils";

export function EducationLevelCard({
  level,
  selected,
  onSelect,
  href,
}: {
  level: EducationLevel;
  selected?: boolean;
  onSelect?: (level: EducationLevel) => void;
  href?: string;
}) {
  const inner = (
    <div
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-2xl border bg-card p-5 transition-all",
        selected
          ? "border-primary ring-2 ring-primary/40 shadow-lg"
          : "hover:-translate-y-1 hover:shadow-md",
      )}
      onClick={onSelect ? () => onSelect(level) : undefined}
      role={onSelect ? "button" : undefined}
      tabIndex={onSelect ? 0 : undefined}
      aria-pressed={selected}
      onKeyDown={
        onSelect
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSelect(level);
              }
            }
          : undefined
      }
    >
      <div className={cn("absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r", level.gradient)} />
      <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-md transition-transform group-hover:scale-110">
        <GraduationCap className="h-5 w-5" />
      </div>
      <p className="font-semibold">{level.name}</p>
      <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{level.description}</p>
      <div className="mt-3 flex items-center gap-1 text-xs font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
        Explore <ArrowRight className="h-3 w-3" />
      </div>
    </div>
  );

  if (href && !onSelect) {
    return <Link href={href} className="block h-full">{inner}</Link>;
  }
  return inner;
}
