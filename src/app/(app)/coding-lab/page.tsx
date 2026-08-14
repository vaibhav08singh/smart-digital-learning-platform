"use client";

import { useRef, useState } from "react";
import {
  Bug,
  FileSearch,
  GitCompareArrows,
  ListChecks,
  Loader2,
  Play,
  RefreshCw,
  Sparkles,
  Square,
  Terminal,
  Wand2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Markdown } from "@/components/ai-tutor/markdown";
import { CodeEditor } from "@/components/coding-lab/code-editor";
import {
  executeCode,
  getLanguage,
  getSnippet,
  labLanguages,
  saveSnippet,
} from "@/services/coding.service";
import { getTopicStatus } from "@/services/performance.service";
import { assistCode } from "@/services/ai-assist.service";
import type { CodeExecutionResult, CodingAssistAction } from "@/types";
import { cn } from "@/lib/utils";

const AI_ACTIONS: { action: CodingAssistAction; label: string; icon: typeof Bug }[] = [
  { action: "explain", label: "Explain Code", icon: FileSearch },
  { action: "debug", label: "Debug Code", icon: Bug },
  { action: "optimize", label: "Optimize Code", icon: Wand2 },
  { action: "tests", label: "Generate Tests", icon: ListChecks },
  { action: "convert", label: "Convert Code", icon: GitCompareArrows },
];

export default function CodingLabPage() {
  const [languageId, setLanguageId] = useState("python");
  const [code, setCode] = useState<string>(() => getSnippet("python") ?? getLanguage("python").sample);
  const [stdin, setStdin] = useState("5");
  const [result, setResult] = useState<CodeExecutionResult | null>(null);
  const [running, setRunning] = useState(false);
  const [aiAction, setAiAction] = useState<CodingAssistAction>("explain");
  const [targetLanguage, setTargetLanguage] = useState("java");
  const [aiResult, setAiResult] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [topicId, setTopicId] = useState("");
  const abortRef = useRef<AbortController | null>(null);
  const [execError, setExecError] = useState<string | null>(null);

  // Reset editor when the language changes.
  const [prevLanguageId, setPrevLanguageId] = useState(languageId);
  if (prevLanguageId !== languageId) {
    setPrevLanguageId(languageId);
    setCode(getSnippet(languageId) ?? getLanguage(languageId).sample);
    setResult(null);
  }

  const topics = getTopicStatus();
  const topicName = topics.find((t) => t.topicId === topicId)?.topicName ?? "";

  async function handleRun() {
    if (running) {
      abortRef.current?.abort();
      setRunning(false);
      return;
    }
    setExecError(null);
    const controller = new AbortController();
    abortRef.current = controller;
    setRunning(true);
    setResult(null);
    try {
      const activeStdin = stdin !== undefined && stdin !== "" ? stdin : "5";
      const res = await executeCode({ code, languageId, stdin: activeStdin, signal: controller.signal });
      setResult(res);
    } catch (err) {
      setResult({
        stdout: "",
        stderr: "",
        output: "",
        exitCode: null,
        timeMs: null,
        memoryKb: null,
        error: controller.signal.aborted ? "Execution stopped." : err instanceof Error ? err.message : String(err),
      });
    } finally {
      setRunning(false);
    }
  }

  async function handleAi(action: CodingAssistAction) {
    if (!code.trim()) return;
    setAiLoading(true);
    setAiError(null);
    setAiResult("");
    try {
      const data = await assistCode({
        action,
        code,
        language: getLanguage(languageId).label,
        targetLanguage: action === "convert" ? getLanguage(targetLanguage).label : undefined,
        topic: topicName || undefined,
        currentError: result?.error ?? result?.stderr ?? undefined,
      });
      setAiResult(data.content);
    } catch (err) {
      setAiError(err instanceof Error ? err.message : "Could not reach the AI assistant.");
    } finally {
      setAiLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Coding Lab</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Write, run and test code in 24+ languages — with an AI assistant for every problem.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select
            aria-label="Language"
            value={languageId}
            onChange={(e) => setLanguageId(e.target.value)}
            className="h-9 rounded-md border bg-card px-3 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-ring"
          >
            {labLanguages.map((lang) => (
              <option key={lang.id} value={lang.id}>
                {lang.label}
              </option>
            ))}
          </select>
          <select
            aria-label="Link to topic"
            value={topicId}
            onChange={(e) => setTopicId(e.target.value)}
            className="h-9 max-w-[12rem] rounded-md border bg-card px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
          >
            <option value="">Track performance…</option>
            {topics.map((t) => (
              <option key={t.topicId} value={t.topicId}>
                {t.topicName} ({t.accuracy}%)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Editor */}
      <Card>
        <CardContent className="p-4">
          <div className="h-[26rem]">
            <CodeEditor
              value={code}
              onChange={setCode}
              onSave={() => saveSnippet(languageId, code)}
              autoSaveLabel="Saved locally"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Input + Run */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="h-4 w-4 text-primary" /> Input & Run
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <label htmlFor="stdin" className="mb-1.5 block text-sm font-medium">
                Standard input <span className="text-xs text-muted-foreground">(each line becomes stdin)</span>
              </label>
              <textarea
                id="stdin"
                value={stdin}
                onChange={(e) => setStdin(e.target.value)}
                rows={4}
                placeholder={"5"}
                className="w-full resize-none rounded-lg border bg-background px-3 py-2 font-mono text-sm focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => void handleRun()} disabled={!code.trim()}>
                {running ? <Square className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                {running ? "Stop" : "Run Code"}
              </Button>
              <Button variant="outline" onClick={() => setResult(null)} disabled={running}>
                <RefreshCw className="h-4 w-4" /> Clear output
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Output */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Terminal className="h-4 w-4 text-primary" /> Output
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {execError && (
              <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {execError}
              </div>
            )}
            {result?.error && (
              <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {result.error}
              </div>
            )}
            {result?.compileOutput && (
              <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                <p className="mb-1 font-semibold">Compilation error</p>
                <pre className="whitespace-pre-wrap font-mono text-xs">{result.compileOutput}</pre>
              </div>
            )}
            {result?.stderr && (
              <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                <pre className="whitespace-pre-wrap font-mono text-xs">{result.stderr}</pre>
              </div>
            )}
            <pre
              className={cn(
                "min-h-[8rem] overflow-x-auto whitespace-pre-wrap rounded-lg bg-muted/40 px-3 py-2 font-mono text-sm",
                !result?.output && "text-muted-foreground",
              )}
            >
              {result?.output || (running ? "Running…" : "Run your code to see the output here.")}
            </pre>
            {result && (
              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <Badge variant="secondary">Exit {result.exitCode ?? "—"}</Badge>
                {result.timeMs != null && <Badge variant="secondary">{result.timeMs} ms</Badge>}
                {result.memoryKb != null && (
                  <Badge variant="secondary">{formatMemory(result.memoryKb)}</Badge>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* AI assistant */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" /> AI Coding Assistant
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            {AI_ACTIONS.map(({ action, label, icon: Icon }) => (
              <Button
                key={action}
                size="sm"
                variant={aiAction === action ? "default" : "outline"}
                onClick={() => setAiAction(action)}
              >
                <Icon className="h-3.5 w-3.5" /> {label}
              </Button>
            ))}
            {aiAction === "convert" && (
              <select
                aria-label="Convert to language"
                value={targetLanguage}
                onChange={(e) => setTargetLanguage(e.target.value)}
                className="h-8 rounded-md border bg-card px-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
              >
                {labLanguages
                  .filter((l) => l.id !== languageId)
                  .map((l) => (
                    <option key={l.id} value={l.id}>
                      → {l.label}
                    </option>
                  ))}
              </select>
            )}
            <div className="flex-1" />
            <Button
              size="sm"
              variant="gradient"
              onClick={() => void handleAi(aiAction)}
              disabled={aiLoading || !code.trim()}
            >
              {aiLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              {aiLoading ? "Thinking…" : `Run ${AI_ACTIONS.find((a) => a.action === aiAction)?.label}`}
            </Button>
          </div>

          {aiError && (
            <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {aiError}
            </div>
          )}

          {aiResult ? (
            <div className="rounded-lg border bg-muted/20 p-4">
              <Markdown content={aiResult} />
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              {aiAction === "explain" && "Get a line-by-line explanation, the algorithm and the time/space complexity."}
              {aiAction === "debug" && "Find syntax, logic and runtime errors — with the corrected code."}
              {aiAction === "optimize" && "Improve time and space complexity with a better algorithm."}
              {aiAction === "tests" && "Generate normal, edge, boundary and stress test cases."}
              {aiAction === "convert" && `Convert your ${getLanguage(languageId).label} code to another language.`}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function formatMemory(kb: number): string {
  if (kb < 1024) return `${kb} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
}
