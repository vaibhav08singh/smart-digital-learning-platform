"use client";

import { Canvas } from "@react-three/fiber";
import { AITutorOrbScene } from "./ai-tutor-orb-scene";

export function AITutorOrbCanvas() {
  const reducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <Canvas
      camera={{ position: [0, 0.3, 4.4], fov: 50 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
      aria-label="3D AI tutor orb"
    >
      <AITutorOrbScene reducedMotion={reducedMotion} />
    </Canvas>
  );
}
