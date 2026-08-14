import type { Chapter, Lesson, Subject, Topic } from "@/types";

// ============================================================
// Curriculum — subjects with chapters → topics → lessons.
// Full detail for the demo path; breadth for the rest.
// ============================================================

function lessons(
  baseId: string,
  titles: Array<[title: string, minutes: number]>,
  content: string,
  topicId: string,
): Lesson[] {
  return titles.map(([title, minutes], i) => ({
    id: `${baseId}-l${i + 1}`,
    title,
    topicId,
    order: i + 1,
    durationMinutes: minutes,
    content,
    resources: [
      { title: "Lesson notes", type: "pdf", url: "#" },
      { title: "Watch summary", type: "video", url: "#" },
    ],
  }));
}

function topic(
  id: string,
  name: string,
  description: string,
  difficulty: Topic["difficulty"],
  order: number,
  chapterId: string,
  lessonTitles: Array<[string, number]>,
  content: string,
): Topic {
  return {
    id,
    name,
    chapterId,
    description,
    order,
    difficulty,
    lessons: lessons(id, lessonTitles, content, id),
  };
}

const LESSON_CONTENT =
  "Welcome to this lesson. Break the idea into small steps, work through the worked examples, then try the practice questions. Remember to mark the lesson complete when you are finished so your learning path updates.";

// ------------------------------------------------------------
// Class 5
// ------------------------------------------------------------

export const subjects: Subject[] = [
  {
    id: "sub-science",
    name: "Science",
    domainId: "d-science",
    levelId: "class-5",
    icon: "FlaskConical",
    color: "#10b981",
    description: "Explore the natural world through observation and simple experiments.",
    chapters: [
      {
        id: "ch-sci-light",
        name: "Physics Basics",
        subjectId: "sub-science",
        description: "Light, shadows and how we see things.",
        order: 1,
        topics: [
          topic("tp-sci-light", "Light", "What is light and where does it come from?", "Beginner", 1, "ch-sci-light", [
            ["Sources of Light", 8],
            ["Shadow Formation", 10],
            ["Reflection of Light", 10],
          ], LESSON_CONTENT),
          topic("tp-sci-shadow", "Shadow Play", "How shadows are formed.", "Beginner", 2, "ch-sci-light", [
            ["Making Shadows", 8],
            ["Shadow Shapes", 6],
          ], LESSON_CONTENT),
        ],
      },
      {
        id: "ch-sci-plants",
        name: "Living World",
        subjectId: "sub-science",
        description: "Plants, animals and habitats.",
        order: 2,
        topics: [
          topic("tp-sci-plant", "Parts of a Plant", "Roots, stem, leaves and flowers.", "Beginner", 1, "ch-sci-plants", [
            ["Plant Parts", 9],
            ["Photosynthesis for Kids", 11],
          ], LESSON_CONTENT),
        ],
      },
    ],
  },
  {
    id: "sub-maths",
    name: "Mathematics",
    domainId: "d-math",
    levelId: "class-5",
    icon: "Sigma",
    color: "#6366f1",
    description: "Numbers, shapes, fractions and patterns.",
    chapters: [
      {
        id: "ch-math-fractions",
        name: "Fractions",
        subjectId: "sub-maths",
        description: "Halves, quarters and sharing things equally.",
        order: 1,
        topics: [
          topic("tp-math-frac", "Understanding Fractions", "Parts of a whole.", "Beginner", 1, "ch-math-fractions", [
            ["What is a Fraction?", 8],
            ["Equivalent Fractions", 12],
          ], LESSON_CONTENT),
        ],
      },
    ],
  },
  {
    id: "sub-english",
    name: "English",
    domainId: "d-language",
    levelId: "class-5",
    icon: "Languages",
    color: "#f59e0b",
    description: "Reading, grammar and creative writing.",
    chapters: [
      {
        id: "ch-eng-grammar",
        name: "Grammar",
        subjectId: "sub-english",
        description: "Nouns, verbs and sentence building.",
        order: 1,
        topics: [
          topic("tp-eng-noun", "Nouns", "Naming words.", "Beginner", 1, "ch-eng-grammar", [
            ["Common and Proper Nouns", 8],
            ["Singular and Plural", 7],
          ], LESSON_CONTENT),
        ],
      },
    ],
  },
  {
    id: "sub-sst",
    name: "Social Studies",
    domainId: "d-social",
    levelId: "class-5",
    icon: "Globe",
    color: "#14b8a6",
    description: "Our world, maps and communities.",
    chapters: [
      {
        id: "ch-sst-map",
        name: "Maps",
        subjectId: "sub-sst",
        description: "Reading maps and understanding directions.",
        order: 1,
        topics: [
          topic("tp-sst-dir", "Directions", "North, South, East and West.", "Beginner", 1, "ch-sst-map", [
            ["Compass Directions", 8],
          ], LESSON_CONTENT),
        ],
      },
    ],
  },

  // ------------------------------------------------------------
  // Class 10 — Mathematics / Algebra / Quadratic Equations
  // ------------------------------------------------------------
  {
    id: "sub-maths10",
    name: "Mathematics",
    domainId: "d-math",
    levelId: "class-10",
    icon: "Sigma",
    color: "#6366f1",
    description: "Algebra, trigonometry, coordinate geometry.",
    chapters: [
      {
        id: "ch-algebra",
        name: "Algebra",
        subjectId: "sub-maths10",
        description: "From linear to quadratic equations.",
        order: 1,
        topics: [
          topic("tp-quadratic", "Quadratic Equations", "ax² + bx + c = 0 and its solutions.", "Intermediate", 1, "ch-algebra", [
            ["Introduction to Quadratic Equations", 14],
            ["Factorisation Method", 16],
            ["Quadratic Formula", 18],
            ["Nature of Roots", 15],
          ], LESSON_CONTENT),
          topic("tp-linear", "Linear Equations", "Systems of equations in two variables.", "Beginner", 2, "ch-algebra", [
            ["Graphical Solution", 12],
            ["Substitution Method", 14],
          ], LESSON_CONTENT),
        ],
      },
      {
        id: "ch-trigonometry",
        name: "Trigonometry",
        subjectId: "sub-maths10",
        description: "Ratios and identities of triangles.",
        order: 2,
        topics: [
          topic("tp-trig-ratio", "Trigonometric Ratios", "sin, cos and tan.", "Intermediate", 1, "ch-trigonometry", [
            ["Right-Triangle Ratios", 15],
          ], LESSON_CONTENT),
        ],
      },
    ],
  },

  // ------------------------------------------------------------
  // Class 12 — Physics / Electromagnetism
  // ------------------------------------------------------------
  {
    id: "sub-physics",
    name: "Physics",
    domainId: "d-science",
    levelId: "class-12",
    icon: "Atom",
    color: "#3b82f6",
    description: "Mechanics, electromagnetism, modern physics.",
    chapters: [
      {
        id: "ch-electromagnetism",
        name: "Electromagnetism",
        subjectId: "sub-physics",
        description: "Electricity and magnetism as one force.",
        order: 1,
        topics: [
          topic("tp-emi", "Electromagnetic Induction", "Changing flux produces emf.", "Advanced", 1, "ch-electromagnetism", [
            ["Magnetic Flux", 16],
            ["Faraday's Law", 20],
            ["Lenz's Law", 18],
            ["AC Generators", 22],
          ], LESSON_CONTENT),
          topic("tp-ac", "Alternating Current", "AC circuits and impedance.", "Advanced", 2, "ch-electromagnetism", [
            ["AC Fundamentals", 18],
            ["R-L-C Circuits", 22],
          ], LESSON_CONTENT),
        ],
      },
      {
        id: "ch-modern-physics",
        name: "Modern Physics",
        subjectId: "sub-physics",
        description: "Photoelectric effect and atomic structure.",
        order: 2,
        topics: [
          topic("tp-photo", "Photoelectric Effect", "Light as photons.", "Advanced", 1, "ch-modern-physics", [
            ["Photon Energy", 16],
            ["Work Function", 18],
          ], LESSON_CONTENT),
        ],
      },
    ],
  },
  {
    id: "sub-chemistry",
    name: "Chemistry",
    domainId: "d-science",
    levelId: "class-12",
    icon: "FlaskConical",
    color: "#10b981",
    description: "Organic and physical chemistry.",
    chapters: [
      {
        id: "ch-organic",
        name: "Organic Chemistry",
        subjectId: "sub-chemistry",
        description: "Hydrocarbons and reactions.",
        order: 1,
        topics: [
          topic("tp-alkanes", "Alkanes", "Structure and properties.", "Intermediate", 1, "ch-organic", [
            ["Alkane Series", 15],
          ], LESSON_CONTENT),
        ],
      },
    ],
  },
  {
    id: "sub-biology",
    name: "Biology",
    domainId: "d-science",
    levelId: "class-12",
    icon: "Dna",
    color: "#22c55e",
    description: "Genetics, evolution and human physiology.",
    chapters: [
      {
        id: "ch-genetics",
        name: "Genetics",
        subjectId: "sub-biology",
        description: "Inheritance and variation.",
        order: 1,
        topics: [
          topic("tp-mendel", "Mendelian Inheritance", "Laws of inheritance.", "Advanced", 1, "ch-genetics", [
            ["Mendel's Laws", 18],
          ], LESSON_CONTENT),
        ],
      },
    ],
  },
  {
    id: "sub-computer-science",
    name: "Computer Science",
    domainId: "d-cs",
    levelId: "class-12",
    icon: "Cpu",
    color: "#8b5cf6",
    description: "Python and computational thinking.",
    chapters: [
      {
        id: "ch-python",
        name: "Python Programming",
        subjectId: "sub-computer-science",
        description: "Core programming constructs.",
        order: 1,
        topics: [
          topic("tp-py-basics", "Python Basics", "Variables, loops and functions.", "Beginner", 1, "ch-python", [
            ["Variables and Types", 12],
            ["Loops and Conditionals", 16],
            ["Functions", 15],
          ], LESSON_CONTENT),
        ],
      },
    ],
  },

  // ------------------------------------------------------------
  // BTech — Computer Science
  // ------------------------------------------------------------
  {
    id: "sub-programming",
    name: "Programming",
    domainId: "d-cs",
    levelId: "btech",
    icon: "Code2",
    color: "#22c55e",
    description: "Foundational programming in C and Python.",
    chapters: [
      {
        id: "ch-c-basics",
        name: "C Programming",
        subjectId: "sub-programming",
        description: "Pointers, memory and control flow.",
        order: 1,
        topics: [
          topic("tp-pointers", "Pointers and Memory", "Addresses, arrays and dynamic memory.", "Intermediate", 1, "ch-c-basics", [
            ["Pointer Basics", 18],
            ["Arrays and Pointers", 20],
            ["Dynamic Memory", 22],
          ], LESSON_CONTENT),
        ],
      },
    ],
  },
  {
    id: "sub-dsa",
    name: "Data Structures",
    domainId: "d-cs",
    levelId: "btech",
    icon: "Network",
    color: "#8b5cf6",
    description: "Storing and organizing data efficiently.",
    chapters: [
      {
        id: "ch-ds-trees",
        name: "Trees",
        subjectId: "sub-dsa",
        description: "Hierarchical structures and balanced trees.",
        order: 1,
        topics: [
          topic("tp-trees", "Binary Trees", "Traversals and properties.", "Intermediate", 1, "ch-ds-trees", [
            ["Tree Terminology", 16],
            ["Tree Traversals", 22],
            ["Height and Depth", 18],
          ], LESSON_CONTENT),
          topic("tp-avl", "AVL Trees", "Self-balancing binary search trees.", "Advanced", 2, "ch-ds-trees", [
            ["Balance Factor", 20],
            ["Rotations", 26],
            ["AVL Insertion", 24],
          ], LESSON_CONTENT),
        ],
      },
      {
        id: "ch-ds-graph",
        name: "Graphs",
        subjectId: "sub-dsa",
        description: "Networks of nodes and edges.",
        order: 2,
        topics: [
          topic("tp-graphs", "Graph Fundamentals", "Representations and BFS/DFS.", "Intermediate", 1, "ch-ds-graph", [
            ["Graph Representations", 18],
            ["Breadth-First Search", 20],
          ], LESSON_CONTENT),
        ],
      },
    ],
  },
  {
    id: "sub-algorithms",
    name: "Algorithms",
    domainId: "d-cs",
    levelId: "btech",
    icon: "GitBranch",
    color: "#f97316",
    description: "Design and analysis of algorithms.",
    chapters: [
      {
        id: "ch-algo-dp",
        name: "Dynamic Programming",
        subjectId: "sub-algorithms",
        description: "Optimal substructure and overlapping subproblems.",
        order: 1,
        topics: [
          topic("tp-dp", "Dynamic Programming", "From recursion to memoization.", "Expert", 1, "ch-algo-dp", [
            ["Recursion Review", 18],
            ["Memoization", 24],
            ["Tabulation", 22],
          ], LESSON_CONTENT),
        ],
      },
    ],
  },
  {
    id: "sub-dbms",
    name: "DBMS",
    domainId: "d-cs",
    levelId: "btech",
    icon: "Database",
    color: "#06b6d4",
    description: "Databases, SQL and transactions.",
    chapters: [
      {
        id: "ch-sql",
        name: "SQL",
        subjectId: "sub-dbms",
        description: "Queries and normalization.",
        order: 1,
        topics: [
          topic("tp-sql-query", "SQL Queries", "Select, join and aggregate.", "Intermediate", 1, "ch-sql", [
            ["Select and Where", 16],
            ["Joins", 22],
          ], LESSON_CONTENT),
        ],
      },
    ],
  },
  {
    id: "sub-os",
    name: "Operating Systems",
    domainId: "d-cs",
    levelId: "btech",
    icon: "MonitorCog",
    color: "#3b82f6",
    description: "Processes, scheduling and memory.",
    chapters: [
      {
        id: "ch-os-proc",
        name: "Processes",
        subjectId: "sub-os",
        description: "Process lifecycle and CPU scheduling.",
        order: 1,
        topics: [
          topic("tp-scheduling", "CPU Scheduling", "FCFS, SJF, Round Robin.", "Advanced", 1, "ch-os-proc", [
            ["Scheduling Basics", 18],
            ["Round Robin", 20],
          ], LESSON_CONTENT),
        ],
      },
    ],
  },
  {
    id: "sub-networks",
    name: "Computer Networks",
    domainId: "d-cs",
    levelId: "btech",
    icon: "Network",
    color: "#14b8a6",
    description: "Layers, protocols and the internet.",
    chapters: [
      {
        id: "ch-net-tcp",
        name: "Transport Layer",
        subjectId: "sub-networks",
        description: "TCP/UDP and congestion control.",
        order: 1,
        topics: [
          topic("tp-tcp", "TCP", "Reliable data transfer.", "Advanced", 1, "ch-net-tcp", [
            ["TCP Handshake", 16],
            ["Congestion Control", 20],
          ], LESSON_CONTENT),
        ],
      },
    ],
  },

  // ------------------------------------------------------------
  // MTech — AI / Deep Learning
  // ------------------------------------------------------------
  {
    id: "sub-dl",
    name: "Deep Learning",
    domainId: "d-ai",
    levelId: "mtech",
    icon: "Brain",
    color: "#ec4899",
    description: "Neural networks at research depth.",
    chapters: [
      {
        id: "ch-nn",
        name: "Advanced Neural Networks",
        subjectId: "sub-dl",
        description: "Architectures beyond the basics.",
        order: 1,
        topics: [
          topic("tp-nn-arch", "Neural Network Architectures", "From MLPs to attention.", "Expert", 1, "ch-nn", [
            ["Gradient Descent Deep Dive", 26],
            ["Backpropagation", 28],
            ["Attention Mechanisms", 34],
          ], LESSON_CONTENT),
          topic("tp-research", "Research Frontiers", "Open problems and current papers.", "Expert", 2, "ch-nn", [
            ["Reading a Research Paper", 24],
            ["Reproducing Results", 30],
          ], LESSON_CONTENT),
        ],
      },
    ],
  },
  {
    id: "sub-ml",
    name: "Machine Learning",
    domainId: "d-ai",
    levelId: "mtech",
    icon: "BrainCog",
    color: "#d946ef",
    description: "Statistical learning and models.",
    chapters: [
      {
        id: "ch-ml-sup",
        name: "Supervised Learning",
        subjectId: "sub-ml",
        description: "Regression and classification.",
        order: 1,
        topics: [
          topic("tp-svm", "Support Vector Machines", "Max-margin classifiers.", "Advanced", 1, "ch-ml-sup", [
            ["Margins", 22],
            ["Kernel Trick", 26],
          ], LESSON_CONTENT),
        ],
      },
    ],
  },
  {
    id: "sub-nlp",
    name: "NLP",
    domainId: "d-ai",
    levelId: "mtech",
    icon: "MessageSquareText",
    color: "#a855f7",
    description: "Language models and transformers.",
    chapters: [
      {
        id: "ch-nlp-transformers",
        name: "Transformers",
        subjectId: "sub-nlp",
        description: "Self-attention and LLMs.",
        order: 1,
        topics: [
          topic("tp-self-attn", "Self-Attention", "How transformers attend.", "Expert", 1, "ch-nlp-transformers", [
            ["Embeddings", 20],
            ["Self-Attention", 30],
          ], LESSON_CONTENT),
        ],
      },
    ],
  },
  {
    id: "sub-cv",
    name: "Computer Vision",
    domainId: "d-ai",
    levelId: "mtech",
    icon: "ScanEye",
    color: "#6366f1",
    description: "Convolutional networks and vision tasks.",
    chapters: [
      {
        id: "ch-cv-cnn",
        name: "CNNs",
        subjectId: "sub-cv",
        description: "Convolutional architectures.",
        order: 1,
        topics: [
          topic("tp-cnn", "Convolutional Networks", "Filters, pooling, backprop.", "Advanced", 1, "ch-cv-cnn", [
            ["Convolutions", 24],
            ["Pooling and Strides", 20],
          ], LESSON_CONTENT),
        ],
      },
    ],
  },

  // ------------------------------------------------------------
  // Advanced / Professional
  // ------------------------------------------------------------
  {
    id: "sub-webdev",
    name: "Web Development",
    domainId: "d-web",
    levelId: "advanced",
    icon: "Globe",
    color: "#f97316",
    description: "Modern full-stack engineering.",
    chapters: [
      {
        id: "ch-react",
        name: "React & Next.js",
        subjectId: "sub-webdev",
        description: "Component-driven web apps.",
        order: 1,
        topics: [
          topic("tp-react-hooks", "Hooks Deep Dive", "State and effects.", "Advanced", 1, "ch-react", [
            ["useState and useEffect", 20],
            ["Custom Hooks", 24],
          ], LESSON_CONTENT),
        ],
      },
    ],
  },
  {
    id: "sub-cloud",
    name: "Cloud Computing",
    domainId: "d-cloud",
    levelId: "advanced",
    icon: "Cloud",
    color: "#3b82f6",
    description: "AWS, containers and DevOps.",
    chapters: [
      {
        id: "ch-devops",
        name: "DevOps",
        subjectId: "sub-cloud",
        description: "CI/CD and infrastructure as code.",
        order: 1,
        topics: [
          topic("tp-docker", "Docker & Kubernetes", "Containers at scale.", "Advanced", 1, "ch-devops", [
            ["Container Basics", 20],
            ["Kubernetes Pods", 26],
          ], LESSON_CONTENT),
        ],
      },
    ],
  },
  {
    id: "sub-security",
    name: "Cybersecurity",
    domainId: "d-security",
    levelId: "advanced",
    icon: "Shield",
    color: "#ef4444",
    description: "Offensive and defensive security.",
    chapters: [
      {
        id: "ch-crypto",
        name: "Cryptography",
        subjectId: "sub-security",
        description: "Encryption and hashing.",
        order: 1,
        topics: [
          topic("tp-crypto", "Symmetric Encryption", "AES and modes.", "Advanced", 1, "ch-crypto", [
            ["AES Fundamentals", 24],
          ], LESSON_CONTENT),
        ],
      },
    ],
  },
  {
    id: "sub-data-science",
    name: "Data Science",
    domainId: "d-data",
    levelId: "advanced",
    icon: "BarChart3",
    color: "#06b6d4",
    description: "Analysis, statistics and pipelines.",
    chapters: [
      {
        id: "ch-stats",
        name: "Statistics",
        subjectId: "sub-data-science",
        description: "Probability and inference.",
        order: 1,
        topics: [
          topic("tp-hypothesis", "Hypothesis Testing", "p-values and confidence.", "Advanced", 1, "ch-stats", [
            ["Sampling Distributions", 22],
            ["t-Tests", 24],
          ], LESSON_CONTENT),
        ],
      },
    ],
  },
  {
    id: "sub-se",
    name: "Software Engineering",
    domainId: "d-se",
    levelId: "advanced",
    icon: "Code2",
    color: "#22c55e",
    description: "Architecture and system design.",
    chapters: [
      {
        id: "ch-sysdesign",
        name: "System Design",
        subjectId: "sub-se",
        description: "Designing scalable systems.",
        order: 1,
        topics: [
          topic("tp-design-scaling", "Scaling Systems", "Load balancing and caching.", "Expert", 1, "ch-sysdesign", [
            ["Load Balancers", 24],
            ["Caching Strategies", 26],
          ], LESSON_CONTENT),
        ],
      },
    ],
  },
  {
    id: "sub-finance",
    name: "Finance",
    domainId: "d-business",
    levelId: "advanced",
    icon: "LineChart",
    color: "#eab308",
    description: "Markets, valuation and investing.",
    chapters: [
      {
        id: "ch-invest",
        name: "Investing",
        subjectId: "sub-finance",
        description: "Equities, risk and portfolios.",
        order: 1,
        topics: [
          topic("tp-valuation", "Valuation", "DCF and multiples.", "Advanced", 1, "ch-invest", [
            ["DCF Modeling", 26],
          ], LESSON_CONTENT),
        ],
      },
    ],
  },
  {
    id: "sub-business",
    name: "Business",
    domainId: "d-business",
    levelId: "advanced",
    icon: "Briefcase",
    color: "#eab308",
    description: "Strategy and operations.",
    chapters: [
      {
        id: "ch-strategy",
        name: "Strategy",
        subjectId: "sub-business",
        description: "Frameworks for decisions.",
        order: 1,
        topics: [
          topic("tp-porters", "Porter's Five Forces", "Industry analysis.", "Advanced", 1, "ch-strategy", [
            ["Industry Forces", 20],
          ], LESSON_CONTENT),
        ],
      },
    ],
  },
  {
    id: "sub-research-methods",
    name: "Research Methods",
    domainId: "d-research",
    levelId: "research",
    icon: "Microscope",
    color: "#64748b",
    description: "Designing and running studies.",
    chapters: [
      {
        id: "ch-methods",
        name: "Methodology",
        subjectId: "sub-research-methods",
        description: "From question to paper.",
        order: 1,
        topics: [
          topic("tp-lit-review", "Literature Review", "Surveying prior work.", "Advanced", 1, "ch-methods", [
            ["Searching Papers", 20],
            ["Synthesis", 24],
          ], LESSON_CONTENT),
          topic("tp-writing", "Academic Writing", "Structure and rigor.", "Advanced", 2, "ch-methods", [
            ["Paper Structure", 22],
          ], LESSON_CONTENT),
        ],
      },
    ],
  },
  {
    id: "sub-circuits",
    name: "Circuits",
    domainId: "d-engineering",
    levelId: "btech",
    icon: "Zap",
    color: "#eab308",
    description: "Analog and digital circuits.",
    chapters: [
      {
        id: "ch-opamp",
        name: "Operational Amplifiers",
        subjectId: "sub-circuits",
        description: "Ideal op-amp circuits.",
        order: 1,
        topics: [
          topic("tp-opamp", "Op-Amp Configurations", "Inverting and non-inverting.", "Intermediate", 1, "ch-opamp", [
            ["Op-Amp Basics", 20],
          ], LESSON_CONTENT),
        ],
      },
    ],
  },
  {
    id: "sub-signals",
    name: "Signals & Systems",
    domainId: "d-engineering",
    levelId: "btech",
    icon: "AudioWaveform",
    color: "#06b6d4",
    description: "Continuous and discrete signals.",
    chapters: [
      {
        id: "ch-fourier",
        name: "Fourier Analysis",
        subjectId: "sub-signals",
        description: "Frequency domain thinking.",
        order: 1,
        topics: [
          topic("tp-fourier", "Fourier Transform", "Decomposing signals.", "Advanced", 1, "ch-fourier", [
            ["Fourier Series", 24],
          ], LESSON_CONTENT),
        ],
      },
    ],
  },
  {
    id: "sub-history",
    name: "History",
    domainId: "d-humanities",
    levelId: "undergraduate",
    icon: "Landmark",
    color: "#d946ef",
    description: "Civilizations and modern world history.",
    chapters: [
      {
        id: "ch-modern-hist",
        name: "Modern World",
        subjectId: "sub-history",
        description: "Industrial age to the present.",
        order: 1,
        topics: [
          topic("tp-indus", "The Industrial Revolution", "Transformation of production.", "Intermediate", 1, "ch-modern-hist", [
            ["Factory Systems", 18],
          ], LESSON_CONTENT),
        ],
      },
    ],
  },
  {
    id: "sub-geography",
    name: "Geography",
    domainId: "d-humanities",
    levelId: "undergraduate",
    icon: "Globe",
    color: "#14b8a6",
    description: "Physical and human geography.",
    chapters: [
      {
        id: "ch-climate",
        name: "Climate",
        subjectId: "sub-geography",
        description: "Weather systems and climate zones.",
        order: 1,
        topics: [
          topic("tp-climate-zones", "Climate Zones", "Classification of climates.", "Intermediate", 1, "ch-climate", [
            ["Tropical Climates", 18],
          ], LESSON_CONTENT),
        ],
      },
    ],
  },
  {
    id: "sub-accounts",
    name: "Accountancy",
    domainId: "d-business",
    levelId: "undergraduate",
    icon: "Calculator",
    color: "#eab308",
    description: "Books of account and financial statements.",
    chapters: [
      {
        id: "ch-basics-acc",
        name: "Fundamentals",
        subjectId: "sub-accounts",
        description: "Debits, credits and journals.",
        order: 1,
        topics: [
          topic("tp-journal", "Journal Entries", "Recording transactions.", "Beginner", 1, "ch-basics-acc", [
            ["Double Entry", 18],
          ], LESSON_CONTENT),
        ],
      },
    ],
  },
  {
    id: "sub-economics",
    name: "Economics",
    domainId: "d-business",
    levelId: "undergraduate",
    icon: "TrendingUp",
    color: "#f59e0b",
    description: "Micro and macro economics.",
    chapters: [
      {
        id: "ch-micro",
        name: "Microeconomics",
        subjectId: "sub-economics",
        description: "Markets and demand.",
        order: 1,
        topics: [
          topic("tp-demand", "Demand & Supply", "Market equilibrium.", "Intermediate", 1, "ch-micro", [
            ["Elasticity", 20],
          ], LESSON_CONTENT),
        ],
      },
    ],
  },
  {
    id: "sub-evidence",
    name: "Environmental Studies",
    domainId: "d-science",
    levelId: "class-1",
    icon: "Leaf",
    color: "#22c55e",
    description: "Our surroundings and nature.",
    chapters: [
      {
        id: "ch-nature",
        name: "Nature Around Us",
        subjectId: "sub-evidence",
        description: "Plants, animals and seasons.",
        order: 1,
        topics: [
          topic("tp-seasons", "Seasons", "Weather across the year.", "Beginner", 1, "ch-nature", [
            ["Four Seasons", 7],
          ], LESSON_CONTENT),
        ],
      },
    ],
  },
];

export function getSubject(id: string): Subject | undefined {
  return subjects.find((s) => s.id === id);
}

export function getChapter(id: string): Chapter | undefined {
  for (const subject of subjects) {
    const chapter = subject.chapters.find((c) => c.id === id);
    if (chapter) return chapter;
  }
  return undefined;
}

export function getTopic(id: string): Topic | undefined {
  for (const subject of subjects) {
    for (const chapter of subject.chapters) {
      const topic = chapter.topics.find((t) => t.id === id);
      if (topic) return topic;
    }
  }
  return undefined;
}

export function getLesson(id: string): Lesson | undefined {
  if (!id) return undefined;

  for (const subject of subjects) {
    for (const chapter of subject.chapters) {
      for (const topic of chapter.topics) {
        const lesson = topic.lessons.find((l) => l.id === id);
        if (lesson) return lesson;
      }
    }
  }

  const directTopic = getTopic(id);
  if (directTopic && directTopic.lessons.length > 0) {
    return directTopic.lessons[0];
  }

  const formattedTitle = id
    .replace(/^tp-/, "")
    .replace(/-l\d+$/, "")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return {
    id,
    title: formattedTitle || "Interactive Lesson",
    topicId: "tp-sci-light",
    order: 1,
    durationMinutes: 10,
    content: LESSON_CONTENT,
    resources: [
      { title: "Lesson notes", type: "pdf", url: "#" },
      { title: "Watch summary", type: "video", url: "#" },
    ],
  };
}

export function subjectsForLevel(levelId: string): Subject[] {
  return subjects.filter((s) => s.levelId === levelId);
}

export function subjectsForDomain(domainId: string): Subject[] {
  return subjects.filter((s) => s.domainId === domainId);
}

/** Flatten every lesson in a subject for progress tracking. */
export function subjectLessons(subject: Subject): Lesson[] {
  return subject.chapters.flatMap((c) => c.topics.flatMap((t) => t.lessons));
}

export function subjectLessonCount(subject: Subject): number {
  return subjectLessons(subject).length;
}
