// ============================================================
// CodeZen — Core domain types
// One platform. Every level of learning.
// ============================================================

/** Top-level stage of a learner's journey. */
export type EducationStage =
  | "school"
  | "undergraduate"
  | "postgraduate"
  | "advanced";

/** Identifiers for every supported education level. */
export type EducationLevelId =
  | "class-1"
  | "class-2"
  | "class-3"
  | "class-4"
  | "class-5"
  | "class-6"
  | "class-7"
  | "class-8"
  | "class-9"
  | "class-10"
  | "class-11"
  | "class-12"
  | "undergraduate"
  | "btech"
  | "postgraduate"
  | "mtech"
  | "advanced"
  | "research";

export interface EducationLevel {
  id: EducationLevelId;
  name: string;
  /** Short label shown in compact UI, e.g. "Class 5", "BTech". */
  shortLabel: string;
  stage: EducationStage;
  /** Group used by onboarding options, e.g. "Class 1–5". */
  group: string;
  description: string;
  /** Fallback icon name from lucide, resolved in the UI layer. */
  icon: string;
  /** Tailwind-safe gradient stops used for theming. */
  gradient: string;
  /** Companion programs/courses for this level. */
  programIds: string[];
  /** Child levels that directly follow this one (roadmap ordering). */
  nextLevelIds: EducationLevelId[];
}

/** A concrete academic program, e.g. "Class 5" or "BTech — Computer Science". */
export interface Program {
  id: string;
  name: string;
  levelId: EducationLevelId;
  /** Stream / faculty, e.g. "Science", "Engineering". */
  stream?: string;
  description: string;
  subjectIds: string[];
  domainIds: string[];
  /** Relative order within the level. */
  order: number;
}

/** Stream / faculty grouping inside a level, e.g. Science, Commerce, Arts. */
export interface Stream {
  id: string;
  name: string;
  levelId: EducationLevelId;
  description: string;
  subjectIds: string[];
}

/** Broad knowledge domain, e.g. Mathematics, Computer Science, AI / ML. */
export interface Domain {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  subjectIds: string[];
  /** Stages this domain is relevant across. */
  stages: EducationStage[];
}

export type Difficulty = "Beginner" | "Intermediate" | "Advanced" | "Expert";

export interface Subject {
  id: string;
  name: string;
  domainId: string;
  levelId: EducationLevelId;
  icon: string;
  color: string;
  description: string;
  chapters: Chapter[];
}

export interface Chapter {
  id: string;
  name: string;
  subjectId: string;
  description: string;
  order: number;
  topics: Topic[];
}

export interface Topic {
  id: string;
  name: string;
  chapterId: string;
  description: string;
  order: number;
  difficulty: Difficulty;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  title: string;
  topicId: string;
  order: number;
  durationMinutes: number;
  /** Markdown-ish body content. */
  content: string;
  /** Optional media placeholder. */
  mediaUrl?: string;
  mediaType?: "video" | "image" | "audio";
  transcript?: string;
  captions?: string;
  /** Embedded resources (links/docs) for the lesson. */
  resources: LessonResource[];
}

export interface LessonResource {
  title: string;
  type: "link" | "pdf" | "video" | "note";
  url: string;
}

export type QuizType = "quiz" | "practice" | "assessment";

export interface Question {
  id: string;
  prompt: string;
  options: string[];
  answerIndex: number;
  explanation: string;
  difficulty: Difficulty;
  topicId?: string;
  topicName?: string;
}

export interface Quiz {
  id: string;
  title: string;
  type: QuizType;
  subjectId: string;
  levelId: EducationLevelId;
  difficulty: Difficulty;
  description: string;
  timeLimitMinutes: number;
  passingScore: number;
  questions: Question[];
}

export type MasteryLevel = "Not Started" | "Learning" | "Needs Practice" | "Strong" | "Mastered";

export interface Mastery {
  topicId: string;
  topicName: string;
  level: MasteryLevel;
  score: number;
  quizCount: number;
}

export interface CourseModule {
  id: string;
  title: string;
  lessonIds: string[];
}

export interface Course {
  id: string;
  title: string;
  subjectId: string;
  subjectName: string;
  domainId: string;
  levelId: EducationLevelId;
  description: string;
  difficulty: Difficulty;
  progress: number;
  durationHours: number;
  rating: number;
  reviewCount: number;
  instructor: string;
  instructorTitle: string;
  bookmarked: boolean;
  enrolled: boolean;
  tags: string[];
  gradient: string;
  modules: CourseModule[];
}

export interface StudentProfile {
  id: string;
  name: string;
  email: string;
  /** Cartoon avatar id — see avatar catalog in @/data/avatars. */
  avatarId?: string;
  /** Legacy avatar URL, kept for future real-photo support. */
  avatar?: string;
  levelId: EducationLevelId;
  programId?: string;
  /** Academic year / class, e.g. "2nd Year", "Class 10". */
  classYear?: string;
  /** Branch / stream, e.g. "Computer Science", "Science". */
  branch?: string;
  /** College or school name. */
  institution?: string;
  /** Optional URL for the school/college website. */
  institutionUrl?: string;
  domainIds?: string[];
  goals: string[];
  /** Preferred subjects the learner wants surfaced (ids from subjects data). */
  preferredSubjectIds?: string[];
  learningStreakDays: number;
  overallProgress: number;
  totalStudyMinutes: number;
  dailyGoalMinutes: number;
  strongSubjectIds: string[];
  weakSubjectIds: string[];
  enrolledCourseIds: string[];
  bookmarkedCourseIds: string[];
}

export interface ActivityEvent {
  id: string;
  type: "lesson" | "quiz" | "practice" | "course" | "streak";
  title: string;
  detail: string;
  timestamp: string;
  xp: number;
}

export interface LearningProgress {
  courseId: string;
  completedLessons: number;
  totalLessons: number;
  lastLessonId?: string;
  masteredTopics: string[];
}

export interface Recommendation {
  id: string;
  type: "continue" | "course" | "practice" | "quiz" | "next-topic" | "ai";
  title: string;
  reason: string;
  targetId: string;
  targetHref: string;
  priority: number;
}

// ------------------------------------------------------------
// Analytics
// ------------------------------------------------------------

export interface WeeklyActivityPoint {
  day: string;
  minutes: number;
}

export interface QuizPerformancePoint {
  quiz: string;
  score: number;
  date: string;
}

export interface SubjectPerformance {
  subjectId: string;
  subjectName: string;
  score: number;
}

export interface TopicPerformance {
  topicId: string;
  topicName: string;
  score: number;
  mastery: MasteryLevel;
}

export interface ProgressPoint {
  week: string;
  progress: number;
}

export interface AnalyticsSummary {
  weeklyActivity: WeeklyActivityPoint[];
  studyMinutesTotal: number;
  studyMinutesLastWeek: number;
  quizPerformance: QuizPerformancePoint[];
  subjectPerformance: SubjectPerformance[];
  topicPerformance: TopicPerformance[];
  progressOverTime: ProgressPoint[];
  learningStreakDays: number;
  dailyGoalMinutes: number;
}

// ------------------------------------------------------------
// AI Tutor
// ------------------------------------------------------------

export type ChatRole = "user" | "assistant";

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  timestamp: string;
}

export interface Conversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

/** One practice result for the results page. */
export interface QuizResult {
  quizId: string;
  quizTitle: string;
  score: number;
  total: number;
  correct: number;
  incorrect: number;
  timeTakenSeconds: number;
  passingScore: number;
  topicBreakdown: TopicPerformance[];
  masteryGained: string;
  completedAt: string;
}

// ------------------------------------------------------------
// UI state helpers
// ------------------------------------------------------------

export type AsyncState = "idle" | "loading" | "empty" | "error" | "success";

export type PathNodeState = "completed" | "in-progress" | "recommended" | "locked";

export interface PathNode {
  id: string;
  label: string;
  description: string;
  state: PathNodeState;
  href?: string;
}

// ------------------------------------------------------------
// AI Weakness Detector
// ------------------------------------------------------------

export type TopicStatusLevel = "weak" | "improving" | "strong";

export interface TopicStatus {
  topicId: string;
  topicName: string;
  /** Weighted accuracy 0–100 across quizzes + coding practice. */
  accuracy: number;
  /** Total attempts (quiz questions + coding problems). */
  attempts: number;
  status: TopicStatusLevel;
  /** Accuracy trend: recent average minus overall average. */
  trend: number;
}

export interface WeaknessAnalysis {
  topics: TopicStatus[];
  weakest?: TopicStatus;
  /** Natural-language explanation of the weakest topic. */
  explanation: string;
  /** Ordered improvement steps for the weakest topic. */
  steps: string[];
  generatedAt: string;
}

// ------------------------------------------------------------
// Study Planner
// ------------------------------------------------------------

export type ActivityStatus = "pending" | "completed" | "skipped";

export interface PlannedActivity {
  id: string;
  title: string;
  subject: string;
  emoji: string;
  durationMinutes: number;
  /** YYYY-MM-DD local date. */
  date: string;
  /** "HH:mm" 24h start time. */
  startTime: string;
  status: ActivityStatus;
  /** Where the activity came from. */
  source: "ai" | "manual" | "weakness" | "demo";
  /** Optional deep-link to open when the activity is started. */
  href?: string;
}

export interface WeekPlanInput {
  subjects: string[];
  minutesPerDay: number;
  preferredTime: string;
  focusTopic?: string;
  quizMinutes?: number;
}

// ------------------------------------------------------------
// Coding Lab
// ------------------------------------------------------------

export type CodingAssistAction = "explain" | "debug" | "optimize" | "tests" | "convert";

export interface CodeTestResult {
  input: string;
  expected: string;
  actual: string;
  passed: boolean;
}

export interface CodeExecutionResult {
  stdout: string;
  stderr: string;
  output: string;
  exitCode: number | null;
  timeMs: number | null;
  memoryKb: number | null;
  compileOutput?: string;
  error?: string;
}

// ------------------------------------------------------------
// Resource Hub — YouTube videos
// ------------------------------------------------------------

/** One video returned by the YouTube search proxy. */
export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  channel: string;
  channelId?: string;
  /** ISO 8601 publish date. */
  publishedAt: string;
  /** Human-readable length, e.g. "12:34" or "1:02:33". */
  duration: string;
  /** Human-readable view count, e.g. "1.2M views". */
  views: string;
  thumbnail: string;
  url: string;
}
