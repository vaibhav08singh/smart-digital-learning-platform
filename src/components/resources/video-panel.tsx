"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { CirclePlay, ExternalLink, Play, RefreshCw, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { searchYoutubeVideos, youtubeSearchUrl } from "@/services/youtube.service";
import type { TopicResources } from "@/data/resource-hub";
import type { CsSubject } from "@/data/cs-subjects";
import type { YouTubeVideo } from "@/types";
import { cn } from "@/lib/utils";

export type VideoSort = "relevance" | "beginner" | "advanced" | "recent";

const SORTS: { id: VideoSort; label: string }[] = [
  { id: "relevance", label: "Most Relevant" },
  { id: "beginner", label: "Beginner" },
  { id: "advanced", label: "Advanced" },
  { id: "recent", label: "Recent" },
];

interface VideoPanelProps {
  subject: CsSubject;
  topics: TopicResources[];
  /** Verified curated videos used when the live YouTube API is unavailable. */
  fallbackVideos?: YouTubeVideo[];
}

export function VideoPanel({ subject, topics, fallbackVideos = [] }: VideoPanelProps) {
  const [draft, setDraft] = useState("");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<VideoSort>("relevance");
  const [activeVideo, setActiveVideo] = useState<YouTubeVideo | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setQuery(draft.trim()), 450);
    return () => window.clearTimeout(timer);
  }, [draft]);

  const order = sort === "recent" ? ("date" as const) : ("relevance" as const);
  const extra = sort === "beginner" ? " for beginners" : sort === "advanced" ? " advanced" : "";
  const customActive = query.length > 0;

  const sections: {
    key: string;
    title: string;
    emoji: string;
    searchQuery: string;
    loadingText: string;
    emptyTitle: string;
  }[] = customActive
    ? [
        {
          key: "custom",
          title: `Results for “${query}”`,
          emoji: "🔍",
          searchQuery: `${subject.name} ${query} tutorial${extra}`,
          loadingText: `Searching for “${query}”…`,
          emptyTitle: `No videos found for “${query}”.`,
        },
      ]
    : [
        {
          key: "course",
          title: `${subject.name} — full course & overview`,
          emoji: "🎓",
          searchQuery: `${subject.name} complete course tutorial${extra}`,
          loadingText: `Loading videos for ${subject.name}…`,
          emptyTitle: "No videos found for this course.",
        },
        ...topics.map((topic) => ({
          key: topic.topicId,
          title: topic.topicName,
          emoji: "🎥",
          searchQuery: `${subject.name} ${topic.topicName} tutorial${extra}`,
          loadingText: `Loading videos for ${topic.topicName}…`,
          emptyTitle: "No videos found for this topic.",
        })),
      ];

  return (
    <div className="space-y-4">
      {/* Search + sort controls */}
      <Card>
        <CardContent className="flex flex-col gap-3 p-4 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") setQuery(draft.trim());
              }}
              placeholder={`Search ${subject.name} videos… e.g. “Recursion”`}
              className="w-full pl-9"
              aria-label="Search videos"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {SORTS.map((s) => (
              <Button
                key={s.id}
                size="sm"
                variant={sort === s.id ? "gradient" : "outline"}
                onClick={() => setSort(s.id)}
                className={sort === s.id ? "" : "bg-card"}
              >
                {s.label}
              </Button>
            ))}
            <Button asChild size="sm" variant="outline" className="bg-card">
              <a
                href={youtubeSearchUrl(`${subject.name} complete course tutorial`)}
                target="_blank"
                rel="noreferrer"
              >
                <CirclePlay className="h-3.5 w-3.5 text-red-500" /> More on YouTube
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Sections */}
      {sections.map((section) => (
        <VideoSection
          key={`${section.key}-${sort}`}
          title={section.title}
          emoji={section.emoji}
          query={section.searchQuery}
          order={order}
          onPlay={setActiveVideo}
          loadingText={section.loadingText}
          emptyTitle={section.emptyTitle}
          fallbackVideos={section.key === "course" ? fallbackVideos : undefined}
          primary={section.key === "course"}
        />
      ))}

      <VideoPlayerDialog video={activeVideo} onClose={() => setActiveVideo(null)} />
    </div>
  );
}

type VideoStatus = "loading" | "success" | "empty" | "error";

interface VideoSectionProps {
  title: string;
  emoji: string;
  query: string;
  order: "relevance" | "date";
  onPlay: (video: YouTubeVideo) => void;
  loadingText?: string;
  emptyTitle?: string;
  fallbackVideos?: YouTubeVideo[];
  /** Course-wide section — owns the curated fallback grid. */
  primary?: boolean;
}

function VideoSection({
  title,
  emoji,
  query,
  order,
  onPlay,
  loadingText,
  emptyTitle,
  fallbackVideos = [],
  primary = false,
}: VideoSectionProps) {
  const [status, setStatus] = useState<VideoStatus>("loading");
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [attempt, setAttempt] = useState(0);

  // Reset to loading when the query changes (render-time adjustment).
  const [prevQuery, setPrevQuery] = useState(query);
  if (prevQuery !== query) {
    setPrevQuery(query);
    setStatus("loading");
    setVideos([]);
  }

  useEffect(() => {
    let cancelled = false;
    searchYoutubeVideos({ query, order })
      .then((results) => {
        if (cancelled) return;
        if (results.length > 0) {
          setVideos(results);
          setStatus("success");
        } else if (fallbackVideos.length > 0) {
          setVideos(fallbackVideos);
          setStatus("success");
        } else {
          setStatus("empty");
        }
      })
      .catch(() => {
        if (cancelled) return;
        if (fallbackVideos.length > 0) {
          setVideos(fallbackVideos);
          setStatus("success");
        } else {
          setStatus("empty");
        }
      });
    return () => {
      cancelled = true;
    };
  }, [query, order, attempt, fallbackVideos]);

  function retry() {
    setStatus("loading");
    setVideos([]);
    setAttempt((n) => n + 1);
  }

  const hasFallback = fallbackVideos.length > 0;

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="text-base">{emoji}</span>
        <h3 className="text-sm font-semibold">{title}</h3>
        {status === "success" && <Badge variant="secondary">{videos.length} videos</Badge>}
      </div>

      {status === "loading" && <VideoSkeletonGrid label={loadingText} />}

      {status === "success" && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {videos.map((video) => (
            <VideoCard key={video.id} video={video} onPlay={onPlay} />
          ))}
        </div>
      )}

      {/* Primary (course) section: show curated videos when live search fails. */}
      {primary && (status === "empty" || status === "error") && hasFallback && (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs text-muted-foreground">
              {status === "error"
                ? "Live YouTube search is unavailable — showing verified videos for this course."
                : "No live results — showing verified videos for this course."}
            </p>
            {status === "error" && (
              <Button size="sm" variant="outline" onClick={retry}>
                <RefreshCw className="h-3.5 w-3.5" /> Retry live search
              </Button>
            )}
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {fallbackVideos.map((video) => (
              <VideoCard key={video.id} video={video} onPlay={onPlay} />
            ))}
          </div>
        </div>
      )}

      {/* Topic sections: stay quiet while the course section shows the fallback. */}
      {!primary && status === "error" && hasFallback && (
        <p className="text-xs text-muted-foreground">Live search unavailable for this topic.</p>
      )}

      {status === "empty" && !hasFallback && (
        <VideoStateCard
          emoji="🎬"
          title={emptyTitle ?? "No videos found for this topic."}
          hint="Try a different search or find it directly on YouTube."
          actions={
            <Button asChild size="sm" variant="outline">
              <a href={youtubeSearchUrl(query)} target="_blank" rel="noreferrer">
                <CirclePlay className="h-3.5 w-3.5" /> Search on YouTube
              </a>
            </Button>
          }
        />
      )}

      {status === "error" && !hasFallback && (
        <VideoStateCard
          emoji="⚠️"
          title="Unable to load videos right now. Please try again."
          hint="YouTube may be temporarily unavailable."
          actions={
            <div className="flex flex-wrap justify-center gap-2">
              <Button size="sm" onClick={retry}>
                <RefreshCw className="h-3.5 w-3.5" /> Retry
              </Button>
              <Button asChild size="sm" variant="outline">
                <a href={youtubeSearchUrl(query)} target="_blank" rel="noreferrer">
                  <CirclePlay className="h-3.5 w-3.5" /> Search on YouTube
                </a>
              </Button>
            </div>
          }
        />
      )}

      {status === "success" && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {videos.map((video) => (
            <VideoCard key={video.id} video={video} onPlay={onPlay} />
          ))}
        </div>
      )}
    </div>
  );
}

function VideoSkeletonGrid({ label = "Loading educational videos…" }: { label?: string }) {
  return (
    <div className="space-y-2">
      <p className="text-sm text-muted-foreground">{label}</p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="aspect-video w-full rounded-xl" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  );
}

function VideoStateCard({
  emoji,
  title,
  hint,
  actions,
}: {
  emoji: string;
  title: string;
  hint: string;
  actions: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-dashed bg-card p-6 text-center">
      <p className="text-3xl">{emoji}</p>
      <p className="mt-2 text-sm font-medium">{title}</p>
      <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
      <div className="mt-3 flex flex-wrap justify-center gap-2">{actions}</div>
    </div>
  );
}

function VideoCard({ video, onPlay }: { video: YouTubeVideo; onPlay: (video: YouTubeVideo) => void }) {
  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border bg-card transition-all hover:border-primary/40 hover:shadow-sm">
      <button
        type="button"
        onClick={() => onPlay(video)}
        className="relative block aspect-video w-full overflow-hidden bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label={`Watch ${video.title}`}
      >
        {video.thumbnail ? (
          <Image
            src={video.thumbnail}
            alt={video.title}
            fill
            unoptimized
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center text-muted-foreground">
            <CirclePlay className="h-8 w-8" />
          </span>
        )}
        {video.duration && (
          <span className="absolute bottom-2 right-2 rounded bg-black/80 px-1.5 py-0.5 text-[11px] font-medium tabular-nums text-white">
            {video.duration}
          </span>
        )}
        <span className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/20">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-black opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
            <Play className="h-5 w-5 fill-current" />
          </span>
        </span>
      </button>
      <div className="flex flex-1 flex-col gap-1.5 p-3">
        <p className="line-clamp-2 text-sm font-medium leading-snug">{video.title}</p>
        <p className="text-xs text-muted-foreground">
          {video.channel}
          {video.views ? ` · ${video.views} views` : ""}
          {video.publishedAt ? ` · ${formatPublished(video.publishedAt)}` : ""}
        </p>
        <p className="line-clamp-2 text-xs text-muted-foreground">{video.description || "Watch this video to learn the topic step by step."}</p>
        <div className="mt-auto flex items-center gap-2 pt-2">
          <Button size="sm" onClick={() => onPlay(video)}>
            <Play className="h-3.5 w-3.5 fill-current" /> Watch
          </Button>
          <Button
            asChild
            size="sm"
            variant="ghost"
            className="ml-auto gap-1.5 px-2 text-muted-foreground hover:text-foreground"
          >
            <a href={video.url} target="_blank" rel="noreferrer">
              <ExternalLink className="h-3.5 w-3.5" /> YouTube
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}

function VideoPlayerDialog({ video, onClose }: { video: YouTubeVideo | null; onClose: () => void }) {
  return (
    <Dialog open={video !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl">
        {video && (
          <>
            <DialogHeader>
              <DialogTitle className="pr-8">{video.title}</DialogTitle>
              <p className={cn("text-sm text-muted-foreground")}>
                {video.channel}
                {video.views ? ` · ${video.views} views` : ""}
                {video.duration ? ` · ${video.duration}` : ""}
              </p>
            </DialogHeader>
            <div className="aspect-video w-full overflow-hidden rounded-xl bg-black">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0`}
                title={video.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="h-full w-full"
              />
            </div>
            {video.description && (
              <p className="line-clamp-3 text-sm text-muted-foreground">{video.description}</p>
            )}
            <DialogFooter>
              <Button asChild variant="outline" size="sm">
                <a href={video.url} target="_blank" rel="noreferrer">
                  <ExternalLink className="h-3.5 w-3.5" /> Watch on YouTube
                </a>
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function formatPublished(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const days = Math.floor((Date.now() - date.getTime()) / 86_400_000);
  if (days < 1) return "today";
  if (days === 1) return "yesterday";
  if (days < 30) return `${days}d ago`;
  return date.toLocaleDateString(undefined, { year: "numeric", month: "short" });
}
