"use client";

import { useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { requestNavigate } from "@/lib/navigation-events";

interface NodeInfo {
  id: string;
  name: string;
  description: string;
  href: string;
}

interface CoursePlanetData {
  id: string;
  name: string;
  shortName: string;
  subtitle: string;
  description: string;
  href: string;
  radius: number;
  a: number; // Orbit radius X
  b: number; // Orbit radius Z
  speed: number;
  initialAngle: number;
  color: string;
  textureType: "dsa" | "webdev" | "ai" | "cloud" | "security" | "physics" | "maths" | "english";
  hasRings?: boolean;
}

// Star positions generated once at module load
const STAR_POSITIONS = (() => {
  const count = 380;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i += 1) {
    positions[i * 3] = (Math.random() - 0.5) * 34;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 22;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 18 - 2;
  }
  return positions;
})();

function useIsMobile() {
  return typeof window !== "undefined" && window.innerWidth < 768;
}

// Procedural 3D CGI planet textures
function createSunTexture() {
  if (typeof document === "undefined") return null;
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  const grad = ctx.createRadialGradient(256, 256, 10, 256, 256, 256);
  grad.addColorStop(0, "#ffffff");
  grad.addColorStop(0.15, "#fff066");
  grad.addColorStop(0.4, "#ff8c00");
  grad.addColorStop(0.75, "#e63900");
  grad.addColorStop(1, "#800000");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);

  ctx.fillStyle = "rgba(255, 230, 160, 0.35)";
  for (let i = 0; i < 70; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const r = Math.random() * 22 + 4;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  return new THREE.CanvasTexture(canvas);
}

function createDSATexture() {
  if (typeof document === "undefined") return null;
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  ctx.fillStyle = "#1e1b4b";
  ctx.fillRect(0, 0, 512, 256);
  ctx.fillStyle = "#6b21a8";
  for (let i = 0; i < 30; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 256;
    const r = Math.random() * 40 + 15;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.strokeStyle = "rgba(192, 132, 252, 0.6)";
  ctx.lineWidth = 2;
  for (let i = 0; i < 15; i++) {
    ctx.beginPath();
    ctx.moveTo(Math.random() * 512, Math.random() * 256);
    ctx.lineTo(Math.random() * 512, Math.random() * 256);
    ctx.stroke();
  }
  return new THREE.CanvasTexture(canvas);
}

function createWebDevTexture() {
  if (typeof document === "undefined") return null;
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  const bands = ["#ea580c", "#f97316", "#fdba74", "#7c2d12", "#c2410c", "#fed7aa"];
  const h = 256 / bands.length;
  bands.forEach((color, i) => {
    ctx.fillStyle = color;
    ctx.fillRect(0, i * h, 512, h + 1);
  });
  ctx.fillStyle = "#9a3412";
  ctx.beginPath();
  ctx.ellipse(320, 150, 45, 24, 0, 0, Math.PI * 2);
  ctx.fill();
  return new THREE.CanvasTexture(canvas);
}

function createAITexture() {
  if (typeof document === "undefined") return null;
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  ctx.fillStyle = "#4a044e";
  ctx.fillRect(0, 0, 512, 256);
  ctx.fillStyle = "#831843";
  for (let i = 0; i < 25; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 256;
    ctx.beginPath();
    ctx.arc(x, y, Math.random() * 30 + 10, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = "rgba(240, 171, 252, 0.5)";
  for (let i = 0; i < 20; i++) {
    ctx.beginPath();
    ctx.arc(Math.random() * 512, Math.random() * 256, 4, 0, Math.PI * 2);
    ctx.fill();
  }
  return new THREE.CanvasTexture(canvas);
}

function createCloudDevOpsTexture() {
  if (typeof document === "undefined") return null;
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  const bands = ["#0284c7", "#38bdf8", "#7dd3fc", "#0369a1", "#075985", "#bae6fd"];
  const h = 256 / bands.length;
  bands.forEach((color, i) => {
    ctx.fillStyle = color;
    ctx.fillRect(0, i * h, 512, h + 1);
  });
  return new THREE.CanvasTexture(canvas);
}

function createSecurityTexture() {
  if (typeof document === "undefined") return null;
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  ctx.fillStyle = "#450a0a";
  ctx.fillRect(0, 0, 512, 256);
  ctx.fillStyle = "#dc2626";
  for (let i = 0; i < 35; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 256;
    ctx.beginPath();
    ctx.arc(x, y, Math.random() * 28 + 8, 0, Math.PI * 2);
    ctx.fill();
  }
  return new THREE.CanvasTexture(canvas);
}

function createPhysicsTexture() {
  if (typeof document === "undefined") return null;
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  ctx.fillStyle = "#0d9488";
  ctx.fillRect(0, 0, 512, 256);
  ctx.fillStyle = "#10b981";
  for (let i = 0; i < 28; i++) {
    ctx.beginPath();
    ctx.arc(Math.random() * 512, Math.random() * 256, Math.random() * 32 + 12, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = "rgba(204, 251, 241, 0.7)";
  ctx.fillRect(0, 0, 512, 25);
  ctx.fillRect(0, 231, 512, 25);
  return new THREE.CanvasTexture(canvas);
}

function createMathsTexture() {
  if (typeof document === "undefined") return null;
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  ctx.fillStyle = "#064e3b";
  ctx.fillRect(0, 0, 512, 256);
  ctx.fillStyle = "#22c55e";
  for (let i = 0; i < 30; i++) {
    ctx.beginPath();
    ctx.arc(Math.random() * 512, Math.random() * 256, Math.random() * 30 + 10, 0, Math.PI * 2);
    ctx.fill();
  }
  return new THREE.CanvasTexture(canvas);
}

function createEnglishTexture() {
  if (typeof document === "undefined") return null;
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  ctx.fillStyle = "#78350f";
  ctx.fillRect(0, 0, 512, 256);
  ctx.fillStyle = "#f59e0b";
  for (let i = 0; i < 30; i++) {
    ctx.beginPath();
    ctx.arc(Math.random() * 512, Math.random() * 256, Math.random() * 32 + 10, 0, Math.PI * 2);
    ctx.fill();
  }
  return new THREE.CanvasTexture(canvas);
}

function createSaturnRingTexture() {
  if (typeof document === "undefined") return null;
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  const grad = ctx.createRadialGradient(128, 128, 30, 128, 128, 128);
  grad.addColorStop(0, "rgba(0,0,0,0)");
  grad.addColorStop(0.35, "rgba(215, 185, 140, 0.85)");
  grad.addColorStop(0.55, "rgba(120, 95, 65, 0.15)");
  grad.addColorStop(0.75, "rgba(230, 200, 155, 0.9)");
  grad.addColorStop(0.92, "rgba(180, 150, 110, 0.4)");
  grad.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 256);
  return new THREE.CanvasTexture(canvas);
}

// Map actual project course data directly to 3D course planets
const COURSE_PLANETS: CoursePlanetData[] = [
  {
    id: "c-dsa-foundations",
    name: "Data Structures & Algorithms",
    shortName: "Data Structures",
    subtitle: "Advanced",
    description: "Trees, graphs & fundamental computer science patterns.",
    href: "/courses/c-dsa-foundations",
    radius: 0.38,
    a: 2.2,
    b: 2.2,
    speed: 0.18,
    initialAngle: 0.4,
    color: "#a855f7",
    textureType: "dsa",
  },
  {
    id: "c-webdev-fullstack",
    name: "Full-Stack Web Development",
    shortName: "Full-Stack Web Dev",
    subtitle: "Intermediate",
    description: "From React hooks to production cloud deployments.",
    href: "/courses/c-webdev-fullstack",
    radius: 0.52,
    a: 3.4,
    b: 3.4,
    speed: 0.14,
    initialAngle: 2.1,
    color: "#f97316",
    textureType: "webdev",
  },
  {
    id: "c-deep-learning",
    name: "Advanced Neural Networks",
    shortName: "AI & Neural Networks",
    subtitle: "Expert",
    description: "Backpropagation to attention & modern AI architectures.",
    href: "/courses/c-deep-learning",
    radius: 0.44,
    a: 4.6,
    b: 4.6,
    speed: 0.10,
    initialAngle: 4.1,
    color: "#ec4899",
    textureType: "ai",
  },
  {
    id: "c-cloud-devops",
    name: "Cloud & DevOps Essentials",
    shortName: "Cloud & DevOps",
    subtitle: "Advanced",
    description: "Docker, Kubernetes & modern CI/CD infrastructure.",
    href: "/courses/c-cloud-devops",
    radius: 0.46,
    a: 5.8,
    b: 5.8,
    speed: 0.075,
    initialAngle: 1.2,
    color: "#0284c7",
    textureType: "cloud",
    hasRings: true,
  },
  {
    id: "c-security",
    name: "Cybersecurity: Cryptography",
    shortName: "Cybersecurity",
    subtitle: "Advanced",
    description: "Encryption, hashing & secure network architecture.",
    href: "/courses/c-security",
    radius: 0.35,
    a: 7.0,
    b: 7.0,
    speed: 0.055,
    initialAngle: 3.5,
    color: "#ef4444",
    textureType: "security",
  },
  {
    id: "c-light-reflections",
    name: "Light & Reflection",
    shortName: "Physics & Light",
    subtitle: "Beginner",
    description: "How light travels, shadows & optical physics.",
    href: "/courses/c-light-reflections",
    radius: 0.28,
    a: 8.2,
    b: 8.2,
    speed: 0.04,
    initialAngle: 5.3,
    color: "#14b8a6",
    textureType: "physics",
  },
  {
    id: "c-quadratic-equations",
    name: "Quadratic Equations Masterclass",
    shortName: "Quadratic Equations",
    subtitle: "Intermediate",
    description: "Factorisation, quadratic formula & roots of equations.",
    href: "/courses/c-quadratic-equations",
    radius: 0.32,
    a: 9.4,
    b: 9.4,
    speed: 0.028,
    initialAngle: 0.8,
    color: "#84cc16",
    textureType: "maths",
  },
  {
    id: "c-english-class5",
    name: "English Grammar Foundations",
    shortName: "English Grammar",
    subtitle: "Beginner",
    description: "Sentence building, parts of speech & literacy skills.",
    href: "/courses/c-english-class5",
    radius: 0.26,
    a: 10.6,
    b: 10.6,
    speed: 0.02,
    initialAngle: 2.8,
    color: "#f59e0b",
    textureType: "english",
  },
];

function OrbitLine({ a, b }: { a: number; b: number }) {
  const lineObject = useMemo(() => {
    const points: THREE.Vector3[] = [];
    const segments = 128;
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      points.push(new THREE.Vector3(Math.cos(theta) * a, 0, Math.sin(theta) * b));
    }
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.14,
    });
    return new THREE.LineLoop(geometry, material);
  }, [a, b]);

  return <primitive object={lineObject} />;
}

function SunNode() {
  const sunTexture = useMemo(() => createSunTexture(), []);
  const coreRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (coreRef.current) {
      coreRef.current.rotation.y = t * 0.06;
    }
    if (glowRef.current) {
      glowRef.current.scale.setScalar(1.22 + Math.sin(t * 2.2) * 0.04);
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Sun Core */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.78, 48, 48]} />
        <meshBasicMaterial map={sunTexture || undefined} color="#ff9900" />
      </mesh>

      {/* Sun Glow Aura */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.92, 32, 32]} />
        <meshBasicMaterial color="#ff7700" transparent opacity={0.28} side={THREE.BackSide} />
      </mesh>

      <pointLight position={[0, 0, 0]} intensity={2.8} color="#ffaa33" distance={30} decay={1} />

      {/* CODEZEN Title */}
      <Html position={[0, 1.4, 0]} center style={{ pointerEvents: "none" }} distanceFactor={8}>
        <div className="pointer-events-none whitespace-nowrap text-sm font-extrabold tracking-[0.45em] text-white drop-shadow-[0_2px_12px_rgba(255,140,0,0.95)]">
          C O D E Z E N
        </div>
      </Html>
    </group>
  );
}

function CoursePlanetNode({
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

  const texture = useMemo(() => {
    switch (planet.textureType) {
      case "dsa":
        return createDSATexture();
      case "webdev":
        return createWebDevTexture();
      case "ai":
        return createAITexture();
      case "cloud":
        return createCloudDevOpsTexture();
      case "security":
        return createSecurityTexture();
      case "physics":
        return createPhysicsTexture();
      case "maths":
        return createMathsTexture();
      case "english":
        return createEnglishTexture();
      default:
        return null;
    }
  }, [planet.textureType]);

  useFrame((_, delta) => {
    if (!reducedMotion) {
      angleRef.current += delta * planet.speed;
    }
    const x = Math.cos(angleRef.current) * planet.a;
    const z = Math.sin(angleRef.current) * planet.b;

    if (groupRef.current) {
      groupRef.current.position.set(x, 0, z);
    }
    if (meshRef.current) {
      if (!reducedMotion) {
        meshRef.current.rotation.y += delta * 0.25;
      }
      const targetScale = hovered ? 1.35 : 1;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }
    if (atmosphereRef.current) {
      const targetScale = hovered ? 1.45 : 1.08;
      atmosphereRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }
  });

  return (
    <group ref={groupRef}>
      {/* Realistic Planet Sphere */}
      <mesh
        ref={meshRef}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          onHover({
            id: planet.id,
            name: planet.name,
            description: planet.description,
            href: planet.href,
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
          map={texture || undefined}
          color={texture ? "#ffffff" : planet.color}
          roughness={0.55}
          metalness={0.15}
          emissive={planet.color}
          emissiveIntensity={hovered ? 0.6 : 0.12}
        />
      </mesh>

      {/* Atmospheric Rim Glow */}
      <mesh ref={atmosphereRef}>
        <sphereGeometry args={[planet.radius * 1.08, 32, 32]} />
        <meshBasicMaterial
          color={planet.color}
          transparent
          opacity={hovered ? 0.35 : 0.15}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Saturn Rings */}
      {planet.hasRings && (
        <mesh rotation-x={Math.PI * 0.45}>
          <ringGeometry args={[planet.radius * 1.3, planet.radius * 2.3, 64]} />
          <meshBasicMaterial
            map={saturnRingTexture || undefined}
            color="#e2c8a0"
            side={THREE.DoubleSide}
            transparent
            opacity={0.8}
          />
        </mesh>
      )}

      {/* Course Name Label — Revealed ONLY on Cursor Hover */}
      {hovered && (
        <Html position={[0, planet.radius + 0.38, 0]} center style={{ pointerEvents: "none" }} distanceFactor={9}>
          <div className="pointer-events-none whitespace-nowrap rounded-lg border border-primary/40 bg-card/95 px-3 py-1.5 text-xs font-bold text-white shadow-xl backdrop-blur-md">
            <div>{planet.name}</div>
            <div className="mt-0.5 text-[10px] font-normal text-muted-foreground">
              {planet.subtitle} · Click to explore
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}

function DeepSpaceStarfield() {
  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(STAR_POSITIONS, 3));
    return g;
  }, []);

  const ref = useRef<THREE.Points>(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.getElapsedTime() * 0.005;
    }
  });

  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial size={0.04} color="#a78bfa" transparent opacity={0.6} sizeAttenuation />
    </points>
  );
}

export function KnowledgeUniverseScene({
  reducedMotion,
  onHover,
}: {
  reducedMotion: boolean;
  onHover: (info: NodeInfo | null) => void;
}) {
  const isMobile = useIsMobile();
  const sceneGroupRef = useRef<THREE.Group>(null);
  const saturnRingTexture = useMemo(() => createSaturnRingTexture(), []);

  // Filter planets on mobile for performance & clarity
  const activePlanets = useMemo(() => {
    return isMobile ? COURSE_PLANETS.filter((_, i) => i % 2 === 0) : COURSE_PLANETS;
  }, [isMobile]);

  useFrame((state) => {
    if (sceneGroupRef.current && !reducedMotion) {
      // Interactive mouse parallax depth shift (horizontal left/right only)
      const targetY = state.pointer.x * 0.35;
      sceneGroupRef.current.rotation.y = THREE.MathUtils.lerp(
        sceneGroupRef.current.rotation.y,
        targetY,
        0.05
      );
      sceneGroupRef.current.rotation.x = 0;
    }
  });

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 10]} intensity={0.6} color="#ffffff" />

      <group ref={sceneGroupRef} scale={0.88}>
        <SunNode />

        {/* Render Orbit Lines */}
        {activePlanets.map((p) => (
          <OrbitLine key={`orbit-${p.id}`} a={p.a} b={p.b} />
        ))}

        {/* Render Orbiting Course Planets */}
        {activePlanets.map((p) => (
          <CoursePlanetNode
            key={p.id}
            planet={p}
            saturnRingTexture={saturnRingTexture}
            onHover={onHover}
            reducedMotion={reducedMotion}
          />
        ))}

        <DeepSpaceStarfield />
      </group>
    </>
  );
}
