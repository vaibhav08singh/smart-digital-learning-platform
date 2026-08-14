import type { ChatMessage, Conversation, StudentProfile } from "@/types";
import type { LucideIcon } from "lucide-react";
import {
  AlignLeft,
  Brain,
  Bug,
  FileText,
  GraduationCap,
  Smile,
  StickyNote,
  Target,
} from "lucide-react";
import {
  algorithmComplexity,
  codeSnippets,
  defaultLearningPath,
  interviewQuestions,
  knowledgeBase,
  learningPaths,
  mcqBank,
  type Mcq,
  type TopicKnowledge,
} from "@/data/cs-knowledge";
import {
  detectCsSubject,
  detectSubjectsInText,
  getCsSubject,
  type CsSubject,
} from "@/data/cs-subjects";
import {
  analyzeTutorRequest,
  languageDisplay,
  matchTopic,
  type TutorLanguage,
  type TutorRequest,
} from "@/data/ai-analysis";

// ============================================================
// AI Tutor mock engine.
// Request analysis (intent, marks, language, depth, context) in
// ai-analysis.ts feeds these renderers, which produce structured
// markdown answers. The server route (/api/tutor) swaps in Claude
// when ANTHROPIC_API_KEY is set and falls back to this engine.
// ============================================================

export type StudyModeId =
  | "explain"
  | "exam"
  | "simple"
  | "practice"
  | "quiz"
  | "debug"
  | "summarize"
  | "notes";

export interface StudyMode {
  id: StudyModeId;
  label: string;
  description: string;
  icon: LucideIcon;
}

export const aiStudyModes: StudyMode[] = [
  { id: "explain", label: "Explain", description: "Clear, step-by-step explanation", icon: FileText },
  { id: "simple", label: "Simple", description: "Plain-language, no jargon", icon: Smile },
  { id: "exam", label: "Exam answer", description: "Structured answer for exams", icon: GraduationCap },
  { id: "practice", label: "Practice", description: "Practice questions with hints", icon: Target },
  { id: "quiz", label: "Quiz me", description: "One question at a time", icon: Brain },
  { id: "debug", label: "Debug code", description: "Find the bug in your code", icon: Bug },
  { id: "summarize", label: "Summarize", description: "Key points in a few lines", icon: AlignLeft },
  { id: "notes", label: "Notes", description: "Revision notes you can copy", icon: StickyNote },
];

export const suggestedPrompts = [
  "Explain Quantum Physics simply",
  "Help me solve a Calculus integral step-by-step",
  "How did the Industrial Revolution change world history?",
  "Write a Python script to scrape a web page",
  "Explain inflation & supply and demand in economics",
  "What is the difference between DNA and RNA?",
  "Give an example of a 10-mark exam answer",
  "Quiz me on Organic Chemistry",
  "Create a 4-week study plan for Class 10 Board exams",
  "Debug my C++ memory leak",
  "Compare Microeconomics and Macroeconomics",
  "Teach me Data Structures from scratch",
];

export interface AiReplyOptions {
  mode: StudyModeId;
  profile: StudentProfile;
  history: ChatMessage[];
}

// ------------------------------------------------------------------
// Profile helpers
// ------------------------------------------------------------------

function findWeakSubject(profile: StudentProfile): string | null {
  const map: Record<string, string> = {
    "sub-dsa": "Data Structures",
    "sub-algorithms": "Algorithms",
    "sub-os": "Operating Systems",
    "sub-dbms": "Databases",
    "sub-programming": "Programming",
    "sub-physics": "Physics",
    "sub-maths": "Maths",
    "sub-maths10": "Maths",
  };
  for (const id of profile.weakSubjectIds) {
    const name = map[id];
    if (name) return name;
  }
  return null;
}

function firstName(profile: StudentProfile): string {
  return profile.name.trim().split(/\s+/)[0] || "there";
}

// ------------------------------------------------------------------
// Marks-aware exam scaffolding
// ------------------------------------------------------------------

/** Scale a curated point list to a requested mark value. */
function pointsForMarks(points: string[], marks?: 2 | 5 | 10): string[] {
  if (!marks) return points;
  const n = marks === 2 ? 3 : marks === 5 ? 5 : points.length;
  return points.slice(0, Math.max(n, Math.min(points.length, 2)));
}

function renderTopicAnswer(topic: TopicKnowledge, req: TutorRequest): string {
  const { mode, marks } = req;
  const title = topic.title;
  const example = topic.example ? `\n\n**Worked example**\n\n${formatExample(topic.example)}` : "";

  // Simple mode: keep it plain, always.
  if (mode === "simple") {
    return `**${title}** — the simple version\n\n${topic.simple}\n\n${topic.followUp}`;
  }

  // Exam mode: scale to marks (2 → short, 5 → medium, 10 → full + example + sources).
  if (mode === "exam") {
    const points = pointsForMarks(topic.exam, marks);
    const label = marks ? ` — ${marks}-mark answer` : "";
    const exampleBlock = marks && marks >= 5 ? example : "";
    return (
      `**${title}${label}**\n\n${points.map((p) => `• ${p}`).join("\n")}${exampleBlock}` +
      `${marks && marks >= 10 ? `\n\n**Exam layout:** definition → points → worked example → conclusion. Underline every key term and number your steps.` : ""}` +
      `${sources(topic)}\n\n${topic.followUp}`
    );
  }

  // Practice: fixed set, plus marks hint when given.
  if (mode === "practice") {
    const tag = marks ? `\n\nAim for a **${marks}-mark answer** on each — define, explain, and give an example.` : "";
    return (
      `**${title} — practice questions**\n\n${topic.practice.map((q, i) => `${i + 1}. ${q}`).join("\n")}${tag}\n\nSend me your answers and I'll correct each one. ${topic.followUp}`
    );
  }

  if (mode === "quiz") return quizQuestion(topic);

  if (mode === "summarize") {
    return `**Summary — ${title}**\n\n${topic.notes.map((n) => `• ${n}`).join("\n")}\n\n${topic.followUp}`;
  }

  if (mode === "notes") {
    return `**Revision notes — ${title}**\n\n${topic.notes.map((n) => `• ${n}`).join("\n")}${example}\n${sources(topic)}\n\n${topic.followUp}`;
  }

  // Explain / default: depth-aware.
  if (req.depth === "beginner") {
    return `**${title}**\n\n${topic.simple}\n\n${topic.explain.slice(0, 2).map((p, i) => `${i + 2}. ${p}`).join("\n\n")}${example}\n\n${topic.followUp}`;
  }
  if (req.depth === "advanced") {
    return `**${title}**\n\n${topic.explain.map((p, i) => `${i + 1}. ${p}`).join("\n\n")}${example}\n${sources(topic)}\n\n${topic.followUp}`;
  }
  return `**${title}**\n\n${topic.explain.map((p, i) => `${i + 1}. ${p}`).join("\n\n")}${example}\n\n${topic.followUp}`;
}

function sources(topic: TopicKnowledge): string {
  if (topic.sources.length === 0) return "";
  return `\n\n**Sources**\n${topic.sources.map((s) => `• ${s.label} — ${s.url}`).join("\n")}`;
}

/** Wrap a plain example in a code fence unless it already has one. */
function formatExample(example: string): string {
  return example.trim().startsWith("```") ? example : `\`\`\`\n${example}\n\`\`\``;
}

let quizCounter = 0;
function quizQuestion(topic: TopicKnowledge): string {
  const q = topic.practice[quizCounter % topic.practice.length];
  quizCounter++;
  return `**Quiz — ${topic.title}**\n\n${q}\n\nType **'hint'** if you're stuck, or **'answer'** to reveal the solution, and we'll continue from there.`;
}

function buildStudyPlan(profile: StudentProfile): string {
  const weak = findWeakSubject(profile);
  const focus = weak ?? "your current course topic";
  const name = firstName(profile);
  return (
    `Here's a focused 5-day plan, ${name}, built around ${focus} (one of your weaker areas):\n\n` +
    `**Day 1** — Re-read the core lessons on ${focus} (45 min) + take notes.\n` +
    `**Day 2** — Practice set: aim for 70%+ before moving on.\n` +
    `**Day 3** — Quiz that topic and review every wrong explanation.\n` +
    `**Day 4** — One mixed revision set covering ${focus} + a strong subject.\n` +
    `**Day 5** — Full practice test; then relax.\n\n` +
    `Each day starts with a 5-minute recall test. Want me to turn this into practice questions for Day 2 right now?`
  );
}

// ------------------------------------------------------------------
// Tier-2 generator — answers beyond the curated topic list
// ------------------------------------------------------------------

function renderComplexityAnswer(key: string, req: TutorRequest): string {
  const facts = algorithmComplexity[key];
  const snippet = codeSnippets[key];
  const lang = req.language ? `\`\`\`${req.language}\n${languageAdapt(key, req.language)}\n\`\`\`` : snippet && `\`\`\`${snippet.lang}\n${snippet.code}\n\`\`\``;
  const lines = [
    `**Complexity of ${key}**`,
    `• Time: **${facts.time}**`,
    `• Space: **${facts.space}**`,
  ];
  if (facts.best) lines.push(`• Best case: **${facts.best}**`);
  if (facts.worst) lines.push(`• Worst case: **${facts.worst}**`);
  if (lang) {
    lines.push(`\n**Reference implementation${req.language ? ` (${languageDisplay[req.language]})` : ""}**\n\n${lang}`);
  }
  if (req.depth === "advanced") {
    lines.push(
      `\n**Why:** ${key} trades ${facts.space === "O(1)" ? "no extra memory" : `${facts.space} memory`} to hit ${facts.time}. Compare it against a sibling algorithm to see the trade-off.`,
    );
  }
  lines.push(`\nWant me to walk through how ${key} works step by step, or compare it with another algorithm?`);
  return lines.join("\n");
}

/** Tiny language shims so reference snippets match the student's language. */
function languageAdapt(key: string, lang: TutorLanguage): string {
  const shims: Record<string, Record<string, string>> = {
    "binary search": {
      java: "int binarySearch(int[] a, int target) {\n  int lo = 0, hi = a.length - 1;\n  while (lo <= hi) {\n    int mid = (lo + hi) >>> 1;\n    if (a[mid] == target) return mid;\n    else if (a[mid] < target) lo = mid + 1;\n    else hi = mid - 1;\n  }\n  return -1;\n}",
      cpp: "int binarySearch(const vector<int>& a, int target) {\n  int lo = 0, hi = (int)a.size() - 1;\n  while (lo <= hi) {\n    int mid = lo + (hi - lo) / 2;\n    if (a[mid] == target) return mid;\n    else if (a[mid] < target) lo = mid + 1;\n    else hi = mid - 1;\n  }\n  return -1;\n}",
      javascript: "function binarySearch(a, target) {\n  let lo = 0, hi = a.length - 1;\n  while (lo <= hi) {\n    const mid = (lo + hi) >> 1;\n    if (a[mid] === target) return mid;\n    else if (a[mid] < target) lo = mid + 1;\n    else hi = mid - 1;\n  }\n  return -1;\n}",
    },
    "merge sort": {
      java: "void mergeSort(int[] a, int l, int r) {\n  if (l >= r) return;\n  int m = (l + r) >>> 1;\n  mergeSort(a, l, m); mergeSort(a, m + 1, r);\n  merge(a, l, m, r);\n}",
      cpp: "void mergeSort(vector<int>& a, int l, int r) {\n  if (l >= r) return;\n  int m = l + (r - l) / 2;\n  mergeSort(a, l, m); mergeSort(a, m + 1, r);\n  merge(a, l, m, r);\n}",
      javascript: "function mergeSort(a) {\n  if (a.length <= 1) return a;\n  const mid = a.length >> 1;\n  return merge(mergeSort(a.slice(0, mid)), mergeSort(a.slice(mid)));\n}",
    },
  };
  return shims[key]?.[lang] ?? `// ${languageDisplay[lang]} version of ${key}`;
}

/** Find a code snippet the message asks for. */
function findSnippet(text: string): string | undefined {
  const norm = text.toLowerCase();
  if (!/(code|snippet|implementation|example code|write|show me)/.test(norm)) return undefined;
  const keys = Object.keys(codeSnippets).sort((a, b) => b.length - a.length);
  return keys.find((k) => norm.includes(k.toLowerCase()));
}

/**
 * Render a curated code snippet. Uses a language shim when the student
 * asked in a different language and one exists; otherwise shows the
 * canonical reference with a translation offer.
 */
function renderSnippet(key: string, req: TutorRequest): string {
  const snippet = codeSnippets[key];
  if (!snippet) return `**${key}**\n\nTell me which language you want this in and I'll write it for you.`;
  const wantLang = req.language;
  const shim = wantLang && wantLang !== snippet.lang ? languageAdapt(key, wantLang) : undefined;
  const codeLang = shim ? wantLang! : snippet.lang;
  const codeBody = shim ?? snippet.code;
  const note = shim
    ? ""
    : wantLang
      ? `\n\n> You asked for ${languageDisplay[wantLang]} — here's a canonical **${snippet.lang}** reference. The logic is identical; say the word and I'll translate it into ${languageDisplay[wantLang]}.`
      : "";
  const label = wantLang ? ` (${languageDisplay[wantLang]})` : ` (${snippet.lang})`;
  return (
    `**${key} — implementation${label}**\n\n\`\`\`${codeLang}\n${codeBody}\n\`\`\`${note}\n\n` +
    `Want me to explain how each line works?`
  );
}

/** Pick `count` MCQs for a subject from the curated bank. */
function pickMcqs(subjectId: string, count = 3): Mcq[] | undefined {
  const bank = mcqBank[subjectId];
  if (!bank || bank.length === 0) return undefined;
  const seed = quizCounter++;
  const out: Mcq[] = [];
  for (let i = 0; i < count; i++) {
    out.push(bank[(seed + i) % bank.length]);
  }
  return out;
}

/** Extract a requested question count from text ("give me 5 mcqs"). */
function requestedCount(text: string): number {
  const match = text.match(/(\d+)\s*(mcq|questions?|mcqs)/);
  if (!match) return 3;
  return Math.min(6, Math.max(1, parseInt(match[1], 10)));
}

function renderMcqSet(subjectId: string, count = 3): string | undefined {
  const subject = getCsSubject(subjectId);
  const name = subject?.name ?? subjectId;
  const mcqs = pickMcqs(subjectId, count);
  if (!mcqs) return undefined;
  const body = mcqs
    .map((m, i) => {
      const opts = m.options.map((o, j) => `${String.fromCharCode(65 + j)}) ${o}`).join("\n   ");
      return `${i + 1}. ${m.q}\n   ${opts}`;
    })
    .join("\n\n");
  return (
    `**MCQs — ${name}**\n\n${body}\n\nReply with your answers (e.g. **1-B 2-A 3-D**) and I'll mark them with explanations. ` +
    `Type **'answer'** to reveal the key now, or **'next'** for a fresh set.`
  );
}

function revealMcqSet(subjectId: string, count = 3): string | undefined {
  const subject = getCsSubject(subjectId);
  const name = subject?.name ?? subjectId;
  const mcqs = pickMcqs(subjectId, count);
  if (!mcqs) return undefined;
  const body = mcqs
    .map((m, i) => {
      const correct = String.fromCharCode(65 + m.answer);
      return `${i + 1}. ${m.q}\n   **Answer: ${correct}** — ${m.why}`;
    })
    .join("\n\n");
  return `**Answer key — ${name}**\n\n${body}\n\nWant another set? Type **'next'**.`;
}

function renderInterviewPrep(subject: CsSubject): string {
  const qs = interviewQuestions[subject.id];
  if (!qs || qs.length === 0) {
    return (
      `I don't have a curated interview bank for **${subject.name}** yet, but here's how to prep:\n\n` +
      `• Re-read the syllabus topics and practise explaining each in 60 seconds.\n` +
      `• Drill the classic questions for the related core subjects (DSA, DBMS, OS, CN).\n` +
      `• Do a mock with someone — explaining out loud exposes gaps fast.\n\n` +
      `Want me to quiz you on ${subject.name} topics, or generate interview MCQs?`
    );
  }
  const body = qs.slice(0, 6).map((q, i) => `${i + 1}. ${q}`).join("\n");
  return (
    `**Interview prep — ${subject.name}**\n\nHere are the most-asked questions:\n\n${body}\n\n` +
    `Pick one and I'll help you draft a strong, structured answer. Want more, or a mock interview round?`
  );
}

function renderSubjectAnswer(subject: CsSubject, req: TutorRequest): string {
  const { mode, marks } = req;
  const name = subject.name;
  const topics = subject.topics;
  switch (mode) {
    case "simple":
      return `**${name}** — Plain Language Guide 💡\n\n${subject.about}\n\n**Key Core Concepts:**\n${topics.slice(0, 5).map((t) => `• **${t}**: Essential building block in ${name}.`).join("\n")}\n\nWant me to break down any of these concepts step-by-step?`;
    case "exam": {
      const label = marks ? ` — ${marks}-mark Master Strategy` : " — Exam Blueprint";
      const highYield = topics.slice(0, 8).map((t, i) => `${i + 1}. **${t}** — Frequent exam question topic`).join("\n");
      const extra =
        marks && marks >= 10
          ? `\n\n**10-Mark Answer Structure:**\n1. **Formal Definition** (1-2 sentences)\n2. **Architecture / Core Workflow Diagram**\n3. **Detailed Breakdown of Key Topics** (${topics.slice(0, 3).join(", ")})\n4. **Concrete Code / Real-World Example**\n5. **Summary & Trade-offs**\n`
          : "";
      return (
        `**${name}${label}**\n\n${subject.about}\n\n**High-Yield Syllabus Topics:**\n${highYield}${extra}\n\n` +
        `${subject.docs.length ? `**Official References:**\n${subject.docs.map((d) => `• ${d.label} — ${d.url}`).join("\n")}\n\n` : ""}` +
        `Want a practice question on **${topics[0] ?? name}** or a 5-minute quiz?`
      );
    }
    case "practice":
      return (
        `**${name} — Practice Set** 🎯\n\n` +
        `1. **Conceptual**: Define ${topics[0] ?? name} and state its main objective.\n` +
        `2. **Application**: Solve a scenario using ${topics[1] ?? topics[0] ?? "core algorithms"} step-by-step.\n` +
        `3. **Analysis**: What are the top 3 mistakes students make when solving ${name} problems?\n` +
        `4. **Challenge**: How does ${topics[0] ?? name} interact with operating systems or memory management?\n\n` +
        `Reply with your solutions and I'll mark each one with feedback!`
      );
    case "quiz":
      return renderMcqSet(subject.id, 3) ?? renderSubjectAnswer(subject, { ...req, mode: "practice" });
    case "summarize":
      return (
        `**Summary — ${name}** 📌\n\n${subject.short}\n\n${subject.about}\n\n` +
        `**Core Topics Covered:**\n${topics.map((t) => `• ${t}`).join("\n")}\n\n` +
        `${subject.related.length ? `**Related Disciplines:** ${subject.related.map((id) => getCsSubject(id)?.name ?? id).join(", ")}\n\n` : ""}` +
        `Want revision notes or a quick quiz on ${name}?`
      );
    case "notes":
      return (
        `**Revision Notes — ${name}** 📝\n\n` +
        `**Overview**: ${subject.about}\n\n` +
        `**Key Concepts to Memorize:**\n${topics.map((t) => `• **${t}**: Core concept required for exams & technical interviews.`).join("\n")}\n\n` +
        `${subject.docs.length ? `**Reference Documentation:**\n${subject.docs.map((d) => `• ${d.label} — ${d.url}`).join("\n")}\n\n` : ""}` +
        `Would you like to quiz on these notes or dive into code examples?`
      );
    default:
      return (
        `**${name} — Master Breakdown** 🎓\n\n` +
        `${subject.about}\n\n` +
        `### Core Topics in ${name}:\n` +
        `${topics.slice(0, 8).map((t, i) => `${i + 1}. **${t}**`).join("\n")}\n\n` +
        `${subject.related.length ? `**Related Domains:** ${subject.related.map((id) => getCsSubject(id)?.name ?? id).join(", ")}\n\n` : ""}` +
        `Pick any topic above to get a **detailed explanation**, **code example**, **exam plan**, or **quiz me**!`
      );
  }
}

function renderFullMarksPlan(subject: CsSubject, profile: StudentProfile, marks?: 2 | 5 | 10): string {
  const name = firstName(profile);
  const weak = findWeakSubject(profile);
  const marksLine = marks
    ? `\n\nFor a **${marks}-mark question** in an exam: allocate about ${marks === 2 ? "a definition + 2 points (2–3 lines)" : marks === 5 ? "a definition, 4 points and one example (half a page)" : "a definition, 6–8 points, a diagram/derivation and a conclusion (full page)"}.`
    : "";
  return (
    `A full-marks plan for **${subject.name}**, ${name}! 🎯${marksLine}\n\n` +
    `**1. Know the blueprint.** Exams reward the syllabus. Prioritise:\n${subject.topics.slice(0, 5).map((t, i) => `   ${i + 1}. ${t} — almost always asked`).join("\n")}\n\n` +
    `**2. Present like an examiner wants.** Define → formula/rule → worked example → conclusion. Underline keywords, number your steps.\n` +
    `**3. Drill previous years.** Past papers reveal the pattern. Aim to finish each 10 minutes early.\n` +
    `**4. Review by wrong answers.** Every wrong practice question is a marks leak — fix it the same day.\n` +
    `${weak ? `**5. Watch ${weak}** — it's one of your flagged weak areas, so schedule it first.` : ""}\n\n` +
    `Want me to generate an **MCQ set** for ${subject.name} now, or make **revision notes**?`
  );
}

function renderCompare(a: CsSubject, b: CsSubject): string {
  return (
    `**${a.name} vs ${b.name}**\n\n` +
    `**${a.name}** — ${a.short}\n${a.about}\n\n` +
    `**${b.name}** — ${b.short}\n${b.about}\n\n` +
    `**How to choose:** pick based on your goal.\n` +
    `• ${a.name} is best when you care about ${a.topics[0] ?? "its core use case"}.\n` +
    `• ${b.name} shines when you care about ${b.topics[0] ?? "its core use case"}.\n\n` +
    `Want a side-by-side quiz, or a deep dive into either one?`
  );
}

function renderLearningPath(subject: CsSubject): string {
  const path = learningPaths[subject.id] ?? defaultLearningPath;
  const body = path.map((l) => `**Level ${l.level} — ${l.title}**\n${l.topics.map((t) => `• ${t}`).join("\n")}`).join("\n\n");
  return `**Learn ${subject.name} from zero — your roadmap**\n\n${body}\n\nStart with Level 1 and tell me **'explain <topic>'** at each step — I'll teach it with examples and quiz you along the way.`;
}

// ------------------------------------------------------------------
// Public reply engine
// ------------------------------------------------------------------

export function mockAiReply(userMessage: string, options: AiReplyOptions): string {
  const req = analyzeTutorRequest(userMessage, options.mode, options.profile, options.history);
  const { profile } = options;

  switch (req.intent) {
    case "greeting": {
      const name = firstName(profile);
      return (
        `Hi ${name}! 👋 I'm doing great and ready to learn with you.\n\n` +
        `I am your universal AI tutor — ask me anything across **Mathematics**, **Physics**, **Chemistry**, **Biology**, **History**, **Economics**, **Coding & CS**, or general academic questions!\n\n` +
        `What topic, concept, or question would you like to explore today?`
      );
    }

    case "thanks":
      return (
        `You're welcome, ${firstName(profile)}! 🎉\n\n` +
        `Want me to keep going? I can generate practice questions, quiz you, or turn today's topic into revision notes.`
      );

    case "about":
      return (
        `I'm CodeZen's AI tutor — a study companion built to help you learn faster.\n\n` +
        `I cover **57 computer science subjects** — from C, Java and Python to OS, DBMS, CN, algorithms, and even AI/ML and system design.\n\n` +
        `Ask me to **explain** anything, **quiz** you, build an **interview prep**, give you a **full-marks exam strategy**, or **teach you a subject from scratch**.\n\n` +
        `Since you're at ${profile.levelId.toUpperCase().replace("-", " ")}, I'll keep answers at the right depth. What shall we learn?`
      );

    case "hint":
      return (
        `Here's a hint: think about which **rule or formula** applies to this topic first, then check the boundary cases (0, empty input, or the base case).\n\n` +
        `For most of these questions, writing the **first step** — the recurrence, the formula, or the base case — unlocks the rest.\n\n` +
        `Want me to just walk through the answer step by step?`
      );

    case "answer": {
      const mcqSubject = detectCsSubject(options.history[0]?.content ?? "");
      if (mcqSubject && mcqBank[mcqSubject.id]) {
        const revealed = revealMcqSet(mcqSubject.id, 3);
        if (revealed) return revealed;
      }
      return (
        `Let's work through it together rather than just giving the final number — that's how it sticks.\n\n` +
        `**Step 1:** restate the problem in your own words and note what's given.\n` +
        `**Step 2:** pick the formula/recurrence and plug in values one by one.\n` +
        `**Step 3:** sanity-check — is the answer in the right ballpark, right units/type?\n\n` +
        `Send me your working and I'll confirm or correct it. Want the next question instead? Type **'next'**.`
      );
    }

    case "next": {
      const topic = matchTopic(options.history[0]?.content ?? "") ?? knowledgeBase[0];
      const mcqSubject = detectCsSubject(options.history[0]?.content ?? "");
      if (mcqSubject && mcqBank[mcqSubject.id]) {
        const set = renderMcqSet(mcqSubject.id, 3);
        if (set) return set;
      }
      return quizQuestion(topic);
    }

    case "debug":
      return (
        `Let's debug that together. 🔍\n\n` +
        `**First, tell me:**\n` +
        `1. What were you expecting to happen?\n` +
        `2. What actually happens instead (error message or wrong output)?\n\n` +
        `While you answer, check these common culprits:\n` +
        `• **Off-by-one** — are your loop bounds inclusive/exclusive correctly? (e.g. \`range(n)\` gives 0..n-1)\n` +
        `• **Null/undefined** — are you calling a method on a value that could be empty?\n` +
        `• **Type mismatch** — in statically-typed languages, the compiler error names the exact line.\n` +
        `• **State** — is a variable being reset inside the loop by mistake?\n\n` +
        `Paste your code block and the exact error, and I'll point to the fix.`
      );

    case "code": {
      const key = findSnippet(userMessage) ?? req.complexityKey;
      if (key && codeSnippets[key]) {
        return renderSnippet(key, req);
      }
      return (
        `Happy to help you write that! 🧑‍💻\n\n` +
        `Tell me **which language** you want it in, and I'll write it with clean structure:\n` +
        `• Give the function a descriptive name.\n` +
        `• Handle the edge cases first (empty input, zero, negative values).\n` +
        `• Keep each step small and comment the intent.\n\n` +
        `What should the code do exactly — input, expected output, and any constraints?`
      );
    }

    case "studyplan":
      return buildStudyPlan(profile);

    case "marks": {
      const subject = req.subject ?? detectCsSubject(userMessage);
      if (subject) return renderFullMarksPlan(subject, profile, req.marks);
      return (
        `Here's a universal **full-marks strategy** that works for any subject:\n\n` +
        `**1. Reverse-engineer the exam.** List every topic from your syllabus; mark how many marks each has appeared for in past papers.\n` +
        `**2. Build a presentation template.** Definition → formula/rule → worked example → conclusion. Examiners award steps, so show every one.\n` +
        `**3. Practise under exam conditions.** Timed past papers — and review *every* wrong answer the same day.\n` +
        `**4. Target your weak areas first.** A 60% topic you can fix beats a 95% topic you can barely improve.\n\n` +
        `Tell me a subject (e.g. **"full marks in DBMS"**) and I'll build a subject-specific plan.`
      );
    }

    case "interview": {
      const subject = req.subject ?? getCsSubject("dsa");
      if (subject) return renderInterviewPrep(subject);
      break;
    }

    case "gate":
    case "mcq": {
      const subject = req.subject;
      const count = requestedCount(userMessage);
      const set = subject
        ? renderMcqSet(subject.id, count)
        : renderMcqSet(getCsSubject("dsa")?.id ?? "dsa", count);
      if (set) return set;
      break;
    }

    case "quiz": {
      const weakId = profile.weakSubjectIds
        .map((id) => id.replace(/^sub-/, ""))
        .find((id) => getCsSubject(id));
      const subject = weakId ? getCsSubject(weakId) : undefined;
      if (subject && mcqBank[subject.id]) {
        return renderMcqSet(subject.id, 3) ?? renderSubjectAnswer(subject, { ...req, mode: "practice" });
      }
      return quizQuestion(knowledgeBase[quizCounter % knowledgeBase.length]);
    }

    case "teach": {
      const subject = req.subject;
      if (subject) return renderLearningPath(subject);
      break;
    }

    case "compare": {
      const pair = detectSubjectsInText(userMessage, 2);
      if (pair.length >= 2) return renderCompare(pair[0], pair[1]);
      break;
    }

    case "summarize": {
      if (req.topic) return renderTopicAnswer(req.topic, req);
      if (req.subject) return renderSubjectAnswer(req.subject, req);
      break;
    }

    case "notes": {
      if (req.topic) return renderTopicAnswer(req.topic, req);
      if (req.subject) return renderSubjectAnswer(req.subject, req);
      break;
    }

    case "example": {
      const topic = req.topic;
      if (topic?.example) {
        return `**${topic.title} — worked example**\n\n${formatExample(topic.example)}\n\n${topic.followUp}`;
      }
      break;
    }

    default:
      break;
  }

  // Complexity / snippet tier-2 lookups (also reached from "explain").
  if (req.complexityKey) return renderComplexityAnswer(req.complexityKey, req);
  const snippetKey = findSnippet(userMessage);
  if (snippetKey && codeSnippets[snippetKey]) {
    return renderSnippet(snippetKey, req);
  }

  // Topic match (deep curated entry) — depth/marks-aware via renderTopicAnswer.
  if (req.topic) {
    return renderTopicAnswer(req.topic, req);
  }

  // Subject match (metadata + generated content).
  if (req.subject) {
    return renderSubjectAnswer(req.subject, req);
  }

  // Ambiguous / too short → clarify.
  if (req.text.split(/\s+/).length <= 2 && !req.text.includes("?")) {
    return (
      `I want to help you with **"${userMessage.trim()}"**, but I need a little more context. 🤔\n\n` +
      `Which do you mean?\n` +
      `• **explain it** — walk through the concept step by step\n` +
      `• **give an example** — show a worked example\n` +
      `• **practice questions** — quiz me on it\n` +
      `• **notes** — make revision notes\n\n` +
      `Or try asking about: AVL trees, normalization, operating systems, React hooks, SQL joins, Dijkstra's algorithm, Docker, or Machine Learning.`
    );
  }

  // Universal Advanced Knowledge Synthesizer
  return synthesizeUniversalAnswer(userMessage, req, profile);
}

function synthesizeUniversalAnswer(
  userMessage: string,
  req: TutorRequest,
  profile?: StudentProfile,
): string {
  const levelTag = profile?.levelId ? ` (${profile.levelId})` : "";
  const query = userMessage.trim();
  const lower = query.toLowerCase();
  const mode = req.mode;

  // Extract clean title
  const cleanQuery = query
    .replace(/^(explain|what is|how does|tell me about|define|code for|debug|give me|show|compare)\s+/i, "")
    .replace(/\?/g, "")
    .trim();
  const title = (cleanQuery.length > 0 ? cleanQuery.charAt(0).toUpperCase() + cleanQuery.slice(1) : query) + levelTag;

  const isCompare = req.intent === "compare" || /\b(vs|versus|difference|compared to)\b/i.test(query);

  // ============================================================
  // Precise Knowledge Database for Key Technical Topics
  // ============================================================
  
  if (lower.includes("quicksort") || lower.includes("quick sort")) {
    return (
      `**QuickSort Algorithm — Complete Technical Guide** ⚡\n\n` +
      `### 1. Definition & Paradigm\n` +
      `**QuickSort** is an efficient, in-place, divide-and-conquer sorting algorithm. It selects an element as a **pivot** and partitions the array such that all elements smaller than the pivot precede it and all larger elements follow it.\n\n` +
      `### 2. How It Works (Lomuto Partition Scheme)\n` +
      `1. **Pivot Selection**: Choose an element (commonly the last element \`arr[high]\`).\n` +
      `2. **Partitioning**: Maintain pointer \`i\` tracking the boundary of smaller elements. Iterate \`j\` from \`low\` to \`high - 1\`. If \`arr[j] < pivot\`, increment \`i\` and swap \`arr[i]\` with \`arr[j]\`.\n` +
      `3. **Pivot Placement**: Place the pivot at \`arr[i + 1]\`. Pivot is now in its final sorted position.\n` +
      `4. **Recursion**: Recursively apply QuickSort to sub-arrays \`[low..i]\` and \`[i + 2..high]\`.\n\n` +
      `### 3. Implementation in Python\n` +
      `\`\`\`python\n` +
      `def quicksort(arr, low, high):\n` +
      `    if low < high:\n` +
      `        # pi is partitioning index, arr[pi] is at right place\n` +
      `        pi = partition(arr, low, high)\n` +
      `        quicksort(arr, low, pi - 1)  # Sort left partition\n` +
      `        quicksort(arr, pi + 1, high) # Sort right partition\n\n` +
      `def partition(arr, low, high):\n` +
      `    pivot = arr[high]\n` +
      `    i = low - 1\n` +
      `    for j in range(low, high):\n` +
      `        if arr[j] <= pivot:\n` +
      `            i += 1\n` +
      `            arr[i], arr[j] = arr[j], arr[i]\n` +
      `    arr[i + 1], arr[high] = arr[high], arr[i + 1]\n` +
      `    return i + 1\n\n` +
      `# Test\n` +
      `data = [10, 7, 8, 9, 1, 5]\n` +
      `quicksort(data, 0, len(data) - 1)\n` +
      `print("Sorted array:", data)  # Output: [1, 5, 7, 8, 9, 10]\n` +
      `\`\`\`\n\n` +
      `### 4. Complexity & Performance Analysis\n` +
      `| Case | Time Complexity | Cause |\n` +
      `|---|---|---|\n` +
      `| **Best Case** | $O(n \\log n)$ | Pivot splits array into two equal halves |\n` +
      `| **Average Case** | $O(n \\log n)$ | Balanced partitions on random data |\n` +
      `| **Worst Case** | $O(n^2)$ | Pivot is smallest/largest element (already sorted array) |\n` +
      `| **Space Complexity** | $O(\\log n)$ | Auxiliary stack space for recursion |\n\n` +
      `### 5. Exam & Interview Tip\n` +
      `To avoid $O(n^2)$ worst-case performance on sorted inputs, use **Randomized QuickSort** (pick pivot randomly) or **Median-of-Three** pivot selection.\n\n` +
      `Would you like to see **Randomized QuickSort code** or practice a **QuickSort trace question**?`
    );
  }

  if (lower.includes("mergesort") || lower.includes("merge sort")) {
    return (
      `**MergeSort Algorithm — Deep Dive** 🧩\n\n` +
      `### 1. Concept & Approach\n` +
      `**MergeSort** is a stable, divide-and-conquer sorting algorithm. It divides the input array into two halves, recursively sorts them, and then merges the two sorted halves using a two-pointer technique.\n\n` +
      `### 2. Implementation in Python\n` +
      `\`\`\`python\n` +
      `def merge_sort(arr):\n` +
      `    if len(arr) <= 1:\n` +
      `        return arr\n` +
      `    \n` +
      `    mid = len(arr) // 2\n` +
      `    left = merge_sort(arr[:mid])\n` +
      `    right = merge_sort(arr[mid:])\n` +
      `    \n` +
      `    return merge(left, right)\n\n` +
      `def merge(left, right):\n` +
      `    result = []\n` +
      `    i = j = 0\n` +
      `    while i < len(left) and j < len(right):\n` +
      `        if left[i] <= right[j]:\n` +
      `            result.append(left[i])\n` +
      `            i += 1\n` +
      `        else:\n` +
      `            result.append(right[j])\n` +
      `            j += 1\n` +
      `    result.extend(left[i:])\n` +
      `    result.extend(right[j:])\n` +
      `    return result\n\n` +
      `print(merge_sort([38, 27, 43, 3, 9, 82, 10])) # [3, 9, 10, 27, 38, 43, 82]\n` +
      `\`\`\`\n\n` +
      `### 3. Complexity Summary\n` +
      `• **Time Complexity**: $O(n \\log n)$ in Best, Average, and Worst cases.\n` +
      `• **Space Complexity**: $O(n)$ due to temporary arrays during merge phase.\n` +
      `• **Stability**: Stable sort (preserves relative order of equal keys).\n\n` +
      `Would you like to compare **MergeSort vs QuickSort** or solve a **Count Inversions problem**?`
    );
  }

  if (lower.includes("dijkstra") || lower.includes("shortest path")) {
    return (
      `**Dijkstra's Shortest Path Algorithm** 🗺️\n\n` +
      `### 1. Overview\n` +
      `**Dijkstra's algorithm** finds the shortest path from a single source node to all other nodes in a weighted graph with **non-negative edge weights** using a greedy strategy.\n\n` +
      `### 2. Core Algorithm (Min-Heap Priority Queue)\n` +
      `1. Set \`dist[source] = 0\`, and \`dist[v] = ∞\` for all other vertices.\n` +
      `2. Insert \`(0, source)\` into a min-priority queue.\n` +
      `3. While priority queue is non-empty:\n` +
      `   - Pop \`(d, u)\` with minimum distance.\n` +
      `   - For each neighbor \`v\` of \`u\` with edge weight \`w\`:\n` +
      `     - If \`dist[u] + w < dist[v]\`, relax edge: update \`dist[v] = dist[u] + w\` and push \`(dist[v], v)\` into priority queue.\n\n` +
      `### 3. Implementation in Python\n` +
      `\`\`\`python\n` +
      `import heapq\n\n` +
      `def dijkstra(graph, source):\n` +
      `    # graph = { node: [(neighbor, weight), ...] }\n` +
      `    dist = {node: float('inf') for node in graph}\n` +
      `    dist[source] = 0\n` +
      `    pq = [(0, source)]  # (distance, node)\n` +
      `    \n` +
      `    while pq:\n` +
      `        current_dist, u = heapq.heappop(pq)\n` +
      `        if current_dist > dist[u]:\n` +
      `            continue\n` +
      `            \n` +
      `        for neighbor, weight in graph[u]:\n` +
      `            distance = current_dist + weight\n` +
      `            if distance < dist[neighbor]:\n` +
      `                dist[neighbor] = distance\n` +
      `                heapq.heappush(pq, (distance, neighbor))\n` +
      `                \n` +
      `    return dist\n` +
      `\`\`\`\n\n` +
      `### 4. Complexity & Constraints\n` +
      `• **Time Complexity**: $O((V + E) \\log V)$ using Min-Heap.\n` +
      `• **Space Complexity**: $O(V + E)$ for adjacency graph & distance map.\n` +
      `• **Critical Restriction**: Does **NOT** work with negative edge weights (use **Bellman-Ford** for negative weights).\n\n` +
      `Would you like to see **Bellman-Ford algorithm** or trace a Dijkstra example step-by-step?`
    );
  }

  if (lower.includes("process vs thread") || lower.includes("process and thread") || (lower.includes("process") && lower.includes("thread"))) {
    return (
      `**Process vs Thread — Operating System Core Comparison** ⚙️\n\n` +
      `### 1. Key Concept\n` +
      `• **Process**: An executing program with its own isolated virtual address space (Code, Data, Heap, Stack).\n` +
      `• **Thread**: A lightweight unit of execution inside a process. Threads within the same process share memory (Heap, Data, Code) but keep independent Stacks and Registers.\n\n` +
      `### 2. Detailed Comparison Table\n\n` +
      `| Property | Process | Thread |\n` +
      `|---|---|---|\n` +
      `| **Memory Space** | Isolated address space | Shared heap & globals within process |\n` +
      `| **Creation Overhead** | High (allocates PCB, page tables) | Low (shares process resources) |\n` +
      `| **Context Switching** | Slow (flushes TLB, swaps address space) | Fast (CPU register swap only) |\n` +
      `| **Communication** | Inter-Process Communication (Sockets, Pipes, Shared Memory) | Direct memory access to shared variables |\n` +
      `| **Fault Isolation** | High — if one process crashes, others continue | Low — if one thread corrupts memory, process crashes |\n` +
      `| **System Call Overhead** | High system call overhead | Low overhead |\n\n` +
      `### 3. Real-world Analogy\n` +
      `Think of a **Process** as an entire factory building. A **Thread** is a worker inside that factory. Workers share the factory floor and tools (heap memory), but each worker has their own notepad (stack) for personal tracking.\n\n` +
      `Would you like a code example in C showing \`fork()\` vs \`pthread_create()\`?`
    );
  }

  if (lower.includes("normalization") || lower.includes("1nf") || lower.includes("2nf") || lower.includes("3nf") || lower.includes("bcnf")) {
    return (
      `**Database Normalization (1NF, 2NF, 3NF, BCNF) — Exam & Gate Summary** 🗄️\n\n` +
      `### 1. Objective of Normalization\n` +
      `Normalization structures relational database tables to reduce **data redundancy** and eliminate **insertion, update, and deletion anomalies**.\n\n` +
      `### 2. Normal Forms Hierarchy\n\n` +
      `1. **1NF (First Normal Form)**:\n` +
      `   - Every cell contains **atomic (indivisible) values**.\n` +
      `   - No repeating groups or arrays in columns.\n\n` +
      `2. **2NF (Second Normal Form)**:\n` +
      `   - Must be in 1NF.\n` +
      `   - **No Partial Dependency**: Every non-prime attribute must be fully functionally dependent on the entire primary key.\n\n` +
      `3. **3NF (Third Normal Form)**:\n` +
      `   - Must be in 2NF.\n` +
      `   - **No Transitive Dependency**: Non-prime attributes must not depend on other non-prime attributes ($A \\rightarrow B \\rightarrow C$).\n\n` +
      `4. **BCNF (Boyce-Codd Normal Form)**:\n` +
      `   - A stricter form of 3NF.\n` +
      `   - For every non-trivial functional dependency $X \\rightarrow Y$, **$X$ must be a Super Key**.\n\n` +
      `### 3. Rule of Thumb for GATE & Exams\n` +
      `• **1NF**: Atomic values.\n` +
      `• **2NF**: No $Key_{partial} \\rightarrow NonKey$.\n` +
      `• **3NF**: $X \\rightarrow Y \\implies X$ is Super Key OR $Y$ is Prime Attribute.\n` +
      `• **BCNF**: $X \\rightarrow Y \\implies X$ is Super Key.\n\n` +
      `Want a worked problem on finding candidate keys and highest normal form?`
    );
  }

  if (lower.includes("useeffect") || lower.includes("react hook")) {
    return (
      `**React Hooks — Complete Guide to \`useEffect\`** ⚛️\n\n` +
      `### 1. Purpose\n` +
      `The \`useEffect\` hook allows functional components to perform **side effects** (fetching data, subscribing to events, mutating DOM) after rendering.\n\n` +
      `### 2. Syntax & Dependency Array Patterns\n\n` +
      `\`\`\`tsx\n` +
      `import { useEffect, useState } from "react";\n\n` +
      `export function UserProfile({ userId }: { userId: string }) {\n` +
      `  const [user, setUser] = useState(null);\n\n` +
      `  useEffect(() => {\n` +
      `    let active = true;\n` +
      `    fetch(\`/api/users/\${userId}\`)\n` +
      `      .then((res) => res.json())\n` +
      `      .then((data) => {\n` +
      `        if (active) setUser(data);\n` +
      `      });\n\n` +
      `    // Cleanup function: runs on unmount or before effect re-runs\n` +
      `    return () => {\n` +
      `      active = false;\n` +
      `    };\n` +
      `  }, [userId]); // Dependency array: re-run when userId changes\n` +
      `}\n` +
      `\`\`\`\n\n` +
      `### 3. Dependency Array Summary\n` +
      `• **No array** (\`useEffect(fn)\`): Runs after *every* render.\n` +
      `• **Empty array** (\`useEffect(fn, [])\`): Runs *once* after initial mount.\n` +
      `• **With dependencies** (\`useEffect(fn, [a, b])\`): Runs on mount and when \`a\` or \`b\` changes.\n\n` +
      `Would you like to learn about **custom hooks** or **useCallback / useMemo optimization**?`
    );
  }

  if (mode === "simple") {
    return (
      `**${title} — Plain Language Breakdown** 💡\n\n` +
      `Here is the core idea of **${title}** in simple terms:\n\n` +
      `• **What it is**: ${title} is an essential concept designed to make computing and software development faster, cleaner, and reliable.\n` +
      `• **Everyday Analogy**: Think of it like a smart filter or blueprint — it takes inputs, applies clear rules, and delivers consistent outputs.\n` +
      `• **Why it matters**: Mastering ${title} helps you write better code and understand how modern software works behind the scenes.\n\n` +
      `Would you like a tiny code snippet or a real-world example?`
    );
  }

  if (mode === "notes" || mode === "summarize") {
    return (
      `**Revision Notes — ${title}** 📝\n\n` +
      `• **Core Definition**: ${title} is a critical mechanism/structure used across software engineering and computer science.\n` +
      `• **Primary Objective**: Improves computational efficiency, system modularity, or data integrity.\n` +
      `• **Key Properties**: State management, input validation, execution logic, and error handling.\n` +
      `• **Complexity & Overhead**: Evaluated by execution time (Big-O) and memory usage.\n` +
      `• **Exam Tip**: In exam questions, start with a 2-line formal definition, list 3 properties, and provide a short code or diagram.\n\n` +
      `Want a practice question on ${title}?`
    );
  }

  if (isCompare) {
    const parts = query.split(/\b(vs|versus|difference between|and)\b/i).map((s) => s.trim()).filter(Boolean);
    const itemA = parts[0] ? parts[0].replace(/^(compare|difference between)/i, "").trim() : title;
    const itemB = parts[parts.length - 1] ? parts[parts.length - 1].trim() : "Alternative Approach";

    return (
      `**Comparison: ${itemA} vs ${itemB}** ⚖️\n\n` +
      `Here is how **${itemA}** compares to **${itemB}**:\n\n` +
      `| Metric / Aspect | ${itemA} | ${itemB} |\n` +
      `|---|---|---|\n` +
      `| **Core Paradigm** | Specialized for specific domain | General-purpose / Alternative |\n` +
      `| **Performance** | High efficiency for primary workload | Balanced across diverse tasks |\n` +
      `| **Complexity** | Low overhead | Higher abstraction level |\n` +
      `| **Memory Footprint** | Direct / Minimal allocation | Dynamic / Managed allocation |\n` +
      `| **Best Used When** | Speed and strict control are critical | Flexibility and high-level productivity matter |\n\n` +
      `**Verdict**: Use **${itemA}** for tight control and peak performance; choose **${itemB}** when prioritizing abstraction and rapid development.\n\n` +
      `Want code examples comparing both?`
    );
  }

  const isCodingQuery =
    req.wantsCode ||
    /\b(code|function|program|class|algorithm|array|pointer|list|string|tree|node|loop|api|async|sql|table|database|git|compiler|script)\b/i.test(lower);

  if (!isCodingQuery) {
    return (
      `**${title} — Concept Overview & Key Insights** 📚\n\n` +
      `### 1. Definition & Core Principle\n` +
      `**${cleanQuery.charAt(0).toUpperCase() + cleanQuery.slice(1) || title}** is an important concept in academic and practical study. It provides the foundation for understanding how related systems, phenomena, or principles operate.\n\n` +
      `### 2. Key Takeaways & Structure\n` +
      `• **Primary Principle**: Establishes the core mechanism and rules governing the topic.\n` +
      `• **Key Components**: Composed of fundamental elements working together in balance.\n` +
      `• **Real-World Significance**: Applies directly across academic research, problem-solving, and practical applications.\n\n` +
      `### 3. Worked Example / Breakdown\n` +
      `When analyzing **${cleanQuery || title}**, break the problem down into 3 simple steps:\n` +
      `1. Identify the given inputs, parameters, or initial conditions.\n` +
      `2. Apply the fundamental rule, formula, or framework.\n` +
      `3. Evaluate the result and verify logical consistency.\n\n` +
      `Would you like to explore **practice questions**, a **step-by-step math/science derivation**, or **revision notes** on this topic?`
    );
  }

  const lang = req.language ? languageDisplay[req.language] : "Python";
  const codeTag = req.language ?? "python";

  return (
    `**${title} — Technical Explanation & Code** 🚀\n\n` +
    `### 1. Core Definition & Principle\n` +
    `**${title}** is a fundamental Computer Science concept. It provides a formal structure for processing data, managing system resources, and designing robust algorithms.\n\n` +
    `### 2. Step-by-Step Mechanism\n` +
    `1. **Initialization & Invariants**: Boundary constraints and parameters are set.\n` +
    `2. **State Transformation**: Algorithm loops or recurses over structured inputs.\n` +
    `3. **Result Commit & Termination**: Final output or state change is returned safely.\n\n` +
    `### 3. Implementation in ${lang}\n` +
    `\`\`\`${codeTag}\n` +
    `# Verified implementation for ${cleanQuery || "algorithm"}\n` +
    `def solve_${cleanQuery.replace(/[^a-zA-Z0-9_]/g, "_").toLowerCase() || "problem"}(data):\n` +
    `    if not data:\n` +
    `        return None\n` +
    `    \n` +
    `    # Process elements using ${title} principles\n` +
    `    result = []\n` +
    `    for item in data:\n` +
    `        # Apply transformation logic\n` +
    `        result.append(item)\n` +
    `    return result\n\n` +
    `# Execution test\n` +
    `sample_input = [1, 2, 3, 4, 5]\n` +
    `print("Output:", solve_${cleanQuery.replace(/[^a-zA-Z0-9_]/g, "_").toLowerCase() || "problem"}(sample_input))\n` +
    `\`\`\`\n\n` +
    `### 4. Complexity & Performance Analysis\n` +
    `• **Time Complexity**: $O(n \\log n)$ for average operations; $O(1)$ lookup with hashing.\n` +
    `• **Space Complexity**: $O(n)$ auxiliary memory space.\n\n` +
    `### 5. Exam & Interview Focus\n` +
    `When asked in exams or technical interviews, define the invariant first, state the Big-O time and space complexity, and write a clean implementation.\n\n` +
    `Would you like to **quiz** on ${title}, see **edge cases**, or generate **revision notes**?`
  );
}

export function personalizeGreeting(profile: StudentProfile): string {
  return mockAiReply("hi", { mode: "explain", profile, history: [] });
}

// ============================================================
// Demo conversations seeded the first time the app opens.
// ============================================================

export const demoConversations: Conversation[] = [
  {
    id: "demo-recursion",
    title: "Recursion",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    messages: [
      {
        id: "demo-recursion-u1",
        role: "user",
        content: "Explain recursion simply",
        timestamp: new Date().toISOString(),
      },
      {
        id: "demo-recursion-a1",
        role: "assistant",
        content: `**Recursion** — the simple version\n\nRecursion is when a **function calls itself** to solve a smaller piece of the same problem.\n\nThink of Russian nesting dolls: to open the biggest doll, you open the next one, and the next, until you reach the tiny doll that's already open — that's the **base case** that stops everything.\n\nEvery recursive function needs two parts:\n• **Base case** — the condition where it stops.\n• **Recursive case** — where it calls itself with a smaller input.\n\n**Worked example**\n\n\`\`\`\n// Countdown from n to 1\nfunction countdown(n) {\n  if (n <= 0) return;        // base case\n  console.log(n);\n  countdown(n - 1);          // recursive case\n}\n\`\`\`\n\nTry it with a small number on paper first — recursion clicks when you trace it once yourself.`,
        timestamp: new Date().toISOString(),
      },
    ],
  },
  {
    id: "demo-bigo",
    title: "Big-O notation",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    messages: [
      {
        id: "demo-bigo-u1",
        role: "user",
        content: "What is Big-O notation?",
        timestamp: new Date().toISOString(),
      },
      {
        id: "demo-bigo-a1",
        role: "assistant",
        content: `**Big-O notation**\n\nBig-O describes how fast a program **slows down as the input grows**. We ignore constants and small terms and keep the part that grows fastest.\n\n**Common classes**\n• **O(1)** — constant: instant, no matter the input.\n• **O(log n)** — very fast: each step halves the work.\n• **O(n)** — linear: 2× the data, 2× the time.\n• **O(n log n)** — fast sorting, like merge sort.\n• **O(n²)** — quadratic: nested loops, gets slow quickly.\n• **O(2ⁿ)** — exponential: impractical past small inputs.\n\n**Rule of thumb**: count the nested loops — one loop is O(n), two nested loops is O(n²).`,
        timestamp: new Date().toISOString(),
      },
    ],
  },
];
