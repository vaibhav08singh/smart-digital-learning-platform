import type { Domain, EducationLevel, Program, Stream } from "@/types";

// ------------------------------------------------------------
// Education levels — the CodeZen spine: Class 1 → Research
// ------------------------------------------------------------

export const educationLevels: EducationLevel[] = [
  {
    id: "class-1",
    name: "Class 1",
    shortLabel: "Class 1",
    stage: "school",
    group: "Class 1–5",
    description: "Foundations of literacy, numeracy and curiosity.",
    icon: "Rocket",
    gradient: "from-sky-400 to-cyan-400",
    programIds: ["p-class-1", "p-class-5"],
    nextLevelIds: ["class-2", "class-5"],
  },
  {
    id: "class-2",
    name: "Class 2",
    shortLabel: "Class 2",
    stage: "school",
    group: "Class 1–5",
    description: "Building reading, writing and basic maths confidence.",
    icon: "BookOpen",
    gradient: "from-sky-400 to-cyan-400",
    programIds: ["p-class-1", "p-class-5"],
    nextLevelIds: ["class-3", "class-5"],
  },
  {
    id: "class-3",
    name: "Class 3",
    shortLabel: "Class 3",
    stage: "school",
    group: "Class 1–5",
    description: "Concrete concepts in maths, science and language.",
    icon: "BookOpen",
    gradient: "from-sky-400 to-cyan-400",
    programIds: ["p-class-1", "p-class-5"],
    nextLevelIds: ["class-4", "class-5"],
  },
  {
    id: "class-4",
    name: "Class 4",
    shortLabel: "Class 4",
    stage: "school",
    group: "Class 1–5",
    description: "From concrete to early abstract thinking.",
    icon: "BookOpen",
    gradient: "from-sky-400 to-cyan-400",
    programIds: ["p-class-1", "p-class-5"],
    nextLevelIds: ["class-5", "class-5"],
  },
  {
    id: "class-5",
    name: "Class 5",
    shortLabel: "Class 5",
    stage: "school",
    group: "Class 1–5",
    description: "Primary school milestone — science basics, fractions, language arts.",
    icon: "GraduationCap",
    gradient: "from-cyan-400 to-teal-400",
    programIds: ["p-class-5", "p-class-8"],
    nextLevelIds: ["class-6", "class-8"],
  },
  {
    id: "class-6",
    name: "Class 6",
    shortLabel: "Class 6",
    stage: "school",
    group: "Class 6–8",
    description: "Middle school begins — algebra, physics basics, social science.",
    icon: "BookOpen",
    gradient: "from-teal-400 to-emerald-400",
    programIds: ["p-class-8"],
    nextLevelIds: ["class-7", "class-8"],
  },
  {
    id: "class-7",
    name: "Class 7",
    shortLabel: "Class 7",
    stage: "school",
    group: "Class 6–8",
    description: "Deeper science, equations and analytical thinking.",
    icon: "BookOpen",
    gradient: "from-teal-400 to-emerald-400",
    programIds: ["p-class-8"],
    nextLevelIds: ["class-8", "class-8"],
  },
  {
    id: "class-8",
    name: "Class 8",
    shortLabel: "Class 8",
    stage: "school",
    group: "Class 6–8",
    description: "Middle school milestone — introduction to higher maths and science.",
    icon: "GraduationCap",
    gradient: "from-emerald-400 to-green-400",
    programIds: ["p-class-8", "p-class-10"],
    nextLevelIds: ["class-9", "class-10"],
  },
  {
    id: "class-9",
    name: "Class 9",
    shortLabel: "Class 9",
    stage: "school",
    group: "Class 9–10",
    description: "Secondary school — algebra, trigonometry, cells and motion.",
    icon: "BookOpen",
    gradient: "from-green-400 to-lime-400",
    programIds: ["p-class-10"],
    nextLevelIds: ["class-10", "class-10"],
  },
  {
    id: "class-10",
    name: "Class 10",
    shortLabel: "Class 10",
    stage: "school",
    group: "Class 9–10",
    description: "Board examination level — quadratic equations, light, electricity.",
    icon: "Award",
    gradient: "from-lime-400 to-yellow-400",
    programIds: ["p-class-10", "p-class-12"],
    nextLevelIds: ["class-11", "class-12"],
  },
  {
    id: "class-11",
    name: "Class 11",
    shortLabel: "Class 11",
    stage: "school",
    group: "Class 11–12",
    description: "Senior secondary — calculus, mechanics, organic chemistry.",
    icon: "BookOpen",
    gradient: "from-amber-400 to-orange-400",
    programIds: ["p-class-12"],
    nextLevelIds: ["class-12", "class-12"],
  },
  {
    id: "class-12",
    name: "Class 12",
    shortLabel: "Class 12",
    stage: "school",
    group: "Class 11–12",
    description: "Senior secondary milestone — electromagnetic induction, complex numbers.",
    icon: "Award",
    gradient: "from-orange-400 to-red-400",
    programIds: ["p-class-12", "p-btech-cse", "p-btech-ece"],
    nextLevelIds: ["undergraduate", "btech"],
  },
  {
    id: "undergraduate",
    name: "Undergraduate",
    shortLabel: "Undergrad",
    stage: "undergraduate",
    group: "Undergraduate",
    description: "Foundational degrees — BSc, BA, BCom and general studies.",
    icon: "Library",
    gradient: "from-violet-400 to-purple-400",
    programIds: ["p-bsc-cs", "p-ba", "p-bcom"],
    nextLevelIds: ["btech"],
  },
  {
    id: "btech",
    name: "BTech / BE",
    shortLabel: "BTech",
    stage: "undergraduate",
    group: "BTech",
    description: "Engineering degrees — programming, DSA, OS, computer networks.",
    icon: "Cpu",
    gradient: "from-purple-400 to-fuchsia-400",
    programIds: ["p-btech-cse", "p-btech-ece", "p-btech-mech", "p-btech-civil"],
    nextLevelIds: ["postgraduate", "mtech"],
  },
  {
    id: "postgraduate",
    name: "Postgraduate",
    shortLabel: "Postgrad",
    stage: "postgraduate",
    group: "Postgraduate",
    description: "Advanced degrees — MSc, MA, MBA with specialization.",
    icon: "Library",
    gradient: "from-fuchsia-400 to-pink-400",
    programIds: ["p-msc-ai", "p-mba"],
    nextLevelIds: ["mtech", "advanced"],
  },
  {
    id: "mtech",
    name: "MTech / ME",
    shortLabel: "MTech",
    stage: "postgraduate",
    group: "MTech",
    description: "Advanced engineering — deep learning, advanced networks, research.",
    icon: "Brain",
    gradient: "from-pink-400 to-rose-400",
    programIds: ["p-mtech-ai", "p-mtech-cs"],
    nextLevelIds: ["advanced", "research"],
  },
  {
    id: "advanced",
    name: "Advanced / Professional",
    shortLabel: "Advanced",
    stage: "advanced",
    group: "Advanced / Professional",
    description: "Professional mastery — cloud, security, system design, leadership.",
    icon: "Trophy",
    gradient: "from-rose-400 to-red-400",
    programIds: ["p-professional"],
    nextLevelIds: ["research"],
  },
  {
    id: "research",
    name: "Research",
    shortLabel: "Research",
    stage: "advanced",
    group: "Advanced / Professional",
    description: "Frontier learning — papers, labs, thesis and original contribution.",
    icon: "FlaskConical",
    gradient: "from-indigo-400 to-violet-400",
    programIds: ["p-research"],
    nextLevelIds: [],
  },
];

// ------------------------------------------------------------
// Streams (faculty groupings)
// ------------------------------------------------------------

export const streams: Stream[] = [
  { id: "st-science", name: "Science", levelId: "class-11", description: "Physics, Chemistry, Maths, Biology", subjectIds: ["sub-physics", "sub-chemistry", "sub-maths", "sub-biology"] },
  { id: "st-commerce", name: "Commerce", levelId: "class-11", description: "Accounts, Business, Economics", subjectIds: ["sub-accounts", "sub-business", "sub-economics"] },
  { id: "st-arts", name: "Arts / Humanities", levelId: "class-11", description: "History, Geography, Civics", subjectIds: ["sub-history", "sub-geography"] },
  { id: "st-cse", name: "Computer Science & Engineering", levelId: "btech", description: "Programming, Systems, AI", subjectIds: ["sub-programming", "sub-dsa", "sub-dbms", "sub-os", "sub-networks", "sub-algorithms"] },
  { id: "st-ece", name: "Electronics & Communication", levelId: "btech", description: "Circuits, Signals, Embedded", subjectIds: ["sub-circuits", "sub-signals"] },
  { id: "st-mtech", name: "AI & Deep Learning", levelId: "mtech", description: "Neural networks, research", subjectIds: ["sub-dl", "sub-ml", "sub-nlp", "sub-cv"] },
];

// ------------------------------------------------------------
// Programs
// ------------------------------------------------------------

export const programs: Program[] = [
  { id: "p-class-1", name: "Class 1", levelId: "class-1", description: "Primary foundations", subjectIds: ["sub-maths", "sub-english", "sub-evidence"], domainIds: ["d-math", "d-language"], order: 1 },
  { id: "p-class-5", name: "Class 5", levelId: "class-5", description: "Primary milestone", subjectIds: ["sub-maths", "sub-science", "sub-english", "sub-sst"], domainIds: ["d-math", "d-science", "d-language", "d-social"], order: 2 },
  { id: "p-class-8", name: "Class 8", levelId: "class-8", description: "Middle school", subjectIds: ["sub-maths", "sub-science", "sub-english", "sub-sst"], domainIds: ["d-math", "d-science", "d-language", "d-social"], order: 3 },
  { id: "p-class-10", name: "Class 10", levelId: "class-10", description: "Secondary / boards", subjectIds: ["sub-maths", "sub-physics", "sub-chemistry", "sub-biology", "sub-english"], domainIds: ["d-math", "d-science"], order: 4 },
  { id: "p-class-12", name: "Class 12", levelId: "class-12", description: "Senior secondary", subjectIds: ["sub-maths", "sub-physics", "sub-chemistry", "sub-biology", "sub-computer-science"], domainIds: ["d-math", "d-science", "d-cs"], order: 5 },
  { id: "p-bsc-cs", name: "BSc Computer Science", levelId: "undergraduate", stream: "Science", description: "Foundations of computing", subjectIds: ["sub-programming", "sub-maths"], domainIds: ["d-cs", "d-math"], order: 6 },
  { id: "p-ba", name: "BA — Humanities", levelId: "undergraduate", stream: "Arts", description: "Liberal arts", subjectIds: ["sub-history", "sub-geography"], domainIds: ["d-humanities"], order: 7 },
  { id: "p-bcom", name: "BCom — Finance", levelId: "undergraduate", stream: "Commerce", description: "Business and finance", subjectIds: ["sub-accounts", "sub-economics", "sub-finance"], domainIds: ["d-business"], order: 8 },
  { id: "p-btech-cse", name: "BTech — Computer Science", levelId: "btech", stream: "Computer Science & Engineering", description: "Engineering of software systems", subjectIds: ["sub-programming", "sub-dsa", "sub-dbms", "sub-os", "sub-networks", "sub-algorithms"], domainIds: ["d-cs", "d-math"], order: 9 },
  { id: "p-btech-ece", name: "BTech — ECE", levelId: "btech", stream: "Electronics & Communication", description: "Circuits and signals", subjectIds: ["sub-circuits", "sub-signals"], domainIds: ["d-engineering"], order: 10 },
  { id: "p-btech-mech", name: "BTech — Mechanical", levelId: "btech", stream: "Engineering", description: "Mechanics and design", subjectIds: [], domainIds: ["d-engineering"], order: 11 },
  { id: "p-btech-civil", name: "BTech — Civil", levelId: "btech", stream: "Engineering", description: "Structures and infrastructure", subjectIds: [], domainIds: ["d-engineering"], order: 12 },
  { id: "p-msc-ai", name: "MSc Artificial Intelligence", levelId: "postgraduate", stream: "Science", description: "Advanced AI foundations", subjectIds: ["sub-ml", "sub-dl"], domainIds: ["d-ai", "d-data"], order: 13 },
  { id: "p-mba", name: "MBA — Business", levelId: "postgraduate", stream: "Commerce", description: "Business and strategy", subjectIds: ["sub-finance", "sub-business"], domainIds: ["d-business"], order: 14 },
  { id: "p-mtech-ai", name: "MTech — AI / ML", levelId: "mtech", stream: "AI & Deep Learning", description: "Research-grade machine learning", subjectIds: ["sub-dl", "sub-ml", "sub-nlp", "sub-cv"], domainIds: ["d-ai", "d-data", "d-research"], order: 15 },
  { id: "p-mtech-cs", name: "MTech — Computer Science", levelId: "mtech", stream: "Computer Science & Engineering", description: "Advanced systems", subjectIds: ["sub-algorithms", "sub-os"], domainIds: ["d-cs", "d-ai"], order: 16 },
  { id: "p-professional", name: "Professional Specialization", levelId: "advanced", description: "Cloud, security, systems", subjectIds: ["sub-cloud", "sub-security", "sub-webdev", "sub-se"], domainIds: ["d-cloud", "d-security", "d-web"], order: 17 },
  { id: "p-research", name: "Research Fellowship", levelId: "research", description: "Frontier investigation", subjectIds: ["sub-research-methods", "sub-dl"], domainIds: ["d-research", "d-ai"], order: 18 },
];

// ------------------------------------------------------------
// Domains (the Knowledge Universe nodes)
// ------------------------------------------------------------

export const domains: Domain[] = [
  { id: "d-math", name: "Mathematics", icon: "Sigma", color: "#6366f1", description: "Numbers, algebra, geometry, calculus", subjectIds: ["sub-maths"], stages: ["school", "undergraduate", "postgraduate", "advanced"] },
  { id: "d-science", name: "Science", icon: "FlaskConical", color: "#10b981", description: "Physics, chemistry and life sciences", subjectIds: ["sub-science", "sub-physics", "sub-chemistry", "sub-biology"], stages: ["school", "undergraduate"] },
  { id: "d-language", name: "Languages", icon: "Languages", color: "#f59e0b", description: "English and world languages", subjectIds: ["sub-english"], stages: ["school", "undergraduate"] },
  { id: "d-social", name: "Social Science", icon: "Globe", color: "#14b8a6", description: "History, geography, civics", subjectIds: ["sub-sst", "sub-history", "sub-geography"], stages: ["school"] },
  { id: "d-cs", name: "Computer Science", icon: "Cpu", color: "#8b5cf6", description: "Programming, DSA, systems and software", subjectIds: ["sub-programming", "sub-dsa", "sub-algorithms", "sub-dbms", "sub-os", "sub-networks", "sub-computer-science"], stages: ["school", "undergraduate", "postgraduate"] },
  { id: "d-ai", name: "AI / ML", icon: "Brain", color: "#ec4899", description: "Machine learning, deep learning, NLP, vision", subjectIds: ["sub-ml", "sub-dl", "sub-nlp", "sub-cv"], stages: ["undergraduate", "postgraduate", "advanced"] },
  { id: "d-data", name: "Data Science", icon: "BarChart3", color: "#06b6d4", description: "Analysis, statistics and data engineering", subjectIds: ["sub-data-science"], stages: ["undergraduate", "postgraduate", "advanced"] },
  { id: "d-security", name: "Cybersecurity", icon: "Shield", color: "#ef4444", description: "Security, cryptography and defense", subjectIds: ["sub-security"], stages: ["undergraduate", "postgraduate", "advanced"] },
  { id: "d-cloud", name: "Cloud Computing", icon: "Cloud", color: "#3b82f6", description: "Infrastructure, DevOps and platforms", subjectIds: ["sub-cloud"], stages: ["undergraduate", "postgraduate", "advanced"] },
  { id: "d-web", name: "Web Development", icon: "Globe", color: "#f97316", description: "Frontend, backend and full-stack engineering", subjectIds: ["sub-webdev"], stages: ["school", "undergraduate", "postgraduate", "advanced"] },
  { id: "d-se", name: "Software Engineering", icon: "Code2", color: "#22c55e", description: "Architecture, design and quality", subjectIds: ["sub-se"], stages: ["undergraduate", "postgraduate", "advanced"] },
  { id: "d-business", name: "Business", icon: "Briefcase", color: "#eab308", description: "Management, finance and entrepreneurship", subjectIds: ["sub-accounts", "sub-business", "sub-finance", "sub-economics"], stages: ["undergraduate", "postgraduate", "advanced"] },
  { id: "d-engineering", name: "Engineering", icon: "Wrench", color: "#a855f7", description: "Electronics, mechanical and civil", subjectIds: ["sub-circuits", "sub-signals"], stages: ["undergraduate"] },
  { id: "d-humanities", name: "Arts & Humanities", icon: "Palette", color: "#d946ef", description: "Arts, culture and philosophy", subjectIds: [], stages: ["school", "undergraduate", "postgraduate"] },
  { id: "d-research", name: "Research", icon: "Microscope", color: "#64748b", description: "Methods, labs and original contribution", subjectIds: ["sub-research-methods"], stages: ["postgraduate", "advanced"] },
];

export function getEducationLevel(id: string): EducationLevel | undefined {
  if (!id) return undefined;
  const exact = educationLevels.find((l) => l.id === id);
  if (exact) return exact;
  const target = id.toLowerCase();
  if (target === "phd" || target === "doctorate") return educationLevels.find((l) => l.id === "research");
  if (target === "postgrad") return educationLevels.find((l) => l.id === "postgraduate");
  if (target === "undergrad") return educationLevels.find((l) => l.id === "undergraduate");
  if (target === "master" || target === "masters") return educationLevels.find((l) => l.id === "mtech");
  return undefined;
}

export function getProgram(id: string): Program | undefined {
  return programs.find((p) => p.id === id);
}

export function getDomain(id: string): Domain | undefined {
  return domains.find((d) => d.id === id);
}

export function programsForLevel(levelId: string): Program[] {
  return programs.filter((p) => p.levelId === levelId);
}

export function domainsForProgram(program: Program): Domain[] {
  return domains.filter((d) => program.domainIds.includes(d.id));
}
