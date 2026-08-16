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
    <div className="relative h-full w-full select-none">
      <Canvas
        camera={{ position: [0, 3.4, 11.2], fov: 46 }}
        dpr={[1, 2]}
        gl={{ antialias: true, powerPreference: "high-performance" }}
        aria-label="Interactive 3D Revolving Solar System"
      >
        <KnowledgeUniverseScene reducedMotion={reducedMotion} onHover={setHovered} />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          rotateSpeed={0.5}
          enableDamping={true}
          dampingFactor={0.04}
          minPolarAngle={Math.PI / 3.8}
          maxPolarAngle={Math.PI / 2.1}
        />
      </Canvas>

      {hovered && (
        <div className="pointer-events-none absolute bottom-6 left-1/2 w-[90%] max-w-sm -translate-x-1/2 rounded-2xl border border-white/20 bg-black/85 p-4 text-center shadow-2xl backdrop-blur-xl">
          <p className="font-bold text-white text-sm">{hovered.name}</p>
          <p className="mt-1 text-xs text-muted-foreground">{hovered.description}</p>
          <p className="mt-1.5 text-[11px] font-semibold text-primary">Click to explore course</p>
        </div>
      )}

      <div className="pointer-events-none absolute right-4 top-4 hidden rounded-full border border-white/20 bg-black/60 px-3 py-1.5 text-xs text-white/90 backdrop-blur-md sm:flex items-center gap-1.5">
        <span className="h-2 w-2 rounded-full bg-indigo-400 animate-pulse" />
        Drag to rotate
      </div>
    </div>
  );
}
