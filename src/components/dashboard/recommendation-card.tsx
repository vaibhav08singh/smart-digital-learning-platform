import Link from "next/link";
import { ArrowUpRight, Bot, BookOpen, Play, Zap } from "lucide-react";
import type { Recommendation } from "@/types";
import { cn } from "@/lib/utils";

const typeConfig: Record<Recommendation["type"], { icon: typeof Play; className: string }> = {
  continue: { icon: Play, className: "bg-primary/15 text-primary" },
  course: { icon: BookOpen, className: "bg-sky-500/15 text-sky-500" },
  practice: { icon: Zap, className: "bg-amber-500/15 text-amber-500" },
  quiz: { icon: Zap, className: "bg-violet-500/15 text-violet-500" },
  "next-topic": { icon: ArrowUpRight, className: "bg-emerald-500/15 text-emerald-500" },
  ai: { icon: Bot, className: "bg-fuchsia-500/15 text-fuchsia-500" },
};

export function RecommendationCard({ recommendation }: { recommendation: Recommendation }) {
  const config = typeConfig[recommendation.type];
  const Icon = config.icon;
  return (
    <Link
      href={recommendation.targetHref}
      className="group flex items-start gap-3 rounded-xl border bg-card p-4 transition-all hover:border-primary/40 hover:shadow-sm"
    >
      <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg", config.className)}>
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold group-hover:text-primary">{recommendation.title}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{recommendation.reason}</p>
      </div>
    </Link>
  );
}
