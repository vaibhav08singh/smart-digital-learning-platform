// ============================================================
// AI Tutor request analysis.
// Pure, isomorphic logic (no browser APIs) shared by:
//   • the local mock engine (src/data/ai.ts)
//   • the server route handler (src/app/api/tutor/route.ts)
// It turns a raw message + mode + profile + history into a
// structured request: intent, marks, language, subject, topic,
// depth and conversational context.
// ============================================================

import {
  algorithmComplexity,
  knowledgeBase,
  type TopicKnowledge,
} from "@/data/cs-knowledge";
import { detectCsSubject, type CsSubject } from "@/data/cs-subjects";
import type { ChatMessage, StudentProfile } from "@/types";
import type { StudyModeId } from "@/data/ai";

export type TutorIntent =
  | "greeting"
  | "thanks"
  | "about"
  | "hint"
  | "answer"
  | "next"
  | "debug"
  | "code"
  | "studyplan"
  | "marks"
  | "interview"
  | "mcq"
  | "gate"
  | "quiz"
  | "teach"
  | "compare"
  | "define"
  | "summarize"
  | "notes"
  | "exam"
  | "practice"
  | "simple"
  | "example"
  | "explain"
  | "fallback";

export type TutorLanguage =
  | "python"
  | "javascript"
  | "typescript"
  | "java"
  | "cpp"
  | "c"
  | "sql";

export type TutorDepth = "beginner" | "intermediate" | "advanced";

export const languageDisplay: Record<TutorLanguage, string> = {
  python: "Python",
  javascript: "JavaScript",
  typescript: "TypeScript",
  java: "Java",
  cpp: "C++",
  c: "C",
  sql: "SQL",
};

export interface TutorContext {
  subject?: CsSubject;
  topic?: TopicKnowledge;
  language?: TutorLanguage;
  intent?: TutorIntent;
}

export interface TutorRequest extends TutorContext {
  intent: TutorIntent;
  mode: StudyModeId;
  marks?: 2 | 5 | 10;
  language?: TutorLanguage;
  subject?: CsSubject;
  topic?: TopicKnowledge;
  wantsCode: boolean;
  wantsExample: boolean;
  count: number;
  depth: TutorDepth;
  complexityKey?: string;
  /** The previous turn's subject/topic/language, if any. */
  context: TutorContext;
  text: string;
  raw: string;
}

// ------------------------------------------------------------------
// Depth from the student's level
// ------------------------------------------------------------------

export function depthForLevel(levelId: string | undefined): TutorDepth {
  switch (levelId) {
    case "postgraduate":
    case "mtech":
    case "advanced":
    case "research":
      return "advanced";
    case "class-11":
    case "class-12":
    case "undergraduate":
    case "btech":
      return "intermediate";
    default:
      return "beginner";
  }
}

// ------------------------------------------------------------------
// Language detection
// ------------------------------------------------------------------

const LANGUAGE_ALIASES: { lang: TutorLanguage; aliases: string[] }[] = [
  { lang: "typescript", aliases: ["typescript", "typescript code"] },
  { lang: "javascript", aliases: ["javascript", "node.js", "nodejs", "node js", "js"] },
  { lang: "python", aliases: ["python", "py"] },
  { lang: "java", aliases: ["java"] },
  { lang: "cpp", aliases: ["c++", "cpp", "c plus plus"] },
  { lang: "c", aliases: ["c language", "in c", "using c", "code in c"] },
  { lang: "sql", aliases: ["sql", "mysql", "postgresql", "postgres"] },
];

export function detectLanguage(text: string): TutorLanguage | undefined {
  const norm = ` ${text.toLowerCase().trim()} `;

  // Non-C languages first (C's aliases are substring-greedy and would
  // swallow "c++"/"c#", so it must be handled last and strictly).
  const nonC = LANGUAGE_ALIASES.filter(({ lang }) => lang !== "c").flatMap(({ lang, aliases }) =>
    aliases.map((a) => ({ lang, alias: a })),
  ).sort((a, b) => b.alias.length - a.alias.length);

  for (const { lang, alias } of nonC) {
    const needle = alias.trim();
    const re = new RegExp(`\\b${needle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?!\\w)`, "i");
    if (re.test(norm)) return lang;
  }

  // C: only when clearly "C" (not "c++"/"c#"), e.g. "in C", "write C code".
  if (/\bc\b/.test(norm) && !/(c\+\+|c#)/.test(norm) && /\b(in|using|write|code|program|programming)\b/.test(norm)) {
    return "c";
  }
  return undefined;
}

// ------------------------------------------------------------------
// Marks extraction ("for 5 marks", "2 mark question", "10m")
// ------------------------------------------------------------------

export function parseMarks(text: string): 2 | 5 | 10 | undefined {
  const m = text.match(/(\d{1,2})\s*[- ]?(?:marks?|m)\b/i);
  if (!m) return undefined;
  const n = parseInt(m[1], 10);
  if (n <= 2) return 2;
  if (n <= 5) return 5;
  return 10;
}

// ------------------------------------------------------------------
// Topic matching — tiered specificity so a specific topic wins over a
// generic one. "AVL trees" must resolve to AVL, not "Trees".
//   Tier 1: exact topic title appears in the message (strongest)
//   Tier 2: longest id keyword that appears word-bounded
//   Tier 3: longest loose keyword substring
// ------------------------------------------------------------------

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function matchTopic(text: string): TopicKnowledge | undefined {
  const norm = text.toLowerCase();

  // Tier 1 — longest title phrase that appears (avoids a short title like
  // "Java" shadowing a longer one like "Binary Search" in the same message).
  let titleHit: TopicKnowledge | undefined;
  let titleLen = 0;
  for (const t of knowledgeBase) {
    const title = t.title.toLowerCase();
    if (title.length > titleLen && norm.includes(title)) {
      titleHit = t;
      titleLen = title.length;
    }
  }
  if (titleHit) return titleHit;

  // Tier 2 — word-bounded id/keyword, longest wins.
  let best: TopicKnowledge | undefined;
  let bestLen = 0;
  for (const t of knowledgeBase) {
    const terms = [t.id, ...t.keywords].sort((a, b) => b.length - a.length);
    for (const term of terms) {
      const lower = term.toLowerCase();
      if (new RegExp(`\\b${escapeRegex(lower)}\\b`).test(norm) && lower.length > bestLen) {
        best = t;
        bestLen = lower.length;
        break;
      }
    }
  }
  if (best) return best;

// Tier 3 — loose substring, longest wins (minimum keyword length: 4 chars).
  bestLen = 0;
  for (const t of knowledgeBase) {
    for (const k of t.keywords) {
      if (k.length >= 4 && norm.includes(k.toLowerCase()) && k.length > bestLen) {
        best = t;
        bestLen = k.length;
      }
    }
  }
  return best;
}

// ------------------------------------------------------------------
// Intent detection
// ------------------------------------------------------------------

const RE = {
  greeting: /^(hi|hii+|hiii+|hello|hey|namaste|yo|sup|good morning|good afternoon|good evening|how are you|how's it going|how do you do|what's up|whats up)\b/i,
  thanks: /\b(thank|thanks|thx|dhanyavad)\b/i,
  about: /(who are you|what are you|about you|your name|what can you do|who made you)/i,
  hint: /^hint$/,
  answer: /^(answer|reveal)$/,
  next: /^(next|next question|another one)$/,
  code: /(write|show me|give me|generate).*(code|program|function|implement)|(code|snippet|implementation).*(for|of)|^(code|snippet)\b/,
  studyplan: /(study plan|make me a plan|learning plan)/,
  marks: /(full marks|good marks|score (good|high|full|better)|how to score|exam strategy|important questions|previous year|pyq|pass in exam)/,
  interview: /(interview|viva|placement|job interview|sde|technical round)/,
  compare: /(compare|difference between| vs | and )/,
  mcq: /\b(mcq|mcqs|multiple choice)\b/,
  gate: /(gate|previous year questions|pyq)/,
  quiz: /(quiz me|test me|quiz\b|test\b)/,
  teach: /(from scratch|from zero|learning path|roadmap|teach me (how to |to )?learn|where (do|should) i start|beginner)/,
  define: /(define|definition of|what is( an?)?|what are|what does|meaning of|explain what)/,
  summarize: /(summarize|summary|summarise|tl;?dr|brief (me|it)|short (version|summary))/,
  notes: /(notes|revision notes|make note|note on|crib sheet|cheat sheet)/,
  example: /(example|eg\b|instance|show me|illustrat|demonstrat)/,
  debug: /(bug|error|debug|not working|wrong output|exception|stack trace|why (is|does) my)/,
};

function detectCode(text: string): boolean {
  return (
    /(function\s+\w+\s*\(|def\s+\w+\s*\(|=>|import\s+\w+|public\s+(class|static|void)|const\s+\w+\s*=|let\s+\w+\s*=|package\s+)/.test(
      text,
    ) ||
    text.includes("```")
  );
}

const MODE_INTENT: Record<StudyModeId, TutorIntent> = {
  explain: "explain",
  simple: "simple",
  exam: "exam",
  practice: "practice",
  quiz: "quiz",
  debug: "debug",
  summarize: "summarize",
  notes: "notes",
};

export function detectIntent(
  text: string,
  mode: StudyModeId,
  hasContext: boolean,
): TutorIntent {
  if (RE.greeting.test(text)) return "greeting";
  if (RE.thanks.test(text)) return "thanks";
  if (RE.about.test(text)) return "about";
  if (RE.hint.test(text)) return "hint";
  if (RE.answer.test(text)) return "answer";
  if (RE.next.test(text)) return "next";

  if (detectCode(text)) return "debug";
  if (RE.code.test(text)) return "code";
  if (RE.studyplan.test(text)) return "studyplan";
  if (RE.marks.test(text)) return "marks";
  if (RE.interview.test(text)) return "interview";
  if (RE.compare.test(text)) return "compare";
  if (RE.gate.test(text)) return "gate";
  if (RE.mcq.test(text)) return "mcq";
  if (RE.quiz.test(text)) return "quiz";
  if (RE.teach.test(text)) return "teach";
  if (RE.define.test(text)) return "define";
  if (RE.summarize.test(text)) return "summarize";
  if (RE.notes.test(text)) return "notes";
  if (RE.example.test(text)) {
    // "give an example" without a fresh topic → reuse the last one.
    return hasContext ? "example" : "explain";
  }

  // "write binary search in C++" / "show mergesort in Java" — a language
  // plus a writing verb implies a code request, even without the word "code".
  if (detectLanguage(text) && /\b(write|show|implement|code|generate)\b/.test(text)) {
    return "code";
  }

  // No explicit intent → the study mode the student picked wins.
  return MODE_INTENT[mode] ?? "explain";
}

// ------------------------------------------------------------------
// Conversational context from history
// ------------------------------------------------------------------

export function deriveContext(history: ChatMessage[] = []): TutorContext {
  const list = Array.isArray(history) ? history : [];
  const ctx: TutorContext = {};
  for (const message of list.slice().reverse()) {
    if (!ctx.topic) {
      const topic = matchTopic(message.content);
      if (topic) ctx.topic = topic;
    }
    if (!ctx.subject) {
      const subject = detectCsSubject(message.content);
      if (subject) ctx.subject = subject;
    }
    if (!ctx.language) {
      const language = detectLanguage(message.content);
      if (language) ctx.language = language;
    }
    if (ctx.topic && ctx.subject && ctx.language) break;
  }
  // The subject may not be an alias of the topic ("explain AVL trees" →
  // topic matched, subject not) — bridge the gap via the topic's keywords.
  if (ctx.topic && !ctx.subject) {
    ctx.subject = detectCsSubject(ctx.topic.keywords.join(" "));
  }
  return ctx;
}

// ------------------------------------------------------------------
// Full analysis
// ------------------------------------------------------------------

export function analyzeTutorRequest(
  raw: string,
  mode: StudyModeId,
  profile: StudentProfile,
  history: ChatMessage[],
): TutorRequest {
  const text = raw.trim().toLowerCase();
  const context = deriveContext(history);
  const hasContext = Boolean(context.subject || context.topic || context.language);

  const intent = detectIntent(text, mode, hasContext);
  const language = detectLanguage(text) ?? context.language;
  const marks = parseMarks(text);

  const subject = detectCsSubject(raw) ?? context.subject;
  const topic = matchTopic(raw) ?? (intent === "example" ? context.topic : undefined);
  const wantsCode = detectCode(raw) || intent === "code" || Boolean(language && /(code|write|show|implement)/.test(text));
  const wantsExample = intent === "example" || RE.example.test(text);

  return {
    intent,
    mode,
    marks,
    language,
    subject,
    topic,
    wantsCode,
    wantsExample,
    count: requestedCount(text),
    depth: depthForLevel(profile.levelId),
    complexityKey: findComplexityKey(text),
    context,
    text,
    raw,
  };
}

function findComplexityKey(text: string): string | undefined {
  const norm = text.toLowerCase();
  if (!/(complexity|time|space|big-o|big o|o\(n)/.test(norm)) return undefined;
  const keys = Object.keys(algorithmComplexity).sort((a, b) => b.length - a.length);
  return keys.find((k) => norm.includes(k.toLowerCase()));
}

function requestedCount(text: string): number {
  const match = text.match(/(\d+)\s*(mcq|questions?|mcqs)/);
  if (!match) return 3;
  return Math.min(6, Math.max(1, parseInt(match[1], 10)));
}
