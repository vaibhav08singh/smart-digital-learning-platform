"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot,
  Brain,
  Check,
  ChevronRight,
  Code2,
  Copy,
  Flame,
  HelpCircle,
  Lightbulb,
  Loader2,
  Menu,
  MessageSquare,
  Plus,
  RefreshCw,
  RotateCcw,
  Send,
  Sparkles,
  Square,
  Target,
  Trash2,
  TrendingUp,
  X,
  Zap,
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
import { getCsSubject } from "@/data/cs-subjects";
import { UserAvatar } from "@/components/profile/user-avatar";
import type { Conversation } from "@/types";
import { cn } from "@/lib/utils";

// Quick Actions Toolbar configuration
const QUICK_ACTIONS = [
  { label: "Explain Simply", prompt: "Explain this concept simply using everyday analogies and plain language.", icon: Lightbulb },
  { label: "Give Example", prompt: "Give a concrete worked example with step-by-step walkthrough.", icon: Zap },
  { label: "Debug Code", prompt: "Analyze my code: identify bugs, explain why they occurred, and provide corrected code.", icon: Code2 },
  { label: "Optimize Code", prompt: "Analyze the time & space complexity (Big-O) and provide an optimized solution.", icon: Target },
  { label: "Generate Quiz", prompt: "Generate an interactive 3-question quiz with multiple choice options on this topic.", icon: Brain },
  { label: "Summarize", prompt: "Provide a dense, exam-ready revision summary of this topic.", icon: Sparkles },
  { label: "Interview Round", prompt: "Act as a Senior Technical Interviewer and ask me a challenging interview question on this topic.", icon: HelpCircle },
];

function StudentInsightsCard({
  profile,
  onSendPrompt,
}: {
  profile: ReturnType<typeof useStudentProfile>;
  onSendPrompt: (prompt: string) => void;
}) {
  const router = useRouter();

  const strongTopicsLabel =
    profile.strongSubjectIds && profile.strongSubjectIds.length > 0
      ? profile.strongSubjectIds.map((id) => getCsSubject(id.replace(/^sub-/, ""))?.name ?? id).join(", ")
      : "Algorithms, Python & Logic";

  const weakTopicsLabel =
    profile.weakSubjectIds && profile.weakSubjectIds.length > 0
      ? profile.weakSubjectIds.map((id) => getCsSubject(id.replace(/^sub-/, ""))?.name ?? id).join(", ")
      : "Dynamic Programming & Graph Search";

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 backdrop-blur-md shadow-lg">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div
          onClick={() => router.push("/profile")}
          className="flex items-center gap-2 cursor-pointer group hover:opacity-90 transition-opacity"
          title="View Student Profile"
        >
          <UserAvatar avatarId={profile.avatarId} name={profile.name} className="h-7 w-7 transition-transform group-hover:scale-105" />
          <div>
            <p className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors">{profile.name}</p>
            <p className="text-[10px] font-semibold text-indigo-400 uppercase tracking-wider">
              {profile.levelId.replace(/-/g, " ")}
            </p>
          </div>
        </div>
        <div
          onClick={() => router.push("/analytics")}
          className="flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-400 cursor-pointer hover:bg-amber-500/20 hover:border-amber-500/50 transition-all shadow-sm"
          title="View Learning Analytics & Streak"
        >
          <Flame className="h-3 w-3 text-amber-400 fill-amber-400" />
          <span>{profile.learningStreakDays || 3} Day Streak</span>
        </div>
      </div>

      <div className="mt-3 space-y-2 text-xs">
        {/* Strong Areas Clickable Card */}
        <div
          onClick={() => onSendPrompt(`Quiz me on my strong areas: ${strongTopicsLabel}`)}
          className="group cursor-pointer rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-2.5 transition-all hover:bg-emerald-500/15 hover:border-emerald-500/40"
          title="Click to generate a quiz on your strong areas"
        >
          <div className="flex items-center justify-between font-bold text-emerald-400 text-[11px]">
            <span className="flex items-center gap-1">
              <Check className="h-3.5 w-3.5" /> Strong Areas
            </span>
            <span className="flex items-center gap-0.5 text-[10px] text-emerald-400/80 group-hover:text-emerald-300 font-semibold">
              Quiz <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
            </span>
          </div>
          <p className="text-slate-200 text-[11px] mt-1 font-medium">{strongTopicsLabel}</p>
        </div>

        {/* Recommended Practice Clickable Card */}
        <div
          onClick={() => onSendPrompt(`Teach me and give practice questions on: ${weakTopicsLabel}`)}
          className="group cursor-pointer rounded-xl border border-amber-500/20 bg-amber-500/5 p-2.5 transition-all hover:bg-amber-500/15 hover:border-amber-500/40"
          title="Click to practice recommended topics with AI Tutor"
        >
          <div className="flex items-center justify-between font-bold text-amber-400 text-[11px]">
            <span className="flex items-center gap-1">
              <TrendingUp className="h-3.5 w-3.5" /> Recommended Practice
            </span>
            <span className="flex items-center gap-0.5 text-[10px] text-amber-400/80 group-hover:text-amber-300 font-semibold">
              Practice <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
            </span>
          </div>
          <p className="text-slate-200 text-[11px] mt-1 font-medium">{weakTopicsLabel}</p>
        </div>
      </div>
    </div>
  );
}

export default function AITutorPage() {
  const [conversations, setConversations] = useState<Conversation[] | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<StudyModeId>("explain");
  const [thinking, setThinking] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [abortController, setAbortController] = useState<AbortController | null>(null);

  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const deepLinkSentRef = useRef(false);

  const profile = useStudentProfile();

  useEffect(() => {
    let mounted = true;
    getConversations().then((list) => {
      if (!mounted) return;
      setConversations(list);
      const stored = getActiveConversationId();
      const nextId = stored && list.some((c) => c.id === stored) ? stored : (list[0]?.id ?? null);
      setActiveId(nextId);

      // Deep link auto-send prompt (/ai-tutor?prompt=...)
      const prompt = nextId ? new URLSearchParams(window.location.search).get("prompt") : null;
      if (prompt && nextId && !deepLinkSentRef.current) {
        deepLinkSentRef.current = true;
        const target = list.find((c) => c.id === nextId);
        if (target) {
          setThinking(true);
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
            })
            .finally(() => {
              if (mounted) setThinking(false);
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

  async function handleNew() {
    const conv = await createConversation();
    setConversations((prev) => (prev ? [conv, ...prev] : [conv]));
    setActiveId(conv.id);
    setMobileDrawerOpen(false);
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

    const controller = new AbortController();
    setAbortController(controller);

    setInput("");
    setThinking(true);
    setError(null);

    try {
      const updated = await sendMessage(activeId, content, mode);
      setConversations((prev) =>
        prev ? prev.map((c) => (c.id === activeId ? updated : c)) : prev
      );
    } catch (err) {
      if (controller.signal.aborted) {
        setError("Generation stopped.");
      } else {
        const message = err instanceof Error ? err.message : String(err);
        setError(message);
      }
      void getConversations().then((list) => {
        setConversations((prev) => (prev ? list : prev));
      });
    } finally {
      setThinking(false);
      setAbortController(null);
      inputRef.current?.focus();
    }
  }

  function handleStop() {
    if (abortController) {
      abortController.abort();
      setThinking(false);
    }
  }

  async function handleRegenerate() {
    if (!active || active.messages.length === 0 || thinking) return;
    const lastUserMessage = [...active.messages].reverse().find((m) => m.role === "user");
    if (lastUserMessage) {
      await handleSend(lastUserMessage.content);
    }
  }

  async function handleCopyMessage(id: string, text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // ignore
    }
  }

  async function handleCopyLastReply() {
    const last = active?.messages.findLast((m) => m.role === "assistant");
    if (!last) return;
    try {
      await navigator.clipboard.writeText(last.content);
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2000);
    } catch {
      // ignore
    }
  }

  return (
    <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[300px_1fr]">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:block">
        <div className="sticky top-20 space-y-4">
          {/* New Conversation Button */}
          <Button
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 font-semibold text-white shadow-lg hover:from-indigo-600 hover:to-purple-700"
            onClick={() => void handleNew()}
          >
            <Plus className="h-4 w-4 mr-1.5" /> New Conversation
          </Button>

          {/* Dynamic Student Insights Card */}
          <StudentInsightsCard profile={profile} onSendPrompt={(p) => void handleSend(p)} />

          {/* Conversations History */}
          <nav className="space-y-1 rounded-2xl border border-white/10 bg-slate-900/40 p-2 backdrop-blur-md max-h-[calc(100vh-28rem)] overflow-y-auto" aria-label="Conversations">
            <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Recent Conversations
            </div>
            {conversations === null && (
              <div className="space-y-2 p-1">
                <Skeleton className="h-9 w-full bg-white/5" />
                <Skeleton className="h-9 w-full bg-white/5" />
              </div>
            )}
            {conversations?.map((conv) => (
              <div
                key={conv.id}
                className={cn(
                  "group flex cursor-pointer items-center gap-2 rounded-xl px-3 py-2 text-xs transition-all duration-200",
                  conv.id === activeId
                    ? "border border-indigo-500/40 bg-indigo-500/15 font-semibold text-white shadow-sm"
                    : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                )}
                onClick={() => {
                  setActiveId(conv.id);
                  setActiveConversationId(conv.id);
                }}
                role="button"
                tabIndex={0}
              >
                <MessageSquare className="h-3.5 w-3.5 shrink-0 text-indigo-400" />
                <span className="min-w-0 flex-1 truncate">{conv.title}</span>
                <button
                  type="button"
                  aria-label={`Delete ${conv.title}`}
                  className="shrink-0 rounded p-1 text-slate-500 opacity-0 transition-opacity hover:bg-rose-500/20 hover:text-rose-400 group-hover:opacity-100"
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
              <p className="p-3 text-center text-xs text-slate-400">No conversations yet.</p>
            )}
          </nav>
        </div>
      </aside>

      {/* Main Chat Shell */}
      <div className="flex h-[calc(100dvh-7rem)] flex-col overflow-hidden rounded-3xl border border-white/10 bg-slate-900/60 backdrop-blur-xl shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-3.5 bg-slate-950/40">
          <div className="flex items-center gap-3">
            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileDrawerOpen(true)}
              className="lg:hidden rounded-lg border border-white/10 bg-white/5 p-2 text-slate-300 hover:bg-white/10"
              aria-label="Open conversation menu"
            >
              <Menu className="h-4 w-4" />
            </button>

            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl border border-indigo-500/30 bg-slate-950 shadow-inner">
              <AITutorOrb height={40} />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="flex items-center gap-1.5 text-base font-extrabold tracking-tight text-white">
                  AI Tutor <Sparkles className="h-4 w-4 text-indigo-400" />
                </h1>
              </div>
              <p className="truncate text-xs font-normal text-slate-400 max-w-sm sm:max-w-md">
                {active ? active.title : "Your personal AI study companion for math, science, coding & exams."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {active && active.messages.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => void handleDelete(active.id)}
                className="hidden sm:flex border-white/10 bg-white/5 text-slate-300 hover:bg-rose-500/20 hover:border-rose-500/40 hover:text-rose-300 text-xs"
              >
                <Trash2 className="h-3.5 w-3.5 mr-1" /> Clear
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => void handleNew()}
              className="border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white text-xs"
            >
              <Plus className="h-3.5 w-3.5 mr-1" /> New
            </Button>
          </div>
        </div>

        {/* Study Mode Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto border-b border-white/10 bg-slate-950/60 px-4 py-2 scrollbar-none" role="tablist" aria-label="Study modes">
          <span className="mr-1 shrink-0 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
            Mode
          </span>
          {aiStudyModes.map((m) => {
            const Icon = m.icon;
            const isSelected = mode === m.id;
            return (
              <button
                key={m.id}
                type="button"
                role="tab"
                aria-selected={isSelected}
                title={m.description}
                onClick={() => setMode(m.id)}
                className={cn(
                  "flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-all duration-200 cursor-pointer",
                  isSelected
                    ? "border border-indigo-400 bg-indigo-500/25 text-white shadow-[0_0_15px_rgba(99,102,241,0.4)]"
                    : "border border-white/10 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
                )}
              >
                <Icon className={cn("h-3.5 w-3.5", isSelected ? "text-indigo-300" : "text-slate-400")} />
                <span>{m.label}</span>
              </button>
            );
          })}
        </div>

        {/* Chat Messages */}
        <div className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-6">
          {active === null && (
            <EmptyState
              title="Start a conversation"
              description="Ask about any subject, pick a study mode above, or click a suggestion below."
            />
          )}

          {active?.messages.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
              <div className="w-full max-w-xs">
                <AITutorOrb height={200} />
              </div>
              <div className="max-w-md">
                <h3 className="text-xl font-extrabold text-white">
                  Welcome {profile.name.split(" ")[0] || "Learner"} 👋
                </h3>
                <p className="mt-1.5 text-xs text-slate-300 leading-relaxed font-normal">
                  {aiStudyModes.find((m) => m.id === mode)?.description}. Ask a question, paste code to debug, or try one of the quick actions below.
                </p>
              </div>
            </div>
          )}

          {active?.messages.map((m) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={cn("flex gap-3", m.role === "user" ? "justify-end" : "justify-start")}
            >
              {m.role === "assistant" && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white shadow-md">
                  <Bot className="h-4 w-4" />
                </div>
              )}

              <div
                className={cn(
                  "relative max-w-[85%] sm:max-w-[78%] rounded-2xl p-4 text-sm leading-relaxed shadow-lg",
                  m.role === "user"
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-tr-none"
                    : "border border-white/10 bg-slate-900/80 text-slate-100 rounded-tl-none backdrop-blur-md"
                )}
              >
                {m.role === "assistant" ? (
                  <>
                    <Markdown content={m.content} />
                    <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-2 text-[11px] text-slate-400">
                      <span className="font-mono text-[10px] text-slate-400">
                        CodeZen AI Expert
                      </span>
                      <button
                        onClick={() => handleCopyMessage(m.id, m.content)}
                        className="flex items-center gap-1 hover:text-white transition-colors"
                      >
                        {copiedId === m.id ? (
                          <>
                            <Check className="h-3 w-3 text-emerald-400" />
                            <span className="text-emerald-400">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  </>
                ) : (
                  <span>{m.content}</span>
                )}
              </div>

              {m.role === "user" && (
                <UserAvatar avatarId={profile.avatarId} name={profile.name} className="h-8 w-8 shrink-0" />
              )}
            </motion.div>
          ))}

          {/* Thinking / Loading Animation */}
          {thinking && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                <Bot className="h-4 w-4" />
              </div>
              <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-xs text-slate-300 backdrop-blur-md">
                <div className="flex gap-1">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-indigo-400 [animation-delay:0ms]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-purple-400 [animation-delay:150ms]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-pink-400 [animation-delay:300ms]" />
                </div>
                <span className="font-semibold text-slate-300 ml-1">Analyzing request & formulating step-by-step response…</span>
              </div>
            </motion.div>
          )}
          <div ref={endRef} />
        </div>

        {/* Quick Actions Bar */}
        <div className="border-t border-white/10 bg-slate-950/40 px-4 py-2 overflow-x-auto scrollbar-none flex items-center gap-2">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 shrink-0">
            Quick Actions
          </span>
          {QUICK_ACTIONS.map((qa) => {
            const Icon = qa.icon;
            return (
              <button
                key={qa.label}
                type="button"
                onClick={() => void handleSend(qa.prompt)}
                disabled={thinking}
                className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-medium text-slate-300 transition-all hover:bg-white/15 hover:border-indigo-500/40 hover:text-white shrink-0 cursor-pointer disabled:opacity-50"
              >
                <Icon className="h-3 w-3 text-indigo-400" />
                <span>{qa.label}</span>
              </button>
            );
          })}
        </div>

        {/* Suggested Prompts if empty */}
        {active?.messages.length === 0 && (
          <div className="flex gap-2 overflow-x-auto border-t border-white/10 bg-slate-950/60 px-4 py-2.5">
            {suggestedPrompts.slice(0, 6).map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => void handleSend(prompt)}
                className="shrink-0 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-300 transition-all hover:border-indigo-500/40 hover:bg-indigo-500/10 hover:text-white cursor-pointer"
              >
                {prompt}
              </button>
            ))}
          </div>
        )}

        {/* Input Bar */}
        <div className="border-t border-white/10 bg-slate-950/80 p-4">
          {error && (
            <div className="mb-3 flex items-center justify-between rounded-xl border border-rose-500/40 bg-rose-500/10 px-3.5 py-2.5 text-xs text-rose-300">
              <div className="flex items-center gap-2">
                <span className="font-bold">Notice:</span>
                <span>{error}</span>
              </div>
              <button
                type="button"
                onClick={() => setError(null)}
                className="rounded p-1 hover:bg-rose-500/20 text-rose-300"
              >
                <X className="h-4 w-4" />
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
              placeholder="Ask anything, request code, debug errors, or type 'quiz me'..."
              rows={1}
              aria-label="Message prompt"
              className="max-h-36 min-h-[44px] flex-1 resize-none rounded-xl border border-white/10 bg-slate-900/90 px-4 py-3 text-sm text-white placeholder-slate-400 focus:border-indigo-500/60 focus:outline-none focus:ring-1 focus:ring-indigo-500/60"
            />

            {thinking ? (
              <Button
                size="icon"
                onClick={handleStop}
                className="h-11 w-11 shrink-0 rounded-xl bg-rose-600 text-white hover:bg-rose-700 shadow-lg"
                title="Stop generation"
              >
                <Square className="h-4 w-4 fill-white" />
              </Button>
            ) : (
              <Button
                size="icon"
                className="h-11 w-11 shrink-0 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50 cursor-pointer"
                onClick={() => void handleSend()}
                disabled={!input.trim()}
                aria-label="Send message"
              >
                <Send className="h-4 w-4" />
              </Button>
            )}
          </div>

          <div className="mt-2.5 flex items-center justify-between px-1 text-[11px] text-slate-400">
            <span>Enter to send · Shift+Enter for newline</span>

            <div className="flex items-center gap-3">
              {active && active.messages.length > 0 && (
                <button
                  type="button"
                  onClick={() => void handleRegenerate()}
                  disabled={thinking}
                  className="flex items-center gap-1 hover:text-white transition-colors disabled:opacity-50"
                >
                  <RefreshCw className="h-3 w-3" />
                  <span>Regenerate</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => void handleCopyLastReply()}
                disabled={!active?.messages.some((m) => m.role === "assistant")}
                className="flex items-center gap-1 hover:text-white transition-colors disabled:opacity-50"
              >
                {copiedAll ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                <span>{copiedAll ? "Copied" : "Copy last answer"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileDrawerOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileDrawerOpen(false)}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
            />

            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.3 }}
              className="relative z-10 w-4/5 max-w-xs border-r border-white/10 bg-slate-900 p-4 shadow-2xl flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <AITutorOrb height={28} />
                    <span className="font-bold text-white text-sm">Conversations</span>
                  </div>
                  <button
                    onClick={() => setMobileDrawerOpen(false)}
                    className="rounded p-1 text-slate-400 hover:text-white"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <Button
                  className="w-full bg-indigo-600 text-white font-semibold"
                  onClick={() => void handleNew()}
                >
                  <Plus className="h-4 w-4 mr-1.5" /> New Conversation
                </Button>

                <StudentInsightsCard
                  profile={profile}
                  onSendPrompt={(p) => {
                    setMobileDrawerOpen(false);
                    void handleSend(p);
                  }}
                />

                <div className="space-y-1 max-h-[40vh] overflow-y-auto">
                  {conversations?.map((conv) => (
                    <div
                      key={conv.id}
                      onClick={() => {
                        setActiveId(conv.id);
                        setActiveConversationId(conv.id);
                        setMobileDrawerOpen(false);
                      }}
                      className={cn(
                        "flex items-center gap-2 rounded-xl px-3 py-2.5 text-xs font-medium transition-colors cursor-pointer",
                        conv.id === activeId ? "bg-indigo-500/20 text-white border border-indigo-500/40" : "text-slate-400 hover:bg-white/5 hover:text-white"
                      )}
                    >
                      <MessageSquare className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                      <span className="truncate flex-1">{conv.title}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-white/10 pt-3 text-xs text-slate-400 text-center">
                AI Tutor · Powered by Gemini
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
