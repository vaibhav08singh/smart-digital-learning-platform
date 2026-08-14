import { env } from "@/lib/env";
import { geminiProvider } from "./gemini";
import { openaiProvider } from "./openai";
import type { AiProvider, AiProviderConfig, AiProviderId } from "./types";

const providers: Record<AiProviderId, AiProvider> = {
  gemini: geminiProvider,
  openai: openaiProvider,
};

const defaultModels: Record<AiProviderId, string> = {
  gemini: "gemini-2.5-flash",
  openai: "gpt-4o-mini",
};

export interface ActiveAiProvider {
  provider: AiProvider;
  /** Present when an API key is configured; otherwise the AI call cannot run. */
  config?: AiProviderConfig;
  configured: boolean;
  /** Human-readable guidance on what env vars to set when not configured. */
  guidance: string;
}

function guidanceFor(id: AiProviderId): string {
  return id === "openai"
    ? "Set OPENAI_API_KEY in .env.local (or switch to AI_PROVIDER=gemini and set GEMINI_API_KEY)."
    : "Set GEMINI_API_KEY in .env.local.";
}

/**
 * Resolve the active AI provider from env vars:
 *   AI_PROVIDER=gemini|openai        (default: gemini)
 *   GEMINI_API_KEY / OPENAI_API_KEY  (the provider's key)
 *   GEMINI_MODEL / OPENAI_MODEL      (optional model override)
 */
export function getActiveProvider(): ActiveAiProvider {
  const requested = env.ai.provider as AiProviderId;
  const provider = providers[requested] ?? geminiProvider;
  const id = provider.id;

  const apiKey = id === "openai" ? env.openai.apiKey : env.gemini.apiKey;
  const model =
    (id === "openai" ? env.openai.model : env.gemini.model) || defaultModels[id];

  return {
    provider,
    config: apiKey ? { apiKey, model } : undefined,
    configured: Boolean(apiKey),
    guidance: guidanceFor(id),
  };
}
