import type { EducationLevelId, EducationStage } from "@/types";

export interface LevelGroup {
  group: string;
  range: EducationLevelId[];
  stage: EducationStage;
}

export const levelGroups: LevelGroup[] = [
  { group: "Class 1–5", range: ["class-1", "class-2", "class-3", "class-4", "class-5"], stage: "school" },
  { group: "Class 6–8", range: ["class-6", "class-7", "class-8"], stage: "school" },
  { group: "Class 9–10", range: ["class-9", "class-10"], stage: "school" },
  { group: "Class 11–12", range: ["class-11", "class-12"], stage: "school" },
  { group: "Undergraduate", range: ["undergraduate"], stage: "undergraduate" },
  { group: "BTech / BE", range: ["btech"], stage: "undergraduate" },
  { group: "Postgraduate", range: ["postgraduate"], stage: "postgraduate" },
  { group: "MTech / ME", range: ["mtech"], stage: "postgraduate" },
  { group: "Advanced / Professional", range: ["advanced"], stage: "advanced" },
  { group: "Research", range: ["research"], stage: "advanced" },
];

export function groupsByStage(stage: EducationStage): LevelGroup[] {
  return levelGroups.filter((g) => g.stage === stage);
}

export function groupForLevel(levelId: EducationLevelId): LevelGroup | undefined {
  return levelGroups.find((g) => g.range.includes(levelId));
}
