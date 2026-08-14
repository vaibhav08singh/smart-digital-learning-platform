"use client";

import { useMemo, useRef, useState } from "react";
import { Check, Clipboard, Eraser, Maximize2, Minimize2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { highlightCode } from "./code-highlight";
import { cn } from "@/lib/utils";

const EDITOR_FONT = "font-mono text-[13px] leading-6";
const FONT_STYLE: React.CSSProperties = {
  fontFamily: 'ui-monospace, SFMono-Regular, SF Mono, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  fontSize: "13px",
  lineHeight: "24px",
  letterSpacing: "0px",
  tabSize: 2,
  WebkitFontSmoothing: "antialiased",
};

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  onSave?: () => void;
  autoSaveLabel?: string;
  readOnly?: boolean;
  placeholder?: string;
}

export function CodeEditor({
  value,
  onChange,
  onSave,
  autoSaveLabel,
  readOnly = false,
  placeholder,
}: CodeEditorProps) {
  const [scrollTop, setScrollTop] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [activeLine, setActiveLine] = useState(1);
  const [copied, setCopied] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const taRef = useRef<HTMLTextAreaElement>(null);

  const lineCount = useMemo(() => value.split("\n").length, [value]);
  const highlighted = useMemo(() => highlightCode(value), [value]);

  function syncCursorLine() {
    if (!taRef.current) return;
    const pos = taRef.current.selectionStart;
    const lineNum = value.slice(0, pos).split("\n").length;
    setActiveLine(lineNum);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    const ta = e.currentTarget;
    const isCmdOrCtrl = e.metaKey || e.ctrlKey;

    // Save shortcut: Cmd+S / Ctrl+S
    if (isCmdOrCtrl && e.key.toLowerCase() === "s") {
      e.preventDefault();
      onSave?.();
      return;
    }

    // Toggle comment shortcut: Cmd+/ or Ctrl+/
    if (isCmdOrCtrl && e.key === "/") {
      e.preventDefault();
      const pos = ta.selectionStart;
      const lines = value.split("\n");
      let charCount = 0;
      let targetIdx = 0;

      for (let i = 0; i < lines.length; i++) {
        if (charCount + lines[i].length >= pos) {
          targetIdx = i;
          break;
        }
        charCount += lines[i].length + 1;
      }

      const currentLine = lines[targetIdx];
      const commentPrefix = currentLine.trimStart().startsWith("#") ? "# " : "// ";
      if (currentLine.trimStart().startsWith("# ") || currentLine.trimStart().startsWith("// ")) {
        lines[targetIdx] = currentLine.replace(/^(\s*)(?:#\s?|\/\/\s?)/, "$1");
      } else {
        lines[targetIdx] = currentLine.replace(/^(\s*)/, `$1${commentPrefix}`);
      }

      const next = lines.join("\n");
      onChange(next);
      setTimeout(() => {
        if (taRef.current) {
          taRef.current.selectionStart = taRef.current.selectionEnd = pos;
          syncCursorLine();
        }
      }, 0);
      return;
    }

    // Move line up: Alt+ArrowUp
    if (e.altKey && !e.shiftKey && e.key === "ArrowUp") {
      e.preventDefault();
      const lines = value.split("\n");
      const currentIdx = activeLine - 1;
      if (currentIdx > 0) {
        const temp = lines[currentIdx];
        lines[currentIdx] = lines[currentIdx - 1];
        lines[currentIdx - 1] = temp;
        onChange(lines.join("\n"));
        setTimeout(() => {
          if (taRef.current) {
            let newPos = 0;
            for (let i = 0; i < currentIdx - 1; i++) newPos += lines[i].length + 1;
            taRef.current.selectionStart = taRef.current.selectionEnd = newPos;
            syncCursorLine();
          }
        }, 0);
      }
      return;
    }

    // Move line down: Alt+ArrowDown
    if (e.altKey && !e.shiftKey && e.key === "ArrowDown") {
      e.preventDefault();
      const lines = value.split("\n");
      const currentIdx = activeLine - 1;
      if (currentIdx < lines.length - 1) {
        const temp = lines[currentIdx];
        lines[currentIdx] = lines[currentIdx + 1];
        lines[currentIdx + 1] = temp;
        onChange(lines.join("\n"));
        setTimeout(() => {
          if (taRef.current) {
            let newPos = 0;
            for (let i = 0; i <= currentIdx + 1; i++) newPos += lines[i].length + 1;
            taRef.current.selectionStart = taRef.current.selectionEnd = Math.max(0, newPos - 1);
            syncCursorLine();
          }
        }, 0);
      }
      return;
    }

    // Duplicate line below: Shift+Alt+ArrowDown
    if (e.altKey && e.shiftKey && e.key === "ArrowDown") {
      e.preventDefault();
      const lines = value.split("\n");
      const currentIdx = activeLine - 1;
      lines.splice(currentIdx + 1, 0, lines[currentIdx]);
      onChange(lines.join("\n"));
      setTimeout(() => {
        if (taRef.current) {
          let newPos = 0;
          for (let i = 0; i <= currentIdx + 1; i++) newPos += lines[i].length + 1;
          taRef.current.selectionStart = taRef.current.selectionEnd = Math.max(0, newPos - 1);
          syncCursorLine();
        }
      }, 0);
      return;
    }

    // Tab key auto-indent
    if (e.key === "Tab") {
      e.preventDefault();
      const start = ta.selectionStart;
      const end = ta.selectionEnd;
      const next = value.slice(0, start) + "  " + value.slice(end);
      onChange(next);
      setTimeout(() => {
        if (taRef.current) {
          taRef.current.selectionStart = taRef.current.selectionEnd = start + 2;
          syncCursorLine();
        }
      }, 0);
      return;
    }

    // Enter key auto-indent
    if (e.key === "Enter") {
      e.preventDefault();
      const start = ta.selectionStart;
      const end = ta.selectionEnd;
      const before = value.slice(0, start);
      const lineStart = before.lastIndexOf("\n") + 1;
      const indent = before.slice(lineStart).match(/^[ \t]*/)?.[0] ?? "";
      const next = before + "\n" + indent + value.slice(end);
      onChange(next);
      const pos = start + 1 + indent.length;
      setTimeout(() => {
        if (taRef.current) {
          taRef.current.selectionStart = taRef.current.selectionEnd = pos;
          syncCursorLine();
        }
      }, 0);
      return;
    }

    // Instant cursor line sync on arrow keys & navigation keys
    if (
      ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Home", "End", "PageUp", "PageDown", "Backspace", "Delete"].includes(e.key)
    ) {
      setTimeout(syncCursorLine, 0);
      requestAnimationFrame(syncCursorLine);
    }
  }

  function handleFormat() {
    const formatted = value
      .replace(/\t/g, "  ")
      .split("\n")
      .map((l) => l.replace(/\s+$/, ""))
      .join("\n")
      .replace(/\n{3,}/g, "\n\n");
    onChange(formatted);
  }

  function handleClear() {
    onChange("");
    taRef.current?.focus();
    setActiveLine(1);
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard unavailable
    }
  }

  const editor = (
    <div className="relative flex h-full overflow-hidden rounded-xl border bg-[#0b1020]">
      {/* Line numbers gutter */}
      <div
        className="w-12 shrink-0 select-none border-r border-slate-800/60 bg-[#080c18] py-4 pr-3 text-right font-mono text-[13px] leading-6 z-20"
        aria-hidden
      >
        <div style={{ transform: `translateY(${-scrollTop}px)` }}>
          {Array.from({ length: lineCount }, (_, i) => (
            <div
              key={i}
              className={cn("h-6 transition-colors", i + 1 === activeLine ? "font-bold text-sky-400" : "text-slate-600")}
            >
              {i + 1}
            </div>
          ))}
        </div>
      </div>

      {/* Main Code Editing Workspace */}
      <div className="relative flex-1 h-full overflow-hidden">
        {/* Active Line Row Highlight */}
        <div
          className="pointer-events-none absolute left-0 right-0 z-0 border-l-2 border-sky-400 bg-sky-500/10 transition-transform duration-75"
          style={{
            height: "24px",
            transform: `translateY(${(activeLine - 1) * 24 + 16 - scrollTop}px)`,
          }}
        />

        {/* Code Textarea Input Layer */}
        <textarea
          ref={taRef}
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            syncCursorLine();
          }}
          onKeyDown={handleKeyDown}
          onKeyUp={syncCursorLine}
          onClick={syncCursorLine}
          onSelect={syncCursorLine}
          onScroll={(e) => {
            setScrollTop(e.currentTarget.scrollTop);
            setScrollLeft(e.currentTarget.scrollLeft);
          }}
          readOnly={readOnly}
          spellCheck={false}
          placeholder={placeholder}
          aria-label="Code editor"
          className={cn(
            "absolute inset-0 z-10 h-full w-full resize-none overflow-auto bg-transparent p-4 text-transparent caret-sky-300 outline-none placeholder:text-slate-600",
            EDITOR_FONT,
          )}
          style={FONT_STYLE}
        />

        {/* Syntax Highlighted Render Layer */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className={cn("p-4", EDITOR_FONT)}
            style={{
              ...FONT_STYLE,
              transform: `translate(${-scrollLeft}px, ${-scrollTop}px)`,
            }}
          >
            <pre className={cn("whitespace-pre text-slate-200", EDITOR_FONT)} style={FONT_STYLE}>{highlighted}</pre>
          </div>
        </div>
      </div>
    </div>
  );

  const toolbar = (
    <div className="flex flex-wrap items-center gap-1.5">
      <Button type="button" size="sm" variant="ghost" onClick={handleFormat} title="Format code">
        Format
      </Button>
      <Button type="button" size="sm" variant="ghost" onClick={() => void handleCopy()} title="Copy code">
        {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Clipboard className="h-3.5 w-3.5" />}
        {copied ? "Copied" : "Copy"}
      </Button>
      <Button type="button" size="sm" variant="ghost" onClick={handleClear} title="Clear code">
        <Eraser className="h-3.5 w-3.5" /> Clear
      </Button>
      {onSave && (
        <Button type="button" size="sm" variant="ghost" onClick={onSave} title="Save code">
          <Save className="h-3.5 w-3.5" /> Save
        </Button>
      )}
      <div className="flex-1" />
      {autoSaveLabel && <span className="text-xs text-muted-foreground">{autoSaveLabel}</span>}
      <Button
        type="button"
        size="sm"
        variant="ghost"
        onClick={() => setFullscreen((f) => !f)}
        title={fullscreen ? "Exit full screen" : "Full screen"}
      >
        {fullscreen ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
        {fullscreen ? "Exit" : "Full screen"}
      </Button>
    </div>
  );

  return (
    <div className="flex h-full flex-col">
      {toolbar}

      <div className="min-h-0 flex-1">
        {fullscreen ? (
          <div className="fixed inset-0 z-50 bg-[#0b1020] p-4">
            <div className="flex h-full flex-col">
              <div className="mb-2 flex justify-end">{toolbar}</div>
              <div className="min-h-0 flex-1">{editor}</div>
            </div>
          </div>
        ) : (
          editor
        )}
      </div>
    </div>
  );
}
