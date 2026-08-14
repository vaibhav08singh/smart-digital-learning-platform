"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { KnowledgeUniverseScene } from "@/components/3d/knowledge-universe-scene";
import { NAVIGATE_EVENT } from "@/lib/navigation-events";

export interface UniverseNodeInfo {
  id: string;
  name: string;
  description: string;
  href: string;
}

export function UniverseCanvas() {
  const router = useRouter();
  const [hovered, setHovered] = useState<UniverseNodeInfo | null>(null);
  const reducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // R3F's reconciler root has no access to Next's router context,
  // so the 3D scene requests navigation through a custom event.
  useEffect(() => {
    const onNavigate = (e: Event) => {
      const href = (e as CustomEvent<string>).detail;
      if (href) router.push(href);
    };
    window.addEventListener(NAVIGATE_EVENT, onNavigate);
    return () => window.removeEventListener(NAVIGATE_EVENT, onNavigate);
  }, [router]);

  return (
    <div className="relative h-full w-full">
      <Canvas
        camera={{ position: [0, 2.5, 13.5], fov: 48 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, powerPreference: "high-performance" }}
        aria-label="Interactive 3D Solar System"
      >
        <KnowledgeUniverseScene reducedMotion={reducedMotion} onHover={setHovered} />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          rotateSpeed={0.8}
          minPolarAngle={Math.PI / 2}
          maxPolarAngle={Math.PI / 2}
        />
      </Canvas>

      {hovered && (
        <div className="pointer-events-none absolute bottom-4 left-1/2 w-[90%] max-w-md -translate-x-1/2 rounded-xl border bg-card/90 p-4 text-center shadow-lg backdrop-blur">
          <p className="font-semibold">{hovered.name}</p>
          <p className="mt-1 text-sm text-muted-foreground">{hovered.description}</p>
          <p className="mt-1 text-xs text-primary">Click to explore</p>
        </div>
      )}

      <p className="pointer-events-none absolute right-3 top-3 hidden rounded-full bg-black/40 px-2.5 py-1 text-[10px] text-white/80 backdrop-blur sm:block">
        Drag to orbit
      </p>
    </div>
  );
}
