import type { AiProvider, AiProviderConfig } from "./types";

const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

async function errorFromResponse(res: Response): Promise<Error> {
  let detail = "";
  try {
    const data = (await res.json()) as {
      error?: { message?: string };
    };
    detail = data.error?.message ?? "";
  } catch {
    detail = (await res.text()).slice(0, 400);
  }
  return new Error(`OpenAI ${res.status}: ${detail || res.statusText}`);
}

export const openaiProvider: AiProvider = {
  id: "openai",
  label: "OpenAI ChatGPT",
  async generate(system: string, messages, config: AiProviderConfig): Promise<string> {
    const res = await fetch(OPENAI_API_URL, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        model: config.model,
        messages: [{ role: "system", content: system }, ...messages],
        temperature: 0.4,
        max_tokens: 8000,
      }),
    });

    if (!res.ok) throw await errorFromResponse(res);

    const data = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const text = data.choices?.[0]?.message?.content;
    if (!text || !text.trim()) throw new Error("OpenAI returned no text content.");
    return text.trim();
  },
};
