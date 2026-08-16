import { simulateLatency } from "@/lib/storage";
import { courses, searchCourses } from "@/data/courses";
import { educationLevels } from "@/data/education";
import { getStudentProfile } from "./auth.service";
import type { Course } from "@/types";

// ============================================================
// Course service — search, filter and detail lookups.
// ============================================================

export type CourseFilters = {
  query?: string;
  levelId?: string;
  difficulty?: string;
  domainId?: string;
  subjectId?: string;
  onlyEnrolled?: boolean;
  onlyBookmarked?: boolean;
};

export async function getCourses(filters: CourseFilters = {}): Promise<Course[]> {
  await simulateLatency(250);
  const profile = getStudentProfile();
  let result = searchCourses(filters.query ?? "");
  const initialSet = [...result];

  if (filters.domainId) {
    const domainMatches = result.filter((c) => c.domainId === filters.domainId);
    if (domainMatches.length > 0) {
      result = domainMatches;
    }
  }

  if (filters.levelId) {
    const exact = result.filter((c) => c.levelId === filters.levelId);
    if (exact.length > 0) {
      result = exact;
    } else {
      const targetLevel = educationLevels.find((l) => l.id === filters.levelId);
      if (targetLevel) {
        const stageMatches = result.filter((c) => {
          const courseLevel = educationLevels.find((l) => l.id === c.levelId);
          return (
            courseLevel?.stage === targetLevel.stage ||
            courseLevel?.group === targetLevel.group
          );
        });
        if (stageMatches.length > 0) {
          result = stageMatches;
        }
      }
    }
  }

  if (filters.difficulty) {
    const diffMatches = result.filter((c) => c.difficulty === filters.difficulty);
    if (diffMatches.length > 0) {
      result = diffMatches;
    }
  }

  if (filters.subjectId) {
    const sId = filters.subjectId.toLowerCase();
    const exact = result.filter(
      (c) => c.subjectId === filters.subjectId || c.subjectId.toLowerCase() === sId,
    );
    if (exact.length > 0) {
      result = exact;
    } else {
      const fuzzy = result.filter(
        (c) =>
          c.subjectName.toLowerCase().includes(sId) ||
          c.title.toLowerCase().includes(sId) ||
          c.tags.some((t) => t.toLowerCase().includes(sId)),
      );
      if (fuzzy.length > 0) result = fuzzy;
    }
  }

  if (filters.onlyEnrolled) result = result.filter((c) => profile.enrolledCourseIds?.includes(c.id));
  if (filters.onlyBookmarked)
    result = result.filter((c) => profile.bookmarkedCourseIds?.includes(c.id));

  // Fallback: if strict multi-filtering produced 0 results, fall back gracefully
  if (result.length === 0 && filters.domainId) {
    const domainFallback = initialSet.filter((c) => c.domainId === filters.domainId);
    if (domainFallback.length > 0) result = domainFallback;
  }
  if (result.length === 0 && filters.levelId) {
    const targetLevel = educationLevels.find((l) => l.id === filters.levelId);
    const levelFallback = initialSet.filter((c) => {
      if (c.levelId === filters.levelId) return true;
      const courseLevel = educationLevels.find((l) => l.id === c.levelId);
      return courseLevel?.stage === targetLevel?.stage;
    });
    if (levelFallback.length > 0) result = levelFallback;
  }

  return result.map((c) => ({
    ...c,
    bookmarked: profile.bookmarkedCourseIds?.includes(c.id) ?? false,
    enrolled: profile.enrolledCourseIds?.includes(c.id) ?? false,
  }));
}

export async function getCourse(id: string): Promise<Course | undefined> {
  await simulateLatency(180);
  const profile = getStudentProfile();
  const course = courses.find((c) => c.id === id);
  if (!course) return undefined;
  return {
    ...course,
    bookmarked: profile.bookmarkedCourseIds.includes(course.id),
    enrolled: profile.enrolledCourseIds.includes(course.id),
  };
}

export function getCourseSync(id: string): Course | undefined {
  return courses.find((c) => c.id === id);
}
