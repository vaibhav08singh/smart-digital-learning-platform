"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { HeroSolarSystemScene, NodeInfo } from "@/components/3d/hero-solar-system-scene";
import { NAVIGATE_EVENT } from "@/lib/navigation-events";
import { ArrowRight, Sparkles } from "lucide-react";

export function HeroSolarSystemCanvas() {
  const router = useRouter();
  const [hovered, setHovered] = useState<NodeInfo | null>(null);
  const reducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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
      {/* 3D WebGL Revolving Solar System Canvas */}
      <Canvas
        camera={{ position: [0, 3.4, 11.2], fov: 46 }}
        dpr={[1, 2]}
        gl={{ antialias: true, powerPreference: "high-performance" }}
        aria-label="Interactive 3D Solar System"
      >
        <HeroSolarSystemScene reducedMotion={reducedMotion} onHover={setHovered} />
        <OrbitControls
          enableDamping={true}
          dampingFactor={0.04}
          enableZoom={false}
          enablePan={false}
          rotateSpeed={0.8}
          minPolarAngle={Math.PI / 3.8}
          maxPolarAngle={Math.PI / 2.1}
        />
      </Canvas>

      {/* Top-Right Pill Overlay Indicator */}
      <div className="pointer-events-none absolute right-4 top-4 z-20 flex items-center gap-2 rounded-full border border-white/20 bg-slate-950/60 px-3.5 py-1.5 backdrop-blur-md shadow-lg">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
        </span>
        <span className="text-xs font-semibold tracking-wide text-slate-200">Drag to rotate</span>
      </div>

      {/* Glassmorphic Bottom Hover Info Card Tooltip */}
      {hovered && (
        <div className="pointer-events-auto absolute bottom-6 left-1/2 z-20 w-[92%] max-w-md -translate-x-1/2 rounded-2xl border border-white/20 bg-[#020617]/85 p-4 shadow-2xl backdrop-blur-xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div
                className="h-3 w-3 rounded-full shadow-sm"
                style={{ backgroundColor: hovered.color }}
              />
              <div>
                <h4 className="text-sm font-bold text-white leading-tight">{hovered.name}</h4>
                <p className="text-[11px] font-medium text-slate-400">{hovered.subtitle}</p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-indigo-300">
              <Sparkles className="h-3 w-3" />
              Course Domain
            </span>
          </div>

          <p className="mt-2 text-xs leading-relaxed text-slate-300">{hovered.description}</p>

          <button
            onClick={() => router.push(hovered.href)}
            className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/10 py-2 text-xs font-semibold text-white transition-all hover:bg-white/20 hover:border-white/30 cursor-pointer"
          >
            Click to explore course <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
