"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { SOLAR_PLANETS } from "@/components/3d/hero-solar-system-scene";

export function HeroSolarSystemFallback() {
  const router = useRouter();
  const [selected, setSelected] = useState(SOLAR_PLANETS[1]);

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center p-6 text-white">
      {/* 2D Orbital Ring System Representation */}
      <div className="relative flex h-[340px] w-full max-w-lg items-center justify-center">
        {/* Sun Core */}
        <div className="relative z-10 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-tr from-amber-500 via-orange-500 to-yellow-300 shadow-[0_0_50px_rgba(245,158,11,0.8)] animate-pulse">
          <span className="text-[10px] font-black tracking-widest text-slate-950">CODEZEN</span>
        </div>

        {/* Orbit Rings & Planet Nodes */}
        {SOLAR_PLANETS.map((planet, idx) => {
          const angle = (idx / SOLAR_PLANETS.length) * Math.PI * 2;
          const radius = 60 + idx * 28;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius * 0.5;

          return (
            <div key={planet.id} className="contents">
              {/* Ring */}
              <div
                className="absolute rounded-full border border-white/10"
                style={{
                  width: `${radius * 2}px`,
                  height: `${radius}px`,
                }}
              />
              {/* Planet Node */}
              <button
                onClick={() => setSelected(planet)}
                className="absolute z-20 flex -translate-x-1/2 -translate-y-1/2 items-center gap-1.5 rounded-full border border-white/20 bg-slate-900/90 px-2.5 py-1 text-xs font-semibold shadow-lg transition-transform hover:scale-110 cursor-pointer"
                style={{
                  left: `calc(50% + ${x}px)`,
                  top: `calc(50% + ${y}px)`,
                  borderColor: planet.color,
                }}
              >
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: planet.color }} />
                <span>{planet.name}</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Selected Info Card */}
      <div className="mt-4 w-full max-w-md rounded-2xl border border-white/20 bg-slate-950/80 p-4 shadow-xl backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full" style={{ backgroundColor: selected.color }} />
            <h4 className="font-bold text-white text-sm">{selected.name}</h4>
          </div>
          <span className="text-[11px] text-slate-400">{selected.subtitle}</span>
        </div>
        <p className="mt-2 text-xs text-slate-300">{selected.description}</p>
        <button
          onClick={() => router.push(selected.href)}
          className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-indigo-600/80 py-2 text-xs font-semibold text-white hover:bg-indigo-600 transition-colors"
        >
          Explore Course <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
