import Link from "next/link";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({
  href = "/",
  className,
  compact = false,
}: {
  href?: string;
  className?: string;
  compact?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn("group flex items-center gap-2", className)}
      aria-label="CodeZen home"
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 text-white shadow-lg shadow-indigo-500/30 transition-transform group-hover:scale-105">
        <Sparkles className="h-4 w-4" />
      </span>
      {!compact && (
        <span className="text-lg font-bold tracking-tight">
          Code<span className="text-gradient">Zen</span>
        </span>
      )}
    </Link>
  );
}
