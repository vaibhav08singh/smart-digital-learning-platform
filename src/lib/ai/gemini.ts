import type { AiProvider, AiProviderConfig } from "./types";

const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models";

async function errorFromResponse(res: Response): Promise<Error> {
  let detail = "";
  try {
    const data = (await res.json()) as { error?: { message?: string } };
    detail = data.error?.message ?? "";
  } catch {
    detail = (await res.text()).slice(0, 400);
  }
  return new Error(`Gemini ${res.status}: ${detail || res.statusText}`);
}

export const geminiProvider: AiProvider = {
  id: "gemini",
  label: "Google Gemini",
  async generate(system: string, messages, config: AiProviderConfig): Promise<string> {
    const modelsToTry = [
      config.model,
      "gemini-3.6-flash",
      "gemini-2.0-flash",
      "gemini-1.5-flash",
      "gemini-1.5-pro",
    ];
    const uniqueModels = Array.from(new Set(modelsToTry.filter(Boolean)));

    let lastError: Error | null = null;
    for (const model of uniqueModels) {
      try {
        const url = `${GEMINI_API_URL}/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(config.apiKey)}`;

        const res = await fetch(url, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: system }] },
            contents: messages.map((m) => ({
              role: m.role === "assistant" ? "model" : "user",
              parts: [{ text: m.content }],
            })),
            generationConfig: {
              temperature: 0.4,
              maxOutputTokens: 8000,
            },
          }),
        });

        if (!res.ok) {
          lastError = await errorFromResponse(res);
          continue;
        }

        const data = (await res.json()) as {
          candidates?: { content?: { parts?: { text?: string }[] } }[];
        };
        const text = data.candidates?.[0]?.content?.parts
          ?.map((p) => p.text ?? "")
          .join("");
        if (text && text.trim()) {
          return text.trim();
        }
      } catch (err) {
        lastError = err instanceof Error ? err : new Error(String(err));
      }
    }

    throw lastError ?? new Error("Gemini generation failed.");
  },
};
