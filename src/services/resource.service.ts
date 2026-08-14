import { getSubjectResources } from "@/data/resource-hub";
import type { SubjectResources } from "@/data/resource-hub";
import { csSubjects } from "@/data/cs-subjects";
import type { CsSubject } from "@/data/cs-subjects";
import { simulateLatency } from "@/lib/storage";

/** List every subject available in the Resource Hub. */
export async function getResourceHubSubjects(): Promise<CsSubject[]> {
  await simulateLatency(250);
  return csSubjects;
}

/** Full topic-level resource map for one subject. */
export async function getResourcesForSubject(subjectId: string): Promise<SubjectResources | undefined> {
  await simulateLatency(200);
  return getSubjectResources(subjectId);
}
