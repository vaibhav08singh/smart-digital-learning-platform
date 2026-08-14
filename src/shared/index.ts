// ============================================================
// CodeZen Shared Domain & Data Layer Entry Point
// Bridges frontend and backend with curriculum databases, TypeScript
// types, AI knowledge engines, and storage utilities.
// ============================================================

// TypeScript Interfaces & Domain Types
export type {
  Course,
  Subject,
  Chapter,
  Topic,
  Lesson,
  StudentProfile,
  ChatMessage,
  Conversation,
  YouTubeVideo,
  Question,
} from "@/types";

// Knowledge Base & Curriculum Databases
export { subjects, getTopic, getLesson, getChapter, getSubject } from "@/data/subjects";
export { csSubjects } from "@/data/cs-subjects";
export { courses, searchCourses, isCsCourse } from "@/data/courses";
export { mockAiReply } from "@/data/ai";
export { analyzeTutorRequest } from "@/data/ai-analysis";
export { getVideoForLesson, videosForCourse } from "@/data/videos";
export { mcqBank } from "@/data/cs-knowledge";

// Utility Helpers
export { readStore, writeStore, uid } from "@/lib/storage";
export { cn } from "@/lib/utils";
