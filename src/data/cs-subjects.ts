// ============================================================
// Computer Science subject metadata for the AI tutor.
// This is NOT a question/answer bank — it gives the tutor
// syllabus context (topics, aliases, related subjects) so the
// answer engine can route and structure answers dynamically.
// Add new subjects here and they instantly work in the tutor,
// the /subjects explorer, quizzes and learning paths.
// ============================================================

export type CsSubjectCategoryId =
  | "programming"
  | "core"
  | "development"
  | "ai-data"
  | "advanced";

export interface CsSubjectCategory {
  id: CsSubjectCategoryId;
  label: string;
  description: string;
}

export const csSubjectCategories: CsSubjectCategory[] = [
  { id: "programming", label: "Programming", description: "Languages and coding fundamentals" },
  { id: "core", label: "Core CS", description: "The theoretical backbone of Computer Science" },
  { id: "development", label: "Development", description: "Building software for the real world" },
  { id: "ai-data", label: "AI & Data", description: "Intelligence, data science and machine learning" },
  { id: "advanced", label: "Advanced", description: "Systems, security and specialised topics" },
];

export interface CsSubject {
  id: string;
  name: string;
  category: CsSubjectCategoryId;
  /** One-line descriptor shown on cards. */
  short: string;
  /** Syllabus-level description — factual context for the tutor. */
  about: string;
  /** Canonical syllabus topics for this subject. */
  topics: string[];
  /** Words/phrases used to detect this subject in a chat message. */
  aliases: string[];
  /** Other subject ids the student is likely to also study. */
  related: string[];
  /** Real official/reputable reference (never fabricated). */
  docs: { label: string; url: string }[];
}

export const csSubjects: CsSubject[] = [
  // ------------------------------------------------------------
  // Programming
  // ------------------------------------------------------------
  {
    id: "c",
    name: "C Programming",
    category: "programming",
    short: "The classic systems language",
    about:
      "C is a low-level, procedural language used for operating systems, embedded systems and performance-critical code. Exams focus on pointers, memory, arrays, strings, structures and recursion.",
    topics: [
      "Basics of C", "Operators & expressions", "Control flow", "Functions", "Arrays",
      "Strings", "Pointers", "Structures & unions", "Dynamic memory allocation", "File handling",
      "Preprocessor", "Recursion",
    ],
    aliases: ["c programming", " c ", "in c", "c language", "pointers in c"],
    related: ["cpp", "os", "coa", "python"],
    docs: [{ label: "cppreference — C reference", url: "https://en.cppreference.com/w/c" }],
  },
  {
    id: "cpp",
    name: "C++",
    category: "programming",
    short: "C with objects, templates and STL",
    about:
      "C++ adds classes, inheritance, templates and the STL to C. Exams cover OOP, pointers, STL containers, operator overloading and memory management.",
    topics: [
      "C++ basics", "Functions & references", "Classes & objects", "Constructors & destructors",
      "Inheritance", "Polymorphism", "Operator overloading", "Templates", "STL containers",
      "Pointers & references", "Dynamic memory", "Exception handling", "File I/O",
    ],
    aliases: ["c++", "cpp", "c plus plus"],
    related: ["c", "oop", "dsa"],
    docs: [{ label: "cppreference — C++ reference", url: "https://en.cppreference.com/w/" }],
  },
  {
    id: "java",
    name: "Java",
    category: "programming",
    short: "Object-oriented, platform-independent",
    about:
      "Java is a strongly-typed, object-oriented language. Exams cover OOP, JVM, collections, exceptions, threads, generics and the Java memory model.",
    topics: [
      "Java basics", "Classes & objects", "Inheritance", "Interfaces & abstract classes",
      "Polymorphism", "Packages", "Exception handling", "Collections framework",
      "Generics", "Multithreading", "Streams & I/O", "JVM & garbage collection",
    ],
    aliases: ["java", "jvm", "javafx", "spring"],
    related: ["oop", "cpp", "dsa", "dbms"],
    docs: [{ label: "Oracle — Java documentation", url: "https://docs.oracle.com/en/java/" }],
  },
  {
    id: "python",
    name: "Python",
    category: "programming",
    short: "Readable, batteries-included scripting",
    about:
      "Python is an interpreted, dynamically-typed language used across scripting, data science and AI. Exams cover data types, functions, OOP, modules and standard library.",
    topics: [
      "Python basics", "Data types", "Lists & tuples & dicts", "Control flow",
      "Functions & lambdas", "Modules & packages", "OOP in Python", "File handling",
      "Exception handling", "Comprehensions", "Iterators & generators", "Standard library",
    ],
    aliases: ["python", "python3"],
    related: ["data-science", "ml", "dsa", "webdev"],
    docs: [{ label: "Python documentation", url: "https://docs.python.org/3/" }],
  },
  {
    id: "javascript",
    name: "JavaScript",
    category: "programming",
    short: "The language of the web",
    about:
      "JavaScript powers interactive web pages and, via Node.js, the server. Exams cover ES6+, functions, closures, the event loop, DOM, promises and async/await.",
    topics: [
      "JS basics", "Functions & scope", "Closures", "Objects & prototypes", "ES6+ features",
      "Arrays & objects methods", "DOM manipulation", "Events", "Promises & async/await",
      "Modules", "Event loop",
    ],
    aliases: ["javascript", "js", "nodejs", "ecmascript"],
    related: ["typescript", "react", "nodejs", "webdev", "html", "css"],
    docs: [{ label: "MDN — JavaScript", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript" }],
  },
  {
    id: "typescript",
    name: "TypeScript",
    category: "programming",
    short: "JavaScript with types",
    about:
      "TypeScript adds static typing and modern tooling to JavaScript. Exams cover types, interfaces, generics, classes and configuration.",
    topics: [
      "TS basics", "Primitive & structural types", "Interfaces", "Type aliases", "Generics",
      "Classes & modifiers", "Union & intersection types", "Utility types", "Modules",
      "tsconfig & tooling",
    ],
    aliases: ["typescript", "ts"],
    related: ["javascript", "react", "nodejs"],
    docs: [{ label: "TypeScript handbook", url: "https://www.typescriptlang.org/docs/" }],
  },

  // ------------------------------------------------------------
  // Core CS
  // ------------------------------------------------------------
  {
    id: "dsa",
    name: "Data Structures",
    category: "core",
    short: "Organising data efficiently",
    about:
      "Data structures are ways to store and organise data so operations stay fast. Exams cover arrays, linked lists, stacks, queues, trees, graphs, hashing and heaps, with complexity analysis.",
    topics: [
      "Arrays", "Strings", "Linked lists", "Stacks", "Queues", "Deque", "Hash tables",
      "Trees", "Binary trees", "Binary search trees", "AVL trees", "Heaps", "Priority queues",
      "Graphs", "Trie", "B-tree & B+ tree", "Union-Find / Disjoint sets",
    ],
    aliases: ["data structures", "dsa", "data structure", "linked list", "hash table", "stack", "queue", "heap", "bst", "trie"],
    related: ["algorithms", "daa", "cpp", "java"],
    docs: [{ label: "GeeksforGeeks — Data Structures", url: "https://www.geeksforgeeks.org/data-structures/" }],
  },
  {
    id: "algorithms",
    name: "Algorithms",
    category: "core",
    short: "Step-by-step problem solving",
    about:
      "Algorithms are precise procedures for solving problems. Exams cover searching, sorting, graph algorithms, greedy, dynamic programming, backtracking and complexity analysis.",
    topics: [
      "Searching", "Sorting", "Binary search", "Merge sort", "Quick sort", "Heap sort",
      "BFS & DFS", "Dijkstra", "Bellman-Ford", "Floyd-Warshall", "Prim's", "Kruskal's",
      "Topological sort", "Greedy algorithms", "Dynamic programming", "Backtracking",
      "Divide & conquer", "Branch & bound", "String algorithms",
    ],
    aliases: ["algorithms", "algorithm", "sorting", "binary search", "dijkstra", "dynamic programming"],
    related: ["dsa", "daa", "discrete-math"],
    docs: [{ label: "GeeksforGeeks — Algorithms", url: "https://www.geeksforgeeks.org/fundamentals-of-algorithms/" }],
  },
  {
    id: "daa",
    name: "Design & Analysis of Algorithms",
    category: "core",
    short: "Proving and comparing algorithms",
    about:
      "DAA focuses on asymptotic analysis, recurrence relations, algorithm design paradigms and correctness proofs. GATE and university exams stress complexity classes and recurrence solving.",
    topics: [
      "Asymptotic notation", "Recurrence relations", "Master theorem", "Divide & conquer",
      "Greedy algorithms", "Dynamic programming", "Graph algorithms", "Amortised analysis",
      "Lower bounds", "NP-completeness", "P vs NP", "Randomised algorithms",
    ],
    aliases: ["design and analysis", "daa", "asymptotic", "master theorem", "np-complete", "np hard"],
    related: ["algorithms", "discrete-math", "toc"],
    docs: [{ label: "MIT 6.046J — Design & Analysis of Algorithms", url: "https://ocw.mit.edu/courses/6-046j-design-and-analysis-of-algorithms-spring-2015/" }],
  },
  {
    id: "dbms",
    name: "Database Management Systems",
    category: "core",
    short: "Storing and querying data",
    about:
      "DBMS covers how databases store, organise and query data safely. Exams cover the relational model, normalization, SQL, transactions, concurrency, indexing and B+ trees.",
    topics: [
      "ER model", "Relational model", "Relational algebra", "SQL", "Normalization (1NF-3NF/BCNF)",
      "Keys & constraints", "Transactions", "ACID properties", "Concurrency control", "Deadlock in DB",
      "Indexing", "B+ trees", "Query optimization", "NoSQL basics",
    ],
    aliases: ["dbms", "database", "normalization", "normalisation", "er model", "acid", "relational"],
    related: ["sql", "os", "daa"],
    docs: [{ label: "CMU 15-445 — Database Systems", url: "https://15445.courses.cs.cmu.edu/" }],
  },
  {
    id: "sql",
    name: "SQL",
    category: "core",
    short: "Querying relational databases",
    about:
      "SQL is the standard language for querying relational databases. Exams cover SELECT, joins, aggregation, subqueries, DDL/DML, indexing and query tuning.",
    topics: [
      "SELECT basics", "WHERE & filtering", "ORDER BY & LIMIT", "Aggregate functions", "GROUP BY & HAVING",
      "JOINs (INNER/LEFT/RIGHT/FULL)", "Subqueries", "Set operations", "DDL & DML", "Constraints",
      "Indexes", "Views", "Transactions in SQL",
    ],
    aliases: ["sql", "mysql", "postgres", "query", "join", "group by"],
    related: ["dbms", "data-science"],
    docs: [{ label: "MySQL — SQL statements reference", url: "https://dev.mysql.com/doc/refman/en/sql-statements.html" }],
  },
  {
    id: "os",
    name: "Operating Systems",
    category: "core",
    short: "Managing hardware for programs",
    about:
      "Operating systems manage processes, memory, files and devices. Exams cover processes & threads, scheduling, deadlocks, memory management, paging and file systems.",
    topics: [
      "Processes", "Threads", "CPU scheduling", "Synchronization", "Deadlock", "Memory management",
      "Paging & segmentation", "Virtual memory", "File systems", "Disk scheduling", "System calls",
      "Process synchronization",
    ],
    aliases: ["operating system", "operating systems", " os ", "deadlock", "process scheduling", "paging", "semaphore"],
    related: ["cn", "coa", "c", "distributed"],
    docs: [{ label: "MIT 6.S081 — Operating System Engineering", url: "https://pdos.csail.mit.edu/6.828/" }],
  },
  {
    id: "cn",
    name: "Computer Networks",
    category: "core",
    short: "Connecting computers worldwide",
    about:
      "Computer networks cover how data travels between devices. Exams cover the OSI & TCP/IP models, IP addressing, routing, TCP/UDP, and application-layer protocols.",
    topics: [
      "OSI model", "TCP/IP model", "Network topologies", "IP addressing & subnetting", "IPv4 & IPv6",
      "Routing algorithms", "TCP vs UDP", "Flow & congestion control", "DNS", "HTTP/HTTPS",
      "Ethernet & switches", "Network security basics",
    ],
    aliases: ["computer networks", "computer network", "networks", "osi", "tcp/ip", "subnetting", "routing", " networking "],
    related: ["os", "security", "distributed"],
    docs: [{ label: "RFC Editor", url: "https://www.rfc-editor.org/" }],
  },
  {
    id: "coa",
    name: "Computer Organization & Architecture",
    category: "core",
    short: "How the CPU actually works",
    about:
      "COA covers the hardware design of computers: instruction sets, CPU datapath, pipelining, memory hierarchy, cache and I/O. Exams often ask about addressing modes and instruction cycles.",
    topics: [
      "Number systems", "Boolean algebra & gates", "Instruction sets", "Addressing modes",
      "CPU datapath", "Control unit", "Pipelining", "Memory hierarchy", "Cache memory",
      "Virtual memory", "I/O organization", "RISC vs CISC",
    ],
    aliases: ["computer organization", "computer architecture", "coa", "pipelining", "cache memory", "addressing mode"],
    related: ["digital-electronics", "os", "c"],
    docs: [{ label: "MIT 6.004 — Computation Structures", url: "https://ocw.mit.edu/courses/6-004-computation-structures-spring-2017/" }],
  },
  {
    id: "digital-electronics",
    name: "Digital Electronics",
    category: "core",
    short: "Logic gates and circuits",
    about:
      "Digital electronics covers binary logic, gates, combinational and sequential circuits, flip-flops, counters and memory elements that form the basis of computing hardware.",
    topics: [
      "Number systems", "Boolean algebra", "Logic gates", "Karnaugh maps", "Combinational circuits",
      "Multiplexers & decoders", "Flip-flops", "Counters", "Shift registers", "Sequential circuits",
      "Adders & ALU", "Memory elements",
    ],
    aliases: ["digital electronics", "digital logic", "logic gates", "k map", "flip flop", "boolean algebra"],
    related: ["coa", "discrete-math"],
    docs: [{ label: "NPTEL — Digital Circuits", url: "https://nptel.ac.in/" }],
  },
  {
    id: "discrete-math",
    name: "Discrete Mathematics",
    category: "core",
    short: "Math for computer science",
    about:
      "Discrete math underpins algorithms and theory: sets, logic, proofs, combinatorics, relations, graphs and number theory. GATE and university exams test proofs and counting.",
    topics: [
      "Sets & relations", "Mathematical logic", "Proof techniques", "Combinatorics",
      "Permutations & combinations", "Recurrence relations", "Graph theory", "Trees",
      "Number theory", "Boolean algebra", "Functions & mappings",
    ],
    aliases: ["discrete mathematics", "discrete math", "combinatorics", "permutations", "graph theory", "set theory"],
    related: ["algorithms", "daa", "digital-electronics"],
    docs: [{ label: "MIT 6.042J — Mathematics for Computer Science", url: "https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-spring-2015/" }],
  },
  {
    id: "toc",
    name: "Theory of Computation",
    category: "core",
    short: "What computers can and can't do",
    about:
      "TOC formalises computation: automata, grammars, regular and context-free languages, Turing machines and decidability. It's central to GATE Theory of Computation questions.",
    topics: [
      "Finite automata (DFA/NFA)", "Regular expressions", "Regular languages", "Context-free grammars",
      "Pushdown automata", "Turing machines", "Recursively enumerable languages", "Undecidability",
      "Chomsky hierarchy", "Pumping lemmas",
    ],
    aliases: ["theory of computation", "toc", "automata", "finite automata", "turing machine", "context free", "regular language"],
    related: ["compiler-design", "daa", "discrete-math"],
    docs: [{ label: "MIT 18.404J — Theory of Computation", url: "https://ocw.mit.edu/courses/18-404j-theory-of-computation-fall-2020/" }],
  },
  {
    id: "compiler-design",
    name: "Compiler Design",
    category: "core",
    short: "Turning code into machine code",
    about:
      "Compiler design covers the phases that translate high-level code to machine code: lexing, parsing, semantic analysis, intermediate code, optimisation and code generation.",
    topics: [
      "Lexical analysis", "Regular expressions & tokens", "Parsing (top-down & bottom-up)", "Syntax analysis",
      "Semantic analysis", "Intermediate code generation", "Symbol tables", "Code optimisation",
      "Code generation", "LL(1) & LR parsers",
    ],
    aliases: ["compiler design", "compiler", "parsing", "lexical analysis", "syntax analysis", "ll1", "lr parser"],
    related: ["toc", "daa", "c"],
    docs: [{ label: "MIT 6.035 — Computer Language Engineering", url: "https://ocw.mit.edu/courses/6-035-computer-language-engineering-spring-2010/" }],
  },
  {
    id: "software-engineering",
    name: "Software Engineering",
    category: "core",
    short: "Building software the disciplined way",
    about:
      "Software engineering covers the process of building reliable software: SDLC models, requirements, design, testing, maintenance and project management.",
    topics: [
      "SDLC models", "Requirements engineering", "Software design", "UML", "Agile & Scrum",
      "Software testing", "Debugging & maintenance", "Software metrics", "Project management",
      "Software quality", "Risk management",
    ],
    aliases: ["software engineering", "sdlc", "agile", "scrum", "software testing", "uml", "software process"],
    related: ["oop", "webdev", "system-design"],
    docs: [{ label: "CMU Software Engineering Institute", url: "https://www.sei.cmu.edu/" }],
  },
  {
    id: "oop",
    name: "Object-Oriented Programming",
    category: "core",
    short: "Thinking in objects and classes",
    about:
      "OOP is a programming paradigm built on objects. Exams cover the four pillars — encapsulation, abstraction, inheritance and polymorphism — plus classes, interfaces and design principles.",
    topics: [
      "Classes & objects", "Encapsulation", "Abstraction", "Inheritance", "Polymorphism",
      "Interfaces & abstract classes", "Method overloading & overriding", "Constructors", "Composition vs inheritance",
      "SOLID principles", "Design patterns basics",
    ],
    aliases: ["oop", "object oriented", "object-oriented", "inheritance", "polymorphism", "encapsulation"],
    related: ["java", "cpp", "python", "software-engineering"],
    docs: [{ label: "Oracle — Object-Oriented Programming Concepts", url: "https://docs.oracle.com/javase/tutorial/java/concepts/" }],
  },

  // ------------------------------------------------------------
  // Development
  // ------------------------------------------------------------
  {
    id: "webdev",
    name: "Web Development",
    category: "development",
    short: "Building for the browser",
    about:
      "Web development covers everything from HTML/CSS and JavaScript to servers, databases and deployment. Exams cover the client-server model, HTTP and the full web stack.",
    topics: [
      "HTML & CSS", "JavaScript", "HTTP & web architecture", "Client-server model", "REST APIs",
      "Authentication & sessions", "Databases & ORMs", "Deployment & hosting", "Accessibility & SEO",
      "Web security basics",
    ],
    aliases: ["web development", "web dev", "webdev", "web design", "frontend", "backend", "full stack", "website"],
    related: ["html", "css", "javascript", "react", "nodejs", "api"],
    docs: [{ label: "MDN — Learn web development", url: "https://developer.mozilla.org/en-US/docs/Learn" }],
  },
  {
    id: "html",
    name: "HTML",
    category: "development",
    short: "Structure for web pages",
    about:
      "HTML (HyperText Markup Language) defines the structure and semantics of web content using tags, attributes and elements.",
    topics: [
      "Document structure", "Headings & paragraphs", "Links & images", "Lists & tables", "Forms",
      "Semantic HTML", "Media elements", "Accessibility", "Meta tags & SEO", "HTML5 features",
    ],
    aliases: ["html", "html5", "markup"],
    related: ["css", "javascript", "webdev"],
    docs: [{ label: "MDN — HTML", url: "https://developer.mozilla.org/en-US/docs/Web/HTML" }],
  },
  {
    id: "css",
    name: "CSS",
    category: "development",
    short: "Style and layout for the web",
    about:
      "CSS controls the presentation of web pages: colours, typography, layout, responsive design and animations.",
    topics: [
      "Selectors", "Box model", "Colours & typography", "Flexbox", "Grid", "Positioning",
      "Responsive design", "Media queries", "Animations & transitions", "CSS variables",
    ],
    aliases: ["css", "css3", "flexbox", "grid layout", "stylesheet"],
    related: ["html", "javascript", "webdev"],
    docs: [{ label: "MDN — CSS", url: "https://developer.mozilla.org/en-US/docs/Web/CSS" }],
  },
  {
    id: "react",
    name: "React",
    category: "development",
    short: "Building interactive UIs",
    about:
      "React is a JavaScript library for building component-based user interfaces. Exams cover components, props, state, hooks, rendering and the virtual DOM.",
    topics: [
      "Components & JSX", "Props", "State", "Hooks (useState, useEffect)", "Conditional rendering",
      "Lists & keys", "Forms", "Context & reducers", "React Router", "Performance & memoization",
    ],
    aliases: ["react", "reactjs", "react.js", "hooks", "jsx"],
    related: ["javascript", "typescript", "webdev", "nodejs"],
    docs: [{ label: "React — Learn", url: "https://react.dev/learn" }],
  },
  {
    id: "nodejs",
    name: "Node.js",
    category: "development",
    short: "JavaScript on the server",
    about:
      "Node.js runs JavaScript on the server using an event-driven, non-blocking model. Exams cover the event loop, modules, streams, and building APIs.",
    topics: [
      "Node.js basics", "Modules & npm", "Event loop", "Callbacks & promises", "File system",
      "Streams & buffers", "HTTP servers", "Express.js", "Middleware", "Deployment basics",
    ],
    aliases: ["node.js", "nodejs", "node js"],
    related: ["javascript", "express", "webdev", "api"],
    docs: [{ label: "Node.js — Learn", url: "https://nodejs.org/en/learn" }],
  },
  {
    id: "express",
    name: "Express.js",
    category: "development",
    short: "Minimal web framework for Node",
    about:
      "Express is the most popular Node.js web framework. Exams cover routing, middleware, request handling and building REST APIs.",
    topics: [
      "Routing", "Middleware", "Request & response objects", "Static files", "Templating",
      "Error handling", "REST API design", "Authentication basics", "Database integration",
    ],
    aliases: ["express", "express.js", "expressjs"],
    related: ["nodejs", "api", "webdev"],
    docs: [{ label: "Express.js", url: "https://expressjs.com/" }],
  },
  {
    id: "fullstack",
    name: "Full Stack Development",
    category: "development",
    short: "Frontend + backend + database",
    about:
      "Full stack development means building the complete application: frontend UI, backend APIs, database, authentication and deployment.",
    topics: [
      "Frontend frameworks", "Backend APIs", "Databases & ORMs", "Authentication & authorization",
      "State management", "API integration", "Deployment & CI/CD", "Project architecture",
    ],
    aliases: ["full stack", "fullstack", "mern", "mean"],
    related: ["webdev", "react", "nodejs", "dbms"],
    docs: [{ label: "MDN — Learn web development", url: "https://developer.mozilla.org/en-US/docs/Learn" }],
  },
  {
    id: "api",
    name: "API Development",
    category: "development",
    short: "Designing programmatic interfaces",
    about:
      "API development covers designing, building and documenting interfaces between software: request/response design, versioning, security and rate limiting.",
    topics: [
      "API fundamentals", "REST design", "HTTP methods & status codes", "Authentication", "Rate limiting",
      "Versioning", "Documentation & OpenAPI", "Error handling", "Testing APIs", "GraphQL basics",
    ],
    aliases: ["api development", "rest api", "restful", "endpoint", "graphql", "openapi"],
    related: ["nodejs", "webdev", "dbms"],
    docs: [{ label: "MDN — Server-side web frameworks", url: "https://developer.mozilla.org/en-US/docs/Learn/Server-side" }],
  },
  {
    id: "git",
    name: "Git & GitHub",
    category: "development",
    short: "Version control for code",
    about:
      "Git is the industry-standard version control system; GitHub is the hosting platform. Exams and interviews cover branching, merging, rebasing and collaboration workflows.",
    topics: [
      "Git basics", "Commits & history", "Branches", "Merging & rebasing", "Remote repositories",
      "Pull requests", "Stashing", "Resolving conflicts", "GitHub workflows", "Git best practices",
    ],
    aliases: ["git", "github", "version control", "branch", "commit"],
    related: ["devops", "software-engineering"],
    docs: [{ label: "Git documentation", url: "https://git-scm.com/doc" }],
  },
  {
    id: "mobile",
    name: "Mobile App Development",
    category: "development",
    short: "Apps for phones and tablets",
    about:
      "Mobile development covers native (Android/iOS), cross-platform frameworks, app architecture, lifecycle, permissions and publishing.",
    topics: [
      "Android basics", "iOS basics", "Cross-platform frameworks", "App lifecycle", "UI components",
      "Navigation", "Data persistence", "Permissions", "Publishing & stores",
    ],
    aliases: ["mobile", "android", "ios", "flutter", "react native", "kotlin", "swift"],
    related: ["webdev", "react", "java"],
    docs: [{ label: "Android developers", url: "https://developer.android.com/" }],
  },

  // ------------------------------------------------------------
  // AI & Data
  // ------------------------------------------------------------
  {
    id: "ai",
    name: "Artificial Intelligence",
    category: "ai-data",
    short: "Machines that reason and act",
    about:
      "AI covers agents, search, knowledge representation, reasoning, planning and learning. Exams cover uninformed/informed search, heuristics and game playing.",
    topics: [
      "AI agents", "Problem solving & search", "Uninformed search", "Informed search (A*)", "Adversarial search",
      "Constraint satisfaction", "Knowledge representation", "Logic & reasoning", "Planning", "Expert systems",
    ],
    aliases: ["artificial intelligence", " ai ", "ai agents", "search algorithms", "heuristic"],
    related: ["ml", "dl", "data-science", "nlp", "cv"],
    docs: [{ label: "MIT 6.034 — Artificial Intelligence", url: "https://ocw.mit.edu/courses/6-034-artificial-intelligence-spring-2010/" }],
  },
  {
    id: "ml",
    name: "Machine Learning",
    category: "ai-data",
    short: "Learning from data",
    about:
      "Machine learning builds models that learn patterns from data. Exams cover supervised/unsupervised learning, regression, classification, evaluation and overfitting.",
    topics: [
      "ML fundamentals", "Supervised learning", "Unsupervised learning", "Regression", "Classification",
      "Decision trees", "SVM", "KNN", "Clustering (K-means)", "Model evaluation", "Bias-variance", "Overfitting",
    ],
    aliases: ["machine learning", " ml ", "supervised", "unsupervised", "regression", "decision tree", "knn"],
    related: ["data-science", "dl", "ai", "python"],
    docs: [{ label: "Google — Machine Learning Crash Course", url: "https://developers.google.com/machine-learning/crash-course" }],
  },
  {
    id: "dl",
    name: "Deep Learning",
    category: "ai-data",
    short: "Neural networks at scale",
    about:
      "Deep learning uses multi-layer neural networks. Exams cover perceptrons, backpropagation, CNNs, RNNs, activation functions and training dynamics.",
    topics: [
      "Neural networks", "Perceptron", "Backpropagation", "Activation functions", "Loss functions",
      "CNN", "RNN & LSTM", "Gradient descent", "Regularization & dropout", "Transfer learning",
    ],
    aliases: ["deep learning", "neural network", "neural networks", "backpropagation", "cnn", "lstm", "perceptron"],
    related: ["ml", "ai", "data-science", "cv", "nlp"],
    docs: [{ label: "deeplearning.ai — Deep Learning Specialization", url: "https://www.deeplearning.ai/courses/deep-learning-specialization/" }],
  },
  {
    id: "genai",
    name: "Generative AI",
    category: "ai-data",
    short: "Creating text, images and code",
    about:
      "Generative AI creates new content. Topics include LLMs, transformers, prompt engineering, text-to-image models, RAG and fine-tuning.",
    topics: [
      "LLMs", "Transformers", "Prompt engineering", "Fine-tuning", "RAG", "Text generation",
      "Image generation", "Hallucination & safety", "Evaluating generative models",
    ],
    aliases: ["generative ai", "gen ai", "genai", "llm", "large language model", "prompt engineering", "chatgpt"],
    related: ["dl", "nlp", "ml"],
    docs: [{ label: "Hugging Face — Learn", url: "https://huggingface.co/learn" }],
  },
  {
    id: "nlp",
    name: "Natural Language Processing",
    category: "ai-data",
    short: "Computers understanding language",
    about:
      "NLP lets machines process human language: tokenization, POS tagging, parsing, embeddings, language models and applications like machine translation.",
    topics: [
      "Text preprocessing", "Tokenization", "POS tagging", "N-grams", "Word embeddings", "Language models",
      "Transformers", "Machine translation", "Sentiment analysis", "Information extraction",
    ],
    aliases: ["nlp", "natural language processing", "language model", "tokenization", "word embedding", "n-gram"],
    related: ["genai", "dl", "ml"],
    docs: [{ label: "Hugging Face — NLP Course", url: "https://huggingface.co/learn/nlp-course" }],
  },
  {
    id: "cv",
    name: "Computer Vision",
    category: "ai-data",
    short: "Computers seeing images",
    about:
      "Computer vision covers image processing and understanding: filters, edge detection, feature extraction, CNNs and object detection.",
    topics: [
      "Image basics", "Filters & convolution", "Edge detection", "Feature extraction", "CNNs",
      "Object detection", "Image segmentation", "Face recognition", "Image classification",
    ],
    aliases: ["computer vision", "image processing", "object detection", "edge detection", "opencv"],
    related: ["dl", "ml", "ai"],
    docs: [{ label: "Stanford CS231n — Convolutional Neural Networks", url: "http://cs231n.stanford.edu/" }],
  },
  {
    id: "data-science",
    name: "Data Science",
    category: "ai-data",
    short: "Turning data into insight",
    about:
      "Data science combines statistics, programming and domain knowledge: data cleaning, EDA, visualisation, statistical inference and modelling.",
    topics: [
      "Data collection & cleaning", "Exploratory data analysis", "Statistics basics", "Probability", "Visualisation",
      "Statistical inference", "Feature engineering", "Modelling", "Data storytelling",
    ],
    aliases: ["data science", "data analysis", "eda", "pandas", "statistics", "data analytics"],
    related: ["ml", "python", "sql", "dl"],
    docs: [{ label: "Kaggle — Learn", url: "https://www.kaggle.com/learn" }],
  },
  {
    id: "data-mining",
    name: "Data Mining",
    category: "ai-data",
    short: "Finding patterns in large data",
    about:
      "Data mining discovers patterns in large datasets: association rules, classification, clustering and anomaly detection.",
    topics: [
      "Data preprocessing", "Association rules (Apriori)", "Classification", "Clustering", "Anomaly detection",
      "Sequential patterns", "Data warehousing", "Mining evaluation",
    ],
    aliases: ["data mining", "apriori", "association rule", "k-means", "data warehousing"],
    related: ["data-science", "ml", "dbms"],
    docs: [{ label: "KDnuggets", url: "https://www.kdnuggets.com/" }],
  },
  {
    id: "bigdata",
    name: "Big Data",
    category: "ai-data",
    short: "Processing data at scale",
    about:
      "Big data technologies handle data that is too large for one machine: MapReduce, Hadoop, Spark, and distributed storage.",
    topics: [
      "Big data characteristics (V's)", "MapReduce", "Hadoop", "Spark", "Distributed storage", "Data pipelines",
      "Streaming", "NoSQL for big data",
    ],
    aliases: ["big data", "hadoop", "mapreduce", "spark", "distributed computing"],
    related: ["data-science", "distributed", "data-mining"],
    docs: [{ label: "Apache Spark — Docs", url: "https://spark.apache.org/docs/latest/" }],
  },

  // ------------------------------------------------------------
  // Advanced
  // ------------------------------------------------------------
  {
    id: "cloud",
    name: "Cloud Computing",
    category: "advanced",
    short: "Computing as a service",
    about:
      "Cloud computing delivers compute, storage and services over the internet: IaaS/PaaS/SaaS, virtualization, and providers like AWS, Azure and GCP.",
    topics: [
      "Cloud fundamentals", "IaaS/PaaS/SaaS", "Virtualization", "AWS/Azure/GCP", "Serverless",
      "Storage & databases", "Networking in the cloud", "Cost & scaling", "Cloud security",
    ],
    aliases: ["cloud computing", "aws", "azure", "gcp", "serverless", "virtualization", "cloud"],
    related: ["devops", "distributed", "security"],
    docs: [{ label: "AWS — What is cloud computing?", url: "https://aws.amazon.com/what-is-cloud-computing/" }],
  },
  {
    id: "devops",
    name: "DevOps",
    category: "advanced",
    short: "Ship software continuously",
    about:
      "DevOps combines development and operations: CI/CD, containers, infrastructure as code, monitoring and automation.",
    topics: [
      "DevOps principles", "CI/CD", "Docker", "Kubernetes", "Infrastructure as code", "Monitoring & logging",
      "Configuration management", "Release automation",
    ],
    aliases: ["devops", "ci/cd", "jenkins", "kubernetes", "k8s", "terraform", "infrastructure as code"],
    related: ["git", "cloud", "linux"],
    docs: [{ label: "Atlassian — DevOps", url: "https://www.atlassian.com/devops" }],
  },
  {
    id: "security",
    name: "Cyber Security",
    category: "advanced",
    short: "Protecting systems and data",
    about:
      "Cyber security covers protecting systems from attack: threats, vulnerabilities, authentication, network security and incident response.",
    topics: [
      "Security fundamentals", "Threats & vulnerabilities", "Authentication & authorization", "Network security",
      "Web security (OWASP Top 10)", "Malware analysis", "Intrusion detection", "Security policies",
    ],
    aliases: ["cyber security", "cybersecurity", "information security", "hacking", "threat", "vulnerability", "owasp"],
    related: ["cryptography", "ethical-hacking", "cn", "os"],
    docs: [{ label: "OWASP — Top 10", url: "https://owasp.org/www-project-top-ten/" }],
  },
  {
    id: "cryptography",
    name: "Cryptography",
    category: "advanced",
    short: "Secrets, ciphers and keys",
    about:
      "Cryptography protects information: symmetric & asymmetric encryption, hashing, digital signatures and protocols.",
    topics: [
      "Symmetric encryption", "AES & DES", "Asymmetric encryption", "RSA", "Hash functions", "Digital signatures",
      "Key exchange", "Public key infrastructure", "Cryptographic protocols",
    ],
    aliases: ["cryptography", "encryption", "aes", "rsa", "cipher", "hash function", "digital signature"],
    related: ["security", "math", "cn"],
    docs: [{ label: "Khan Academy — Cryptography", url: "https://www.khanacademy.org/computing/computer-science/cryptography" }],
  },
  {
    id: "blockchain",
    name: "Blockchain",
    category: "advanced",
    short: "Decentralised, tamper-evident ledgers",
    about:
      "Blockchain is a distributed, append-only ledger: blocks, hashing, consensus, smart contracts and cryptocurrencies.",
    topics: [
      "Blockchain basics", "Blocks & hashing", "Consensus mechanisms", "Proof of work & stake", "Smart contracts",
      "Cryptocurrencies", "Decentralised apps", "Blockchain security",
    ],
    aliases: ["blockchain", "bitcoin", "ethereum", "smart contract", "consensus", "web3"],
    related: ["cryptography", "distributed", "security"],
    docs: [{ label: "Ethereum — Developers", url: "https://ethereum.org/en/developers/docs/" }],
  },
  {
    id: "distributed",
    name: "Distributed Systems",
    category: "advanced",
    short: "Many computers, one system",
    about:
      "Distributed systems coordinate multiple computers: consistency, replication, fault tolerance, consensus and the CAP theorem.",
    topics: [
      "Distributed system models", "Consistency", "Replication", "Fault tolerance", "Consensus (Raft/Paxos)",
      "CAP theorem", "Distributed transactions", "Time & ordering", "RPC & messaging",
    ],
    aliases: ["distributed systems", "distributed computing", "cap theorem", "consensus", "replication", "raft"],
    related: ["os", "cn", "bigdata", "cloud"],
    docs: [{ label: "MIT 6.824 — Distributed Systems", url: "https://pdos.csail.mit.edu/6.824/" }],
  },
  {
    id: "parallel",
    name: "Parallel Computing",
    category: "advanced",
    short: "Speed through simultaneous work",
    about:
      "Parallel computing splits work across multiple processors: parallel architectures, Amdahl's law, threads, GPUs and MPI/OpenMP.",
    topics: [
      "Parallel architectures", "Amdahl's law", "Thread-level parallelism", "Shared & distributed memory",
      "OpenMP", "MPI", "GPU computing", "Performance & scaling",
    ],
    aliases: ["parallel computing", "parallel processing", "amdahl", "openmp", "mpi", "gpgpu"],
    related: ["os", "distributed", "coa"],
    docs: [{ label: "LLNL — Intro to Parallel Computing", url: "https://hpc.llnl.gov/documentation/tutorials/introduction-parallel-computing-tutorial" }],
  },
  {
    id: "system-design",
    name: "System Design",
    category: "advanced",
    short: "Designing large-scale systems",
    about:
      "System design is how engineers architect large services: scalability, load balancing, caching, databases, queues and real-world trade-offs.",
    topics: [
      "Scalability", "Load balancing", "Caching", "Databases & sharding", "Message queues", "Microservices",
      "CDN", "Consistency & availability", "Capacity estimation", "Design interview patterns",
    ],
    aliases: ["system design", "scalability", "load balancing", "microservices", "sharding", "design interview"],
    related: ["distributed", "dbms", "cloud", "software-engineering"],
    docs: [{ label: "System Design Primer", url: "https://github.com/donnemartin/system-design-primer" }],
  },
  {
    id: "software-architecture",
    name: "Software Architecture",
    category: "advanced",
    short: "High-level structure of systems",
    about:
      "Software architecture is the high-level structure of a system: architectural styles, layers, components and the trade-offs that shape quality.",
    topics: [
      "Architectural styles", "Layering", "Microservices vs monolith", "Event-driven architecture", "Component design",
      "Quality attributes", "Architectural patterns", "Evolution & refactoring",
    ],
    aliases: ["software architecture", "architecture patterns", "monolith", "event-driven", "microservices"],
    related: ["system-design", "software-engineering", "oop"],
    docs: [{ label: "martinfowler.com — Architecture", url: "https://martinfowler.com/architecture/" }],
  },
  {
    id: "linux",
    name: "Linux",
    category: "advanced",
    short: "The open-source operating system",
    about:
      "Linux covers the kernel, shell, filesystem, processes, permissions and system administration. It's the standard environment for servers and developers.",
    topics: [
      "Linux fundamentals", "Shell & commands", "File system", "Processes", "Permissions", "Package management",
      "Shell scripting", "Networking commands", "System administration",
    ],
    aliases: ["linux", "unix", "shell", "bash", "ubuntu", "commands", "terminal"],
    related: ["os", "devops", "git"],
    docs: [{ label: "Linux kernel documentation", url: "https://www.kernel.org/doc/" }],
  },
  {
    id: "iot",
    name: "Internet of Things",
    category: "advanced",
    short: "Connected devices everywhere",
    about:
      "IoT connects sensors and devices to the internet: architectures, protocols, embedded systems, data and security concerns.",
    topics: [
      "IoT architecture", "Sensors & actuators", "IoT protocols", "Embedded systems", "Edge computing",
      "IoT platforms", "IoT security", "Data & analytics",
    ],
    aliases: ["iot", "internet of things", "embedded", "sensors", "raspberry pi", "arduino"],
    related: ["cn", "security", "c"],
    docs: [{ label: "Arduino — Tutorials", url: "https://docs.arduino.cc/" }],
  },
  {
    id: "ethical-hacking",
    name: "Ethical Hacking & Security Fundamentals",
    category: "advanced",
    short: "Attack to defend",
    about:
      "Ethical hacking covers how attackers break systems so defenders can protect them: reconnaissance, scanning, exploitation, and defensive countermeasures.",
    topics: [
      "Security fundamentals", "Reconnaissance", "Scanning & enumeration", "Exploitation", "Web application attacks",
      "Password & authentication attacks", "Post-exploitation", "Defence & hardening", "Legal & ethical boundaries",
    ],
    aliases: ["ethical hacking", "penetration testing", "pentest", "kali", "footprinting", "exploit", "vulnerability assessment"],
    related: ["security", "cryptography", "cn", "os"],
    docs: [{ label: "TryHackMe", url: "https://tryhackme.com/" }],
  },
  {
    id: "ipr",
    name: "Intellectual Property Rights",
    category: "advanced",
    short: "Legal protection for ideas",
    about:
      "IPR covers the legal rights over creations: patents, copyright, trademarks, trade secrets and their role in software and research.",
    topics: [
      "IPR fundamentals", "Copyright", "Patents", "Trademarks", "Trade secrets", "Software licensing",
      "Open source licences", "IPR in research",
    ],
    aliases: ["ipr", "intellectual property", "copyright", "patent", "trademark", "open source license", "licensing"],
    related: ["software-engineering", "blockchain"],
    docs: [{ label: "WIPO — World Intellectual Property Organization", url: "https://www.wipo.int/" }],
  },
  {
    id: "math",
    name: "Engineering Mathematics",
    category: "advanced",
    short: "Math that CS runs on",
    about:
      "Engineering mathematics for CS covers linear algebra, calculus, probability, statistics and discrete structures used throughout the degree.",
    topics: [
      "Linear algebra", "Calculus", "Differential equations", "Probability", "Statistics", "Numerical methods",
      "Optimization", "Matrices & vectors",
    ],
    aliases: ["engineering mathematics", "linear algebra", "calculus", "probability", "numerical methods", "matrices"],
    related: ["discrete-math", "ml", "daa"],
    docs: [{ label: "MIT 18.06 — Linear Algebra", url: "https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/" }],
  },
];

// ------------------------------------------------------------
// Helpers
// ------------------------------------------------------------

export function getCsSubject(id: string): CsSubject | undefined {
  return csSubjects.find((s) => s.id === id);
}

export function subjectsInCategory(category: CsSubjectCategoryId): CsSubject[] {
  return csSubjects.filter((s) => s.category === category);
}

/** Detect a subject from free text using aliases (longest-first). */
export function detectCsSubject(text: string): CsSubject | undefined {
  const norm = ` ${text.toLowerCase().trim()} `;
  let best: CsSubject | undefined;
  let bestLen = 0;
  for (const subject of csSubjects) {
    for (const alias of subject.aliases) {
      const a = alias.toLowerCase().trim();
      const needle = a.startsWith(" ") && a.endsWith(" ") ? a : ` ${a} `;
      if (norm.includes(needle) && a.length > bestLen) {
        best = subject;
        bestLen = a.length;
      }
    }
  }
  return best;
}

/**
 * Detect up to `limit` distinct subjects mentioned in free text.
 * Returns matches longest-alias-first, so "compare C++ and Java" yields
 * [C++, Java] rather than [C, Java].
 */
export function detectSubjectsInText(text: string, limit = 2): CsSubject[] {
  const norm = ` ${text.toLowerCase().trim()} `;
  const hits: { subject: CsSubject; len: number }[] = [];
  for (const subject of csSubjects) {
    for (const alias of subject.aliases) {
      const a = alias.toLowerCase().trim();
      const needle = a.startsWith(" ") && a.endsWith(" ") ? a : ` ${a} `;
      if (norm.includes(needle)) {
        hits.push({ subject, len: a.length });
        break;
      }
    }
  }
  hits.sort((x, y) => y.len - x.len);
  const seen = new Set<string>();
  return hits
    .filter((h) => !seen.has(h.subject.id) && seen.add(h.subject.id))
    .slice(0, limit)
    .map((h) => h.subject);
}
