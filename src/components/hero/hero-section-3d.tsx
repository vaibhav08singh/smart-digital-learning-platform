"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ChevronRight, Sparkles } from "lucide-react";
import { HeroSolarSystemFallback } from "@/components/3d/hero-solar-system-fallback";

// Client-side dynamic import of 3D Canvas with ssr: false
const HeroSolarSystemCanvas = dynamic(
  () =>
    import("@/components/3d/hero-solar-system-canvas").then(
      (m) => m.HeroSolarSystemCanvas
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center text-sm font-medium text-slate-400">
        <div className="flex items-center gap-3">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
          <span>Initializing 3D Knowledge Universe…</span>
        </div>
      </div>
    ),
  }
);

// Level Navigation Steps
const LEVEL_STEPS = [
  { label: "Class 1", id: "class-1", desc: "Foundational Math & Reading" },
  { label: "Class 5", id: "class-5", desc: "Logic & Elementary Science" },
  { label: "Class 10", id: "class-10", desc: "Board Preparation & STEM" },
  { label: "Class 12", id: "class-12", desc: "Advanced Physics & Math" },
  { label: "Undergrad", id: "undergrad", desc: "Core Computer Science" },
  { label: "BTech", id: "btech", desc: "Software & System Engineering" },
  { label: "MTech", id: "mtech", desc: "Specialized AI & Distributed Systems" },
  { label: "Advanced", id: "advanced", desc: "Quantum & Neural Architectures" },
  { label: "Research", id: "research", desc: "Peer-Reviewed Frontiers & Thesis" },
];

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
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export function HeroSection3D() {
  const router = useRouter();
  const prefersReducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotion,
    () => false
  );

  const [use3D, setUse3D] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<string>("btech");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setUse3D(webglSupported());
    }, 50);
    return () => window.clearTimeout(timer);
  }, []);

  const render3D = use3D && !prefersReducedMotion;

  return (
    <section className="relative min-h-[92vh] w-full overflow-hidden bg-[#020617] text-white flex flex-col justify-between pt-8 pb-12 px-4 sm:px-6 lg:px-8">
      {/* Ambient Radial Deep-Space Backdrop Light Gradients */}
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-gradient-to-b from-indigo-900/25 via-purple-900/15 to-transparent blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 left-10 h-72 w-72 rounded-full bg-fuchsia-600/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-20 right-10 h-80 w-80 rounded-full bg-emerald-500/10 blur-3xl" />

      {/* Grid Pattern Mesh */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle, #ffffff 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      />

      {/* Hero Header CTA Overlay Area */}
      <div className="relative z-20 mx-auto max-w-5xl text-center pt-4">
        {/* Modern Glass Typography Badge */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 backdrop-blur-xl shadow-lg mb-6"
        >
          <Sparkles className="h-4 w-4 text-indigo-400" />
          <span className="text-xs font-bold tracking-wider uppercase text-indigo-200">
            NEXT-GEN AI LEARNING PLATFORM
          </span>
        </motion.div>

        {/* Hero Title */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.1]"
        >
          Master Any Subject in the{" "}
          <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
            CodeZen Universe
          </span>
        </motion.h1>

        {/* Hero Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto mt-4 max-w-2xl text-sm sm:text-base md:text-lg text-slate-300 leading-relaxed font-normal"
        >
          An interactive, AI-powered learning platform tailored for every grade — from primary school mathematics to cutting-edge research.
        </motion.p>

        {/* Hero CTA Controls */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-4"
        >
          {/* Primary Action Button */}
          <Link
            href="/register"
            className="group relative inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-8 py-3.5 text-sm font-bold text-white shadow-[0_0_30px_rgba(99,102,241,0.5)] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(168,85,247,0.7)] cursor-pointer"
          >
            <span>Start learning</span>
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>

          {/* Secondary Action Button */}
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-8 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition-all duration-300 hover:bg-white/15 hover:border-white/40 hover:scale-105 cursor-pointer"
          >
            <span>Explore the universe</span>
          </Link>
        </motion.div>
      </div>

      {/* 3D Revolving Solar System Canvas Container */}
      <div className="relative z-10 my-4 h-[440px] sm:h-[500px] md:h-[540px] w-full max-w-6xl mx-auto rounded-3xl border border-white/10 bg-[#001D29]/40 shadow-2xl backdrop-blur-sm overflow-hidden">
        {render3D ? <HeroSolarSystemCanvas /> : <HeroSolarSystemFallback />}
      </div>

      {/* Bottom Level Navigation Strip */}
      <div className="relative z-20 w-full max-w-6xl mx-auto mt-2">
        {/* Header Text */}
        <p className="text-center text-[11px] font-extrabold uppercase tracking-[0.25em] text-slate-400 mb-3">
          FROM PRIMARY SCHOOL TO THE RESEARCH FRONTIER — CLICK ANY LEVEL TO EXPLORE
        </p>

        {/* Horizontal Responsive Step Badges */}
        <div className="flex w-full items-center justify-between gap-1.5 overflow-x-auto pb-2 scrollbar-none px-1">
          {LEVEL_STEPS.map((step, idx) => {
            const isSelected = selectedLevel === step.id;
            return (
              <div key={step.id} className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => {
                    setSelectedLevel(step.id);
                    router.push(`/courses?level=${step.id}`);
                  }}
                  className={`group relative flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all duration-300 cursor-pointer ${
                    isSelected
                      ? "border border-indigo-400 bg-indigo-500/25 text-white shadow-[0_0_20px_rgba(99,102,241,0.5)] scale-105"
                      : "border border-white/10 bg-white/5 text-slate-300 hover:scale-105 hover:border-purple-400/50 hover:bg-purple-500/15 hover:text-white hover:shadow-[0_0_15px_rgba(168,85,247,0.3)]"
                  }`}
                  title={step.desc}
                >
                  <span
                    className={`h-2 w-2 rounded-full transition-colors ${
                      isSelected
                        ? "bg-indigo-400 shadow-[0_0_8px_#818cf8]"
                        : "bg-slate-500 group-hover:bg-purple-400"
                    }`}
                  />
                  <span>{step.label}</span>
                </button>

                {idx < LEVEL_STEPS.length - 1 && (
                  <ChevronRight className="h-3.5 w-3.5 text-slate-600 shrink-0 hidden sm:block" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
