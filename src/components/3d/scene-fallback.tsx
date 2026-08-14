"use client";

import { useRouter } from "next/navigation";
import { domains } from "@/data/education";
import { educationLevels } from "@/data/education";

// ============================================================
// 2D fallback for the Knowledge Universe.
// Used when WebGL is unavailable or reduced motion is preferred.
// Fully accessible and clickable — 3D is never required.
// ============================================================

export function SceneFallback({ height = 480 }: { height?: number }) {
  const router = useRouter();
  const ringDomains = domains.filter((d) => d.subjectIds.length > 0);
  const pathLevels = educationLevels.filter((l) =>
    ["class-1", "class-5", "class-10", "class-12", "undergraduate", "btech", "mtech", "advanced", "research"].includes(l.id),
  );

  return (
    <div
      className="bg-mesh flex w-full flex-col items-center justify-center gap-6 overflow-hidden rounded-3xl border px-4 py-10"
      style={{ minHeight: height }}
      role="group"
      aria-label="Knowledge Universe (2D view). Select a domain or education level to explore."
    >
      <button
        type="button"
        onClick={() => router.push("/explore")}
        className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-sm font-bold text-white shadow-lg shadow-indigo-500/30 transition-transform hover:scale-105"
      >
        CODEZEN
      </button>

      <div className="flex flex-wrap items-center justify-center gap-2">
        {ringDomains.map((d) => (
          <button
            key={d.id}
            type="button"
            onClick={() => router.push(`/explore?domain=${d.id}`)}
            className="rounded-full border bg-card px-3 py-1.5 text-xs font-medium transition-colors hover:border-primary hover:text-primary"
            title={d.description}
          >
            {d.name}
          </button>
        ))}
      </div>

      <div className="w-full max-w-2xl">
        <p className="mb-2 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Education journey
        </p>
        <div className="flex flex-wrap items-center justify-center gap-1.5">
          {pathLevels.map((level, i) => (
            <div key={level.id} className="flex items-center gap-1.5">
              {i > 0 && <span className="text-muted-foreground">→</span>}
              <button
                type="button"
                onClick={() => router.push(`/explore?level=${level.id}`)}
                className="rounded-md border bg-card px-2.5 py-1 text-xs font-medium transition-colors hover:border-primary hover:text-primary"
              >
                {level.shortLabel}
              </button>
            </div>
          ))}
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        Interactive 3D mode is disabled — this accessible 2D view works everywhere.
      </p>
    </div>
  );
}
