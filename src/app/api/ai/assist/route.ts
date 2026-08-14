import { buildAssistSystem, type AssistRequest } from "@/lib/server/ai-assist";
import { jsonError, readJsonBody } from "@/lib/server/errors";
import { getActiveProvider } from "@/lib/ai";
import type { AiMessage } from "@/lib/ai/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// ============================================================
// AI Coding Assistant — explain / debug / optimize / tests /
// convert. Reuses the same env-configured AI provider as the
// AI tutor (AI_PROVIDER, GEMINI_API_KEY / OPENAI_API_KEY).
// Thin route handler; prompt construction lives in
// @/lib/server/ai-assist.
// ============================================================

export async function POST(request: Request): Promise<Response> {
  const body = await readJsonBody<AssistRequest>(request);
  if (!body) return jsonError("Invalid JSON body.", 400);

  const { action, code } = body;
  if (!action || typeof code !== "string" || code.trim().length === 0) {
    return jsonError("Missing 'action' or 'code'.", 400);
  }

  const { provider, config, configured, guidance } = getActiveProvider();
  if (!config || !configured) {
    return jsonError(`AI assistant is not configured yet. ${guidance}`, 503, "AI_NOT_CONFIGURED");
  }

  const system = buildAssistSystem(body);
  const messages: AiMessage[] = [{ role: "user", content: "Begin your answer now." }];

  try {
    const content = await provider.generate(system, messages, config);
    return Response.json({ content, source: provider.id });
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    console.error("[api/ai/assist] provider call failed:", detail);
    return jsonError(
      `The AI assistant could not answer (${provider.id}). ${detail}`,
      502,
      "AI_PROVIDER_ERROR",
    );
  }
}
