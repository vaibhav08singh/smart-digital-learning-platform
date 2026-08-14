import { analyzeTutorRequest } from "@/data/ai-analysis";
import { mockAiReply, type StudyModeId } from "@/data/ai";
import { jsonError, readJsonBody } from "@/lib/server/errors";
import { getActiveProvider } from "@/lib/ai";
import { buildSystemPrompt } from "@/lib/ai/prompt";
import type { AiMessage } from "@/lib/ai/types";
import type { ChatMessage, StudentProfile } from "@/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface TutorRequestBody {
  message: string;
  mode: StudyModeId;
  profile: StudentProfile;
  history: ChatMessage[];
}

export interface TutorResponseBody {
  content: string;
  source: "gemini" | "openai" | "mock";
}

const MAX_HISTORY = 12;

export async function POST(request: Request): Promise<Response> {
  const body = await readJsonBody<TutorRequestBody>(request);
  if (!body) return jsonError("Invalid JSON body.", 400);

  const { message, mode, profile, history } = body;
  if (!message || typeof message !== "string" || !profile) {
    return jsonError("Missing 'message' or 'profile'.", 400);
  }
  if (typeof profile.levelId !== "string" || !profile.levelId) {
    return jsonError("Invalid 'profile': a non-empty 'levelId' is required.", 400);
  }
  if (typeof profile.name !== "string" || !profile.name.trim()) {
    return jsonError("Invalid 'profile': a non-empty 'name' is required.", 400);
  }

  const analysis = analyzeTutorRequest(message, mode, profile, history);

  const { provider, config, configured } = getActiveProvider();

  // Try live provider first if API key is present
  if (config && configured) {
    const system = buildSystemPrompt({ message, mode, profile, analysis });

    const aiMessages: AiMessage[] = (history ?? [])
      .slice(-MAX_HISTORY)
      .filter((m): m is ChatMessage & { role: "user" | "assistant" } =>
        m.role === "user" || m.role === "assistant",
      )
      .map((m) => ({ role: m.role, content: m.content }))
      .concat([{ role: "user", content: message }]);

    try {
      const content = await provider.generate(system, aiMessages, config);
      return Response.json({ content, source: provider.id } satisfies TutorResponseBody);
    } catch (error) {
      const detail = error instanceof Error ? error.message : String(error);
      console.warn(`[api/tutor] AI provider '${provider.id}' failed, using Knowledge Engine:`, detail);
    }
  }

  // Gracefully fallback to the AI Knowledge Engine when unconfigured or on provider failure
  const content = mockAiReply(message, { mode, profile, history });
  return Response.json({ content, source: "mock" } satisfies TutorResponseBody);
}

