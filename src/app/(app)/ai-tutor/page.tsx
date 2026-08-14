"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Bot,
  Check,
  Copy,
  Loader2,
  MessageSquare,
  Plus,
  Send,
  Sparkles,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/state";
import { AITutorOrb } from "@/components/3d/ai-tutor-orb";
import { Markdown } from "@/components/ai-tutor/markdown";
import {
  aiStudyModes,
  clearConversation,
  createConversation,
  getConversations,
  getActiveConversationId,
  sendMessage,
  setActiveConversationId,
  suggestedPrompts,
  type StudyModeId,
} from "@/services/ai.service";
import { useStudentProfile } from "@/services/auth.service";
import { UserAvatar } from "@/components/profile/user-avatar";
import type { Conversation } from "@/types";
import { cn } from "@/lib/utils";

export default function AITutorPage() {
  const [conversations, setConversations] = useState<Conversation[] | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<StudyModeId>("explain");
  const [thinking, setThinking] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const deepLinkSentRef = useRef(false);

  useEffect(() => {
    let mounted = true;
    getConversations().then((list) => {
      if (!mounted) return;
      setConversations(list);
      const stored = getActiveConversationId();
      const nextId = stored && list.some((c) => c.id === stored) ? stored : (list[0]?.id ?? null);
      setActiveId(nextId);

      // Deep link: /ai-tutor?prompt=Teach me X from scratch → auto-send once loaded.
      const prompt = nextId ? new URLSearchParams(window.location.search).get("prompt") : null;
      if (prompt && nextId && !deepLinkSentRef.current) {
        deepLinkSentRef.current = true;
        const target = list.find((c) => c.id === nextId);
        if (target) {
          void sendMessage(nextId, prompt, mode)
            .then((updated) => {
              if (!mounted) return;
              setConversations((prev) =>
                prev ? prev.map((c) => (c.id === nextId ? updated : c)) : prev,
              );
              window.history.replaceState({}, "", "/ai-tutor");
            })
            .catch((err: unknown) => {
              if (!mounted) return;
              setError(err instanceof Error ? err.message : String(err));
              void getConversations().then((list) => {
                setConversations((prev) => (prev ? list : prev));
              });
            });
        }
      }
    });
    return () => {
      mounted = false;
    };
  }, [mode]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversations, activeId, thinking]);

  const active = conversations?.find((c) => c.id === activeId) ?? null;
  const profile = useStudentProfile();

  async function handleNew() {
    const conv = await createConversation();
    setConversations((prev) => (prev ? [conv, ...prev] : [conv]));
    setActiveId(conv.id);
  }

  async function handleDelete(id: string) {
    await clearConversation(id);
    setConversations((prev) => (prev ? prev.filter((c) => c.id !== id) : prev));
    if (activeId === id) {
      const remaining = conversations?.filter((c) => c.id !== id) ?? [];
      setActiveId(remaining[0]?.id ?? null);
    }
  }

  async function handleSend(text?: string) {
    const content = (text ?? input).trim();
    if (!content || thinking || !activeId) return;
    setInput("");
    setThinking(true);
    setError(null);
    try {
      const updated = await sendMessage(activeId, content, mode);
      setConversations((prev) =>
        prev ? prev.map((c) => (c.id === activeId ? updated : c)) : prev,
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
      void getConversations().then((list) => {
        setConversations((prev) => (prev ? list : prev));
      });
    } finally {
      setThinking(false);
      inputRef.current?.focus();
    }
  }

  async function handleCopy() {
    const last = active?.messages.findLast((m) => m.role === "assistant");
    if (!last) return;
    try {
      await navigator.clipboard.writeText(last.content);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard unavailable
    }
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[280px_1fr]">
      {/* Conversation list */}
      <aside className="hidden lg:block">
        <div className="sticky top-20 space-y-3">
          <Button className="w-full" onClick={() => void handleNew()}>
            <Plus className="h-4 w-4" /> New conversation
          </Button>
          <nav className="space-y-1 rounded-2xl border bg-card p-2" aria-label="Conversations">
            {conversations === null && (
              <>
                <Skeleton className="h-9" />
                <Skeleton className="h-9" />
              </>
            )}
            {conversations?.map((conv) => (
              <div
                key={conv.id}
                className={cn(
                  "group flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
                  conv.id === activeId ? "bg-primary/10 font-medium text-primary" : "hover:bg-accent",
                )}
                onClick={() => {
                  setActiveId(conv.id);
                  setActiveConversationId(conv.id);
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    setActiveId(conv.id);
                    setActiveConversationId(conv.id);
                  }
                }}
              >
                <MessageSquare className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="min-w-0 flex-1 truncate">{conv.title}</span>
                <button
                  type="button"
                  aria-label={`Delete ${conv.title}`}
                  className="shrink-0 rounded p-1 text-muted-foreground opacity-0 transition-opacity hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    void handleDelete(conv.id);
                  }}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
            {conversations?.length === 0 && (
              <p className="p-3 text-center text-sm text-muted-foreground">No conversations yet.</p>
            )}
          </nav>
        </div>
      </aside>

      {/* Chat */}
      <div className="flex h-[calc(100dvh-11rem)] flex-col overflow-hidden rounded-2xl border bg-card lg:h-[calc(100dvh-10rem)]">
        {/* Header */}
        <div className="flex items-center gap-3 border-b px-5 py-4">
          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border bg-mesh">
            <AITutorOrb height={48} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h1 className="flex items-center gap-1.5 text-lg font-bold tracking-tight">
                AI Tutor <Sparkles className="h-4 w-4 text-primary" />
              </h1>
            </div>
            <p className="truncate text-xs text-muted-foreground">
              {active ? active.title : "Ask anything — AI tutor for all subjects, courses & general Q&A."}
            </p>
          </div>
          <Button asChild variant="outline" size="sm" className="lg:hidden">
            <a href="/analytics">Analytics</a>
          </Button>
        </div>

        {/* Study mode selector */}
        <div className="flex items-center gap-1.5 overflow-x-auto border-b px-4 py-2.5" role="tablist" aria-label="Study mode">
          <span className="mr-1 shrink-0 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            Mode
          </span>
          {aiStudyModes.map((m) => {
            const Icon = m.icon;
            return (
              <button
                key={m.id}
                type="button"
                role="tab"
                aria-selected={mode === m.id}
                title={m.description}
                onClick={() => setMode(m.id)}
                className={cn(
                  "flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                  mode === m.id
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-transparent text-muted-foreground hover:bg-accent hover:text-foreground",
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {m.label}
              </button>
            );
          })}
        </div>

        {/* Messages */}
        <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
          {active === null && (
            <EmptyState
              title="Start a conversation"
              description="Ask about a concept you learned, or tap a suggestion below."
            />
          )}
          {active?.messages.length === 0 && (
            <div className="flex flex-col items-center gap-4 py-10 text-center">
              <div className="w-full max-w-sm">
                <AITutorOrb height={220} />
              </div>
              <div>
                <p className="text-lg font-semibold">
                  Hi {profile.name.split(" ")[0] || "there"} 👋
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {aiStudyModes.find((m) => m.id === mode)?.description}. Pick a mode above or just ask
                  me anything.
                </p>
              </div>
            </div>
          )}
          {active?.messages.map((m) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn("flex gap-3", m.role === "user" && "flex-row-reverse")}
            >
              {m.role === "assistant" && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-white">
                  <Bot className="h-4 w-4" />
                </div>
              )}
              {m.role === "user" && (
                <UserAvatar avatarId={profile.avatarId} name={profile.name} className="h-8 w-8" />
              )}
              <div
                className={cn(
                  "max-w-[80%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-relaxed",
                  m.role === "user" ? "bg-primary text-primary-foreground" : "border bg-muted/40",
                )}
              >
                {m.role === "assistant" ? <Markdown content={m.content} /> : m.content}
              </div>
            </motion.div>
          ))}
          {thinking && (
            <div className="flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-white">
                <Bot className="h-4 w-4" />
              </div>
              <div className="flex items-center gap-1.5 rounded-2xl border bg-muted/40 px-4 py-3">
                <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:0ms]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:150ms]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:300ms]" />
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        {/* Suggestions */}
        {active?.messages.length === 0 && (
          <div className="flex gap-2 overflow-x-auto border-t px-5 py-3">
            {suggestedPrompts.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => void handleSend(prompt)}
                className="shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
              >
                {prompt}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="border-t p-4">
          {error && (
            <div className="mb-3 flex items-start gap-2 rounded-xl border border-destructive/40 bg-destructive/10 px-3 py-2.5 text-xs leading-relaxed text-destructive">
              <div className="min-w-0 flex-1">
                <p className="font-semibold">AI tutor unavailable</p>
                <p className="mt-0.5">{error}</p>
              </div>
              <button
                type="button"
                onClick={() => setError(null)}
                className="shrink-0 rounded p-1 transition-colors hover:bg-destructive/10"
                aria-label="Dismiss"
              >
                <span aria-hidden>&times;</span>
              </button>
            </div>
          )}
          <div className="flex items-end gap-2">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  void handleSend();
                }
              }}
              placeholder="Ask your AI tutor…"
              rows={1}
              aria-label="Message"
              className="max-h-32 min-h-[44px] flex-1 resize-none rounded-xl border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
            />
            <Button
              size="icon"
              className="h-11 w-11 shrink-0"
              onClick={() => void handleSend()}
              disabled={!input.trim() || thinking}
              aria-label="Send message"
            >
              {thinking ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </div>
          <div className="mt-2 flex items-center justify-between px-1">
            <p className="text-[11px] text-muted-foreground">Enter to send · Shift+Enter for a new line</p>
            <button
              type="button"
              onClick={() => void handleCopy()}
              disabled={!active?.messages.some((m) => m.role === "assistant")}
              className="flex items-center gap-1 text-[11px] text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
            >
              {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              {copied ? "Copied" : "Copy last reply"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
