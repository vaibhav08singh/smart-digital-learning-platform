import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BookMarked, Bot, ExternalLink, GraduationCap, ListChecks, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  csSubjectCategories,
  csSubjects,
  getCsSubject,
  type CsSubjectCategoryId,
} from "@/data/cs-subjects";
import { defaultLearningPath, learningPaths } from "@/data/cs-knowledge";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Subject — CodeZen",
  description: "Subject syllabus, learning path and AI tutor practice.",
};

export function generateStaticParams() {
  return csSubjects.map((s) => ({ id: s.id }));
}

const categoryBadge: Record<CsSubjectCategoryId, "default" | "secondary" | "success" | "warning" | "info"> = {
  programming: "default",
  core: "secondary",
  development: "success",
  "ai-data": "info",
  advanced: "warning",
};

export default async function SubjectPage({ params }: PageProps<"/subjects/[id]">) {
  const { id } = await params;
  const subject = getCsSubject(id);
  if (!subject) notFound();

  const category = csSubjectCategories.find((c) => c.id === subject.category);
  const path = learningPaths[subject.id] ?? defaultLearningPath;
  const related = subject.related.map((rid) => getCsSubject(rid)).filter(Boolean);

  return (
    <div className="mx-auto max-w-5xl">
      <Link
        href="/subjects"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> All subjects
      </Link>

      {/* Hero */}
      <section className="mb-8 overflow-hidden rounded-2xl border bg-card">
        <div className="h-1.5 bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500" />
        <div className="flex flex-col gap-5 p-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 text-white shadow-md">
              <BookMarked className="h-7 w-7" />
            </div>
            <div>
              <div className="mb-1 flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{subject.name}</h1>
                <Badge variant={categoryBadge[subject.category]}>{category?.label}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">{subject.short}</p>
            </div>
          </div>
          <Button asChild className="shrink-0">
            <Link href={`/ai-tutor?prompt=${encodeURIComponent(`Teach me ${subject.name} from scratch`)}`}>
              <Sparkles className="h-4 w-4" /> Ask the AI tutor
            </Link>
          </Button>
        </div>
        <div className="border-t px-6 py-4">
          <p className="text-sm leading-relaxed">{subject.about}</p>
        </div>
      </section>

      {/* Topics + learning path */}
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border bg-card p-6">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold tracking-tight">
            <ListChecks className="h-5 w-5 text-primary" /> Syllabus topics
          </h2>
          <ol className="space-y-2">
            {subject.topics.map((topic, i) => (
              <li key={topic} className="flex items-start gap-3 text-sm">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                  {i + 1}
                </span>
                <span className="pt-0.5">{topic}</span>
              </li>
            ))}
          </ol>
        </section>

        <div className="space-y-6">
          <section className="rounded-2xl border bg-card p-6">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold tracking-tight">
              <GraduationCap className="h-5 w-5 text-primary" /> Learning path
            </h2>
            <ol className="space-y-3">
              {path.map((level) => (
                <li key={level.level} className="rounded-xl border bg-muted/40 p-3">
                  <p className="mb-1 text-sm font-semibold">
                    Level {level.level} — {level.title}
                  </p>
                  <p className="text-xs text-muted-foreground">{level.topics.join(" · ")}</p>
                </li>
              ))}
            </ol>
            <Button asChild variant="outline" size="sm" className="mt-4 w-full">
              <Link href={`/ai-tutor?prompt=${encodeURIComponent(`Teach me ${subject.name} from scratch`)}`}>
                <Bot className="h-4 w-4" /> Start Level 1 with the AI tutor
              </Link>
            </Button>
          </section>

          {related.length > 0 && (
            <section className="rounded-2xl border bg-card p-6">
              <h2 className="mb-3 text-lg font-semibold tracking-tight">Related subjects</h2>
              <div className="flex flex-wrap gap-2">
                {related.map(
                  (r) =>
                    r && (
                      <Link
                        key={r.id}
                        href={`/subjects/${r.id}`}
                        className={cn(
                          "rounded-full border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary",
                        )}
                      >
                        {r.name}
                      </Link>
                    ),
                )}
              </div>
            </section>
          )}
        </div>
      </div>

      {/* Official resources */}
      {subject.docs.length > 0 && (
        <section className="mt-6 rounded-2xl border bg-card p-6">
          <h2 className="mb-3 text-lg font-semibold tracking-tight">Official resources</h2>
          <ul className="space-y-2">
            {subject.docs.map((doc) => (
              <li key={doc.url}>
                <a
                  href={doc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-primary underline-offset-2 hover:underline"
                >
                  <ExternalLink className="h-3.5 w-3.5" /> {doc.label}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
