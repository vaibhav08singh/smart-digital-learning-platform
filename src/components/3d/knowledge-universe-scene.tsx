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
  orbitRadius: number; // Circular orbit radius around central Sun
  speed: number; // Orbital revolving speed
  initialAngle: number; // Starting angle on circular orbit
  color: string;
  atmosphereColor: string;
  textureType:
    | "sun"
    | "dsa"
    | "webdev"
    | "ai"
    | "cloud"
    | "security"
    | "physics"
    | "maths"
    | "english";
  hasRings?: boolean;
}

// Custom Fresnel Shader for Realistic Atmospheric Scattering Rim Glow
function createAtmosphereMaterial(color: string, coefficient = 0.5, power = 3.5) {
  return new THREE.ShaderMaterial({
    uniforms: {
      color: { value: new THREE.Color(color) },
      coefficient: { value: coefficient },
      power: { value: power },
    },
    vertexShader: `
      varying vec3 vNormal;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying vec3 vNormal;
      uniform vec3 color;
      uniform float coefficient;
      uniform float power;
      void main() {
        float intensity = pow(coefficient - dot(vNormal, vec3(0.0, 0.0, 1.0)), power);
        gl_FragColor = vec4(color, clamp(intensity, 0.0, 1.0));
      }
    `,
    blending: THREE.AdditiveBlending,
    side: THREE.BackSide,
    transparent: true,
    depthWrite: false,
  });
}

// High-Detail Procedural PBR Texture Generators
function createSunTexture(): THREE.CanvasTexture | null {
  if (typeof document === "undefined") return null;
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const grad = ctx.createLinearGradient(0, 0, 0, 512);
  grad.addColorStop(0, "#4a0000");
  grad.addColorStop(0.2, "#cf2a00");
  grad.addColorStop(0.5, "#ff6a00");
  grad.addColorStop(0.8, "#ffaa00");
  grad.addColorStop(1, "#520000");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1024, 512);

  for (let i = 0; i < 350; i++) {
    const x = Math.random() * 1024;
    const y = Math.random() * 512;
    const r = Math.random() * 35 + 8;
    const alpha = Math.random() * 0.45 + 0.15;
    ctx.fillStyle = i % 4 === 0 ? `rgba(255, 255, 200, ${alpha})` : `rgba(255, 120, 0, ${alpha})`;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = "rgba(70, 10, 0, 0.65)";
  for (let i = 0; i < 40; i++) {
    const x = Math.random() * 1024;
    const y = Math.random() * 512;
    const rx = Math.random() * 45 + 12;
    const ry = Math.random() * 20 + 6;
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, Math.random() * Math.PI, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  return texture;
}

function createDSATexture(): THREE.CanvasTexture | null {
  if (typeof document === "undefined") return null;
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  ctx.fillStyle = "#0f0c29";
  ctx.fillRect(0, 0, 1024, 512);

  ctx.fillStyle = "#302b63";
  for (let i = 0; i < 65; i++) {
    const x = Math.random() * 1024;
    const y = Math.random() * 512;
    const r = Math.random() * 80 + 35;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.strokeStyle = "rgba(168, 85, 247, 0.4)";
  ctx.lineWidth = 2.5;
  for (let i = 0; i < 40; i++) {
    ctx.beginPath();
    ctx.moveTo(Math.random() * 1024, Math.random() * 512);
    ctx.lineTo(Math.random() * 1024, Math.random() * 512);
    ctx.stroke();
  }

  ctx.fillStyle = "#c084fc";
  for (let i = 0; i < 80; i++) {
    ctx.beginPath();
    ctx.arc(Math.random() * 1024, Math.random() * 512, Math.random() * 3.5 + 1.5, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  return texture;
}

function createWebDevTexture(): THREE.CanvasTexture | null {
  if (typeof document === "undefined") return null;
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const colors = [
    "#7c2d12",
    "#9a3412",
    "#c2410c",
    "#ea580c",
    "#f97316",
    "#fdba74",
    "#431407",
    "#ea580c",
    "#9a3412",
    "#f97316",
  ];

  const bandHeight = 512 / colors.length;
  colors.forEach((color, idx) => {
    ctx.fillStyle = color;
    ctx.fillRect(0, idx * bandHeight, 1024, bandHeight + 2);
  });

  for (let i = 0; i < 180; i++) {
    const x = Math.random() * 1024;
    const y = Math.random() * 512;
    const rx = Math.random() * 90 + 20;
    const ry = Math.random() * 14 + 4;
    ctx.fillStyle = i % 2 === 0 ? "rgba(255, 237, 213, 0.25)" : "rgba(124, 45, 18, 0.35)";
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, Math.random() * 0.2 - 0.1, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = "#991b1b";
  ctx.beginPath();
  ctx.ellipse(650, 320, 85, 42, -0.1, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#fca5a5";
  ctx.lineWidth = 3;
  ctx.stroke();

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  return texture;
}

function createAITexture(): THREE.CanvasTexture | null {
  if (typeof document === "undefined") return null;
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  ctx.fillStyle = "#2e1065";
  ctx.fillRect(0, 0, 1024, 512);

  ctx.fillStyle = "#701a75";
  for (let i = 0; i < 70; i++) {
    const x = Math.random() * 1024;
    const y = Math.random() * 512;
    const r = Math.random() * 90 + 30;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = "rgba(244, 114, 182, 0.6)";
  for (let i = 0; i < 60; i++) {
    ctx.beginPath();
    ctx.arc(Math.random() * 1024, Math.random() * 512, Math.random() * 8 + 2, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  return texture;
}

function createCloudDevOpsTexture(): THREE.CanvasTexture | null {
  if (typeof document === "undefined") return null;
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const grad = ctx.createLinearGradient(0, 0, 0, 512);
  grad.addColorStop(0, "#0c4a6e");
  grad.addColorStop(0.3, "#0284c7");
  grad.addColorStop(0.6, "#38bdf8");
  grad.addColorStop(1, "#075985");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1024, 512);

  ctx.fillStyle = "rgba(224, 242, 254, 0.4)";
  for (let i = 0; i < 120; i++) {
    const x = Math.random() * 1024;
    const y = Math.random() * 512;
    const rx = Math.random() * 120 + 40;
    const ry = Math.random() * 8 + 2;
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  return texture;
}

function createSecurityTexture(): THREE.CanvasTexture | null {
  if (typeof document === "undefined") return null;
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  ctx.fillStyle = "#18181b";
  ctx.fillRect(0, 0, 1024, 512);

  ctx.fillStyle = "#7f1d1d";
  for (let i = 0; i < 80; i++) {
    const x = Math.random() * 1024;
    const y = Math.random() * 512;
    const r = Math.random() * 70 + 20;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.strokeStyle = "#ef4444";
  ctx.lineWidth = 3;
  for (let i = 0; i < 30; i++) {
    ctx.beginPath();
    ctx.moveTo(Math.random() * 1024, Math.random() * 512);
    ctx.lineTo(Math.random() * 1024, Math.random() * 512);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  return texture;
}

function createPhysicsTexture(): THREE.CanvasTexture | null {
  if (typeof document === "undefined") return null;
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  ctx.fillStyle = "#0f766e";
  ctx.fillRect(0, 0, 1024, 512);

  ctx.fillStyle = "#042f2e";
  for (let i = 0; i < 50; i++) {
    const x = Math.random() * 1024;
    const y = Math.random() * 512;
    const r = Math.random() * 85 + 25;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = "rgba(204, 251, 241, 0.35)";
  for (let i = 0; i < 90; i++) {
    const x = Math.random() * 1024;
    const y = Math.random() * 512;
    ctx.beginPath();
    ctx.arc(x, y, Math.random() * 30 + 10, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  return texture;
}

function createMathsTexture(): THREE.CanvasTexture | null {
  if (typeof document === "undefined") return null;
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  ctx.fillStyle = "#14532d";
  ctx.fillRect(0, 0, 1024, 512);

  ctx.fillStyle = "#22c55e";
  for (let i = 0; i < 70; i++) {
    ctx.beginPath();
    ctx.arc(Math.random() * 1024, Math.random() * 512, Math.random() * 60 + 15, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  return texture;
}

function createEnglishTexture(): THREE.CanvasTexture | null {
  if (typeof document === "undefined") return null;
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  ctx.fillStyle = "#78350f";
  ctx.fillRect(0, 0, 1024, 512);

  ctx.fillStyle = "#f59e0b";
  for (let i = 0; i < 70; i++) {
    ctx.beginPath();
    ctx.arc(Math.random() * 1024, Math.random() * 512, Math.random() * 60 + 15, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  return texture;
}

function createPlanetBumpMap(): THREE.CanvasTexture | null {
  if (typeof document === "undefined") return null;
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  ctx.fillStyle = "#808080";
  ctx.fillRect(0, 0, 512, 256);

  for (let i = 0; i < 120; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 256;
    const r = Math.random() * 25 + 4;
    const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
    grad.addColorStop(0, "#ffffff");
    grad.addColorStop(0.7, "#666666");
    grad.addColorStop(1, "#808080");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  return texture;
}

function createSaturnRingTexture(): THREE.CanvasTexture | null {
  if (typeof document === "undefined") return null;
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const grad = ctx.createRadialGradient(256, 256, 40, 256, 256, 256);
  grad.addColorStop(0, "rgba(0,0,0,0)");
  grad.addColorStop(0.35, "rgba(224, 231, 255, 0.85)");
  grad.addColorStop(0.48, "rgba(56, 189, 248, 0.95)");
  grad.addColorStop(0.55, "rgba(15, 23, 42, 0.1)");
  grad.addColorStop(0.65, "rgba(125, 211, 252, 0.85)");
  grad.addColorStop(0.85, "rgba(56, 189, 248, 0.4)");
  grad.addColorStop(1, "rgba(0,0,0,0)");

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

// Planets revolving around central Sun in concentric circular orbits (compact scaled dimensions)
const COURSE_PLANETS: CoursePlanetData[] = [
  {
    id: "c-codezen-core",
    name: "CodeZen Universal Core",
    shortName: "CodeZen Core",
    subtitle: "Universal Platform",
    description: "AI-powered adaptive learning engine covering all levels.",
    href: "/explore",
    radius: 0.62,
    orbitRadius: 0,
    speed: 0,
    initialAngle: 0,
    color: "#ff5500",
    atmosphereColor: "#ffaa00",
    textureType: "sun",
  },
  {
    id: "c-maths-foundations",
    name: "Mathematics & Geometry",
    shortName: "Maths & Geometry",
    subtitle: "Class 1 - 10",
    description: "Numbers, algebra, vectors, and foundational calculus.",
    href: "/courses/c-quadratic-equations",
    radius: 0.2,
    orbitRadius: 1.4,
    speed: 0.24,
    initialAngle: 0.2,
    color: "#22c55e",
    atmosphereColor: "#4ade80",
    textureType: "maths",
  },
  {
    id: "c-security-crypto",
    name: "Cybersecurity & Cryptography",
    shortName: "Cybersecurity",
    subtitle: "Advanced",
    description: "Encryption, hashing, and zero-trust security architecture.",
    href: "/courses/c-security",
    radius: 0.24,
    orbitRadius: 2.1,
    speed: 0.19,
    initialAngle: 1.6,
    color: "#ef4444",
    atmosphereColor: "#f87171",
    textureType: "security",
  },
  {
    id: "c-dsa-foundations",
    name: "Data Structures & Algorithms",
    shortName: "DSA",
    subtitle: "Undergraduate / BTech",
    description: "Trees, graphs, dynamic programming, and algorithm optimization.",
    href: "/courses/c-dsa-foundations",
    radius: 0.28,
    orbitRadius: 2.8,
    speed: 0.15,
    initialAngle: 3.1,
    color: "#a855f7",
    atmosphereColor: "#c084fc",
    textureType: "dsa",
  },
  {
    id: "c-cloud-devops",
    name: "Cloud Computing & DevOps",
    shortName: "Cloud & DevOps",
    subtitle: "Advanced",
    description: "Docker, Kubernetes, microservices, and CI/CD pipelines.",
    href: "/courses/c-cloud-devops",
    radius: 0.32,
    orbitRadius: 3.5,
    speed: 0.12,
    initialAngle: 4.5,
    color: "#38bdf8",
    atmosphereColor: "#7dd3fc",
    textureType: "cloud",
    hasRings: true,
  },
  {
    id: "c-webdev-fullstack",
    name: "Full-Stack Web Development",
    shortName: "Full-Stack Web Dev",
    subtitle: "Intermediate",
    description: "Modern Next.js, React, Node.js, and cloud deployment.",
    href: "/courses/c-webdev-fullstack",
    radius: 0.34,
    orbitRadius: 4.2,
    speed: 0.095,
    initialAngle: 0.8,
    color: "#f97316",
    atmosphereColor: "#fb923c",
    textureType: "webdev",
  },
  {
    id: "c-deep-learning",
    name: "AI & Neural Networks",
    shortName: "AI & Deep Learning",
    subtitle: "MTech & Research",
    description: "Transformers, PyTorch, backpropagation, and LLM fine-tuning.",
    href: "/courses/c-deep-learning",
    radius: 0.27,
    orbitRadius: 4.9,
    speed: 0.075,
    initialAngle: 2.4,
    color: "#ec4899",
    atmosphereColor: "#f472b6",
    textureType: "ai",
  },
  {
    id: "c-physics-quantum",
    name: "Physics & Optics",
    shortName: "Physics & Optics",
    subtitle: "Class 10 - Undergraduate",
    description: "Light, electromagnetism, optics, and quantum fundamentals.",
    href: "/courses/c-light-reflections",
    radius: 0.21,
    orbitRadius: 5.6,
    speed: 0.055,
    initialAngle: 5.0,
    color: "#14b8a6",
    atmosphereColor: "#2dd4bf",
    textureType: "physics",
  },
];

// Concentric Circular Orbit Rings centered around the Sun (0, 0, 0)
function OrbitRing({ radius }: { radius: number }) {
  const lineObject = useMemo(() => {
    const points: THREE.Vector3[] = [];
    const segments = 128;
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      points.push(new THREE.Vector3(Math.cos(theta) * radius, 0, Math.sin(theta) * radius));
    }
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.2,
    });
    return new THREE.LineLoop(geometry, material);
  }, [radius]);

  return <primitive object={lineObject} />;
}

function SunNode({ planet }: { planet: CoursePlanetData }) {
  const sunTexture = useMemo(() => createSunTexture(), []);
  const bumpMap = useMemo(() => createPlanetBumpMap(), []);
  const coreRef = useRef<THREE.Mesh>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);

  const atmosphereMat = useMemo(
    () => createAtmosphereMaterial(planet.atmosphereColor, 0.65, 3.0),
    [planet.atmosphereColor]
  );

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (coreRef.current) {
      coreRef.current.rotation.y = t * 0.04;
    }
    if (atmosphereRef.current) {
      atmosphereRef.current.scale.setScalar(1.2 + Math.sin(t * 1.8) * 0.02);
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Central Sun / Core Celestial Body at exact center */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[planet.radius, 64, 64]} />
        <meshStandardMaterial
          map={sunTexture || undefined}
          bumpMap={bumpMap || undefined}
          bumpScale={0.06}
          emissive="#ff3300"
          emissiveIntensity={0.65}
          roughness={0.4}
          metalness={0.1}
        />
      </mesh>

      {/* Atmospheric Scattering Rim Glow */}
      <mesh ref={atmosphereRef} material={atmosphereMat}>
        <sphereGeometry args={[planet.radius * 1.16, 48, 48]} />
      </mesh>

      {/* Point light emitting light onto all revolving planets */}
      <pointLight position={[0, 0, 0]} intensity={3.5} color="#ffaa44" distance={30} decay={0.8} />

      {/* CODEZEN Title Positioned Horizontally Above Central Sun */}
      <Html
        position={[0, planet.radius + 0.65, 0]}
        center
        style={{ pointerEvents: "none", whiteSpace: "nowrap", width: "max-content" }}
        distanceFactor={7}
      >
        <div
          className="pointer-events-none select-none text-center"
          style={{ whiteSpace: "nowrap", width: "max-content" }}
        >
          <span className="text-xs sm:text-sm font-extrabold tracking-[0.55em] text-white drop-shadow-[0_0_12px_rgba(255,170,0,0.95)]">
            C O D E Z E N
          </span>
        </div>
      </Html>
    </group>
  );
}

function CoursePlanetNode({
  planet,
  saturnRingTexture,
  bumpMap,
  onHover,
  reducedMotion,
}: {
  planet: CoursePlanetData;
  saturnRingTexture: THREE.CanvasTexture | null;
  bumpMap: THREE.CanvasTexture | null;
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

  const atmosphereMat = useMemo(
    () => createAtmosphereMaterial(planet.atmosphereColor, 0.55, 3.2),
    [planet.atmosphereColor]
  );

  useFrame((_, delta) => {
    // 3D Circular Orbital Revolution around the central Sun
    if (!reducedMotion) {
      angleRef.current += delta * planet.speed;
    }

    const x = Math.cos(angleRef.current) * planet.orbitRadius;
    const z = Math.sin(angleRef.current) * planet.orbitRadius;

    if (groupRef.current) {
      groupRef.current.position.set(x, 0, z);
    }

    // Planet self-rotation
    if (meshRef.current) {
      if (!reducedMotion) {
        meshRef.current.rotation.y += delta * 0.3;
      }
      const targetScale = hovered ? 1.25 : 1;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }
  });

  return (
    <group ref={groupRef}>
      {/* Planet Sphere */}
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
          bumpMap={bumpMap || undefined}
          bumpScale={0.04}
          color={texture ? "#ffffff" : planet.color}
          roughness={0.45}
          metalness={0.15}
          emissive={planet.color}
          emissiveIntensity={hovered ? 0.45 : 0.08}
        />
      </mesh>

      {/* Atmospheric Rim Glow */}
      <mesh ref={atmosphereRef} material={atmosphereMat}>
        <sphereGeometry args={[planet.radius * 1.14, 36, 36]} />
      </mesh>

      {/* Saturn Ring System */}
      {planet.hasRings && (
        <mesh rotation-x={Math.PI * 0.45}>
          <ringGeometry args={[planet.radius * 1.35, planet.radius * 2.3, 64]} />
          <meshBasicMaterial
            map={saturnRingTexture || undefined}
            side={THREE.DoubleSide}
            transparent
            opacity={0.88}
          />
        </mesh>
      )}

      {/* Hover Tooltip */}
      {hovered && (
        <Html
          position={[0, planet.radius + 0.35, 0]}
          center
          style={{ pointerEvents: "none", whiteSpace: "nowrap", width: "max-content" }}
          distanceFactor={8}
        >
          <div
            className="pointer-events-none select-none rounded-xl border border-white/20 bg-black/85 px-3 py-1.5 text-xs font-bold text-white shadow-2xl backdrop-blur-lg"
            style={{ whiteSpace: "nowrap", width: "max-content" }}
          >
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

// Starfield position and color buffers generated once at module load
const STAR_DATA = (() => {
  const count = 1400;
  const pos = new Float32Array(count * 3);
  const col = new Float32Array(count * 3);
  const palette = [
    new THREE.Color("#ffffff"),
    new THREE.Color("#cbd5e1"),
    new THREE.Color("#a78bfa"),
    new THREE.Color("#38bdf8"),
    new THREE.Color("#fde047"),
  ];

  for (let i = 0; i < count; i++) {
    pos[i * 3] = (Math.random() - 0.5) * 38;
    pos[i * 3 + 1] = (Math.random() - 0.5) * 24;
    pos[i * 3 + 2] = (Math.random() - 0.5) * 20 - 2;

    const color = palette[Math.floor(Math.random() * palette.length)];
    col[i * 3] = color.r;
    col[i * 3 + 1] = color.g;
    col[i * 3 + 2] = color.b;
  }
  return { positions: pos, colors: col };
})();

function RealisticStarfield() {
  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(STAR_DATA.positions, 3));
    g.setAttribute("color", new THREE.BufferAttribute(STAR_DATA.colors, 3));
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
      <pointsMaterial
        size={0.035}
        vertexColors
        transparent
        opacity={0.75}
        sizeAttenuation
      />
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
  const sceneGroupRef = useRef<THREE.Group>(null);
  const saturnRingTexture = useMemo(() => createSaturnRingTexture(), []);
  const bumpMap = useMemo(() => createPlanetBumpMap(), []);

  const sunPlanet = useMemo(
    () => COURSE_PLANETS.find((p) => p.textureType === "sun")!,
    []
  );
  const orbitingPlanets = useMemo(
    () => COURSE_PLANETS.filter((p) => p.textureType !== "sun"),
    []
  );

  useFrame((state) => {
    if (sceneGroupRef.current && !reducedMotion) {
      // Gentle mouse parallax
      const targetY = state.pointer.x * 0.15;
      const targetX = -state.pointer.y * 0.08;
      sceneGroupRef.current.rotation.y = THREE.MathUtils.lerp(
        sceneGroupRef.current.rotation.y,
        targetY,
        0.05
      );
      sceneGroupRef.current.rotation.x = THREE.MathUtils.lerp(
        sceneGroupRef.current.rotation.x,
        targetX,
        0.05
      );
    }
  });

  return (
    <>
      <ambientLight intensity={0.25} color="#1e1b4b" />
      <directionalLight position={[10, 12, 12]} intensity={0.8} color="#ffffff" />
      <directionalLight position={[-10, -5, -10]} intensity={0.15} color="#a855f7" />

      <group ref={sceneGroupRef} scale={0.86}>
        {/* Central Sun */}
        <SunNode planet={sunPlanet} />

        {/* Concentric Orbit Rings for Revolving Planets */}
        {orbitingPlanets.map((p) => (
          <OrbitRing key={`ring-${p.id}`} radius={p.orbitRadius} />
        ))}

        {/* Revolving Planets */}
        {orbitingPlanets.map((p) => (
          <CoursePlanetNode
            key={p.id}
            planet={p}
            saturnRingTexture={saturnRingTexture}
            bumpMap={bumpMap}
            onHover={onHover}
            reducedMotion={reducedMotion}
          />
        ))}

        <RealisticStarfield />
      </group>
    </>
  );
}
