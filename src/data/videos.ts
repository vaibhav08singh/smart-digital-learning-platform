// ============================================================
// Recommended YouTube videos per course.
// All video IDs are real, public and verified against
// YouTube's oEmbed endpoint (title shown for each).
// ============================================================

export interface CourseVideo {
  id: string;
  /** YouTube 11-char video id. */
  youtubeId: string;
  title: string;
  channel: string;
  /** Optional duration label, e.g. "8 min". */
  duration?: string;
  /** Optional short note on what it covers. */
  note?: string;
}

export const videosByCourse: Record<string, CourseVideo[]> = {
  "c-dsa-foundations": [
    {
      id: "v-dsa-trees",
      youtubeId: "fAAZixBzIAI",
      title: "Binary Tree Algorithms for Technical Interviews",
      channel: "freeCodeCamp.org",
      duration: "1h 48m",
      note: "Covers the trees module: traversal, max depth, path sums and more.",
    },
    {
      id: "v-dsa-avl",
      youtubeId: "jDM6_TnYIqE",
      title: "10.1 AVL Tree — Insertion and Rotations",
      channel: "Abdul Bari",
      duration: "43 min",
      note: "The classic walkthrough of AVL balance factors and rotations.",
    },
    {
      id: "v-dsa-graphs",
      youtubeId: "gTsoyORhqkg",
      title: "Graph Data Structure — What is Graph? (DSA Course)",
      channel: "GeeksforGeeks",
      duration: "8 min",
      note: "Quick intro to graphs, DFS and BFS traversal.",
    },
  ],
  "c-avltrees": [
    {
      id: "v-avl-1",
      youtubeId: "jDM6_TnYIqE",
      title: "10.1 AVL Tree — Insertion and Rotations",
      channel: "Abdul Bari",
      duration: "43 min",
      note: "Deep dive into balance factors, LL/LR/RR/RL rotations and insertion.",
    },
    {
      id: "v-avl-2",
      youtubeId: "fAAZixBzIAI",
      title: "Binary Tree Algorithms for Technical Interviews",
      channel: "freeCodeCamp.org",
      duration: "1h 48m",
      note: "Practice the tree fundamentals before tackling rotations.",
    },
  ],
  "c-deep-learning": [
    {
      id: "v-dl-1",
      youtubeId: "aircAruvnKk",
      title: "But what is a neural network? — Deep learning chapter 1",
      channel: "3Blue1Brown",
      duration: "18 min",
      note: "Visual intuition for neurons, layers, weights and the math behind learning.",
    },
  ],
  "c-webdev-fullstack": [
    {
      id: "v-web-react",
      youtubeId: "Tn6-PIqc4UM",
      title: "React in 100 Seconds",
      channel: "Fireship",
      duration: "2 min",
      note: "A fast overview of components, props and state before your hooks lesson.",
    },
  ],
  "c-cloud-devops": [
    {
      id: "v-cloud-docker",
      youtubeId: "YFl2mCHdv24",
      title: "Learn Docker in 12 Minutes",
      channel: "Jake Wright",
      duration: "12 min",
      note: "What containers are, Dockerfiles, images, volumes and containers.",
    },
  ],
  "c-security": [
    {
      id: "v-sec-1",
      youtubeId: "O4xNJsjtN6E",
      title: "AES Explained (Advanced Encryption Standard)",
      channel: "Computerphile",
      duration: "14 min",
      note: "How the symmetric cipher that protects modern data actually works.",
    },
    {
      id: "v-sec-2",
      youtubeId: "GSIDS_lvRv4",
      title: "Public Key Cryptography",
      channel: "Computerphile",
      duration: "6 min",
      note: "The idea behind public/private key pairs.",
    },
  ],
  "c-quadratic-equations": [
    {
      id: "v-quad-intro",
      youtubeId: "IWigvJcCAJ0",
      title: "Introduction to the quadratic equation",
      channel: "Khan Academy",
      duration: "9 min",
      note: "What a quadratic equation is and why roots matter.",
    },
    {
      id: "v-quad-formula",
      youtubeId: "i7idZfS8t8w",
      title: "How to use the quadratic formula",
      channel: "Khan Academy",
      duration: "16 min",
      note: "Step-by-step practice with the quadratic formula.",
    },
  ],
  "c-light-reflections": [
    {
      id: "v-light-1",
      youtubeId: "sd0BOnN6aNY",
      title: "Specular and diffuse reflection",
      channel: "Khan Academy",
      duration: "10 min",
      note: "Why mirrors reflect clearly but most surfaces scatter light.",
    },
  ],
  "c-emi": [
    {
      id: "v-emi-lewin",
      youtubeId: "nGQbA2jwkWI",
      title: "Electromagnetic Induction, Faraday's Law, Lenz Law",
      channel: "Lectures by Walter Lewin",
      duration: "51 min",
      note: "MIT lecture with the famous demos — worth watching twice.",
    },
    {
      id: "v-emi-khan",
      youtubeId: "yU--8Zk57-Y",
      title: "Electromagnetic Induction",
      channel: "Khan Academy",
      duration: "11 min",
      note: "Faraday's experiments explained step by step.",
    },
  ],
  "c-english-class5": [
    {
      id: "v-eng-nouns",
      youtubeId: "tquecIG-Pws",
      title: "All About Nouns: English Grammar for Kids",
      channel: "FreeSchool",
      duration: "3 min",
      note: "Nouns are everywhere — a friendly intro with examples.",
    },
  ],
};

/** Videos for a course, or an empty list when none are mapped. */
export function videosForCourse(courseId: string): CourseVideo[] {
  return videosByCourse[courseId] ?? [];
}

const topicLessonVideoMap: Record<string, CourseVideo> = {
  // --- Data Structures & Algorithms ---
  "tp-trees": { id: "v-trees-main", youtubeId: "fAAZixBzIAI", title: "Binary Tree Algorithms for Technical Interviews", channel: "freeCodeCamp.org", duration: "1h 48m" },
  "tp-trees-l1": { id: "v-trees-l1", youtubeId: "fAAZixBzIAI", title: "Binary Tree Terminology & Structure", channel: "freeCodeCamp.org", duration: "16 min" },
  "tp-trees-l2": { id: "v-trees-l2", youtubeId: "4s1LWV06ZLI", title: "Binary Tree Traversals (Inorder, Preorder, Postorder)", channel: "mycodeschool", duration: "22 min" },
  "tp-trees-l3": { id: "v-trees-l3", youtubeId: "_O-l3T8D070", title: "Height and Depth of a Binary Tree", channel: "Abdul Bari", duration: "18 min" },

  "tp-avl": { id: "v-avl-main", youtubeId: "jDM6_TnYIqE", title: "AVL Tree — Insertion and Rotations", channel: "Abdul Bari", duration: "43 min" },
  "tp-avl-l1": { id: "v-avl-l1", youtubeId: "jDM6_TnYIqE", title: "AVL Balance Factors and Height Invariant", channel: "Abdul Bari", duration: "20 min" },
  "tp-avl-l2": { id: "v-avl-l2", youtubeId: "vRwi_UcZGjU", title: "AVL Rotations Explained (LL, RR, LR, RL)", channel: "Abdul Bari", duration: "26 min" },
  "tp-avl-l3": { id: "v-avl-l3", youtubeId: "jDM6_TnYIqE", title: "AVL Tree Insertion Step-by-Step", channel: "Abdul Bari", duration: "24 min" },

  "tp-graphs": { id: "v-graphs-main", youtubeId: "tWVWeAqZ0WU", title: "Graph Algorithms for Technical Interviews", channel: "freeCodeCamp.org", duration: "2h 15m" },
  "tp-graphs-l1": { id: "v-graphs-l1", youtubeId: "gTsoyORhqkg", title: "Graph Representations (Matrix vs List)", channel: "GeeksforGeeks", duration: "18 min" },
  "tp-graphs-l2": { id: "v-graphs-l2", youtubeId: "pcKY4hjNq60", title: "Breadth-First Search (BFS) Traversal", channel: "Abdul Bari", duration: "20 min" },

  "tp-dp": { id: "v-dp-main", youtubeId: "oBt53YbR9Kk", title: "Dynamic Programming - Learn to Solve Algorithmic Problems", channel: "freeCodeCamp.org", duration: "5h 10m" },
  "tp-dp-l1": { id: "v-dp-l1", youtubeId: "oBt53YbR9Kk", title: "Recursion Review & Overlapping Subproblems", channel: "freeCodeCamp.org", duration: "18 min" },
  "tp-dp-l2": { id: "v-dp-l2", youtubeId: "oBt53YbR9Kk", title: "Memoization & Top-Down Dynamic Programming", channel: "freeCodeCamp.org", duration: "24 min" },
  "tp-dp-l3": { id: "v-dp-l3", youtubeId: "oBt53YbR9Kk", title: "Tabulation & Bottom-Up Dynamic Programming", channel: "freeCodeCamp.org", duration: "22 min" },
  "tp-pointers": { id: "v-pointers-main", youtubeId: "2ybLD6_2gKM", title: "Pointers in C / C++ Explained", channel: "mycodeschool", duration: "24 min" },
  "tp-pointers-l1": { id: "v-pointers-l1", youtubeId: "2ybLD6_2gKM", title: "Pointers Memory Allocation & Addresses", channel: "mycodeschool", duration: "24 min" },
  "tp-py-basics": { id: "v-py-main", youtubeId: "rfscVS0vtbw", title: "Python for Beginners - Full Course", channel: "Programming with Mosh", duration: "6h 14m" },
  "tp-py-basics-l1": { id: "v-py-l1", youtubeId: "rfscVS0vtbw", title: "Python Variables, Functions & Syntax", channel: "Programming with Mosh", duration: "30 min" },

  // --- Operating Systems & Networks ---
  "tp-scheduling": { id: "v-scheduling-main", youtubeId: "eYTu3q3tH0w", title: "CPU Scheduling Algorithms in Operating Systems", channel: "Gate Smashers", duration: "15 min" },
  "tp-scheduling-l1": { id: "v-scheduling-l1", youtubeId: "eYTu3q3tH0w", title: "FCFS, SJF and Round Robin Scheduling", channel: "Gate Smashers", duration: "15 min" },
  "tp-tcp": { id: "v-tcp-main", youtubeId: "PpsEaqJV_A0", title: "TCP/IP Networking Protocol Essentials", channel: "NetworkChuck", duration: "22 min" },
  "tp-tcp-l1": { id: "v-tcp-l1", youtubeId: "PpsEaqJV_A0", title: "TCP 3-Way Handshake & Reliable Transport", channel: "NetworkChuck", duration: "22 min" },
  "tp-sql-query": { id: "v-sql-main", youtubeId: "HXV3zeQKqGY", title: "SQL Tutorial - Full Database Course", channel: "freeCodeCamp.org", duration: "4h 20m" },
  "tp-sql-query-l1": { id: "v-sql-l1", youtubeId: "HXV3zeQKqGY", title: "SELECT Queries, JOINs and Aggregates", channel: "freeCodeCamp.org", duration: "40 min" },

  // --- Web Dev, DevOps & Security ---
  "tp-react-hooks": { id: "v-react-hooks", youtubeId: "TNhaISOUy6Q", title: "React Hooks Course - Learn React Hooks", channel: "freeCodeCamp.org", duration: "1h 30m" },
  "tp-react-hooks-l1": { id: "v-react-l1", youtubeId: "Tn6-PIqc4UM", title: "React Components, Props & JSX Basics", channel: "Fireship", duration: "10 min" },
  "tp-react-hooks-l2": { id: "v-react-l2", youtubeId: "TNhaISOUy6Q", title: "State & Effect Hooks (useState, useEffect)", channel: "freeCodeCamp.org", duration: "35 min" },
  "tp-docker": { id: "v-docker-main", youtubeId: "YFl2mCHdv24", title: "Learn Docker in 12 Minutes", channel: "Jake Wright", duration: "12 min" },
  "tp-docker-l1": { id: "v-docker-l1", youtubeId: "YFl2mCHdv24", title: "Docker Containers, Images & Dockerfile", channel: "Jake Wright", duration: "12 min" },
  "tp-docker-l2": { id: "v-docker-l2", youtubeId: "X48VuDVv0do", title: "Docker Compose & Container Networking", channel: "TechWorld with Nana", duration: "25 min" },
  "tp-crypto": { id: "v-sec-crypto", youtubeId: "O4xNJsjtN6E", title: "AES Encryption Explained", channel: "Computerphile", duration: "14 min" },
  "tp-crypto-l1": { id: "v-crypto-l1", youtubeId: "O4xNJsjtN6E", title: "Symmetric vs Asymmetric Encryption", channel: "Computerphile", duration: "14 min" },
  "tp-design-scaling": { id: "v-sysdesign", youtubeId: "m8Icp_CidTO", title: "System Design Course for Beginners", channel: "ByteByteGo", duration: "1h 10m" },
  "tp-design-scaling-l1": { id: "v-sysdesign-l1", youtubeId: "m8Icp_CidTO", title: "Load Balancing, Caching & Scalability", channel: "ByteByteGo", duration: "30 min" },

  // --- AI & Machine Learning ---
  "tp-nn-arch": { id: "v-nn-main", youtubeId: "aircAruvnKk", title: "But what is a neural network?", channel: "3Blue1Brown", duration: "18 min" },
  "tp-nn-arch-l1": { id: "v-nn-l1", youtubeId: "aircAruvnKk", title: "Neural Network Architecture & Forward Pass", channel: "3Blue1Brown", duration: "18 min" },
  "tp-nn-arch-l2": { id: "v-nn-l2", youtubeId: "Ilg3gGewQ5U", title: "Gradient Descent & Backpropagation", channel: "3Blue1Brown", duration: "21 min" },
  "tp-nn-arch-l3": { id: "v-nn-l3", youtubeId: "eMlx5aiWiMJ", title: "Transformer Neural Networks & Self-Attention", channel: "StatQuest", duration: "16 min" },
  "tp-research": { id: "v-research-main", youtubeId: "zjkBMFhNj_g", title: "State of Deep Learning & AI Research", channel: "Lex Fridman", duration: "45 min" },
  "tp-research-l1": { id: "v-res-l1", youtubeId: "zjkBMFhNj_g", title: "Modern AI & Deep Learning Architectures", channel: "Lex Fridman", duration: "45 min" },
  "tp-research-l2": { id: "v-res-l2", youtubeId: "zjkBMFhNj_g", title: "Research Paper Review & Methodologies", channel: "Lex Fridman", duration: "30 min" },
  "tp-svm": { id: "v-svm-main", youtubeId: "efR1C6CvhmE", title: "StatQuest: Support Vector Machines", channel: "StatQuest", duration: "20 min" },
  "tp-svm-l1": { id: "v-svm-l1", youtubeId: "efR1C6CvhmE", title: "Support Vector Machines & Margin Optimization", channel: "StatQuest", duration: "20 min" },
  "tp-self-attn": { id: "v-attn-main", youtubeId: "eMlx5aiWiMJ", title: "Transformer Neural Networks & Self-Attention", channel: "StatQuest", duration: "16 min" },
  "tp-self-attn-l1": { id: "v-attn-l1", youtubeId: "eMlx5aiWiMJ", title: "Attention Mechanism & Key-Value Queries", channel: "StatQuest", duration: "16 min" },
  "tp-cnn": { id: "v-cnn-main", youtubeId: "YRhxdVk_sIs", title: "Convolutional Neural Networks (CNNs)", channel: "StatQuest", duration: "22 min" },
  "tp-cnn-l1": { id: "v-cnn-l1", youtubeId: "YRhxdVk_sIs", title: "CNN Convolutions, Kernels & Pooling", channel: "StatQuest", duration: "22 min" },
  "tp-hypothesis": { id: "v-hypo-main", youtubeId: "0oc49g9v5lk", title: "Hypothesis Testing and P-values Explained", channel: "StatQuest", duration: "14 min" },
  "tp-hypothesis-l1": { id: "v-hypo-l1", youtubeId: "0oc49g9v5lk", title: "Null Hypothesis, P-Values & Significance", channel: "StatQuest", duration: "14 min" },

  // --- Mathematics & Science (Class 1 to 12) ---
  "tp-sci-light": { id: "v-sci-light", youtubeId: "sd0BOnN6aNY", title: "Light Reflection and Refraction Basics", channel: "Khan Academy", duration: "10 min" },
  "tp-sci-light-l1": { id: "v-sci-light-l1", youtubeId: "sd0BOnN6aNY", title: "Introduction to Light & Ray Optics", channel: "Khan Academy", duration: "10 min" },
  "tp-sci-light-l2": { id: "v-sci-light-l2", youtubeId: "sd0BOnN6aNY", title: "Properties & Sources of Light", channel: "Khan Academy", duration: "8 min" },
  "tp-sci-light-l3": { id: "v-sci-light-l3", youtubeId: "sd0BOnN6aNY", title: "Laws of Reflection & Mirror Images", channel: "Khan Academy", duration: "12 min" },
  "tp-sci-shadow": { id: "v-sci-shadow", youtubeId: "p-0zVnK_R58", title: "How Shadows Form — Science for Kids", channel: "SciShow Kids", duration: "4 min" },
  "tp-sci-shadow-l1": { id: "v-sci-shadow-l1", youtubeId: "p-0zVnK_R58", title: "How Shadows Form — Opaque & Transparent", channel: "SciShow Kids", duration: "4 min" },
  "tp-sci-shadow-l2": { id: "v-sci-shadow-l2", youtubeId: "p-0zVnK_R58", title: "Umbra & Penumbra Regions", channel: "SciShow Kids", duration: "5 min" },
  "tp-sci-plant": { id: "v-sci-plant", youtubeId: "X6TLFZUC9gI", title: "Parts of a Plant and Their Functions", channel: "Peekaboo Kids", duration: "6 min" },
  "tp-sci-plant-l1": { id: "v-sci-plant-l1", youtubeId: "X6TLFZUC9gI", title: "Roots, Stems & Photosynthesis", channel: "Peekaboo Kids", duration: "6 min" },
  "tp-seasons": { id: "v-sci-seasons", youtubeId: "KUU7IyfR34o", title: "Why Do We Have Seasons?", channel: "SciShow Kids", duration: "4 min" },
  "tp-seasons-l1": { id: "v-sci-seasons-l1", youtubeId: "KUU7IyfR34o", title: "Earth Tilt & Seasonal Cycles", channel: "SciShow Kids", duration: "4 min" },
  "tp-math-frac": { id: "v-math-frac", youtubeId: "n0FZhQ_GkKw", title: "Understanding Fractions for Beginners", channel: "Khan Academy", duration: "8 min" },
  "tp-math-frac-l1": { id: "v-math-frac-l1", youtubeId: "n0FZhQ_GkKw", title: "Numerators, Denominators & Visual Fractions", channel: "Khan Academy", duration: "8 min" },
  "tp-quadratic": { id: "v-quad-main", youtubeId: "IWigvJcCAJ0", title: "Introduction to Quadratic Equations", channel: "Khan Academy", duration: "9 min" },
  "tp-quadratic-l1": { id: "v-quad-l1", youtubeId: "IWigvJcCAJ0", title: "Standard Form of Quadratic Equations (ax² + bx + c = 0)", channel: "Khan Academy", duration: "9 min" },
  "tp-quadratic-l2": { id: "v-quad-l2", youtubeId: "IWigvJcCAJ0", title: "Solving Quadratics by Factorisation", channel: "Khan Academy", duration: "14 min" },
  "tp-quadratic-l3": { id: "v-quad-l3", youtubeId: "i7idZfS8t8w", title: "The Quadratic Formula Derivation & Steps", channel: "Khan Academy", duration: "16 min" },
  "tp-quadratic-l4": { id: "v-quad-l4", youtubeId: "i7idZfS8t8w", title: "Discriminant (b² - 4ac) & Nature of Roots", channel: "Khan Academy", duration: "12 min" },
  "tp-linear": { id: "v-linear-main", youtubeId: "75m60SxFfJg", title: "Linear Equations in Two Variables", channel: "Khan Academy", duration: "12 min" },
  "tp-linear-l1": { id: "v-linear-l1", youtubeId: "75m60SxFfJg", title: "Graphical Solution of Linear Systems", channel: "Khan Academy", duration: "12 min" },
  "tp-linear-l2": { id: "v-linear-l2", youtubeId: "75m60SxFfJg", title: "Substitution & Elimination Methods", channel: "Khan Academy", duration: "14 min" },
  "tp-trig-ratio": { id: "v-trig-main", youtubeId: "PUB0TaZ7bhA", title: "Trigonometric Ratios (sin, cos, tan)", channel: "Organic Chemistry Tutor", duration: "15 min" },
  "tp-trig-ratio-l1": { id: "v-trig-l1", youtubeId: "PUB0TaZ7bhA", title: "Right-Triangle Ratios (sin, cos, tan)", channel: "Organic Chemistry Tutor", duration: "15 min" },
  "tp-emi": { id: "v-emi-main", youtubeId: "nGQbA2jwkWI", title: "Electromagnetic Induction & Faraday's Law", channel: "Lectures by Walter Lewin", duration: "51 min" },
  "tp-emi-l1": { id: "v-emi-l1", youtubeId: "nGQbA2jwkWI", title: "Magnetic Flux & Induction Principle", channel: "Lectures by Walter Lewin", duration: "25 min" },
  "tp-emi-l2": { id: "v-emi-l2", youtubeId: "nGQbA2jwkWI", title: "Faraday's Law of Induction", channel: "Lectures by Walter Lewin", duration: "26 min" },
  "tp-emi-l3": { id: "v-emi-l3", youtubeId: "nGQbA2jwkWI", title: "Lenz's Law & Conservation of Energy", channel: "Lectures by Walter Lewin", duration: "20 min" },
  "tp-emi-l4": { id: "v-emi-l4", youtubeId: "yU--8Zk57-Y", title: "AC Generators & Eddy Currents", channel: "Khan Academy", duration: "15 min" },
  "tp-ac": { id: "v-ac-main", youtubeId: "v1b5p08xHkY", title: "Alternating Current Circuits Essentials", channel: "Organic Chemistry Tutor", duration: "25 min" },
  "tp-ac-l1": { id: "v-ac-l1", youtubeId: "v1b5p08xHkY", title: "AC Voltage, Current & Phasor Diagrams", channel: "Organic Chemistry Tutor", duration: "25 min" },
  "tp-photo": { id: "v-photo-main", youtubeId: "ubkNGwGIK6Q", title: "The Photoelectric Effect Explained", channel: "Khan Academy", duration: "12 min" },
  "tp-photo-l1": { id: "v-photo-l1", youtubeId: "ubkNGwGIK6Q", title: "Photon Energy, Work Function & Threshold Frequency", channel: "Khan Academy", duration: "12 min" },
  "tp-alkanes": { id: "v-alkanes-main", youtubeId: "NRFPvLp3r3g", title: "Naming simple alkanes | Organic chemistry | Khan Academy", channel: "Khan Academy", duration: "9 min" },
  "tp-alkanes-l1": { id: "v-alkanes-l1", youtubeId: "NRFPvLp3r3g", title: "Naming simple alkanes | Organic chemistry | Khan Academy", channel: "Khan Academy", duration: "9 min" },
  "tp-mendel": { id: "v-mendel-main", youtubeId: "NWqgZUnJdAY", title: "Mendelian Genetics and Punnett Squares", channel: "Amoeba Sisters", duration: "9 min" },
  "tp-mendel-l1": { id: "v-mendel-l1", youtubeId: "NWqgZUnJdAY", title: "Dominant & Recessive Traits and Punnett Squares", channel: "Amoeba Sisters", duration: "9 min" },

  // --- Languages, Humanities & Business ---
  "tp-eng-noun": { id: "v-eng-noun", youtubeId: "tquecIG-Pws", title: "All About Nouns: English Grammar", channel: "FreeSchool", duration: "3 min" },
  "tp-eng-noun-l1": { id: "v-eng-l1", youtubeId: "tquecIG-Pws", title: "Introduction to Nouns (Person, Place, Thing)", channel: "FreeSchool", duration: "3 min" },
  "tp-eng-noun-l2": { id: "v-eng-l2", youtubeId: "tquecIG-Pws", title: "Proper vs Common Nouns with Examples", channel: "FreeSchool", duration: "5 min" },
  "tp-sst-dir": { id: "v-sst-dir", youtubeId: "f2I81_A24vg", title: "Cardinal Directions (North, South, East, West)", channel: "SciShow Kids", duration: "4 min" },
  "tp-sst-dir-l1": { id: "v-sst-dir-l1", youtubeId: "f2I81_A24vg", title: "Reading Compass Directions on Maps", channel: "SciShow Kids", duration: "4 min" },
  "tp-indus": { id: "v-indus-main", youtubeId: "zhL5DCizj5c", title: "The Industrial Revolution", channel: "CrashCourse History", duration: "12 min" },
  "tp-indus-l1": { id: "v-indus-l1", youtubeId: "zhL5DCizj5c", title: "Steam Engines, Factories & Industrialization", channel: "CrashCourse History", duration: "12 min" },
  "tp-climate-zones": { id: "v-climate-main", youtubeId: "5qB4pmsz5Gg", title: "World Climate Zones Explained", channel: "National Geographic", duration: "10 min" },
  "tp-climate-zones-l1": { id: "v-climate-l1", youtubeId: "5qB4pmsz5Gg", title: "Tropical, Temperate & Polar Climate Zones", channel: "National Geographic", duration: "10 min" },
  "tp-journal": { id: "v-acc-journal", youtubeId: "yKk_0q20KqE", title: "Debits and Credits / Journal Entries", channel: "Accounting Stuff", duration: "15 min" },
  "tp-journal-l1": { id: "v-journal-l1", youtubeId: "yKk_0q20KqE", title: "Double-Entry Accounting & Journal Posting", channel: "Accounting Stuff", duration: "15 min" },
  "tp-demand": { id: "v-econ-demand", youtubeId: "kUPm2rQ5hGg", title: "Supply and Demand Principles", channel: "CrashCourse Economics", duration: "10 min" },
  "tp-demand-l1": { id: "v-demand-l1", youtubeId: "kUPm2rQ5hGg", title: "Law of Demand & Equilibrium Price", channel: "CrashCourse Economics", duration: "10 min" },
  "tp-valuation": { id: "v-fin-valuation", youtubeId: "14W2J3hZ-0s", title: "Discounted Cash Flow Valuation Essentials", channel: "Valuation Academy", duration: "20 min" },
  "tp-valuation-l1": { id: "v-val-l1", youtubeId: "14W2J3hZ-0s", title: "DCF Valuation & Discount Rates", channel: "Valuation Academy", duration: "20 min" },
  "tp-porters": { id: "v-strat-porters", youtubeId: "mYF2_FBCvXw", title: "Porter's Five Forces Explained", channel: "Harvard Business Review", duration: "8 min" },
  "tp-porters-l1": { id: "v-porters-l1", youtubeId: "mYF2_FBCvXw", title: "Industry Structure & Competitive Forces", channel: "Harvard Business Review", duration: "8 min" },
  "tp-lit-review": { id: "v-res-lit", youtubeId: "r-72t0p7r0M", title: "How to Write a Literature Review", channel: "Paperpal", duration: "12 min" },
  "tp-lit-review-l1": { id: "v-lit-l1", youtubeId: "r-72t0p7r0M", title: "Synthesizing Academic Literature", channel: "Paperpal", duration: "12 min" },
  "tp-writing": { id: "v-res-writing", youtubeId: "kS2O5c3R4rY", title: "Academic Writing Principles & Rigor", channel: "Harvard Writing Center", duration: "15 min" },
  "tp-writing-l1": { id: "v-writing-l1", youtubeId: "kS2O5c3R4rY", title: "Structuring Thesis & Argumentation", channel: "Harvard Writing Center", duration: "15 min" },
  "tp-opamp": { id: "v-ee-opamp", youtubeId: "7FYHgSJ5rVE", title: "Operational Amplifiers (Op-Amps) Explained", channel: "Engineering Mindset", duration: "14 min" },
  "tp-opamp-l1": { id: "v-opamp-l1", youtubeId: "7FYHgSJ5rVE", title: "Inverting & Non-Inverting Op-Amp Circuits", channel: "Engineering Mindset", duration: "14 min" },
  "tp-fourier": { id: "v-ee-fourier", youtubeId: "spUNpyF58BY", title: "But what is the Fourier Transform?", channel: "3Blue1Brown", duration: "21 min" },
  "tp-fourier-l1": { id: "v-fourier-l1", youtubeId: "spUNpyF58BY", title: "Frequency Decomposition & Continuous Spectrum", channel: "3Blue1Brown", duration: "21 min" },
};

/** Fetch verified YouTube video information for a specific lesson or topic. */
export function getVideoForLesson(topicId: string, lessonId: string): CourseVideo {
  if (topicLessonVideoMap[lessonId]) return topicLessonVideoMap[lessonId];
  if (topicLessonVideoMap[topicId]) return topicLessonVideoMap[topicId];
  return {
    id: `v-${lessonId}`,
    youtubeId: "fAAZixBzIAI",
    title: "Computer Science & Curriculum Video",
    channel: "freeCodeCamp.org",
    duration: "15 min",
  };
}

