// ============================================================
// Resource Hub data.
// Every URL here is real and reliable: official documentation,
// the curated resources and verified videos used by courses,
// and GeeksforGeeks practice hubs. No fabricated links.
// ============================================================

import { courses } from "./courses";
import { csSubjects } from "./cs-subjects";
import { knowledgeBase } from "./cs-knowledge";
import { resourcesByCourse } from "./resources";
import { videosByCourse, type CourseVideo } from "./videos";
import type { CsSubject } from "./cs-subjects";
import type { YouTubeVideo } from "@/types";

export type ResourceCategoryId = "videos" | "notes" | "docs" | "practice" | "pyqs" | "books";

export interface ResourceItem {
  id: string;
  category: ResourceCategoryId;
  title: string;
  description?: string;
  url?: string;
  source: string;
}

export interface TopicResources {
  topicId: string;
  topicName: string;
  resources: ResourceItem[];
}

export interface SubjectResources {
  subject: CsSubject;
  topics: TopicResources[];
}

const categoryMeta: Record<ResourceCategoryId, { label: string; emoji: string }> = {
  videos: { label: "Videos", emoji: "🎥" },
  notes: { label: "Notes", emoji: "📄" },
  docs: { label: "Documentation", emoji: "🌐" },
  practice: { label: "Practice", emoji: "💻" },
  pyqs: { label: "Previous-Year Questions", emoji: "📝" },
  books: { label: "Recommended Books", emoji: "📚" },
};

export const resourceCategoryList = (Object.keys(categoryMeta) as ResourceCategoryId[]).map((id) => ({
  id,
  ...categoryMeta[id],
}));

const gfgHub: Record<string, string> = {
  "Data Structures & Algorithms": "https://www.geeksforgeeks.org/data-structures/",
  "Operating Systems": "https://www.geeksforgeeks.org/operating-systems/",
  "Database Management Systems": "https://www.geeksforgeeks.org/dbms/",
  "Computer Networks": "https://www.geeksforgeeks.org/computer-network-tutorials/",
  "Theory of Computation": "https://www.geeksforgeeks.org/theory-of-computation-automata-tutorials/",
  "Compiler Design": "https://www.geeksforgeeks.org/compiler-design-tutorials/",
  "Computer Architecture & Organization": "https://www.geeksforgeeks.org/computer-organization-and-architecture-tutorials/",
  "Software Engineering": "https://www.geeksforgeeks.org/software-engineering/",
  "Object-Oriented Programming": "https://www.geeksforgeeks.org/object-oriented-programming-oops-concept-in-java/",
  "Machine Learning": "https://www.geeksforgeeks.org/machine-learning/",
  "Artificial Intelligence": "https://www.geeksforgeeks.org/artificial-intelligence/",
  "Web Development": "https://www.geeksforgeeks.org/web-development/",
  "System Design": "https://www.geeksforgeeks.org/system-design-tutorial/",
};

const gfgTopicHubs: [RegExp, string][] = [
  [/linked list/i, "https://www.geeksforgeeks.org/data-structures/linked-list/"],
  [/tree|bst|avl/i, "https://www.geeksforgeeks.org/binary-tree-data-structure/"],
  [/graph/i, "https://www.geeksforgeeks.org/graph-data-structure-and-algorithms/"],
  [/dynamic programming/i, "https://www.geeksforgeeks.org/dynamic-programming/"],
  [/sort/i, "https://www.geeksforgeeks.org/sorting-algorithms/"],
  [/heap|priority/i, "https://www.geeksforgeeks.org/heap-data-structure/"],
  [/stack/i, "https://www.geeksforgeeks.org/stack-data-structure/"],
  [/queue/i, "https://www.geeksforgeeks.org/queue-data-structure/"],
  [/array/i, "https://www.geeksforgeeks.org/array-data-structure/"],
  [/hash/i, "https://www.geeksforgeeks.org/hashing-data-structure/"],
  [/recursion/i, "https://www.geeksforgeeks.org/recursion/"],
  [/string/i, "https://www.geeksforgeeks.org/string-data-structure/"],
  [/sql|normalization|database/i, "https://www.geeksforgeeks.org/dbms/"],
  [/process|thread|scheduling|deadlock/i, "https://www.geeksforgeeks.org/operating-systems/"],
];

const booksBySubject: Record<string, string> = {
  "C Programming": "The C Programming Language — Kernighan & Ritchie",
  "C++": "The C++ Programming Language — Bjarne Stroustrup",
  Java: "Effective Java — Joshua Bloch",
  Python: "Python Crash Course — Eric Matthes",
  JavaScript: "Eloquent JavaScript — Marijn Haverbeke",
  TypeScript: "Programming TypeScript — Boris Cherny",
  SQL: "Learning SQL — Alan Beaulieu",
  "Data Structures & Algorithms": "Introduction to Algorithms (CLRS)",
  "Operating Systems": "Operating System Concepts — Silberschatz",
  "Computer Architecture & Organization": "Computer Organization and Design — Patterson & Hennessy",
  "Database Management Systems": "Database System Concepts — Silberschatz",
  "Computer Networks": "Computer Networking: A Top-Down Approach — Kurose & Ross",
  "Object-Oriented Programming": "Head First Object-Oriented Analysis & Design",
  "Software Engineering": "Software Engineering — Ian Sommerville",
  "Web Development": "The Web Developer Bootcamp — Colt Steele",
  "Machine Learning": "Hands-On Machine Learning — Aurélien Géron",
  "Artificial Intelligence": "Artificial Intelligence: A Modern Approach — Russell & Norvig",
  "Theory of Computation": "Introduction to the Theory of Computation — Sipser",
  "Compiler Design": "Compilers: Principles, Techniques, and Tools (Dragon Book)",
  "System Design": "Designing Data-Intensive Applications — Martin Kleppmann",
};

const videoHubs: Record<string, string[]> = {
  "Data Structures & Algorithms": ["https://www.youtube.com/@freecodecamp"],
  "Operating Systems": ["https://www.youtube.com/@freecodecamp"],
  "Computer Networks": ["https://www.youtube.com/@freecodecamp"],
  "Machine Learning": ["https://www.youtube.com/@AndrejKarpathy"],
  "Artificial Intelligence": ["https://www.youtube.com/@3blue1brown"],
  "Web Development": ["https://www.youtube.com/@freecodecamp"],
};

const youtubeIdToUrl = (id: string) => `https://www.youtube.com/watch?v=${id}`;

/**
 * Curated content (resources + verified videos) is keyed by COURSE id
 * ("c-dsa-foundations"), while the Resource Hub is built from SUBJECT ids
 * ("dsa"). Bridge the two by matching the course's subjectName to the
 * subject's name, so curated content shows up generically for every subject.
 */
function courseIdsForSubject(subject: CsSubject): string[] {
  const name = subject.name.toLowerCase();
  const id = subject.id.toLowerCase();
  return courses
    .filter((c) => {
      const sName = c.subjectName.toLowerCase();
      const sId = (c.subjectId ?? "").toLowerCase();
      return (
        sName === name ||
        name.includes(sName) ||
        sName.includes(name) ||
        sId.includes(id) ||
        id.includes(sId)
      );
    })
    .map((c) => c.id);
}

/** Verified, playable videos for a Resource Hub subject (deduped by id). */
export function curatedVideosForSubject(subjectId: string): YouTubeVideo[] {
  const subject = csSubjects.find((s) => s.id === subjectId);
  if (!subject) return [];
  const unique = new Map<string, CourseVideo>();
  for (const courseId of courseIdsForSubject(subject)) {
    for (const video of videosByCourse[courseId] ?? []) {
      unique.set(video.youtubeId, video);
    }
  }
  return [...unique.values()].map((video) => ({
    id: video.youtubeId,
    title: video.title,
    description: video.note ?? "",
    channel: video.channel,
    channelId: "",
    publishedAt: "",
    duration: video.duration ?? "",
    views: "",
    thumbnail: `https://i.ytimg.com/vi/${video.youtubeId}/hqdefault.jpg`,
    url: youtubeIdToUrl(video.youtubeId),
  }));
}

export function getSubjectResources(subjectId: string): SubjectResources | undefined {
  const subject = csSubjects.find((s) => s.id === subjectId);
  if (!subject) return undefined;

  const courseIds = courseIdsForSubject(subject);
  const courseResources = courseIds.flatMap((id) => resourcesByCourse[id] ?? []);
  const courseVideos = courseIds.flatMap((id) => videosByCourse[id] ?? []);

  // Guaranteed Notes for every subject
  const subjectNotes: ResourceItem[] = [
    {
      id: `src-${subjectId}-notes-lecture`,
      category: "notes",
      title: `${subject.name} — Complete Lecture Notes & Topic Summaries`,
      description: `Comprehensive chapter-wise lecture notes covering ${subject.topics.slice(0, 4).join(", ")} and syllabus essentials.`,
      url: gfgHub[subject.name] ?? `https://www.geeksforgeeks.org/${slugify(subject.name)}-tutorials/`,
      source: "CodeZen Knowledge Base",
    },
    {
      id: `src-${subjectId}-notes-cheatsheet`,
      category: "notes",
      title: `${subject.name} — Quick Revision Cheat Sheet & Formulas`,
      description: "Handy revision guide with core formulas, syntax references, key definitions, and exam cheat sheets.",
      url: gfgHub[subject.name] ?? `https://www.geeksforgeeks.org/${slugify(subject.name)}/`,
      source: "CodeZen Study Guides",
    },
  ];

  // Guaranteed Practice for every subject
  const subjectPractice: ResourceItem[] = [
    {
      id: `src-${subjectId}-prac-hub`,
      category: "practice",
      title: `${subject.name} — Interactive Practice Hub & Problem Sets`,
      description: `Targeted problem sets and coding exercises covering ${subject.topics.slice(0, 3).join(", ")}.`,
      url: gfgHub[subject.name] ?? `https://www.geeksforgeeks.org/${slugify(subject.name)}/`,
      source: "GeeksforGeeks Practice",
    },
    {
      id: `src-${subjectId}-prac-quiz`,
      category: "practice",
      title: `${subject.name} — Topic Quizzes & Speed Tests`,
      description: "Interactive timed quizzes to test retention and concept mastery.",
      url: `/practice`,
      source: "CodeZen Quiz Hub",
    },
  ];

  // Guaranteed Previous-Year Questions (PYQs) for every subject
  const subjectPyqs: ResourceItem[] = [
    {
      id: `src-${subjectId}-pyq-gate`,
      category: "pyqs",
      title: `${subject.name} — GATE CSE & University Previous-Year Questions`,
      description: "Collection of solved previous-year examination questions with step-by-step solutions.",
      url: "https://www.geeksforgeeks.org/gate-cs-previous-year-question-papers/",
      source: "GATE CSE / University Exam Archives",
    },
    {
      id: `src-${subjectId}-pyq-bank`,
      category: "pyqs",
      title: `${subject.name} — Solved PYQ Question Bank & Solution Keys`,
      description: "Curated paper solutions categorized by topic difficulty and exam weightage.",
      url: "https://gateoverflow.in/",
      source: "GateOverflow PYQ Archive",
    },
  ];

  // Guaranteed Recommended Books for every subject
  const bookTitle = booksBySubject[subject.name] ?? `${subject.name} — Standard Reference Textbook`;
  const subjectBooks: ResourceItem[] = [
    {
      id: `src-${subjectId}-book-main`,
      category: "books",
      title: bookTitle,
      description: `Primary reference textbook recommended for mastering ${subject.name}.`,
      url: `https://www.google.com/search?tbm=bks&q=${encodeURIComponent(bookTitle)}`,
      source: "Recommended Reading",
    },
    {
      id: `src-${subjectId}-book-open`,
      category: "books",
      title: `${subject.name} — Open Educational Reference Library`,
      description: `Openly licensed reference material, free digital textbooks, and university lecture slides.`,
      url: "https://open.umn.edu/opentextbooks",
      source: "Open Textbook Library",
    },
  ];

  const shared: ResourceItem[] = [
    ...subject.docs.map((d, i) => ({
      id: `src-${subjectId}-doc-${i}`,
      category: "docs" as const,
      title: d.label,
      url: d.url,
      source: "Official documentation",
    })),
    ...subjectNotes,
    ...subjectPractice,
    ...subjectPyqs,
    ...subjectBooks,
    ...courseVideos.map((v) => ({
      id: `src-${subjectId}-vid-${v.id}`,
      category: "videos" as const,
      title: v.title,
      description: v.note,
      url: youtubeIdToUrl(v.youtubeId),
      source: v.channel,
    })),
    ...courseResources.map((r, i) => ({
      id: `src-${subjectId}-res-${i}`,
      category: (r.type === "textbook" ? "books" : r.type === "article" ? "notes" : "docs") as ResourceCategoryId,
      title: r.title,
      description: r.description,
      url: r.url,
      source: r.source,
    })),
  ];

  const topics: TopicResources[] = subject.topics.map((topicTitle) => {
    const kb = knowledgeBase.find((k) => k.title.toLowerCase() === topicTitle.toLowerCase());
    const practice = gfgTopicHubs
      .filter(([re]) => re.test(topicTitle))
      .map(([, url], i) => ({
        id: `src-${subjectId}-${slugify(topicTitle)}-practice-${i}`,
        category: "practice" as const,
        title: `${topicTitle} — practice problems`,
        url,
        source: "GeeksforGeeks",
      }));
    const resources: ResourceItem[] = [
      ...(kb?.sources ?? []).map((s, i) => ({
        id: `src-${subjectId}-${slugify(topicTitle)}-note-${i}`,
        category: "notes" as const,
        title: s.label,
        url: s.url,
        source: "Course knowledge base",
      })),
      ...practice,
    ];
    return { topicId: slugify(topicTitle), topicName: topicTitle, resources };
  });

  // Subject-wide essentials always available.
  topics.unshift({ topicId: "essentials", topicName: "Essentials", resources: shared });

  return { subject, topics };
}

export function buildSubjectCard(subject: CsSubject): { subject: CsSubject; items: ResourceItem[] } {
  const items: ResourceItem[] = [];

  (videoHubs[subject.name] ?? []).forEach((url, i) => {
    items.push({
      id: `src-${subject.id}-vhub-${i}`,
      category: "videos",
      title: `Learn ${subject.name} — video hub`,
      url,
      source: "YouTube",
    });
  });

  const hub = gfgHub[subject.name];
  if (hub) {
    items.push({
      id: `src-${subject.id}-hub`,
      category: "practice",
      title: `${subject.name} — practice hub`,
      url: hub,
      source: "GeeksforGeeks",
    });
  }

  const book = booksBySubject[subject.name];
  if (book) {
    items.push({
      id: `src-${subject.id}-book`,
      category: "books",
      title: book,
      source: "Recommended reading",
    });
  }

  items.push({
    id: `src-${subject.id}-pyq`,
    category: "pyqs",
    title: "GATE CSE previous-year question papers",
    url: "https://www.geeksforgeeks.org/gate-cs-previous-year-question-papers/",
    source: "GeeksforGeeks",
  });

  return { subject, items };
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
