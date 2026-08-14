"use client";

// Tiny markdown renderer for AI tutor replies.
// Supports: code fences, inline code, **bold**, lists,
// headings (#) and auto-linked URLs. Plain text everywhere else.

import * as React from "react";
import { cn } from "@/lib/utils";

function renderInline(text: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  const regex = /(`[^`]+`|\*\*[^*]+\*\*|https?:\/\/[^\s)]+)/g;
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
          className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-[0.85em]"
        >
          {token.slice(1, -1)}
        </code>,
      );
    } else if (token.startsWith("**")) {
      nodes.push(
        <strong key={key++} className="font-semibold">
          {token.slice(2, -2)}
        </strong>,
      );
    } else {
      nodes.push(
        <a
          key={key++}
          href={token}
          target="_blank"
          rel="noopener noreferrer"
          className="break-all text-primary underline underline-offset-2 hover:text-primary/80"
        >
          {token}
        </a>,
      );
    }
    lastIndex = match.index + token.length;
  }
  if (lastIndex < text.length) nodes.push(text.slice(lastIndex));
  return nodes;
}

function renderBlock(content: string): React.ReactNode[] {
  const lines = content.split("\n");
  const blocks: React.ReactNode[] = [];
  let paragraph: string[] = [];
  let listType: "ul" | "ol" | null = null;
  let listItems: string[] = [];
  let key = 0;

  const flushParagraph = () => {
    if (paragraph.length === 0) return;
    blocks.push(
      <p key={key++} className="leading-relaxed">
        {renderInline(paragraph.join(" "))}
      </p>,
    );
    paragraph = [];
  };

  const flushList = () => {
    if (listType === null || listItems.length === 0) return;
    const Tag = listType === "ul" ? "ul" : "ol";
    blocks.push(
      <Tag
        key={key++}
        className={cn("my-1.5 space-y-1 pl-5", listType === "ul" ? "list-disc" : "list-decimal")}
      >
        {listItems.map((item, i) => (
          <li key={i} className="leading-relaxed">
            {renderInline(item)}
          </li>
        ))}
      </Tag>,
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

    if (trimmed.startsWith("### ")) {
      flushParagraph();
      flushList();
      blocks.push(
        <h4 key={key++} className="mt-1 font-semibold">
          {renderInline(trimmed.slice(4))}
        </h4>,
      );
      continue;
    }

    const ulMatch = /^[-•]\s+(.*)$/.exec(trimmed);
    if (ulMatch) {
      flushParagraph();
      if (listType !== "ul") {
        flushList();
        listType = "ul";
      }
      listItems.push(ulMatch[1]);
      continue;
    }

    const olMatch = /^\d+[.)]\s+(.*)$/.exec(trimmed);
    if (olMatch) {
      flushParagraph();
      if (listType !== "ol") {
        flushList();
        listType = "ol";
      }
      listItems.push(olMatch[1]);
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
  const parts = content.split(/```/);
  const nodes: React.ReactNode[] = [];
  let key = 0;

  parts.forEach((part, i) => {
    if (i % 2 === 1) {
      // Inside a code fence — strip optional language tag.
      const code = part.replace(/^[a-zA-Z]+\n/, "").replace(/\n$/, "");
      nodes.push(
        <pre
          key={key++}
          className="my-2 overflow-x-auto rounded-xl bg-muted/80 p-3 text-[0.85rem] leading-relaxed"
        >
          <code className="font-mono">{code}</code>
        </pre>,
      );
    } else if (part.trim().length > 0) {
      nodes.push(<div key={key++}>{renderBlock(part)}</div>);
    }
  });

  return <div className={cn("space-y-1.5", className)}>{nodes}</div>;
}
