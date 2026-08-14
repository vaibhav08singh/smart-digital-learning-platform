"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  Bot,
  Brain,
  CheckCircle2,
  ChevronDown,
  Compass,
  GraduationCap,
  Sparkles,
} from "lucide-react";
import { KnowledgeUniverse } from "@/components/3d/knowledge-universe";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MagneticCTA } from "@/components/ui/magnetic-cta";
import { LiveDemoDialog } from "@/components/demo/live-demo-dialog";
import { domains } from "@/data/education";
import { cn } from "@/lib/utils";

const journey = [
  { label: "Class 1", levelId: "class-1" },
  { label: "Class 5", levelId: "class-5" },
  { label: "Class 10", levelId: "class-10" },
  { label: "Class 12", levelId: "class-12" },
  { label: "Undergrad", levelId: "undergraduate" },
  { label: "BTech", levelId: "btech" },
  { label: "MTech", levelId: "mtech" },
  { label: "Advanced", levelId: "advanced" },
  { label: "Research", levelId: "phd" },
];

const features = [
  {
    icon: Compass,
    title: "3D Knowledge Universe",
    description: "Explore every domain — from Mathematics to Research — in one interactive galaxy.",
  },
  {
    icon: GraduationCap,
    title: "Every Level, One Platform",
    description: "Class 1 or MTech? CodeZen adapts content, subjects and difficulty to you.",
  },
  {
    icon: Bot,
    title: "AI Tutor",
    description: "Explain, practice, summarize — your personal learning companion, always on.",
  },
  {
    icon: BarChart3,
    title: "Mastery Analytics",
    description: "Know exactly what you've mastered and what needs practice, in real time.",
  },
];

const cinematicSection = {
  initial: { opacity: 0, y: 36, scale: 0.97 },
  whileInView: { opacity: 1, y: 0, scale: 1 },
  viewport: { once: false, amount: 0.25 },
  transition: { duration: 0.6, ease: "easeOut" as const },
};

function ScrollProgressIndicator() {
  const { scrollYProgress } = useScroll();
  const scaleY = useSpring(scrollYProgress, { stiffness: 200, damping: 25 });

  return (
    <div className="fixed right-0 top-0 bottom-0 z-50 w-1 pointer-events-none hidden sm:block">
      <motion.div
        style={{ scaleY, transformOrigin: "top" }}
        className="h-full w-full bg-gradient-to-b from-indigo-500 via-violet-500 to-fuchsia-500 shadow-[0_0_10px_rgba(139,92,246,0.9)]"
      />
    </div>
  );
}

export default function HomePage() {
  const [demoOpen, setDemoOpen] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroScrollProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroOpacity = useTransform(heroScrollProgress, [0, 0.85], [1, 0.2]);
  const heroScale = useTransform(heroScrollProgress, [0, 0.85], [1, 0.94]);
  const heroY = useTransform(heroScrollProgress, [0, 0.85], [0, -60]);

  return (
    <div className="bg-mesh relative">
      <ScrollProgressIndicator />

      {/* 1. CINEMATIC HERO SECTION */}
      <section
        ref={heroRef}
        className="relative min-h-[calc(100vh-4rem)] w-full overflow-hidden flex flex-col justify-center items-center text-center bg-[#001D29] text-white px-6 py-20"
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0"
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4"
          aria-label="Cinematic background video"
        />

        <motion.div
          style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
          className="relative z-10 flex flex-col items-center justify-center text-center px-6 max-w-7xl mx-auto my-auto"
        >
          <h1
            className="text-5xl sm:text-7xl md:text-8xl leading-[0.95] tracking-[-2.46px] max-w-7xl font-normal text-white animate-fade-rise mx-auto"
            style={{ fontFamily: "'Instrument Serif', serif" }}
          >
            Learn <em className="not-italic text-muted-foreground" style={{ color: "hsl(240 4% 66%)" }}>smarter.</em> Build{" "}
            <em className="not-italic text-muted-foreground" style={{ color: "hsl(240 4% 66%)" }}>better.</em> Shape your future.
          </h1>

          <p
            className="text-muted-foreground text-base sm:text-lg max-w-2xl mt-8 leading-relaxed animate-fade-rise-delay mx-auto tracking-normal"
            style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400, color: "hsl(240 4% 66%)" }}
          >
            Your AI-powered learning companion for courses, coding, personalized guidance, study resources, and smarter learning — all in one place.
          </p>

          <MagneticCTA
            href="/onboarding"
            className="liquid-glass rounded-full px-14 py-5 text-base text-white mt-12 hover:scale-[1.03] cursor-pointer animate-fade-rise-delay-2 inline-flex items-center justify-center gap-2 transition-transform font-medium"
          >
            Start Learning <ArrowRight className="h-4 w-4" />
          </MagneticCTA>
        </motion.div>

        {/* Aesthetic Liquid-Glass Bouncing Scroll Capsule Indicator — Positioned at Absolute Bottom */}
        <motion.div
          style={{ opacity: heroOpacity }}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: [0, 6, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center cursor-pointer group"
          onClick={() => {
            window.scrollTo({ top: window.innerHeight - 70, behavior: "smooth" });
          }}
        >
          <div className="liquid-glass relative flex items-center gap-3 rounded-full border border-white/40 bg-white/10 px-6 py-2.5 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.6)] transition-all duration-300 group-hover:scale-105 group-hover:border-white/80 group-hover:bg-white/20 group-hover:shadow-[0_0_30px_rgba(168,85,247,0.65)]">
            {/* Liquid specular gloss streak */}
            <div className="absolute inset-x-3 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/80 to-transparent pointer-events-none" />
            <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-white drop-shadow-[0_1px_6px_rgba(255,255,255,0.9)]">
              Explore Universe
            </span>
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/25 text-white shadow-inner transition-transform group-hover:scale-110">
              <ChevronDown className="h-4 w-4 stroke-[2.5]" />
            </div>
          </div>
        </motion.div>
      </section>

      {/* 2. EXISTING HOME PAGE CONTENT WITH REPEATABLE SCROLL REVEALS */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 pb-10 pt-16 sm:px-6 sm:pt-24 lg:px-8">
          <motion.div {...cinematicSection} className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border bg-card/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              PS-013 · Smart Digital Learning Platform
            </div>

            <h1 className="mt-6 text-4xl font-extrabold tracking-tight sm:text-6xl">
              One Platform.
              <br />
              <span className="text-gradient">Every Level of Learning.</span>
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-base text-muted-foreground sm:text-lg">
              CodeZen is a universal intelligent learning ecosystem — from Class 1 to advanced
              university and research. Pick your level, explore the knowledge universe, and let
              your learning path evolve with you.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button asChild size="lg">
                <Link href="/onboarding">
                  Start learning <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/explore">Explore the universe</Link>
              </Button>
            </div>
          </motion.div>

          {/* 3D Knowledge Universe / Course Solar System */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 40 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.7, ease: "easeOut" as const }}
            className="mt-12"
          >
            <KnowledgeUniverse height={520} />
          </motion.div>
        </div>
      </section>

      {/* Journey strip */}
      <motion.section {...cinematicSection} className="border-y bg-card/40">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <p className="mb-4 text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            From primary school to the research frontier — click any level to explore
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {journey.map((step, i) => (
              <div key={step.levelId} className="flex items-center gap-2">
                {i > 0 && <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/60" />}
                <Link
                  href={`/explore?level=${step.levelId}`}
                  className={cn(
                    "rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all duration-200 hover:scale-110 hover:border-primary hover:bg-primary/10 hover:text-primary hover:shadow-md cursor-pointer",
                    i >= journey.length - 2
                      ? "border-primary/40 bg-primary/10 text-primary shadow-sm"
                      : "border-border/60 bg-background/60 text-muted-foreground hover:text-foreground"
                  )}
                >
                  {step.label}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Domains */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <motion.div {...cinematicSection} className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            A universe of knowledge
          </h2>
          <p className="mt-3 text-muted-foreground">
            Mathematics to Research — every domain, every stream, every subject.
          </p>
        </motion.div>

        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {domains.map((domain, i) => (
            <motion.div
              key={domain.id}
              initial={{ opacity: 0, y: 24, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.45, delay: i * 0.04, ease: "easeOut" as const }}
            >
              <Link
                href={`/explore?domain=${domain.id}`}
                className="group flex h-full flex-col items-center gap-2 rounded-2xl border bg-card p-5 text-center transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/50 hover:shadow-xl"
              >
                <span
                  className="flex h-11 w-11 items-center justify-center rounded-xl text-white shadow-md transition-transform group-hover:scale-110"
                  style={{ backgroundColor: domain.color }}
                >
                  <Sparkles className="h-5 w-5" />
                </span>
                <span className="text-sm font-semibold">{domain.name}</span>
                <span className="line-clamp-2 text-xs text-muted-foreground">
                  {domain.description}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="border-t bg-card/40">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 28, scale: 0.96 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.5, delay: i * 0.06, ease: "easeOut" as const }}
              >
                <Card className="h-full transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-primary/30">
                  <CardContent className="p-6">
                    <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform hover:scale-110">
                      <feature.icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-semibold">{feature.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Adaptive CTA */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <motion.div
          {...cinematicSection}
          className="relative overflow-hidden rounded-3xl border bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 p-10 text-center text-white sm:p-16 shadow-2xl"
        >
          <Brain className="mx-auto mb-4 h-10 w-10 opacity-80" />
          <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">
            Your dashboard adapts to you — Class 5 or MTech
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-white/80">
            A Class 5 learner sees Science, Maths and English. A BTech learner sees DSA, OS and
            Algorithms. An MTech learner sees deep learning and research. Same platform, same
            magic.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg" variant="secondary">
              <Link href="/onboarding">
                Take the 60-second setup <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              onClick={() => setDemoOpen(true)}
              className="border border-white/30 bg-white/10 text-white hover:bg-white/20 font-semibold shadow-lg"
            >
              View live demo
            </Button>
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-white/70">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4" /> No signup required for demo
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4" /> 18 education levels
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4" /> 15+ knowledge domains
            </span>
          </div>
        </motion.div>
      </section>

      <LiveDemoDialog open={demoOpen} onOpenChange={setDemoOpen} />
    </div>
  );
}
