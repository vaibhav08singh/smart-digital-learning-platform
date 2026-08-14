// ============================================================
// AI Coding Assistant — server-side prompt construction.
// Maps a CodingAssistAction to system instructions and builds the
// full system prompt for the configured AI provider.
// ============================================================

import type { CodingAssistAction } from "@/types";

const ACTION_INTRO: Record<CodingAssistAction, string> = {
  explain:
    "Explain the given code as a CS tutor. Include:\n1. Line-by-line explanation\n2. The overall logic\n3. The algorithm in steps\n4. Time and space complexity\nBe precise and use the exact identifiers from the code.",
  debug:
    "Debug the given code like an experienced reviewer:\n1. Identify syntax errors\n2. Identify logical errors\n3. Identify runtime problems\n4. Explain WHY each error occurs\n5. Give the full corrected code\nIf the code looks correct, say so and still suggest one improvement.",
  optimize:
    "Optimize the given code:\n1. Current time complexity and space complexity\n2. Where the bottleneck is\n3. A better algorithm or technique\n4. The optimized code with a brief explanation\nKeep the same language and behavior.",
  tests:
    "Generate test cases for the given code (a function/program reading input and printing output).\nGive 4–6 test cases covering:\n- normal cases\n- edge cases\n- boundary cases\n- stress cases\nFormat each as:\n```\nInput: <lines>\nExpected output: <lines>\n```",
  convert:
    "Convert the given code to the requested target language. Preserve behavior exactly. If a construct has no direct equivalent, explain the idiomatic replacement. Show the full converted code in a fenced block.",
};

export interface AssistRequest {
  action: CodingAssistAction;
  code: string;
  language: string;
  targetLanguage?: string;
  topic?: string;
  testCases?: { input: string; expected: string }[];
  currentError?: string;
}

/** Build the system prompt for a coding-assist request. */
export function buildAssistSystem(request: AssistRequest): string {
  const { action, code, language, targetLanguage, topic, testCases, currentError } = request;

  const sections: string[] = [
    `You are CodeZen's AI coding assistant for a computer science student.`,
    `Action: ${ACTION_INTRO[action]}`,
    `Programming language: ${language}${targetLanguage ? `\nConvert target language: ${targetLanguage}` : ""}`,
  ];
  if (topic) sections.push(`Related topic for context: ${topic}.`);
  if (currentError) sections.push(`Current error/output from the runner:\n${currentError}`);
  if (testCases && testCases.length > 0) {
    sections.push(
      `Existing test cases:\n${testCases.map((t) => `Input: ${t.input || "(none)"}\nExpected: ${t.expected || "(none)"}`).join("\n\n")}`,
    );
  }
  sections.push(`The code to work on:\n\`\`\`${language}\n${code}\n\`\`\``);
  sections.push(
    "Format your answer in clean Markdown the app renders: headings, bold, bullet lists and fenced code blocks. Be accurate; never invent API behavior you are unsure about.",
  );

  return sections.join("\n\n");
}
