"use client";

import dynamic from "next/dynamic";
import { Suspense, useEffect, useState, useSyncExternalStore } from "react";
import { Bot, Brain, Sparkles } from "lucide-react";

// Canvas + scene load lazily and only on the client.
const AITutorOrbCanvas = dynamic(
  () => import("./ai-tutor-orb-canvas").then((m) => m.AITutorOrbCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="bg-mesh flex h-full w-full items-center justify-center">
        <Bot className="h-5 w-5 animate-pulse text-indigo-400" />
      </div>
    ),
  },
);

function webglSupported(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch {
    return false;
  }
}

function subscribeReducedMotion(callback: () => void): () => void {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

function getReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** 2D fallback — compact icon for small headers, animated orb for hero/empty state. */
function OrbFallback({ height = 200 }: { height?: number }) {
  if (height <= 60) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white shadow-inner">
        <Bot className="h-5 w-5" />
      </div>
    );
  }

  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-mesh">
      <div className="relative flex h-28 w-28 items-center justify-center">
        <div className="absolute inset-0 animate-ping rounded-full bg-indigo-500/20" style={{ animationDuration: "2.6s" }} />
        <div className="absolute inset-2 rounded-full bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 opacity-90 blur-[2px]" />
        <div className="absolute inset-5 flex items-center justify-center rounded-full bg-slate-950/50 backdrop-blur">
          <Brain className="h-9 w-9 text-white" />
        </div>
      </div>
      {["Learn", "Ask", "Practice", "Assess", "Improve"].map((label, i) => (
        <span
          key={label}
          className="absolute animate-pulse whitespace-nowrap rounded-full border border-white/10 bg-slate-900/80 px-2.5 py-0.5 text-[10px] font-semibold text-slate-300 shadow-sm backdrop-blur"
          style={{
            top: `${10 + i * 18}%`,
            right: "6%",
            animationDelay: `${i * 200}ms`,
          }}
        >
          {label}
        </span>
      ))}
      <Sparkles className="absolute left-8 top-6 h-4 w-4 text-indigo-400/60" />
    </div>
  );
}

export function AITutorOrb({ height = 200 }: { height?: number }) {
  const [use3D, setUse3D] = useState(false);
  const prefersReducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotion,
    () => false,
  );

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setUse3D(webglSupported());
    }, 80);
    return () => window.clearTimeout(timer);
  }, [prefersReducedMotion]);

  const show3D = use3D && !prefersReducedMotion && height > 60;

  return (
    <div className="relative h-full w-full overflow-hidden" style={{ height }}>
      {show3D ? (
        <Suspense fallback={<OrbFallback height={height} />}>
          <AITutorOrbCanvas />
        </Suspense>
      ) : (
        <OrbFallback height={height} />
      )}
    </div>
  );
}
