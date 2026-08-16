"use client";

import React, { useState } from "react";
import { Check, Copy, Code2 } from "lucide-react";
import { cn } from "@/lib/utils";

function CodeBlock({ code, language }: { code: string; language: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="group relative my-3 overflow-hidden rounded-xl border border-white/10 bg-slate-950/90 text-slate-100 shadow-xl">
      {/* Code Header Bar */}
      <div className="flex items-center justify-between border-b border-white/10 bg-slate-900/80 px-4 py-2 text-xs text-slate-400 font-mono">
        <div className="flex items-center gap-2">
          <Code2 className="h-3.5 w-3.5 text-indigo-400" />
          <span className="uppercase tracking-wider font-semibold text-[11px] text-slate-300">
            {language || "code"}
          </span>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-medium text-slate-300 transition-all hover:bg-white/10 hover:text-white"
        >
          {copied ? (
            <>
              <Check className="h-3 w-3 text-emerald-400" />
              <span className="text-emerald-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code Content */}
      <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-slate-200">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function renderInline(text: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  const regex = /(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*|https?:\/\/[^\s)]+)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }
    const token = match[0];
    if (token.startsWith("`") && token.endsWith("`")) {
      nodes.push(
        <code
          key={key++}
          className="rounded-md border border-indigo-500/20 bg-indigo-500/10 px-1.5 py-0.5 font-mono text-[0.85em] font-semibold text-indigo-300"
        >
          {token.slice(1, -1)}
        </code>
      );
    } else if (token.startsWith("**") && token.endsWith("**")) {
      nodes.push(
        <strong key={key++} className="font-bold text-slate-100">
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith("*") && token.endsWith("*")) {
      nodes.push(
        <em key={key++} className="italic text-slate-200">
          {token.slice(1, -1)}
        </em>
      );
    } else {
      nodes.push(
        <a
          key={key++}
          href={token}
          target="_blank"
          rel="noopener noreferrer"
          className="break-all font-medium text-indigo-400 underline underline-offset-2 hover:text-indigo-300"
        >
          {token}
        </a>
      );
    }
    lastIndex = match.index + token.length;
  }
  if (lastIndex < text.length) nodes.push(text.slice(lastIndex));
  return nodes;
}

interface ListItemData {
  num?: number;
  text: string;
}

function renderBlock(content: string): React.ReactNode[] {
  const lines = content.split("\n");
  const blocks: React.ReactNode[] = [];
  let paragraph: string[] = [];
  let listType: "ul" | "ol" | null = null;
  let listItems: ListItemData[] = [];
  let key = 0;

  const flushParagraph = () => {
    if (paragraph.length === 0) return;
    const fullText = paragraph.join(" ");

    // Check if paragraph has smashed MCQ options (e.g., "A) ... B) ... C) ... D) ...")
    const optionSplitRegex = /([A-D][).]\s+[^\s].*?)(?=\s+[A-D][).]\s+|$)/g;
    const optionMatches = fullText.match(optionSplitRegex);

    if (optionMatches && optionMatches.length >= 2) {
      // Split smashed MCQ options onto separate lines!
      const nonOptionPrefix = fullText.split(/[A-D][).]\s+/)[0]?.trim();
      if (nonOptionPrefix) {
        blocks.push(
          <p key={key++} className="leading-relaxed text-slate-200 my-1 font-medium">
            {renderInline(nonOptionPrefix)}
          </p>
        );
      }
      blocks.push(
        <div key={key++} className="my-2 space-y-1 pl-4 font-mono text-xs text-slate-200">
          {optionMatches.map((opt, idx) => (
            <div key={idx} className="flex items-start gap-2 bg-slate-900/60 border border-white/5 rounded-lg px-3 py-1.5 text-slate-200">
              <span className="font-bold text-indigo-400 shrink-0">{opt.slice(0, 2)}</span>
              <span>{renderInline(opt.slice(2).trim())}</span>
            </div>
          ))}
        </div>
      );
    } else {
      blocks.push(
        <p key={key++} className="leading-relaxed text-slate-200 my-1">
          {renderInline(fullText)}
        </p>
      );
    }
    paragraph = [];
  };

  const flushList = () => {
    if (listType === null || listItems.length === 0) return;
    const Tag = listType === "ul" ? "ul" : "ol";
    blocks.push(
      <Tag
        key={key++}
        className={cn(
          "my-2 space-y-1.5 pl-5 text-slate-200",
          listType === "ul" ? "list-disc marker:text-indigo-400" : "list-decimal marker:text-indigo-400 font-semibold"
        )}
      >
        {listItems.map((item, i) => (
          <li key={i} value={item.num} className="leading-relaxed font-normal">
            {renderInline(item.text)}
          </li>
        ))}
      </Tag>
    );
    listType = null;
    listItems = [];
  };

  for (const raw of lines) {
    const line = raw.trimEnd();
    const trimmed = line.trim();

    if (trimmed === "") {
      flushParagraph();
      flushList();
      continue;
    }

    if (trimmed.startsWith("# ")) {
      flushParagraph();
      flushList();
      blocks.push(
        <h2 key={key++} className="mt-4 mb-2 text-xl font-bold tracking-tight text-white border-b border-white/10 pb-1">
          {renderInline(trimmed.slice(2))}
        </h2>
      );
      continue;
    }

    if (trimmed.startsWith("## ")) {
      flushParagraph();
      flushList();
      blocks.push(
        <h3 key={key++} className="mt-3.5 mb-1.5 text-lg font-extrabold tracking-tight text-white">
          {renderInline(trimmed.slice(3))}
        </h3>
      );
      continue;
    }

    if (trimmed.startsWith("### ")) {
      flushParagraph();
      flushList();
      blocks.push(
        <h4 key={key++} className="mt-3 mb-1 text-base font-bold text-indigo-300">
          {renderInline(trimmed.slice(4))}
        </h4>
      );
      continue;
    }

    if (trimmed.startsWith("> ")) {
      flushParagraph();
      flushList();
      blocks.push(
        <blockquote
          key={key++}
          className="my-2.5 rounded-r-xl border-l-4 border-indigo-500 bg-indigo-500/10 px-4 py-2.5 text-sm italic text-slate-200"
        >
          {renderInline(trimmed.slice(2))}
        </blockquote>
      );
      continue;
    }

    // MCQ option line detection (e.g. "A) Option" or "B. Option")
    const optionMatch = /^([A-D])[).]\s+(.*)$/i.exec(trimmed);
    if (optionMatch) {
      flushParagraph();
      flushList();
      blocks.push(
        <div key={key++} className="my-1.5 flex items-start gap-2.5 rounded-xl border border-white/10 bg-slate-900/60 px-3.5 py-2 text-xs text-slate-200">
          <span className="font-bold text-indigo-400 font-mono shrink-0">{optionMatch[1].toUpperCase()})</span>
          <span>{renderInline(optionMatch[2])}</span>
        </div>
      );
      continue;
    }

    const ulMatch = /^[-•*]\s+(.*)$/.exec(trimmed);
    if (ulMatch) {
      flushParagraph();
      if (listType !== "ul") {
        flushList();
        listType = "ul";
      }
      listItems.push({ text: ulMatch[1] });
      continue;
    }

    const olMatch = /^(\d+)[.)]\s+(.*)$/.exec(trimmed);
    if (olMatch) {
      flushParagraph();
      const num = parseInt(olMatch[1], 10);
      if (listType !== "ol") {
        flushList();
        listType = "ol";
      }
      listItems.push({ num, text: olMatch[2] });
      continue;
    }

    if (listType !== null) {
      flushList();
    }
    paragraph.push(line);
  }
  flushParagraph();
  flushList();
  return blocks;
}

export function Markdown({ content, className }: { content: string; className?: string }) {
  if (!content) return null;

  // Split by code blocks ```lang ... ```
  const codeBlockRegex = /```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g;
  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = codeBlockRegex.exec(content)) !== null) {
    const textBefore = content.slice(lastIndex, match.index);
    if (textBefore.trim().length > 0) {
      nodes.push(<div key={key++}>{renderBlock(textBefore)}</div>);
    }
    const language = match[1]?.trim() || "code";
    const code = match[2]?.trim() || "";
    nodes.push(<CodeBlock key={key++} code={code} language={language} />);
    lastIndex = match.index + match[0].length;
  }

  const remaining = content.slice(lastIndex);
  if (remaining.trim().length > 0) {
    nodes.push(<div key={key++}>{renderBlock(remaining)}</div>);
  }

  return <div className={cn("space-y-2 text-sm leading-relaxed", className)}>{nodes}</div>;
}
