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
        <Bot className="h-8 w-8 animate-pulse text-primary" />
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

// Subscribes to the reduced-motion media query (no setState in effects).
function subscribeReducedMotion(callback: () => void): () => void {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

function getReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** 2D fallback — an animated gradient orb with orbiting labels. */
function OrbFallback() {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-mesh">
      <div className="relative flex h-28 w-28 items-center justify-center">
        <div className="absolute inset-0 animate-ping rounded-full bg-primary/20" style={{ animationDuration: "2.6s" }} />
        <div className="absolute inset-2 rounded-full bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 opacity-90 blur-[2px]" />
        <div className="absolute inset-5 flex items-center justify-center rounded-full bg-background/40 backdrop-blur">
          <Brain className="h-9 w-9 text-white" />
        </div>
      </div>
      {["Learn", "Ask", "Practice", "Assess", "Improve"].map((label, i) => (
        <span
          key={label}
          className="absolute animate-pulse whitespace-nowrap rounded-full border bg-card/85 px-2 py-0.5 text-[10px] font-medium text-muted-foreground shadow-sm backdrop-blur"
          style={{
            top: `${10 + i * 18}%`,
            right: "6%",
            animationDelay: `${i * 200}ms`,
          }}
        >
          {label}
        </span>
      ))}
      <Sparkles className="absolute left-8 top-6 h-4 w-4 text-primary/50" />
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

  // WebGL detection is one-shot and async so the first paint stays SSR-safe (2D).
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setUse3D(webglSupported());
    }, 80);
    return () => window.clearTimeout(timer);
  }, [prefersReducedMotion]);

  const show3D = use3D && !prefersReducedMotion;

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border bg-mesh" style={{ height }}>
      {show3D ? (
        <Suspense fallback={<OrbFallback />}>
          <AITutorOrbCanvas />
        </Suspense>
      ) : (
        <OrbFallback />
      )}
    </div>
  );
}
