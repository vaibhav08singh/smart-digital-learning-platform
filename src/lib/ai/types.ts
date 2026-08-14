export type AiProviderId = "gemini" | "openai";

export interface AiMessage {
  role: "user" | "assistant";
  content: string;
}

export interface AiProviderConfig {
  apiKey: string;
  model: string;
}

export interface AiProvider {
  id: AiProviderId;
  label: string;
  generate(system: string, messages: AiMessage[], config: AiProviderConfig): Promise<string>;
}
