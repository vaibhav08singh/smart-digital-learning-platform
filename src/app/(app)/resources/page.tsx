"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ExternalLink, Library, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { getResourceHubSubjects } from "@/services/resource.service";
import { curatedVideosForSubject, getSubjectResources, resourceCategoryList } from "@/data/resource-hub";
import { VideoPanel } from "@/components/resources/video-panel";
import type { ResourceCategoryId, ResourceItem } from "@/data/resource-hub";
import type { CsSubject } from "@/data/cs-subjects";
import { cn } from "@/lib/utils";

type Filter = "all" | ResourceCategoryId;

export default function ResourcesPage() {
  const [subjects, setSubjects] = useState<CsSubject[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");

  useEffect(() => {
    let mounted = true;
    getResourceHubSubjects().then((list) => {
      if (!mounted) return;
      setSubjects(list);
      setLoading(false);
    });
    return () => {
      mounted = false;
    };
  }, []);

  const filteredSubjects = useMemo(() => {
    const q = query.trim().toLowerCase();
    return subjects.filter((s) => {
      const matchesQuery =
        !q ||
        s.name.toLowerCase().includes(q) ||
        s.short.toLowerCase().includes(q) ||
        s.about.toLowerCase().includes(q);

      if (!matchesQuery) return false;
      if (filter === "all") return true;

      const resources = getSubjectResources(s.id);
      const hasCategoryItem = resources?.topics.some((t) =>
        t.resources.some((r) => r.category === filter),
      );
      return hasCategoryItem;
    });
  }, [subjects, query, filter]);

  const selectedSubject = subjects.find((s) => s.id === selected);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight sm:text-3xl">
            <Library className="h-6 w-6 text-primary" /> Resource Hub
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Hand-picked videos, notes, documentation, practice hubs, PYQs and books for every CS subject.
          </p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search subjects…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-9 sm:w-64"
          />
        </div>
      </div>

      {selectedSubject ? (
        <SubjectDetail
          key={selectedSubject.id}
          subject={selectedSubject}
          onBack={() => setSelected(null)}
          initialFilter={filter}
        />
      ) : (
        <>
          <CategoryFilters filter={filter} onFilter={setFilter} />
          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-40" />
              ))}
            </div>
          ) : filteredSubjects.length === 0 ? (
            <Card>
              <CardContent className="py-10 text-center text-sm text-muted-foreground">
                No subjects match “{query}”.
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredSubjects.map((subject) => (
                <SubjectCard key={subject.id} subject={subject} filter={filter} onOpen={() => setSelected(subject.id)} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function CategoryFilters({ filter, onFilter }: { filter: Filter; onFilter: (f: Filter) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      <FilterChip active={filter === "all"} onClick={() => onFilter("all")} label="All" emoji="✨" />
      {resourceCategoryList.map((cat) => (
        <FilterChip key={cat.id} active={filter === cat.id} onClick={() => onFilter(cat.id)} label={cat.label} emoji={cat.emoji} />
      ))}
    </div>
  );
}

function FilterChip({ active, onClick, label, emoji }: { active: boolean; onClick: () => void; label: string; emoji: string }) {
  return (
    <Button variant={active ? "gradient" : "outline"} size="sm" onClick={onClick} className={active ? "" : "bg-card"}>
      <span>{emoji}</span>
      {label}
    </Button>
  );
}

function SubjectCard({ subject, filter, onOpen }: { subject: CsSubject; filter: Filter; onOpen: () => void }) {
  const resources = getSubjectResources(subject.id);
  const counts = useMemo(() => {
    const c: Record<ResourceCategoryId, number> = { videos: 0, notes: 0, docs: 0, practice: 0, pyqs: 0, books: 0 };
    for (const topic of resources?.topics ?? []) {
      for (const item of topic.resources) c[item.category] += 1;
    }
    return c;
  }, [resources]);
  const total = Object.values(counts).reduce((s, n) => s + n, 0);

  return (
    <Card className="flex flex-col transition-shadow hover:shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-base">
          <span>{subject.name}</span>
          <Badge variant="secondary">{subject.category}</Badge>
        </CardTitle>
        <p className="text-xs text-muted-foreground">{subject.short}</p>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-3">
        <div className="flex flex-wrap gap-1.5">
          <Badge variant="outline">
            {total} resource{total === 1 ? "" : "s"}
          </Badge>
          {resourceCategoryList
            .filter((cat) => counts[cat.id] > 0)
            .map((cat) => (
              <Badge key={cat.id} variant="outline" className={cn(filter !== "all" && filter !== cat.id && "opacity-40")}>
                {cat.emoji} {counts[cat.id]}
              </Badge>
            ))}
        </div>
        <Button variant="outline" size="sm" className="mt-auto" onClick={onOpen}>
          Browse resources
        </Button>
      </CardContent>
    </Card>
  );
}

function SubjectDetail({ subject, onBack, initialFilter }: { subject: CsSubject; onBack: () => void; initialFilter: Filter }) {
  const [filter, setFilter] = useState<Filter>(initialFilter);
  const data = getSubjectResources(subject.id);
  const topics = data?.topics ?? [];
  const topicSections = topics.filter((t) => t.topicId !== "essentials");

  const visible = (items: ResourceItem[]) =>
    filter === "all" ? items : items.filter((i) => i.category === filter);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" onClick={onBack} aria-label="Back to subjects">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="text-lg font-bold">{subject.name}</h2>
            <p className="text-xs text-muted-foreground">{subject.short}</p>
          </div>
        </div>
        <CategoryFilters filter={filter} onFilter={setFilter} />
      </div>

      {filter === "videos" ? (
        <VideoPanel subject={subject} topics={topicSections} fallbackVideos={curatedVideosForSubject(subject.id)} />
      ) : (
        topics.map((topic) => {
          const items = visible(topic.resources);
          if (items.length === 0) return null;
          return (
            <Card key={topic.topicId}>
              <CardHeader>
                <CardTitle className="text-sm">{topic.topicName}</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-2 sm:grid-cols-2">
                {items.map((item) => (
                  <ResourceRow key={item.id} item={item} />
                ))}
              </CardContent>
            </Card>
          );
        })
      )}
    </div>
  );
}

function ResourceRow({ item }: { item: ResourceItem }) {
  const meta = resourceCategoryList.find((c) => c.id === item.category);
  return (
    <a
      href={item.url}
      target={item.url ? "_blank" : undefined}
      rel="noreferrer"
      className="flex items-start gap-2 rounded-lg border bg-card p-3 transition-colors hover:border-primary/50 hover:bg-accent"
    >
      <span className="text-base">{meta?.emoji ?? "📄"}</span>
      <span className="min-w-0 flex-1">
        <span className="flex items-start gap-1 text-sm font-medium">
          <span className="line-clamp-2">{item.title}</span>
          {item.url && <ExternalLink className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />}
        </span>
        <span className="block text-xs text-muted-foreground">{item.source}</span>
        {item.description && (
          <span className="mt-0.5 line-clamp-2 block text-xs text-muted-foreground">{item.description}</span>
        )}
      </span>
    </a>
  );
}
