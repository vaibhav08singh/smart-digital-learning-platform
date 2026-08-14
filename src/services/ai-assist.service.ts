import { postJson } from "@/services/http";
import type { CodingAssistAction } from "@/types";

// ============================================================
// AI Coding Assistant — client-side API access.
// Talks ONLY to /api/ai/assist; the provider configuration and
// API keys stay on the server.
// ============================================================

export interface AiAssistRequest {
  action: CodingAssistAction;
  code: string;
  language: string;
  targetLanguage?: string;
  topic?: string;
  testCases?: { input: string; expected: string }[];
  currentError?: string;
}

export interface AiAssistResponse {
  content: string;
  source: "gemini" | "openai" | "mock";
}

export async function assistCode(body: AiAssistRequest): Promise<AiAssistResponse> {
  return postJson<AiAssistResponse>("/api/ai/assist", body);
}
