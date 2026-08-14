"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { saveStudentProfile } from "@/services/auth.service";
import { writeStore } from "@/lib/storage";
import { defaultStudent } from "@/data/student";
import type { EducationLevelId } from "@/types";
import {
  ArrowRight,
  BookOpen,
  Brain,
  Code2,
  Cpu,
  GraduationCap,
  Sparkles,
  Zap,
} from "lucide-react";

interface LiveDemoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DEMO_PERSONAS = [
  {
    id: "btech",
    levelId: "btech",
    title: "BTech 3rd Year — Computer Science",
    institution: "State Institute of Engineering and Technology Nilokheri",
    icon: Code2,
    badge: "Engineering / BTech",
    gradient: "from-violet-500/20 via-purple-500/10 to-indigo-500/20",
    border: "border-purple-500/30",
    color: "text-purple-400",
    subjects: ["Data Structures & Algorithms", "Python Programming", "Operating Systems", "DBMS"],
    goals: ["Master DSA algorithms", "Clear technical interviews", "Build full-stack applications"],
  },
  {
    id: "class-10",
    levelId: "class-10",
    title: "Class 10 — Board Exam Preparation",
    institution: "Model Senior Secondary School",
    icon: BookOpen,
    badge: "Class 10 Boards",
    gradient: "from-amber-500/20 via-yellow-500/10 to-orange-500/20",
    border: "border-amber-500/30",
    color: "text-amber-400",
    subjects: ["Quadratic Equations", "Light & Reflection", "Physics Mechanics"],
    goals: ["Score 95%+ in Class 10 Boards", "Master Maths & Physics step-by-step"],
  },
  {
    id: "class-5",
    levelId: "class-5",
    title: "Class 5 — Primary Foundations",
    institution: "SIET Primary School",
    icon: Sparkles,
    badge: "Primary School",
    gradient: "from-emerald-500/20 via-teal-500/10 to-cyan-500/20",
    border: "border-emerald-500/30",
    color: "text-emerald-400",
    subjects: ["Light & Reflection", "English Grammar", "Basic Science"],
    goals: ["Fun visual science experiments", "Build strong English and Math basics"],
  },
  {
    id: "mtech",
    levelId: "mtech",
    title: "MTech — AI & Deep Learning",
    institution: "IIT Delhi / AI Research Lab",
    icon: Cpu,
    badge: "Postgraduate & Research",
    gradient: "from-pink-500/20 via-rose-500/10 to-purple-500/20",
    border: "border-pink-500/30",
    color: "text-pink-400",
    subjects: ["Advanced Neural Networks", "Transformer Architectures", "Optimization"],
    goals: ["Publish research papers", "Master deep neural network optimization"],
  },
];

export function LiveDemoDialog({ open, onOpenChange }: LiveDemoDialogProps) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  function launchPersona(persona: (typeof DEMO_PERSONAS)[0]) {
    setLoadingId(persona.id);
    const customProfile = {
      ...defaultStudent,
      name: "Demo Learner",
      levelId: persona.levelId as EducationLevelId,
      institution: persona.institution,
      goals: persona.goals,
    };
    saveStudentProfile(customProfile);
    writeStore("codezen:onboarding-complete", true);
    setTimeout(() => {
      onOpenChange(false);
      router.push("/dashboard");
    }, 250);
  }

  function launchDefaultDemo() {
    setLoadingId("default");
    saveStudentProfile(defaultStudent);
    writeStore("codezen:onboarding-complete", true);
    setTimeout(() => {
      onOpenChange(false);
      router.push("/dashboard");
    }, 250);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl border-border/80 bg-background/95 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
        <DialogHeader>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
            <Zap className="h-4 w-4 fill-primary/20 text-primary" /> Live Interactive Demo
          </div>
          <DialogTitle className="text-2xl font-bold tracking-tight sm:text-3xl">
            Choose a Demo Student Profile
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Experience how CodeZen dynamically customizes AI tutors, subjects, courses, and learning paths for any grade or level.
          </DialogDescription>
        </DialogHeader>

        <div className="my-4 grid gap-3 sm:grid-cols-2">
          {DEMO_PERSONAS.map((persona) => {
            const Icon = persona.icon;
            const isLoading = loadingId === persona.id;
            return (
              <div
                key={persona.id}
                onClick={() => launchPersona(persona)}
                className={`group relative flex flex-col justify-between rounded-2xl border bg-gradient-to-br p-5 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${persona.border} ${persona.gradient}`}
              >
                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <div className={`rounded-xl border border-white/10 bg-background/60 p-2.5 shadow-sm ${persona.color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <Badge variant="outline" className="text-[11px] font-semibold">
                      {persona.badge}
                    </Badge>
                  </div>
                  <h3 className="text-base font-bold text-foreground transition-colors group-hover:text-primary">
                    {persona.title}
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-1">
                    📍 {persona.institution}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {persona.subjects.map((sub) => (
                      <span key={sub} className="rounded-md bg-background/60 px-2 py-0.5 text-[10px] font-medium text-foreground/80 border border-border/50">
                        {sub}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between pt-3 border-t border-border/40 text-xs font-semibold text-primary">
                  <span>{isLoading ? "Launching Demo…" : "Launch Live Demo"}</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between pt-2 border-t border-border/60">
          <p className="text-xs text-muted-foreground flex items-center gap-1.5">
            <GraduationCap className="h-4 w-4 text-primary" /> Instant access • No login or credit card required
          </p>
          <Button
            size="default"
            onClick={launchDefaultDemo}
            className="gap-2 font-semibold shadow-lg bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white"
          >
            <Brain className="h-4 w-4" /> Launch Direct Demo <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
