"use client";

import Link from "next/link";
import { ArrowRight, GraduationCap } from "lucide-react";
import type { Program } from "@/types";
import { getEducationLevel } from "@/data/education";
import { cn } from "@/lib/utils";

export function ProgramCard({ program }: { program: Program }) {
  const level = getEducationLevel(program.levelId);
  return (
    <Link
      href={`/explore?program=${program.id}`}
      className="group flex h-full flex-col rounded-2xl border bg-card p-5 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-md"
    >
      <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 text-white shadow-md transition-transform group-hover:scale-110">
        <GraduationCap className="h-5 w-5" />
      </div>
      <p className="font-semibold">{program.name}</p>
      <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{program.description}</p>
      <div className="mt-auto flex items-center justify-between pt-3">
        <span className="text-[11px] text-muted-foreground">{level?.shortLabel}</span>
        <span className={cn("flex items-center gap-1 text-xs font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100")}>
          {program.subjectIds.length} subjects <ArrowRight className="h-3 w-3" />
        </span>
      </div>
    </Link>
  );
}
