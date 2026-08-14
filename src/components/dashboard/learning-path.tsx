"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, Lock, PlayCircle, Sparkles } from "lucide-react";
import type { PathNode } from "@/types";
import { cn } from "@/lib/utils";
import { demoPath } from "@/data/student";

const stateConfig: Record<
  PathNode["state"],
  { icon: typeof CheckCircle2; className: string; ring: string }
> = {
  completed: { icon: CheckCircle2, className: "bg-emerald-500/15 text-emerald-500", ring: "border-emerald-500/40" },
  "in-progress": { icon: PlayCircle, className: "bg-primary/15 text-primary", ring: "border-primary/50" },
  recommended: { icon: Sparkles, className: "bg-amber-500/15 text-amber-500", ring: "border-amber-500/40" },
  locked: { icon: Lock, className: "bg-muted text-muted-foreground", ring: "border-border" },
};

export function LearningPath({ nodes = demoPath }: { nodes?: PathNode[] }) {
  return (
    <ol className="relative space-y-2" aria-label="Learning roadmap">
      {nodes.map((node, index) => {
        const config = stateConfig[node.state];
        const Icon = config.icon;
        const isLast = index === nodes.length - 1;
        return (
          <motion.li
            key={node.id}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, delay: index * 0.08 }}
            className="relative flex gap-3"
          >
            {/* connector */}
            {!isLast && (
              <span className="absolute left-5 top-12 h-[calc(100%-1.5rem)] w-0.5 bg-border" aria-hidden />
            )}
            <span
              className={cn(
                "z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2",
                config.className,
                config.ring,
              )}
            >
              <Icon className="h-4 w-4" />
            </span>
            <div
              className={cn(
                "flex-1 rounded-xl border bg-card px-4 py-3",
                node.state === "locked" ? "opacity-60" : "hover:border-primary/40",
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold">{node.label}</p>
                  <p className="text-xs text-muted-foreground">{node.description}</p>
                </div>
                {node.href && node.state !== "locked" ? (
                  <Link
                    href={node.href}
                    className="text-xs font-medium text-primary underline-offset-2 hover:underline"
                  >
                    {node.state === "in-progress" ? "Continue" : "Open"}
                  </Link>
                ) : (
                  <span className="text-xs text-muted-foreground">{node.state}</span>
                )}
              </div>
            </div>
          </motion.li>
        );
      })}
    </ol>
  );
}
