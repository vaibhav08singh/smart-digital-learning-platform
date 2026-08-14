import { readStore, simulateLatency, writeStore } from "@/lib/storage";
import { getStudentProfile, saveStudentProfile } from "./auth.service";
import type { EducationLevelId, StudentProfile } from "@/types";
import { educationLevels, getEducationLevel } from "@/data/education";

// ============================================================
// Student / profile service — onboarding + recommendations.
// ============================================================

const PROFILE_KEY = "codezen:profile";
const PATH_KEY = "codezen:learning-path";
const ONBOARDING_KEY = "codezen:onboarding-complete";

export async function getProfile(): Promise<StudentProfile> {
  await simulateLatency(200);
  return getStudentProfile();
}

export async function updateLevel(
  levelId: EducationLevelId,
  goals: string[],
  domainIds: string[] = [],
): Promise<StudentProfile> {
  await simulateLatency(300);
  const level = getEducationLevel(levelId);
  const profile = getStudentProfile();
  const updated: StudentProfile = {
    ...profile,
    levelId,
    programId: level?.programIds[0] ?? profile.programId,
    domainIds,
    goals,
  };
  writeStore(PROFILE_KEY, updated);
  writeStore(ONBOARDING_KEY, true);
  return updated;
}

export function isOnboarded(): boolean {
  return readStore<boolean>(ONBOARDING_KEY, false);
}

export async function toggleBookmark(courseId: string): Promise<StudentProfile> {
  await simulateLatency(120);
  const profile = getStudentProfile();
  const bookmarked = profile.bookmarkedCourseIds ?? [];
  const updated: StudentProfile = {
    ...profile,
    bookmarkedCourseIds: bookmarked.includes(courseId)
      ? bookmarked.filter((id) => id !== courseId)
      : [...bookmarked, courseId],
  };
  saveStudentProfile(updated);
  return updated;
}

export async function enroll(courseId: string): Promise<StudentProfile> {
  await simulateLatency(150);
  const profile = getStudentProfile();
  const enrolled = profile.enrolledCourseIds ?? [];
  if (enrolled.includes(courseId)) return profile;
  const updated: StudentProfile = {
    ...profile,
    enrolledCourseIds: [...enrolled, courseId],
  };
  saveStudentProfile(updated);
  return updated;
}

export function getLearningPath(): import("@/types").PathNode[] {
  const stored = readStore<import("@/types").PathNode[] | null>(PATH_KEY, null);
  if (stored) return stored;
  return [];
}

export function saveLearningPath(nodes: import("@/types").PathNode[]): void {
  writeStore(PATH_KEY, nodes);
}

export function levelLabel(levelId: EducationLevelId): string {
  return educationLevels.find((l) => l.id === levelId)?.shortLabel ?? levelId;
}

/** Add studied minutes and a small progress bump to the stored profile. */
export function addStudyMinutes(minutes: number): StudentProfile {
  const profile = getStudentProfile();
  const updated: StudentProfile = {
    ...profile,
    totalStudyMinutes: profile.totalStudyMinutes + minutes,
    overallProgress: Math.min(100, profile.overallProgress + Math.max(0, Math.round(minutes / 30))),
  };
  saveStudentProfile(updated);
  return updated;
}
