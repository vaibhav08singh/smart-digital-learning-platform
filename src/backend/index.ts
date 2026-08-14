// ============================================================
// CodeZen Backend Core Entry Point
// Organizes all server-side logic, API handlers, AI provider adapters,
// and backend utility functions into a single clean interface.
// ============================================================

// AI Providers & Prompt Construction
export { getActiveProvider } from "@/lib/ai";
export { buildSystemPrompt } from "@/lib/ai/prompt";
export { geminiProvider } from "@/lib/ai/gemini";
export { openaiProvider } from "@/lib/ai/openai";

// Server Services, Firebase & Proxy Logic
export { app, auth, db, analytics, firebaseConfig } from "@/lib/firebase";
export { searchYoutubeVideos, YoutubeSearchError } from "@/lib/server/youtube";
export { jsonError, readJsonBody } from "@/lib/server/errors";

// API Handlers (Imported by Next.js Route Handlers)
export type { TutorResponseBody } from "@/app/api/tutor/route";
export type { YoutubeSearchOptions } from "@/lib/server/youtube";
