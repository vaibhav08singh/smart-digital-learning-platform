import { buildAssistSystem, buildFallbackAssistReply, type AssistRequest } from "@/lib/server/ai-assist";
import { jsonError, readJsonBody } from "@/lib/server/errors";
import { getActiveProvider } from "@/lib/ai";
import type { AiMessage } from "@/lib/ai/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// ============================================================
// AI Coding Assistant — explain / debug / optimize / tests /
// convert. Reuses the same env-configured AI provider as the
// AI tutor (AI_PROVIDER, GEMINI_API_KEY / OPENAI_API_KEY).
// Gracefully falls back to the CodeZen AI engine when unconfigured.
// ============================================================

export async function POST(request: Request): Promise<Response> {
  const body = await readJsonBody<AssistRequest>(request);
  if (!body) return jsonError("Invalid JSON body.", 400);

  const { action, code } = body;
  if (!action || typeof code !== "string" || code.trim().length === 0) {
    return jsonError("Missing 'action' or 'code'.", 400);
  }

  const { provider, config, configured } = getActiveProvider();

  // Try live provider first if API key is present
  if (config && configured) {
    const system = buildAssistSystem(body);
    const messages: AiMessage[] = [{ role: "user", content: "Begin your answer now." }];
    try {
      const content = await provider.generate(system, messages, config);
      return Response.json({ content, source: provider.id });
    } catch (error) {
      const detail = error instanceof Error ? error.message : String(error);
      console.warn(`[api/ai/assist] AI provider '${provider.id}' failed, using CodeZen engine:`, detail);
    }
  }

  // Gracefully fallback to the AI Coding Assistant Engine when unconfigured or on provider failure
  const content = buildFallbackAssistReply(body);
  return Response.json({ content, source: "mock" });
}
