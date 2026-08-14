"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";
import { EducationLevelCard } from "@/components/education/education-level-card";
import { DomainCard } from "@/components/education/domain-card";
import { ProgramCard } from "@/components/knowledge/program-card";
import { SubjectCard } from "@/components/knowledge/subject-card";
import { ChapterCard } from "@/components/knowledge/chapter-card";
import { TopicCard } from "@/components/knowledge/topic-card";
import { LessonCard } from "@/components/knowledge/lesson-card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/state";
import { educationLevels, getEducationLevel, programsForLevel, getProgram, getDomain, domains } from "@/data/education";
import { getSubject, getChapter, getTopic, subjectsForDomain, subjectsForLevel } from "@/data/subjects";
import { groupsByStage } from "@/lib/education-groups";
import type { EducationStage } from "@/types";

const stageLabels: Record<EducationStage, string> = {
  school: "School",
  undergraduate: "Undergraduate",
  postgraduate: "Postgraduate",
  advanced: "Advanced & Research",
};

function ExplorerContent() {
  const params = useSearchParams();
  const levelId = params.get("level");
  const programId = params.get("program");
  const domainId = params.get("domain");
  const subjectId = params.get("subject");
  const chapterId = params.get("chapter");
  const topicId = params.get("topic");

  // Reset to root
  const rootLink = <Link href="/explore" className="text-primary underline-offset-2 hover:underline">Explore</Link>;

  // TOPIC → lessons
  if (topicId) {
    const topic = getTopic(topicId);
    const chapter = topic ? getChapter(topic.chapterId) : undefined;
    const subject = chapter ? getSubject(chapter.subjectId) : undefined;
    if (!topic || !chapter || !subject) return <EmptyState title="Topic not found" />;
    return (
      <section>
        <CrumbTrail items={[rootLink, crumb(`/explore?subject=${subject.id}`, subject.name), crumb(`/explore?chapter=${chapter.id}`, chapter.name), <span key="t" className="font-medium text-foreground">{topic.name}</span>]} />
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{topic.name}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{topic.description}</p>
          </div>
          <Button asChild>
            <Link href={`/learning/${topic.id}/${topic.lessons[0]?.id}`}>
              Start learning <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="space-y-2">
          {topic.lessons.map((lesson) => (
            <LessonCard key={lesson.id} lesson={lesson} topicId={topic.id} />
          ))}
        </div>
      </section>
    );
  }

  // CHAPTER → topics
  if (chapterId) {
    const chapter = getChapter(chapterId);
    const subject = chapter ? getSubject(chapter.subjectId) : undefined;
    if (!chapter || !subject) return <EmptyState title="Chapter not found" />;
    return (
      <section>
        <CrumbTrail items={[rootLink, crumb(`/explore?subject=${subject.id}`, subject.name), <span key="c" className="font-medium text-foreground">{chapter.name}</span>]} />
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{chapter.name}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{chapter.description}</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {chapter.topics.map((topic) => (
            <TopicCard key={topic.id} topic={topic} />
          ))}
        </div>
      </section>
    );
  }

  // SUBJECT → chapters
  if (subjectId) {
    const subject = getSubject(subjectId);
    if (!subject) return <EmptyState title="Subject not found" />;
    const level = educationLevels.find((l) => l.id === subject.levelId);
    return (
      <section>
        <CrumbTrail items={[rootLink, crumb(`/explore?level=${subject.levelId}`, level?.shortLabel ?? "Level"), <span key="s" className="font-medium text-foreground">{subject.name}</span>]} />
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{subject.name}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{subject.description}</p>
          </div>
          <Button asChild variant="outline">
            <Link href={`/courses?subject=${subject.id}`}>View related courses</Link>
          </Button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {subject.chapters.map((chapter) => (
            <ChapterCard key={chapter.id} chapter={chapter} />
          ))}
        </div>
      </section>
    );
  }

  // DOMAIN → subjects
  if (domainId) {
    const domain = getDomain(domainId);
    if (!domain) return <EmptyState title="Domain not found" />;
    const subjects = subjectsForDomain(domain.id);
    return (
      <section>
        <CrumbTrail items={[rootLink, <span key="d" className="font-medium text-foreground">{domain.name}</span>]} />
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{domain.name}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{domain.description}</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {subjects.map((subject) => (
            <SubjectCard key={subject.id} subject={subject} />
          ))}
        </div>
        {subjects.length === 0 && (
          <EmptyState
            title="Subjects coming soon"
            description="This domain is on the roadmap. Explore another domain meanwhile."
            action={
              <Button asChild size="sm"><Link href="/explore">Back to universe</Link></Button>
            }
          />
        )}
      </section>
    );
  }

  // PROGRAM → subjects
  if (programId) {
    const program = getProgram(programId);
    if (!program) return <EmptyState title="Program not found" />;
    const programSubjects = program.subjectIds.map((id) => getSubject(id)).filter(Boolean);
    const level = educationLevels.find((l) => l.id === program.levelId);
    return (
      <section>
        <CrumbTrail items={[rootLink, crumb(`/explore?level=${program.levelId}`, level?.shortLabel ?? "Level"), <span key="p" className="font-medium text-foreground">{program.name}</span>]} />
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{program.name}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{program.description}</p>
        </div>
        {programSubjects.length === 0 ? (
          <EmptyState title="No subjects mapped yet" description="We're still curating this program. Explore related subjects below." />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {programSubjects.map((subject) => subject && <SubjectCard key={subject.id} subject={subject} />)}
          </div>
        )}
      </section>
    );
  }

  // LEVEL → programs
  if (levelId) {
    const level = getEducationLevel(levelId);
    if (!level) return <EmptyState title="Level not found" />;
    const levelPrograms = programsForLevel(level.id);
    const levelSubjects = subjectsForLevel(level.id);
    return (
      <section>
        <CrumbTrail items={[rootLink, <span key="l" className="font-medium text-foreground">{level.name}</span>]} />
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{level.name}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{level.description}</p>
        </div>

        {levelPrograms.length > 0 && (
          <>
            <h2 className="mb-3 mt-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Programs</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {levelPrograms.map((program) => (
                <ProgramCard key={program.id} program={program} />
              ))}
            </div>
          </>
        )}

        {levelSubjects.length > 0 && (
          <>
            <h2 className="mb-3 mt-8 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Subjects</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {levelSubjects.map((subject) => (
                <SubjectCard key={subject.id} subject={subject} />
              ))}
            </div>
          </>
        )}

        {levelPrograms.length === 0 && levelSubjects.length === 0 && (
          <EmptyState
            title="This level is being prepared"
            description="Content for this level is on the roadmap."
          />
        )}
      </section>
    );
  }

  // ROOT → levels grouped by stage
  return (
    <section>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Knowledge Universe</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          Choose your education level to see programs and subjects, or dive straight into a knowledge
          domain. Same components, every level — Class 1 to Research.
        </p>
      </div>

      <div className="mb-8">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Domains</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {domains.map((domain) => (
            <DomainCard key={domain.id} domain={domain} href={`/explore?domain=${domain.id}`} />
          ))}
        </div>
      </div>

      {(["school", "undergraduate", "postgraduate", "advanced"] as EducationStage[]).map((stage) => (
        <div key={stage} className="mb-8">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            {stageLabels[stage]}
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {groupsByStage(stage).map((group) => {
              const groupLevels = educationLevels.filter((l) => group.range.includes(l.id));
              const representative = groupLevels[groupLevels.length - 1];
              return (
                <EducationLevelCard
                  key={group.group}
                  level={{
                    ...(representative ?? groupLevels[0]),
                    id: representative?.id as never,
                    name: group.group,
                    description: representative?.description ?? "",
                  }}
                  href={`/explore?level=${representative?.id}`}
                />
              );
            })}
          </div>
        </div>
      ))}
    </section>
  );
}

function CrumbTrail({ items }: { items: React.ReactNode[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
      <Link href="/explore" className="hover:text-foreground">Explore</Link>
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5">
          <ChevronRight className="h-3.5 w-3.5" />
          {item}
        </span>
      ))}
    </nav>
  );
}

function crumb(href: string, label: string) {
  return <Link href={href} className="text-muted-foreground hover:text-foreground">{label}</Link>;
}

export default function ExplorePage() {
  return (
    <div className="mx-auto max-w-7xl">
      <Suspense fallback={<div className="h-64 animate-pulse rounded-xl bg-muted" />}>
        <ExplorerContent />
      </Suspense>
    </div>
  );
}
