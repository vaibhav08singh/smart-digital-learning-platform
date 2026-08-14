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

  if (filters.levelId) {
    const exact = result.filter((c) => c.levelId === filters.levelId);
    if (exact.length > 0) {
      result = exact;
    } else {
      const targetLevel = educationLevels.find((l) => l.id === filters.levelId);
      if (targetLevel) {
        result = result.filter((c) => {
          const courseLevel = educationLevels.find((l) => l.id === c.levelId);
          return (
            courseLevel?.stage === targetLevel.stage ||
            courseLevel?.group === targetLevel.group
          );
        });
      }
    }
  }

  if (filters.difficulty) result = result.filter((c) => c.difficulty === filters.difficulty);
  if (filters.domainId) result = result.filter((c) => c.domainId === filters.domainId);
  if (filters.subjectId) result = result.filter((c) => c.subjectId === filters.subjectId);
  if (filters.onlyEnrolled) result = result.filter((c) => profile.enrolledCourseIds?.includes(c.id));
  if (filters.onlyBookmarked)
    result = result.filter((c) => profile.bookmarkedCourseIds?.includes(c.id));

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
