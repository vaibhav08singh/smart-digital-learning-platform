// ============================================================
// Cartoon avatar catalog.
// Each avatar is a lightweight SVG scene: a friendly student
// character with distinct skin tone, hair, style and accessory.
// ============================================================

export interface AvatarOption {
  id: string;
  label: string;
  /** Skin tone hex. */
  skin: string;
  /** Hair color hex. */
  hair: string;
  /** Hair style key — see AvatarArt renderer. */
  hairStyle: "short" | "curly" | "bun" | "spiky" | "none" | "fringe";
  /** Accessory key. */
  accessory: "none" | "glasses" | "headphones" | "cap";
  /** Background gradient (Tailwind classes). */
  gradient: string;
  /** Accent color used for shirt/band. */
  accent: string;
}

export const avatarOptions: AvatarOption[] = [
  {
    id: "student-orange",
    label: "Aarav",
    skin: "#f5c9a6",
    hair: "#3b2b20",
    hairStyle: "short",
    accessory: "glasses",
    gradient: "from-amber-400 to-orange-500",
    accent: "#f97316",
  },
  {
    id: "student-indigo",
    label: "Zara",
    skin: "#f7d2b0",
    hair: "#4a2f1b",
    hairStyle: "bun",
    accessory: "none",
    gradient: "from-indigo-400 to-violet-500",
    accent: "#6366f1",
  },
  {
    id: "student-emerald",
    label: "Kenji",
    skin: "#e8b88a",
    hair: "#1f2a36",
    hairStyle: "spiky",
    accessory: "headphones",
    gradient: "from-emerald-400 to-teal-500",
    accent: "#10b981",
  },
  {
    id: "student-rose",
    label: "Maya",
    skin: "#f3c3a0",
    hair: "#5d3a1e",
    hairStyle: "curly",
    accessory: "none",
    gradient: "from-rose-400 to-pink-500",
    accent: "#ec4899",
  },
  {
    id: "student-sky",
    label: "Liam",
    skin: "#f1bd94",
    hair: "#a9713b",
    hairStyle: "fringe",
    accessory: "cap",
    gradient: "from-sky-400 to-cyan-500",
    accent: "#0ea5e9",
  },
  {
    id: "student-violet",
    label: "Nia",
    skin: "#ecc49a",
    hair: "#2c1c10",
    hairStyle: "bun",
    accessory: "glasses",
    gradient: "from-fuchsia-400 to-purple-500",
    accent: "#a855f7",
  },
  {
    id: "student-lime",
    label: "Ravi",
    skin: "#f6cdab",
    hair: "#37251b",
    hairStyle: "short",
    accessory: "none",
    gradient: "from-lime-400 to-green-500",
    accent: "#84cc16",
  },
  {
    id: "student-blue",
    label: "Sara",
    skin: "#f5c6a1",
    hair: "#6b4a2a",
    hairStyle: "curly",
    accessory: "headphones",
    gradient: "from-blue-400 to-indigo-500",
    accent: "#3b82f6",
  },
];

/** Resolve an avatar by id, falling back to the first option. */
export function getAvatarOption(id?: string): AvatarOption {
  return avatarOptions.find((a) => a.id === id) ?? avatarOptions[0];
}

/** Helper so any avatar id is safely normalized. */
export function isValidAvatarId(id: string | undefined): boolean {
  return !!id && avatarOptions.some((a) => a.id === id);
}
