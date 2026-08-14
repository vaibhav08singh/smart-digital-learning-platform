import type { ReactNode } from "react";

// Lightweight syntax highlighter — tokenizes code into styled spans.
// Covers the languages in the Coding Lab (C, C++, Java, Python, JS,
// TS, Go, Rust, PHP, C#, Kotlin, Swift, SQL) via a shared token model.

export type TokenType = "keyword" | "string" | "comment" | "number" | "function" | "plain";

export interface Token {
  type: TokenType;
  text: string;
}

const KEYWORDS = new Set([
  "break", "case", "catch", "class", "const", "continue", "default", "delete", "do", "else",
  "enum", "export", "extends", "extern", "false", "final", "finally", "for", "foreach", "from",
  "func", "function", "global", "go", "if", "implements", "import", "in", "instanceof",
  "interface", "lambda", "let", "match", "module", "namespace", "new", "nil", "none", "not",
  "null", "package", "pass", "private", "protected", "public", "return", "select", "static",
  "struct", "super", "switch", "this", "throw", "trait", "true", "try", "type", "typeof", "val",
  "var", "virtual", "void", "while", "with", "yield", "async", "await", "def", "elif", "elsif", "and",
  "or", "print", "println", "puts", "printf", "self", "fn", "use", "mut", "impl", "pub", "create", "insert", "values",
  "into", "where", "order", "by", "group", "having", "join", "inner", "left", "right", "outer",
  "on", "as", "from", "set", "update", "delete", "drop", "table", "index", "primary", "key",
  "references", "is", "like", "between", "distinct", "desc", "asc", "sub", "my", "local",
  "read", "then", "fi", "done", "end", "begin", "program", "section", "mov", "int", "eax", "ebx",
  "ecx", "edx", "defmodule", "putStrLn", "say", "cat", "echo", "writeln", "write",
]);

const TOKEN_RE =
  /(\/\/[^\n]*|\/\*[\s\S]*?\*\/|#[^\n]*|--[^\n]*|\/\*[^\n]*|'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*`|\b\d[\d_.]*\b|\b[a-zA-Z_]\w*\b)/g;

export function tokenize(code: string): Token[] {
  const tokens: Token[] = [];
  let last = 0;
  let match: RegExpExecArray | null;
  TOKEN_RE.lastIndex = 0;

  while ((match = TOKEN_RE.exec(code)) !== null) {
    if (match.index > last) {
      tokens.push({ type: "plain", text: code.slice(last, match.index) });
    }
    const value = match[0];
    let type: TokenType = "plain";

    if (value.startsWith("//") || value.startsWith("/*") || value.startsWith("#") || value.startsWith("--")) {
      type = "comment";
    } else if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'")) ||
      (value.startsWith("`") && value.endsWith("`"))
    ) {
      type = "string";
    } else if (/^\d/.test(value)) {
      type = "number";
    } else if (KEYWORDS.has(value)) {
      type = "keyword";
    } else {
      // Identifier — highlight as a function call when followed by "(".
      const rest = code.slice(match.index + value.length);
      if (/^\s*\(/.test(rest)) type = "function";
    }
    tokens.push({ type, text: value });
    last = match.index + value.length;
  }

  if (last < code.length) {
    tokens.push({ type: "plain", text: code.slice(last) });
  }
  return tokens;
}

const tokenClass: Record<TokenType, string> = {
  keyword: "text-violet-400",
  string: "text-amber-300",
  comment: "text-emerald-500/60 italic",
  number: "text-orange-300",
  function: "text-sky-300",
  plain: "text-slate-200",
};

export function highlightCode(code: string): ReactNode[] {
  const lines = code.split("\n");
  return lines.map((line, i) => (
    <div key={i} className="whitespace-pre">
      {tokenize(line).map((tok, j) => (
        <span key={j} className={tokenClass[tok.type]}>
          {tok.text}
        </span>
      ))}
    </div>
  ));
}
