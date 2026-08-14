"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Bookmark, Search, SlidersHorizontal } from "lucide-react";
import { CourseCard } from "@/components/courses/course-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EmptyState, LoadingState, ErrorState } from "@/components/ui/state";
import { getCourses } from "@/services/course.service";
import { useStudentProfile } from "@/services/auth.service";
import { toggleBookmark } from "@/services/student.service";
import { educationLevels, domains } from "@/data/education";
import { getSubject } from "@/data/subjects";
import type { Course, Difficulty } from "@/types";
import { cn } from "@/lib/utils";

const difficulties: Difficulty[] = ["Beginner", "Intermediate", "Advanced", "Expert"];

function CoursesContent() {
  const params = useSearchParams();
  const initialSubject = params.get("subject");

  const [query, setQuery] = useState("");
  const [levelFilter, setLevelFilter] = useState<string>("");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("");
  const [domainFilter, setDomainFilter] = useState<string>("");
  const [subjectFilter, setSubjectFilter] = useState<string>(initialSubject ?? "");
  const [showBookmarked, setShowBookmarked] = useState(false);
  const [courses, setCourses] = useState<Course[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [profileVersion, setProfileVersion] = useState(0);

  // Updates a filter and shows the loading state (event handlers may setState).
  function applyFilter(update: () => void) {
    setLoading(true);
    update();
  }

  useEffect(() => {
    let mounted = true;
    getCourses({
      query,
      levelId: levelFilter || undefined,
      difficulty: difficultyFilter || undefined,
      domainId: domainFilter || undefined,
      subjectId: subjectFilter || undefined,
      onlyBookmarked: showBookmarked || undefined,
    })
      .then((result) => {
        if (!mounted) return;
        setCourses(result);
        setError(false);
        setLoading(false);
      })
      .catch(() => {
        if (!mounted) return;
        setError(true);
        setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [query, levelFilter, difficultyFilter, domainFilter, subjectFilter, showBookmarked, profileVersion]);

  const profile = useStudentProfile();
  const bookmarkedIds = profile.bookmarkedCourseIds;
  const subjectName = subjectFilter ? getSubject(subjectFilter)?.name : undefined;

  async function handleToggleBookmark(course: Course) {
    setLoading(true);
    await toggleBookmark(course.id);
    setProfileVersion((v) => v + 1);
  }

  const hasActiveFilters = query || levelFilter || difficultyFilter || domainFilter || subjectFilter || showBookmarked;

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Courses</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Learn any subject at any level — search, filter and start.
          </p>
        </div>
      </div>

      {/* Search + filters */}
      <div className="mb-6 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => applyFilter(() => setQuery(e.target.value))}
            placeholder="Search courses, subjects, instructors…"
            className="pl-9"
            aria-label="Search courses"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
            <SlidersHorizontal className="h-3.5 w-3.5" /> Level
          </span>
          {educationLevels.map((level) => (
            <FilterChip key={level.id} active={levelFilter === level.id} onClick={() => setLevelFilter(levelFilter === level.id ? "" : level.id)}>
              {level.shortLabel}
            </FilterChip>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
            <SlidersHorizontal className="h-3.5 w-3.5" /> Domain
          </span>
          {domains.slice(0, 10).map((domain) => (
            <FilterChip key={domain.id} active={domainFilter === domain.id} onClick={() => setDomainFilter(domainFilter === domain.id ? "" : domain.id)}>
              {domain.name}
            </FilterChip>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
            <SlidersHorizontal className="h-3.5 w-3.5" /> Difficulty
          </span>
          {difficulties.map((diff) => (
            <FilterChip key={diff} active={difficultyFilter === diff} onClick={() => setDifficultyFilter(difficultyFilter === diff ? "" : diff)}>
              {diff}
            </FilterChip>
          ))}
          <Button
            variant={showBookmarked ? "secondary" : "outline"}
            size="sm"
            className="ml-auto"
            onClick={() => setShowBookmarked((v) => !v)}
          >
            <Bookmark className="h-3.5 w-3.5" /> {showBookmarked ? "All courses" : "Bookmarked"}
          </Button>
        </div>
      </div>

      {/* Results */}
      {subjectName && (
        <div className="mb-4 flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Filtering by subject:</span>
          <FilterChip active onClick={() => setSubjectFilter("")}>
            {subjectName} ×
          </FilterChip>
        </div>
      )}
      {loading && <LoadingState label="Loading courses…" />}
      {error && <ErrorState message="Could not load courses." />}
      {courses && courses.length === 0 && (
        <EmptyState
          title={hasActiveFilters ? "No courses match your filters" : "No courses yet"}
          description="Try adjusting your search or filters."
        />
      )}
      {courses && courses.length > 0 && (
        <>
          <p className="mb-4 text-xs text-muted-foreground">
            {courses.length} course{courses.length > 1 ? "s" : ""}
            {subjectName ? ` for ${subjectName}` : ""}
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {courses.map((course) => (
              <CourseCard key={course.id} course={{ ...course, bookmarked: bookmarkedIds.includes(course.id) }} onToggleBookmark={handleToggleBookmark} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function FilterChip({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
        active ? "border-primary bg-primary text-primary-foreground" : "bg-card hover:border-primary/50",
      )}
    >
      {children}
    </button>
  );
}

export default function CoursesPage() {
  return (
    <Suspense fallback={<div className="h-64 animate-pulse rounded-xl bg-muted" />}>
      <CoursesContent />
    </Suspense>
  );
}
