// ============================================================
// Notes & Resources per course.
// Only official / legal sources are used — official docs,
// open courseware, government & NGO education portals.
// ============================================================

export type ResourceType = "article" | "docs" | "textbook" | "practice" | "course" | "official";

export interface CourseResource {
  id: string;
  title: string;
  description: string;
  url: string;
  source: string;
  type: ResourceType;
  /** Direct download when the source officially publishes a PDF. */
  downloadUrl?: string;
}

export const resourcesByCourse: Record<string, CourseResource[]> = {
  "c-dsa-foundations": [
    {
      id: "r-dsa-trees-gfg",
      title: "Tree Data Structure",
      description: "Terminology, types of trees, traversals and operations with diagrams.",
      url: "https://www.geeksforgeeks.org/tree-data-structure/",
      source: "GeeksforGeeks",
      type: "article",
    },
    {
      id: "r-dsa-graph-gfg",
      title: "Graph Data Structure & Algorithms",
      description: "Graphs, adjacency lists, DFS/BFS and shortest path algorithms.",
      url: "https://www.geeksforgeeks.org/graph-data-structure-and-algorithms/",
      source: "GeeksforGeeks",
      type: "article",
    },
    {
      id: "r-dsa-ods",
      title: "Open Data Structures (free book)",
      description: "A complete, freely licensed DSA textbook — great for interviews.",
      url: "https://opendatastructures.org/",
      source: "Open Data Structures",
      type: "textbook",
    },
  ],
  "c-avltrees": [
    {
      id: "r-avl-gfg",
      title: "AVL Tree — Insertion",
      description: "Balance factors and the four rotations with worked examples.",
      url: "https://www.geeksforgeeks.org/avl-tree-set-1-insertion/",
      source: "GeeksforGeeks",
      type: "article",
    },
    {
      id: "r-avl-ods",
      title: "Open Data Structures — AVL Trees chapter",
      description: "Rigorous treatment of height balance and rotations.",
      url: "https://opendatastructures.org/ods-java/6_2_AVLTree.html",
      source: "Open Data Structures",
      type: "textbook",
    },
  ],
  "c-deep-learning": [
    {
      id: "r-dl-3b1b",
      title: "But what is a Neural Network? — interactive lesson",
      description: "The written version of the video with interactive visualisations.",
      url: "https://www.3blue1brown.com/lessons/neural-networks/",
      source: "3Blue1Brown",
      type: "article",
    },
    {
      id: "r-dl-mit",
      title: "MIT 6.S191 — Introduction to Deep Learning",
      description: "The famous open MIT course with lecture videos and slides.",
      url: "http://introtodeeplearning.com/",
      source: "MIT",
      type: "course",
    },
    {
      id: "r-dl-google",
      title: "Google Machine Learning Crash Course",
      description: "Free, hands-on introduction to ML concepts.",
      url: "https://developers.google.com/machine-learning/crash-course",
      source: "Google",
      type: "course",
    },
  ],
  "c-webdev-fullstack": [
    {
      id: "r-web-react",
      title: "React — Official Documentation",
      description: "Learn React the way the team recommends: components, hooks, thinking in React.",
      url: "https://react.dev",
      source: "React",
      type: "docs",
    },
    {
      id: "r-web-mdn",
      title: "MDN — JavaScript Guide",
      description: "The definitive reference for JavaScript, the language of the web.",
      url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
      source: "MDN",
      type: "docs",
    },
    {
      id: "r-web-odin",
      title: "The Odin Project — Full Stack Path",
      description: "Free, project-based curriculum covering HTML, CSS, JS and React.",
      url: "https://www.theodinproject.com/",
      source: "The Odin Project",
      type: "course",
    },
  ],
  "c-cloud-devops": [
    {
      id: "r-cloud-docker",
      title: "Docker Documentation — Get Started",
      description: "Official tutorials for images, containers, compose and volumes.",
      url: "https://docs.docker.com/get-started/",
      source: "Docker",
      type: "docs",
    },
    {
      id: "r-cloud-k8s",
      title: "Kubernetes Documentation",
      description: "Concepts, tutorials and reference for container orchestration.",
      url: "https://kubernetes.io/docs/",
      source: "Kubernetes",
      type: "docs",
    },
    {
      id: "r-cloud-roadmap",
      title: "DevOps Roadmap",
      description: "A visual map of the tools and concepts in the DevOps world.",
      url: "https://roadmap.sh/devops",
      source: "Roadmap.sh",
      type: "article",
    },
  ],
  "c-security": [
    {
      id: "r-sec-nist",
      title: "AES — FIPS 197 (official standard PDF)",
      description: "The NIST specification for the Advanced Encryption Standard.",
      url: "https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.197.pdf",
      source: "NIST",
      type: "official",
      downloadUrl: "https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.197.pdf",
    },
    {
      id: "r-sec-khan",
      title: "Khan Academy — Cryptography",
      description: "Interactive course covering ciphers, public-key crypto and more.",
      url: "https://www.khanacademy.org/computing/computer-science/cryptography",
      source: "Khan Academy",
      type: "course",
    },
    {
      id: "r-sec-crypto101",
      title: "Crypto 101 (free book)",
      description: "A friendly, freely available introduction to cryptography.",
      url: "https://www.crypto101.io/",
      source: "Crypto 101",
      type: "textbook",
    },
  ],
  "c-quadratic-equations": [
    {
      id: "r-quad-khan",
      title: "Quadratic functions & equations",
      description: "Video lessons and practice from factoring to the quadratic formula.",
      url: "https://www.khanacademy.org/math/algebra/x2f8bb11595b61c86:quadratic-functions-equations",
      source: "Khan Academy",
      type: "practice",
    },
    {
      id: "r-quad-ncert",
      title: "NCERT Class 10 Maths — Quadratic Equations chapter",
      description: "The official CBSE textbook chapter with exercises.",
      url: "https://ncert.nic.in/textbook.php",
      source: "NCERT",
      type: "textbook",
    },
    {
      id: "r-quad-mif",
      title: "Math is Fun — Quadratic Equations",
      description: "Plain-language explanation with interactive graphs.",
      url: "https://www.mathsisfun.com/algebra/quadratic-equation.html",
      source: "Math is Fun",
      type: "article",
    },
  ],
  "c-light-reflections": [
    {
      id: "r-light-khan",
      title: "Khan Academy — Reflection of light",
      description: "Watch and learn the laws of reflection with short quizzes.",
      url: "https://www.khanacademy.org/science/in-in-class10th-physics/in-in-10th-physics-light-reflection-refraction/in-in-reflection-of-light/v/laws-of-reflection2",
      source: "Khan Academy",
      type: "practice",
    },
    {
      id: "r-light-ncert",
      title: "NCERT textbooks",
      description: "Browse official NCERT school textbooks (Science, EVS and more).",
      url: "https://ncert.nic.in/textbook.php",
      source: "NCERT",
      type: "textbook",
    },
  ],
  "c-emi": [
    {
      id: "r-emi-khan",
      title: "Electromagnetic Induction — Faraday's experiments",
      description: "Khan Academy lesson with a clear step-by-step explanation.",
      url: "https://www.khanacademy.org/science/ap-physics-2/x0e2f5a2c:magnetism-and-electromagnetism/x0e2f5a2c:electromagnetic-induction/v/electromagnetic-induction-faradays-experiments",
      source: "Khan Academy",
      type: "practice",
    },
    {
      id: "r-emi-mit",
      title: "MIT 8.02 — Electricity & Magnetism (Walter Lewin)",
      description: "The full course homepage with lecture videos, notes and problem sets.",
      url: "https://ocw.mit.edu/courses/8-02-physics-ii-electricity-and-magnetism-spring-2007/",
      source: "MIT OpenCourseWare",
      type: "course",
    },
  ],
  "c-english-class5": [
    {
      id: "r-eng-khan-grammar",
      title: "Khan Academy — Grammar",
      description: "Learn parts of speech, including nouns, with interactive exercises.",
      url: "https://www.khanacademy.org/humanities/grammar",
      source: "Khan Academy",
      type: "practice",
    },
    {
      id: "r-eng-gm",
      title: "Grammar Monster — Nouns",
      description: "Clear lessons on common, proper, abstract and collective nouns.",
      url: "https://www.grammar-monster.com/lessons/nouns.htm",
      source: "Grammar Monster",
      type: "article",
    },
  ],
};

/** Resources for a course, or an empty list when none are mapped. */
export function resourcesForCourse(courseId: string): CourseResource[] {
  return resourcesByCourse[courseId] ?? [];
}
