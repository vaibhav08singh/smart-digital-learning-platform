"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, GraduationCap, Rocket, Sparkles, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EducationLevelCard } from "@/components/education/education-level-card";
import { DomainCard } from "@/components/education/domain-card";
import { educationLevels, domains } from "@/data/education";
import { updateLevel } from "@/services/student.service";
import type { EducationLevelId } from "@/types";

const goalOptions = [
  { id: "Understand concepts", emoji: "🧠" },
  { id: "Prepare for exams", emoji: "📝" },
  { id: "Improve weak subjects", emoji: "🎯" },
  { id: "Build skills", emoji: "🛠️" },
  { id: "Competitive exam preparation", emoji: "🏆" },
  { id: "University preparation", emoji: "🎓" },
  { id: "Professional learning", emoji: "💼" },
  { id: "Research", emoji: "🔬" },
];

const steps = [
  { title: "What are you currently studying?", subtitle: "Pick your education level — the whole platform adapts to it." },
  { title: "What do you want to learn?", subtitle: "Choose one or more knowledge domains to focus on." },
  { title: "What is your goal?", subtitle: "Tell us why you're learning so we can personalize your path." },
];

const levelGroups = [
  { group: "Class 1–5", range: ["class-1", "class-2", "class-3", "class-4", "class-5"] },
  { group: "Class 6–8", range: ["class-6", "class-7", "class-8"] },
  { group: "Class 9–10", range: ["class-9", "class-10"] },
  { group: "Class 11–12", range: ["class-11", "class-12"] },
  { group: "Undergraduate", range: ["undergraduate"] },
  { group: "BTech", range: ["btech"] },
  { group: "MTech", range: ["postgraduate", "mtech"] },
  { group: "Advanced / Professional", range: ["advanced", "research"] },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [levelId, setLevelId] = useState<EducationLevelId | null>(null);
  const [domainsSelected, setDomainsSelected] = useState<string[]>([]);
  const [goals, setGoals] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canContinue =
    (step === 0 && !!levelId) || (step === 1 && domainsSelected.length > 0) || (step === 2 && goals.length > 0);

  function handleBack() {
    if (step > 0) {
      setStep((s) => s - 1);
    } else {
      if (typeof window !== "undefined" && window.history.length > 1) {
        router.back();
      } else {
        router.push("/dashboard");
      }
    }
  }

  async function finish() {
    if (!levelId || goals.length === 0) return;
    setSaving(true);
    setError(null);
    try {
      await updateLevel(levelId, goals, domainsSelected);
      router.push("/dashboard");
    } catch {
      setError("Something went wrong saving your preferences. Please try again.");
      setSaving(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col justify-between bg-background text-foreground">
      {/* Top Standalone Header */}
      <header className="flex items-center justify-between border-b px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 font-bold text-white shadow-md">
            CZ
          </div>
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
            CodeZen
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-10 sm:px-6">
        {/* Progress */}
        <div className="mb-8 flex items-center justify-center gap-2" aria-label={`Step ${step + 1} of 3`}>
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i === step ? "w-12 bg-primary" : i < step ? "w-6 bg-primary/50" : "w-6 bg-muted"
              }`}
            />
          ))}
          <span className="ml-2 text-sm text-muted-foreground">{step + 1}/3</span>
        </div>

        <motion.div
          key={step}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35 }}
        >
          <div className="mb-8 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 text-white shadow-lg shadow-indigo-500/25">
              {step === 0 ? (
                <GraduationCap className="h-6 w-6" />
              ) : step === 1 ? (
                <Rocket className="h-6 w-6" />
              ) : (
                <Target className="h-6 w-6" />
              )}
            </div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{steps[step].title}</h1>
            <p className="mt-2 text-muted-foreground">{steps[step].subtitle}</p>
          </div>

          {/* Step 1 — education level */}
          {step === 0 && (
            <div className="grid gap-3 sm:grid-cols-2">
              {levelGroups.map((group) => {
                const groupLevels = educationLevels.filter((l) => group.range.includes(l.id));
                const representative = groupLevels[groupLevels.length - 1];
                const groupLevelId = representative?.id as EducationLevelId;
                const isSelected = group.range.includes(levelId ?? "");
                return (
                  <EducationLevelCard
                    key={group.group}
                    level={{
                      ...(representative ?? groupLevels[0]),
                      id: groupLevelId,
                      name: group.group,
                      description: `${groupLevels.length} level${groupLevels.length > 1 ? "s" : ""} · ${
                        representative?.description ?? ""
                      }`,
                    }}
                    selected={isSelected}
                    onSelect={() => setLevelId(groupLevelId)}
                    href={`/explore?level=${groupLevelId}`}
                  />
                );
              })}
            </div>
          )}

          {/* Step 2 — domains */}
          {step === 1 && (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {domains.map((domain) => (
                <DomainCard
                  key={domain.id}
                  domain={domain}
                  selected={domainsSelected.includes(domain.id)}
                  onSelect={() =>
                    setDomainsSelected((prev) =>
                      prev.includes(domain.id) ? prev.filter((d) => d !== domain.id) : [...prev, domain.id],
                    )
                  }
                />
              ))}
            </div>
          )}

          {/* Step 3 — goals */}
          {step === 2 && (
            <div className="grid gap-3 sm:grid-cols-2">
              {goalOptions.map((goal) => {
                const selected = goals.includes(goal.id);
                return (
                  <button
                    key={goal.id}
                    type="button"
                    onClick={() =>
                      setGoals((prev) => (selected ? prev.filter((g) => g !== goal.id) : [...prev, goal.id]))
                    }
                    aria-pressed={selected}
                    className={`flex items-center gap-3 rounded-2xl border bg-card p-4 text-left transition-all hover:border-primary/50 ${
                      selected ? "border-primary ring-2 ring-primary/40" : ""
                    }`}
                  >
                    <span className="text-xl" aria-hidden>
                      {goal.emoji}
                    </span>
                    <span className="flex-1 font-medium">{goal.id}</span>
                    {selected && (
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        <Check className="h-4 w-4" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {error && <p role="alert" className="mt-4 text-center text-sm text-destructive">{error}</p>}

          {/* Navigation */}
          <div className="mt-10 flex items-center justify-between">
            <Button variant="ghost" onClick={handleBack} disabled={saving}>
              <ArrowLeft className="mr-1 h-4 w-4" /> Back
            </Button>
            {step < 2 ? (
              <Button onClick={() => setStep((s) => s + 1)} disabled={!canContinue}>
                Continue <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={finish} disabled={!canContinue || saving}>
                {saving ? (
                  "Setting up…"
                ) : (
                  <>
                    <Sparkles className="mr-1 h-4 w-4" /> Build my dashboard
                  </>
                )}
              </Button>
            )}
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t py-4 text-center text-xs text-muted-foreground">
        CodeZen AI Platform &copy; 2026. Tailored learning paths for every level.
      </footer>
    </div>
  );
}
