// ============================================================
// Centralized environment access — SERVER ONLY.
// All process.env reads happen here (or through this module's
// helpers) so env names live in one place and the rest of the
// server code stays testable. Values are read once at import time.
// ============================================================

export const env = {
  ai: {
    provider: (process.env.AI_PROVIDER ?? "gemini").trim().toLowerCase(),
  },
  gemini: {
    apiKey: process.env.GEMINI_API_KEY?.trim(),
    model: process.env.GEMINI_MODEL?.trim(),
  },
  openai: {
    apiKey: process.env.OPENAI_API_KEY?.trim(),
    model: process.env.OPENAI_MODEL?.trim(),
  },
  youtube: {
    apiKey: process.env.YOUTUBE_API_KEY?.trim(),
  },
  execute: {
    url: process.env.EXECUTE_API_URL ?? "https://emkc.org/api/v2/piston",
    apiKey: process.env.EXECUTE_API_KEY,
  },
};
