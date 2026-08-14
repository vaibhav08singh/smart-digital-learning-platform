import type {
  ActivityEvent,
  AnalyticsSummary,
  PathNode,
  Recommendation,
  StudentProfile,
} from "@/types";

// The default demo persona for the platform.
export const defaultStudent: StudentProfile = {
  id: "student-1",
  name: "Vaibhav Singh",
  email: "vaibhav.singh@codezen.app",
  avatarId: "student-orange",
  levelId: "btech",
  programId: "p-btech-cse",
  classYear: "2nd Year",
  branch: "Computer Science",
  institution: "National Institute of Technology",
  goals: ["Build skills", "Competitive exam preparation"],
  learningStreakDays: 12,
  overallProgress: 46,
  totalStudyMinutes: 3240,
  dailyGoalMinutes: 45,
  strongSubjectIds: ["sub-dsa", "sub-programming"],
  weakSubjectIds: ["sub-algorithms", "sub-os"],
  preferredSubjectIds: ["sub-dsa", "sub-programming", "sub-dbms", "sub-os"],
  enrolledCourseIds: ["c-dsa-foundations", "c-deep-learning", "c-light-reflections", "c-quadratic-equations", "c-emi", "c-english-class5"],
  bookmarkedCourseIds: ["c-dsa-foundations", "c-light-reflections", "c-quadratic-equations", "c-deep-learning", "c-security"],
};

export const demoActivity: ActivityEvent[] = [
  { id: "a1", type: "lesson", title: "Completed: Tree Traversals", detail: "Data Structures · 22 min", timestamp: "2 hours ago", xp: 25 },
  { id: "a2", type: "quiz", title: "Quiz: Trees & AVL", detail: "Scored 81%", timestamp: "Yesterday", xp: 40 },
  { id: "a3", type: "practice", title: "Practice: AVL Rotations", detail: "12 questions · 15 min", timestamp: "Yesterday", xp: 18 },
  { id: "a4", type: "course", title: "Enrolled: Advanced Neural Networks", detail: "MTech · Deep Learning", timestamp: "3 days ago", xp: 10 },
  { id: "a5", type: "streak", title: "10-day learning streak", detail: "Keep it going!", timestamp: "4 days ago", xp: 50 },
];

export const demoAnalytics: AnalyticsSummary = {
  weeklyActivity: [
    { day: "Mon", minutes: 55 },
    { day: "Tue", minutes: 70 },
    { day: "Wed", minutes: 45 },
    { day: "Thu", minutes: 90 },
    { day: "Fri", minutes: 40 },
    { day: "Sat", minutes: 25 },
    { day: "Sun", minutes: 60 },
  ],
  studyMinutesTotal: 3240,
  studyMinutesLastWeek: 385,
  quizPerformance: [
    { quiz: "Trees & AVL", score: 81, date: "Aug 08" },
    { quiz: "Quadratic Equations", score: 92, date: "Aug 02" },
    { quiz: "Light & Reflection", score: 88, date: "Jul 28" },
    { quiz: "Dynamic Programming", score: 43, date: "Jul 22" },
    { quiz: "Electromagnetic Induction", score: 65, date: "Jul 15" },
  ],
  subjectPerformance: [
    { subjectId: "sub-dsa", subjectName: "Data Structures", score: 81 },
    { subjectId: "sub-programming", subjectName: "Programming", score: 78 },
    { subjectId: "sub-maths10", subjectName: "Mathematics", score: 72 },
    { subjectId: "sub-algorithms", subjectName: "Algorithms", score: 48 },
    { subjectId: "sub-os", subjectName: "Operating Systems", score: 44 },
  ],
  topicPerformance: [
    { topicId: "tp-trees", topicName: "Binary Trees", score: 92, mastery: "Mastered" },
    { topicId: "tp-avl", topicName: "AVL Trees", score: 81, mastery: "Strong" },
    { topicId: "tp-graphs", topicName: "Graphs", score: 55, mastery: "Needs Practice" },
    { topicId: "tp-dp", topicName: "Dynamic Programming", score: 43, mastery: "Needs Practice" },
    { topicId: "tp-quadratic", topicName: "Quadratic Equations", score: 92, mastery: "Mastered" },
  ],
  progressOverTime: [
    { week: "W1", progress: 8 },
    { week: "W2", progress: 16 },
    { week: "W3", progress: 22 },
    { week: "W4", progress: 31 },
    { week: "W5", progress: 38 },
    { week: "W6", progress: 46 },
  ],
  learningStreakDays: 12,
  dailyGoalMinutes: 45,
};

export const demoPath: PathNode[] = [
  { id: "pn-1", label: "Data Structures & Algorithms", description: "Trees, graphs & interview patterns", state: "completed", href: "/courses/c-dsa-foundations" },
  { id: "pn-2", label: "AVL Trees", description: "Self-balancing trees & rotations", state: "completed", href: "/courses/c-avltrees" },
  { id: "pn-3", label: "Advanced Neural Networks", description: "Backpropagation to attention", state: "in-progress", href: "/courses/c-deep-learning" },
  { id: "pn-4", label: "Full-Stack Web Development", description: "React hooks to production", state: "recommended", href: "/courses/c-webdev-fullstack" },
  { id: "pn-5", label: "Cloud & DevOps Essentials", description: "Docker, Kubernetes, CI/CD", state: "locked", href: "/courses/c-cloud-devops" },
  { id: "pn-6", label: "Cybersecurity: Cryptography", description: "Encryption & secure systems", state: "locked", href: "/courses/c-security" },
];

export const demoRecommendations: Recommendation[] = [
  { id: "r1", type: "continue", title: "Continue: AVL Rotations", reason: "You were 81% strong here — finish the last lesson to master it.", targetId: "c-dsa-foundations", targetHref: "/learning/tp-avl/tp-avl-l1", priority: 1 },
  { id: "r2", type: "practice", title: "Practice: Dynamic Programming", reason: "Your score of 43% needs work — 10 focused questions will help.", targetId: "quiz-dp", targetHref: "/quiz/quiz-dp", priority: 2 },
  { id: "r3", type: "course", title: "Try: Cloud & DevOps Essentials", reason: "Professional learners like you also study this domain.", targetId: "c-cloud-devops", targetHref: "/courses/c-cloud-devops", priority: 3 },
  { id: "r4", type: "ai", title: "AI Tutor suggests: Spaced revision", reason: "Revisit Binary Trees tomorrow to lock in the 92% you earned.", targetId: "ai", targetHref: "/ai-tutor", priority: 4 },
];
