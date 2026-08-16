"use client";

import { useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html, Text } from "@react-three/drei";
import * as THREE from "three";
import { requestNavigate } from "@/lib/navigation-events";

export interface NodeInfo {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  href: string;
  color: string;
}

export interface CoursePlanetData {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  href: string;
  radius: number;
  a: number; // Orbit radius X
  b: number; // Orbit radius Z
  speed: number; // Angular orbital velocity
  initialAngle: number;
  color: string;
  textureType: "dsa" | "webdev" | "ai" | "cloud" | "physics" | "maths";
  hasRings?: boolean;
}

export const SOLAR_PLANETS: CoursePlanetData[] = [
  {
    id: "maths",
    name: "Mathematics",
    subtitle: "Algebra, Calculus & Logic",
    description: "Master foundational & advanced mathematical principles from elementary to research.",
    href: "/courses?domain=mathematics",
    radius: 0.30,
    a: 2.6,
    b: 2.4,
    speed: 0.42,
    initialAngle: 0.3,
    color: "#10B981", // Emerald
    textureType: "maths",
  },
  {
    id: "computer-science",
    name: "Computer Science",
    subtitle: "Algorithms & Data Structures",
    description: "Build robust software systems, master algorithms, and software design principles.",
    href: "/courses?domain=cs",
    radius: 0.36,
    a: 3.8,
    b: 3.5,
    speed: 0.32,
    initialAngle: 1.9,
    color: "#6366F1", // Electric Indigo
    textureType: "dsa",
  },
  {
    id: "ai",
    name: "Artificial Intelligence",
    subtitle: "Neural Nets & Machine Learning",
    description: "Explore deep learning models, LLMs, computer vision, and autonomous agents.",
    href: "/courses?domain=ai",
    radius: 0.40,
    a: 5.1,
    b: 4.7,
    speed: 0.26,
    initialAngle: 3.5,
    color: "#EC4899", // Magenta
    textureType: "ai",
    hasRings: true,
  },
  {
    id: "engineering",
    name: "Engineering & Cloud",
    subtitle: "DevOps & Microservices",
    description: "Deploy scalable cloud architectures, containerized microservices, and networks.",
    href: "/courses?domain=engineering",
    radius: 0.35,
    a: 6.3,
    b: 5.8,
    speed: 0.20,
    initialAngle: 4.8,
    color: "#8B5CF6", // Violet
    textureType: "cloud",
  },
  {
    id: "physics",
    name: "Physics & Quantum",
    subtitle: "Quantum Mechanics & Light",
    description: "Dive into quantum theory, theoretical physics, mechanics, and computational modeling.",
    href: "/courses?domain=physics",
    radius: 0.33,
    a: 7.5,
    b: 6.9,
    speed: 0.16,
    initialAngle: 0.8,
    color: "#06B6D4", // Cyan
    textureType: "physics",
  },
  {
    id: "research",
    name: "Advanced Research",
    subtitle: "Frontier Innovations & Papers",
    description: "Peer-reviewed publications, PhD thesis topics, and state-of-the-art AI frontiers.",
    href: "/courses?domain=research",
    radius: 0.44,
    a: 8.8,
    b: 8.1,
    speed: 0.12,
    initialAngle: 2.6,
    color: "#F59E0B", // Amber / Gold
    textureType: "webdev",
    hasRings: true,
  },
];

// Module-level Starfield Positions Buffer
const STAR_POSITIONS = (() => {
  const count = 500;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i += 1) {
    positions[i * 3] = (Math.random() - 0.5) * 40;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 26;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 22 - 3;
  }
  return positions;
})();

// Helper Canvas Procedural Textures
function createSunTexture() {
  if (typeof document === "undefined") return null;
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const grad = ctx.createLinearGradient(0, 0, 0, 512);
  grad.addColorStop(0, "#4a0000");
  grad.addColorStop(0.2, "#cc3300");
  grad.addColorStop(0.5, "#ff6600");
  grad.addColorStop(0.8, "#ffaa00");
  grad.addColorStop(1, "#660000");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1024, 512);

  ctx.fillStyle = "rgba(255, 230, 150, 0.25)";
  for (let i = 0; i < 400; i++) {
    const x = Math.random() * 1024;
    const y = Math.random() * 512;
    const rx = Math.random() * 28 + 8;
    const ry = Math.random() * 14 + 4;
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, Math.random() * Math.PI, 0, Math.PI * 2);
    ctx.fill();
  }

  return new THREE.CanvasTexture(canvas);
}

function createSaturnRingTexture() {
  if (typeof document === "undefined") return null;
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 64;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const grad = ctx.createLinearGradient(0, 0, 512, 0);
  grad.addColorStop(0.0, "rgba(255,255,255,0)");
  grad.addColorStop(0.15, "rgba(220, 190, 255, 0.75)");
  grad.addColorStop(0.45, "rgba(180, 140, 240, 0.95)");
  grad.addColorStop(0.55, "rgba(20, 10, 40, 0.1)");
  grad.addColorStop(0.70, "rgba(230, 200, 255, 0.85)");
  grad.addColorStop(1.0, "rgba(255,255,255,0)");

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 64);

  return new THREE.CanvasTexture(canvas);
}

// 1. Concentric Elliptical Orbit Ring Line using THREE.Line & primitive
function OrbitLine({ radiusX, radiusZ, color = "#6366F1", opacity = 0.22 }: { radiusX: number; radiusZ: number; color?: string; opacity?: number }) {
  const lineObject = useMemo(() => {
    const pts = [];
    const segments = 128;
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(theta) * radiusX, 0, Math.sin(theta) * radiusZ));
    }
    const geometry = new THREE.BufferGeometry().setFromPoints(pts);
    const material = new THREE.LineBasicMaterial({
      color: new THREE.Color(color),
      transparent: true,
      opacity: opacity,
    });
    return new THREE.Line(geometry, material);
  }, [radiusX, radiusZ, color, opacity]);

  return <primitive object={lineObject} />;
}

// 2. Central Sun Core & 3D Text Mesh "C O D E Z E N"
function CentralSunNode() {
  const coreRef = useRef<THREE.Mesh>(null);
  const corona1Ref = useRef<THREE.Mesh>(null);
  const corona2Ref = useRef<THREE.Mesh>(null);
  const textGroupRef = useRef<THREE.Group>(null);

  const sunTexture = useMemo(() => createSunTexture(), []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (coreRef.current) {
      coreRef.current.rotation.y = t * 0.05;
      const s = 0.94 + Math.sin(t * 2.2) * 0.03;
      coreRef.current.scale.set(s, s, s);
    }
    if (corona1Ref.current) {
      const s = 1.18 + Math.sin(t * 1.6) * 0.04;
      corona1Ref.current.scale.set(s, s, s);
    }
    if (corona2Ref.current) {
      const s = 1.42 + Math.cos(t * 1.2) * 0.05;
      corona2Ref.current.scale.set(s, s, s);
    }
    if (textGroupRef.current) {
      textGroupRef.current.position.y = 1.85 + Math.sin(t * 1.5) * 0.06;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Sun Core Mesh */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.92, 64, 64]} />
        <meshStandardMaterial
          map={sunTexture || undefined}
          emissive="#ff5500"
          emissiveMap={sunTexture || undefined}
          emissiveIntensity={1.75}
          roughness={0.7}
          metalness={0.2}
        />
      </mesh>

      {/* Atmospheric Corona Layer 1 */}
      <mesh ref={corona1Ref}>
        <sphereGeometry args={[1.06, 32, 32]} />
        <meshBasicMaterial color="#ff7700" transparent opacity={0.38} side={THREE.BackSide} />
      </mesh>

      {/* Atmospheric Corona Layer 2 */}
      <mesh ref={corona2Ref}>
        <sphereGeometry args={[1.25, 32, 32]} />
        <meshBasicMaterial color="#a855f7" transparent opacity={0.20} side={THREE.BackSide} />
      </mesh>

      {/* Central Point Light Source */}
      <pointLight position={[0, 0, 0]} intensity={5.5} color="#ffaa55" distance={60} decay={0.8} />

      {/* 3D Floating Title "C O D E Z E N" Floating Directly Above Sun Core */}
      <group ref={textGroupRef} position={[0, 1.85, 0]}>
        <Text
          fontSize={0.44}
          letterSpacing={0.35}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          C O D E Z E N
          <meshBasicMaterial color="#ffffff" toneMapped={false} />
        </Text>
        <Html center position={[0, 0, 0]} style={{ pointerEvents: "none" }} distanceFactor={9}>
          <div className="pointer-events-none whitespace-nowrap text-xs font-black tracking-[0.45em] text-white drop-shadow-[0_0_16px_rgba(255,255,255,0.95)]">
            C O D E Z E N
          </div>
        </Html>
      </group>
    </group>
  );
}

// 3. Revolving Planet Node
function RevolvingPlanetNode({
  planet,
  saturnRingTexture,
  onHover,
  reducedMotion,
}: {
  planet: CoursePlanetData;
  saturnRingTexture: THREE.CanvasTexture | null;
  onHover: (info: NodeInfo | null) => void;
  reducedMotion: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);
  const angleRef = useRef(planet.initialAngle);
  const [hovered, setHovered] = useState(false);

  useFrame((_, delta) => {
    if (!reducedMotion) {
      angleRef.current += delta * planet.speed;
    }

    // Calculate elliptical orbit position around central Sun
    const x = Math.cos(angleRef.current) * planet.a;
    const z = Math.sin(angleRef.current) * planet.b;

    if (groupRef.current) {
      groupRef.current.position.set(x, 0, z);
    }
    if (meshRef.current) {
      if (!reducedMotion) {
        meshRef.current.rotation.y += delta * 0.4;
      }
      const targetScale = hovered ? 1.35 : 1;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.12);
    }
    if (atmosphereRef.current) {
      const targetScale = hovered ? 1.45 : 1.1;
      atmosphereRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.12);
    }
  });

  return (
    <group ref={groupRef}>
      {/* 3D Planet Mesh */}
      <mesh
        ref={meshRef}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          onHover({
            id: planet.id,
            name: planet.name,
            subtitle: planet.subtitle,
            description: planet.description,
            href: planet.href,
            color: planet.color,
          });
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHovered(false);
          onHover(null);
          document.body.style.cursor = "auto";
        }}
        onClick={(e) => {
          e.stopPropagation();
          requestNavigate(planet.href);
        }}
      >
        <sphereGeometry args={[planet.radius, 48, 48]} />
        <meshStandardMaterial
          color={planet.color}
          roughness={0.4}
          metalness={0.2}
          emissive={planet.color}
          emissiveIntensity={hovered ? 0.9 : 0.35}
        />
      </mesh>

      {/* Planet Rayleigh Atmospheric Glow Shell */}
      <mesh ref={atmosphereRef}>
        <sphereGeometry args={[planet.radius * 1.1, 32, 32]} />
        <meshBasicMaterial color={planet.color} transparent opacity={hovered ? 0.65 : 0.3} side={THREE.BackSide} />
      </mesh>

      {/* Planetary Saturn Rings if applicable */}
      {planet.hasRings && (
        <mesh rotation-x={Math.PI * 0.42}>
          <ringGeometry args={[planet.radius * 1.38, planet.radius * 2.3, 48]} />
          <meshBasicMaterial
            map={saturnRingTexture || undefined}
            color={planet.color}
            side={THREE.DoubleSide}
            transparent
            opacity={0.8}
          />
        </mesh>
      )}

      {/* 3D Glassmorphic Hover Card Badge above planet */}
      {hovered && (
        <Html position={[0, planet.radius + 0.4, 0]} center style={{ pointerEvents: "none" }} distanceFactor={9}>
          <div className="pointer-events-none whitespace-nowrap rounded-lg border border-white/20 bg-[#020617]/90 px-3 py-1.5 text-xs font-semibold text-white shadow-2xl backdrop-blur-xl">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: planet.color }} />
              <span>{planet.name}</span>
            </div>
            <div className="mt-0.5 text-[10px] text-slate-300 font-normal">
              {planet.subtitle} · Click to explore
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}

// Deep Space Ambient Particle Starfield
function DeepSpaceStarfield() {
  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(STAR_POSITIONS, 3));
    return g;
  }, []);

  const ref = useRef<THREE.Points>(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.getElapsedTime() * 0.003;
    }
  });

  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial size={0.045} color="#c084fc" transparent opacity={0.6} sizeAttenuation />
    </points>
  );
}

export function HeroSolarSystemScene({
  reducedMotion,
  onHover,
}: {
  reducedMotion: boolean;
  onHover: (info: NodeInfo | null) => void;
}) {
  const sceneRef = useRef<THREE.Group>(null);
  const saturnRingTexture = useMemo(() => createSaturnRingTexture(), []);

  useFrame((state) => {
    if (sceneRef.current && !reducedMotion) {
      const targetY = state.pointer.x * 0.25;
      sceneRef.current.rotation.y = THREE.MathUtils.lerp(sceneRef.current.rotation.y, targetY, 0.05);
    }
  });

  return (
    <>
      <ambientLight intensity={0.25} color="#94a3b8" />

      <group ref={sceneRef} scale={0.96}>
        {/* Central Sun Core & 3D Title "C O D E Z E N" */}
        <CentralSunNode />

        {/* Orbit Rings */}
        {SOLAR_PLANETS.map((p) => (
          <OrbitLine key={`ring-${p.id}`} radiusX={p.a} radiusZ={p.b} color={p.color} />
        ))}

        {/* Revolving Planets */}
        {SOLAR_PLANETS.map((p) => (
          <RevolvingPlanetNode
            key={p.id}
            planet={p}
            saturnRingTexture={saturnRingTexture}
            onHover={onHover}
            reducedMotion={reducedMotion}
          />
        ))}

        {/* Ambient Deep Space Stars */}
        <DeepSpaceStarfield />
      </group>
    </>
  );
}
