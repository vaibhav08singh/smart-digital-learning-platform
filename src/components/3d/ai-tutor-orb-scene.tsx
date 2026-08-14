"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";

// ============================================================
// AITutorOrb3D — a floating "AI mind" orb with orbiting
// skill labels. Rendered inside <Canvas>; lightweight.
// ============================================================

const LABELS = ["Learn", "Ask", "Practice", "Assess", "Improve"];

// Per-label orbit angle (index / count * 2π).
const LABEL_ANGLES = LABELS.map((_, i) => (i / LABELS.length) * Math.PI * 2);

function OrbCore({ reducedMotion }: { reducedMotion: boolean }) {
  const core = useRef<THREE.Mesh>(null);
  const wire = useRef<THREE.Mesh>(null);
  const ring = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (reducedMotion) return;
    const t = state.clock.elapsedTime;
    if (core.current) {
      const s = 1 + Math.sin(t * 1.2) * 0.06;
      core.current.scale.setScalar(s);
    }
    if (wire.current) {
      wire.current.rotation.x = t * 0.12;
      wire.current.rotation.y = t * 0.18;
    }
    if (ring.current) {
      ring.current.rotation.x = Math.sin(t * 0.35) * 0.45;
      ring.current.rotation.z = t * 0.25;
    }
  });

  return (
    <group>
      <mesh ref={core}>
        <sphereGeometry args={[0.62, 32, 32]} />
        <meshStandardMaterial
          color="#4f46e5"
          emissive="#6366f1"
          emissiveIntensity={0.55}
          roughness={0.25}
          metalness={0.2}
        />
      </mesh>
      <mesh ref={wire}>
        <icosahedronGeometry args={[1.05, 1]} />
        <meshBasicMaterial color="#8b5cf6" wireframe transparent opacity={0.35} />
      </mesh>
      <mesh ref={ring} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.3, 0.014, 8, 64]} />
        <meshBasicMaterial color="#a78bfa" transparent opacity={0.55} />
      </mesh>
    </group>
  );
}

function SparkleField({ reducedMotion }: { reducedMotion: boolean }) {
  const group = useRef<THREE.Group>(null);

  // Deterministic pseudo-random values so SSR/hydration never differs.
  const sparks = useMemo(() => {
    const hash = (n: number) => {
      const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
      return x - Math.floor(x);
    };
    return Array.from({ length: 26 }, (_, i) => {
      const angle = (i / 26) * Math.PI * 2 + hash(i * 3 + 1) * 0.4;
      const radius = 1.7 + hash(i * 5 + 2) * 0.9;
      return {
        position: [
          Math.cos(angle) * radius,
          (hash(i * 7 + 3) - 0.5) * 1.6,
          Math.sin(angle) * radius,
        ] as [number, number, number],
        size: 0.03 + hash(i * 11 + 4) * 0.05,
        speed: 0.5 + hash(i * 13 + 5) * 0.7,
      };
    });
  }, []);

  useFrame((state) => {
    if (reducedMotion || !group.current) return;
    group.current.rotation.y = state.clock.elapsedTime * 0.1;
    sparks.forEach((spark, i) => {
      const child = group.current?.children[i];
      if (!child) return;
      child.position.y = spark.position[1] + Math.sin(state.clock.elapsedTime * spark.speed + i) * 0.08;
    });
  });

  return (
    <group ref={group}>
      {sparks.map((spark, i) => (
        <mesh key={i} position={spark.position}>
          <sphereGeometry args={[spark.size, 6, 6]} />
          <meshBasicMaterial color="#c4b5fd" transparent opacity={0.75} />
        </mesh>
      ))}
    </group>
  );
}

function OrbitLabels() {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!group.current) return;
    // Labels gently breathe outward.
    const t = state.clock.elapsedTime;
    group.current.children.forEach((child, i) => {
      const base = 2.15;
      const dist = base + Math.sin(t * 0.8 + i) * 0.12;
      const angle = LABEL_ANGLES[i] + t * 0.05;
      child.position.set(Math.cos(angle) * dist, Math.sin(angle * 2 + i) * 0.35, Math.sin(angle) * dist);
    });
  });

  return (
    <group ref={group}>
      {LABELS.map((label) => (
        <Html key={label} center style={{ pointerEvents: "none" }}>
          <span className="whitespace-nowrap rounded-full border bg-card/85 px-2.5 py-1 text-[11px] font-medium text-muted-foreground shadow-sm backdrop-blur">
            {label}
          </span>
        </Html>
      ))}
    </group>
  );
}

export function AITutorOrbScene({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <>
      <ambientLight intensity={0.65} />
      <pointLight position={[3, 4, 4]} intensity={1.4} color="#a78bfa" />
      <pointLight position={[-4, -3, -2]} intensity={0.5} color="#38bdf8" />
      <OrbCore reducedMotion={reducedMotion} />
      <SparkleField reducedMotion={reducedMotion} />
      <OrbitLabels />
    </>
  );
}
