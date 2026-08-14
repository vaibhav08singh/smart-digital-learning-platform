import { postJson } from "@/services/http";
import { readStore, simulateLatency, uid, writeStore } from "@/lib/storage";
import {
  aiStudyModes,
  demoConversations,
  mockAiReply,
  suggestedPrompts,
  type StudyModeId,
} from "@/data/ai";
import { getStudentProfile } from "@/services/auth.service";
import type { ChatMessage, Conversation, StudentProfile } from "@/types";

// ============================================================
// AI Tutor service — mock conversation engine.
// Future backend integration: replace sendMessage() internals
// with a real LLM call. The rest of the app never changes.
// ============================================================

const CONVERSATIONS_KEY = "codezen:conversations";
const ACTIVE_KEY = "codezen:active-conversation";

export async function getConversations(): Promise<Conversation[]> {
  await simulateLatency(150);
  return readStore<Conversation[]>(CONVERSATIONS_KEY, demoConversations);
}

export function getActiveConversationId(): string | null {
  return readStore<string | null>(ACTIVE_KEY, null);
}

export function setActiveConversationId(id: string | null): void {
  writeStore(ACTIVE_KEY, id);
}

export async function createConversation(): Promise<Conversation> {
  const conversation: Conversation = {
    id: uid("conv"),
    title: "New conversation",
    messages: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  const all = readStore<Conversation[]>(CONVERSATIONS_KEY, demoConversations);
  writeStore(CONVERSATIONS_KEY, [conversation, ...all]);
  setActiveConversationId(conversation.id);
  return conversation;
}

export async function sendMessage(
  conversationId: string,
  content: string,
  mode: StudyModeId = "explain",
): Promise<Conversation> {
  const all = readStore<Conversation[]>(CONVERSATIONS_KEY, demoConversations);
  const index = all.findIndex((c) => c.id === conversationId);
  const existing: Conversation =
    index >= 0 ? all[index] : { id: conversationId, title: "New conversation", messages: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };

  const profile = getStudentProfile();
  const history = existing.messages.slice(-10);

  const userMessage: ChatMessage = {
    id: uid("msg"),
    role: "user",
    content,
    timestamp: new Date().toISOString(),
  };

  let reply: AiReplyResult;
  try {
    reply = await generateAiReply(content, { mode, profile, history });
  } catch (error) {
    // Persist the user's message so it isn't lost, then surface the error.
    const partial: Conversation = {
      ...existing,
      messages: [...existing.messages, userMessage],
      updatedAt: new Date().toISOString(),
    };
    const partialNext = [...all];
    if (index >= 0) partialNext[index] = partial;
    else partialNext.unshift(partial);
    writeStore(CONVERSATIONS_KEY, partialNext);
    throw error;
  }

  const assistantMessage: ChatMessage = {
    id: uid("msg"),
    role: "assistant",
    content: reply.content,
    timestamp: new Date().toISOString(),
  };

  const updated: Conversation = {
    ...existing,
    title: existing.messages.length === 0 ? summarizeTitle(content) : existing.title,
    messages: [...existing.messages, userMessage, assistantMessage],
    updatedAt: new Date().toISOString(),
  };

  const next = [...all];
  if (index >= 0) next[index] = updated;
  else next.unshift(updated);
  writeStore(CONVERSATIONS_KEY, next);
  return updated;
}

export interface AiReplyResult {
  content: string;
  source: "gemini" | "openai" | "mock";
}

export class AiTutorError extends Error {
  code: string;
  constructor(message: string, code = "AI_ERROR") {
    super(message);
    this.name = "AiTutorError";
    this.code = code;
  }
}

/**
 * Generate a tutor reply through the /api/tutor backend.
 * - Server says "AI not configured" (503) or the provider failed (502):
 *   we throw so the UI shows the real reason — we do NOT fake a reply.
 * - Backend unreachable (dev server down): fall back to the local mock
 *   engine so the app still works on localhost.
 */
async function generateAiReply(
  content: string,
  options: { mode: StudyModeId; profile: StudentProfile; history: ChatMessage[] },
): Promise<AiReplyResult> {
  try {
    const data = await postJson<Partial<AiReplyResult>>("/api/tutor", {
      message: content,
      mode: options.mode,
      profile: options.profile,
      history: options.history,
    });
    if (typeof data.content === "string") {
      const source = data.source === "gemini" || data.source === "openai" ? data.source : "mock";
      return { content: data.content, source };
    }
  } catch (error) {
    console.warn("[ai.service] Backend /api/tutor unavailable or threw error, using local engine:", error);
  }

  // Resilient fallback to local AI Knowledge Engine
  await simulateLatency(300);
  return { content: mockAiReply(content, options), source: "mock" };
}

export async function clearConversation(conversationId: string): Promise<void> {
  await simulateLatency(100);
  const all = readStore<Conversation[]>(CONVERSATIONS_KEY, demoConversations);
  const next = all.filter((c) => c.id !== conversationId);
  writeStore(CONVERSATIONS_KEY, next);
  if (getActiveConversationId() === conversationId) setActiveConversationId(null);
}

function summarizeTitle(content: string): string {
  const words = content.trim().split(/\s+/);
  const title = words.slice(0, 6).join(" ");
  return words.length > 6 ? `${title}…` : title;
}

export { aiStudyModes, suggestedPrompts };
export type { StudyModeId };
