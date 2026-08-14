import Link from "next/link";
import { BookOpen, Sparkles } from "lucide-react";
import { CsSubjectCard } from "@/components/knowledge/cs-subject-card";
import { Button } from "@/components/ui/button";
import {
  csSubjectCategories,
  subjectsInCategory,
} from "@/data/cs-subjects";

export const metadata = {
  title: "Subjects — CS Syllabus Explorer",
  description:
    "Browse all 57 computer science subjects — programming, core CS, development, AI & data, and advanced topics.",
};

export default function SubjectsPage() {
  return (
    <div className="mx-auto max-w-7xl">
      <section className="mb-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Subjects</h1>
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
              The full computer science syllabus. Pick a subject to see its topics, official
              resources, and start learning with the AI tutor.
            </p>
          </div>
          <Button asChild>
            <Link href="/ai-tutor">
              <Sparkles className="h-4 w-4" /> Ask the AI tutor
            </Link>
          </Button>
        </div>
      </section>

      {csSubjectCategories.map((category) => {
        const subjects = subjectsInCategory(category.id);
        if (subjects.length === 0) return null;
        return (
          <section key={category.id} className="mb-10">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 text-white shadow-md">
                <BookOpen className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold tracking-tight">{category.label}</h2>
                <p className="text-xs text-muted-foreground">{category.description}</p>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {subjects.map((subject) => (
                <CsSubjectCard key={subject.id} subject={subject} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
