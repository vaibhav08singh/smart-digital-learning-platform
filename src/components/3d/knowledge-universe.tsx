"use client";

import dynamic from "next/dynamic";
import { Suspense, useEffect, useState, useSyncExternalStore } from "react";
import { SceneFallback } from "@/components/3d/scene-fallback";

// Canvas + scene are loaded lazily and only on the client.
const UniverseCanvas = dynamic(
  () => import("@/components/3d/universe-canvas").then((m) => m.UniverseCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="bg-mesh flex h-full w-full items-center justify-center text-sm text-muted-foreground">
        Loading universe…
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

export function KnowledgeUniverse({ height = 520 }: { height?: number }) {
  const prefersReducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotion,
    () => false,
  );

  const [use3D, setUse3D] = useState(false);

  // WebGL detection is one-shot and async so the first paint stays SSR-safe (2D).
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setUse3D(webglSupported());
    }, 50);
    return () => window.clearTimeout(timer);
  }, [prefersReducedMotion]);

  const isMobile =
    typeof window !== "undefined" ? window.innerWidth < 768 : false;
  const render3D = use3D && !prefersReducedMotion && !isMobile;

  return (
    <div className="relative w-full overflow-hidden rounded-3xl" style={{ height }}>
      {render3D ? (
        <Suspense fallback={null}>
          <UniverseCanvas />
        </Suspense>
      ) : (
        <SceneFallback height={height} />
      )}
    </div>
  );
}
