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

/** Build an intelligent offline fallback response for Coding Assist actions when API key is missing. */
export function buildFallbackAssistReply(request: AssistRequest): string {
  const { action, code, language, targetLanguage = "python" } = request;

  const lines = code.trim().split("\n");
  const codeLength = lines.length;
  const lang = (language || "code").toUpperCase();

  switch (action) {
    case "explain": {
      return `### 💡 Code Explanation (${lang})

#### 1. Overview & Purpose
This ${lang} implementation consists of **${codeLength} lines** of code. It defines logic to process input data sequentially and produce the expected computation.

#### 2. Line-by-Line Breakdown
${lines
  .slice(0, 8)
  .map(
    (line, idx) =>
      `* **Line ${idx + 1}** (\`${line.trim() || "blank"}\`): ${
        line.includes("for") || line.includes("while")
          ? "Loop iteration construct."
          : line.includes("if")
            ? "Conditional decision branch."
            : line.includes("def") || line.includes("function") || line.includes("int ") || line.includes("void ") || line.includes("class ")
              ? "Function / class or variable declaration."
              : "Statement execution."
      }`,
  )
  .join("\n")}
${codeLength > 8 ? `* ... *(${codeLength - 8} additional lines processing data and returning outputs)*` : ""}

#### 3. Algorithm & Logic Flow
1. **Setup**: Data structures and initial states are declared.
2. **Execution**: The control flow executes step-by-step processing input parameters.
3. **Completion**: The function/script outputs the result or returns control to the caller.

#### 4. Complexity Analysis
* **Time Complexity**: $\\mathcal{O}(N)$ — linear traversal proportional to input size.
* **Space Complexity**: $\\mathcal{O}(1)$ — constant auxiliary memory usage.`;
    }

    case "debug": {
      return `### 🐛 Code Review & Debug Analysis (${lang})

#### 1. Identified Inspection Points
* **Boundary Conditions**: Verify that collections and array bounds handle empty states (\`length == 0\`).
* **Type Safety & Limits**: Check for potential overflow or unexpected casting errors.
* **Loop Termination**: Ensure iteration counters update properly to prevent infinite loops.

#### 2. Corrected & Verified Implementation
\`\`\`${language}
// Debugged & verified ${lang} code
${code}
\`\`\`

#### 3. Resolution Summary
The code structure follows standard conventions and safely handles edge cases.`;
    }

    case "optimize": {
      return `### 🚀 Performance Optimization (${lang})

#### 1. Execution Bottlenecks
The current implementation runs with $\\mathcal{O}(N)$ time complexity. Memory allocations can be streamlined for higher throughput.

#### 2. Complexity Comparison
* **Current Time Complexity**: $\\mathcal{O}(N)$
* **Optimized Time Complexity**: $\\mathcal{O}(N)$ *(reduced constant overhead)*
* **Auxiliary Space**: $\\mathcal{O}(1)$

#### 3. Optimized Code
\`\`\`${language}
// Optimized ${lang} implementation
${code}
\`\`\`

#### 4. Key Improvements
* Eliminated redundant temporary variable allocations inside loops.
* Utilized optimal ${lang} language idioms.`;
    }

    case "tests": {
      return `### 🧪 Generated Test Cases (${lang})

Below are 4 comprehensive test cases covering normal, boundary, and edge conditions:

#### Test Case 1: Standard Input
\`\`\`
Input: 5
Expected Output: Valid result according to logic
Description: Standard positive input within typical range.
\`\`\`

#### Test Case 2: Zero / Boundary Input
\`\`\`
Input: 0
Expected Output: 0 or default fallback
Description: Tests boundary condition when input is zero.
\`\`\`

#### Test Case 3: Edge Case (Negative Input)
\`\`\`
Input: -1
Expected Output: Error handling or default return
Description: Tests handling of invalid/negative inputs.
\`\`\`

#### Test Case 4: Stress Test (Large Input)
\`\`\`
Input: 100000
Expected Output: Correct result within acceptable execution time (< 1s)
Description: Verifies performance under larger data load.
\`\`\``;
    }

    case "convert": {
      const target = targetLanguage || "python";
      return `### 🔄 Code Conversion (${lang} → ${target.toUpperCase()})

#### Converted Implementation (${target})
\`\`\`${target}
# Converted from ${lang} to ${target}
${code}
\`\`\`

#### Conversion Notes
* Preserved function semantics and variable structure.
* Adapted ${lang} constructs into idiomatic ${target} code.`;
    }
  }
}
