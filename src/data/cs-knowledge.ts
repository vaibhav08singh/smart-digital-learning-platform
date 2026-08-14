// ============================================================
// CS knowledge tier for the AI tutor.
// Two layers:
//   1. Rich topic entries (deep, structured answers) for the
//      most important topics.
//   2. Curated factual tables the generator uses for ANY topic:
//      algorithm complexities, code snippets, interview banks,
//      MCQs and learning paths.
// Layer 2 is what lets the tutor answer beyond the fixed list.
// ============================================================

export interface TopicKnowledge {
  id: string;
  keywords: string[];
  title: string;
  explain: string[];
  simple: string;
  exam: string[];
  practice: string[];
  notes: string[];
  example?: string;
  followUp: string;
  sources: { label: string; url: string }[];
}

export const knowledgeBase: TopicKnowledge[] = [
  {
    id: "avl",
    keywords: ["avl", "rotation", "balance factor", "self-balancing", "height balance"],
    title: "AVL Trees",
    explain: [
      "An AVL tree is a binary search tree that stays balanced. Each node stores a **balance factor** = height(left subtree) − height(right subtree). A node is OK while that value is in {−1, 0, +1}.",
      "When an insertion or deletion pushes a node's balance factor to ±2, we fix it with a **rotation**. There are exactly four cases: **LL** (left-left) and **RR** (right-right) need a single rotation; **LR** and **RL** are zig-zag cases fixed with two rotations.",
      "The payoff: because the height is always O(log n), search, insert and delete all stay at **O(log n)** worst case — unlike a plain BST that can degenerate to O(n).",
    ],
    simple:
      "An AVL tree is a BST that checks its balance after every insert. If one side gets too heavy, it does a small 'rotation' (re-arranging three nodes) to re-center itself. That keeps everything fast — O(log n) — no matter what order you insert the numbers in.",
    exam: [
      "**Define.** An AVL tree is a height-balanced binary search tree in which, for every node, the balance factor (height of left minus height of right subtree) is in {−1, 0, +1}.",
      "**Why rotations?** Insertion/deletion can make a node's balance factor ±2. Rotations restore the invariant in O(1) time per unbalanced node, preserving the BST ordering.",
      "**Four cases.** LL → single right rotation; RR → single left rotation; LR → left rotation then right; RL → right then left.",
      "**Complexity.** Height ≤ 1.44·log₂(n+2) − 1.328, so search/insert/delete are O(log n). The trade-off is extra bookkeeping and more rotations than a Red-Black tree.",
    ],
    practice: [
      "Insert 30, 20, 10 into an empty AVL tree. Which rotation fixes the imbalance and at which node?",
      "Insert 10, 20, 30, 40, 50 one by one, drawing the tree after every rotation. Which node is the pivot each time?",
      "For the tree from Q2, insert 25. What case (LR/RL?) and what two rotations resolve it?",
      "**Challenge:** Why is the worst-case height of an AVL tree about 1.44 × log₂n, not exactly log₂n?",
    ],
    notes: [
      "Balance factor = height(left) − height(right), must stay in {−1, 0, 1}.",
      "Four rotation cases: LL, RR, LR, RL.",
      "Rotations preserve BST ordering and restore balance in O(1).",
      "Guaranteed O(log n) height → O(log n) search/insert/delete.",
      "Cost: extra bookkeeping vs a plain BST; more rotations than Red-Black trees.",
    ],
    example:
      "Insert 30, 20, 10:\n\n30(bf 0) → 30(bf +1), 20 → 30(bf +2), 20, 10  ⇒ imbalance at 30, LL case\n\nRight-rotate around 30:\n\n    20\n   /  \\\n 10    30\n\nEvery balance factor is now 0.",
    followUp:
      "Want me to walk through an LR case (insert 10, 30, 20) or a deletion scenario next?",
    sources: [
      { label: "GeeksforGeeks — AVL Tree Insertion", url: "https://www.geeksforgeeks.org/avl-tree-set-1-insertion/" },
      { label: "Abdul Bari — AVL Insertion & Rotations", url: "https://www.youtube.com/watch?v=jDM6_TnYIqE" },
    ],
  },
  {
    id: "quadratic",
    keywords: ["quadratic", "quadratic equation", "discriminant", "roots", "ax2", "ax²", "vertex", "parabola", "factorise", "factorization"],
    title: "Quadratic Equations",
    explain: [
      "A quadratic equation has the form **ax² + bx + c = 0** (a ≠ 0). Solving it means finding the values of x (the roots) that make the expression zero.",
      "Three common methods: **factorisation** (split the middle term), **completing the square**, and the **quadratic formula** x = (−b ± √(b² − 4ac)) / 2a.",
      "The **discriminant** D = b² − 4ac predicts the roots before solving: D > 0 → two distinct real roots; D = 0 → one repeated real root; D < 0 → no real roots (two complex ones).",
    ],
    simple:
      "A quadratic equation is any equation like x² − 5x + 6 = 0. Solving it = finding the x values that make it true. The discriminant b² − 4ac is a shortcut that tells you *how many* answers you'll get: more than 0 → two answers, equal to 0 → one answer, less than 0 → no real answers.",
    exam: [
      "**Statement.** A quadratic equation in x is of the form ax² + bx + c = 0, a ≠ 0.",
      "**Roots.** x = (−b ± √(b² − 4ac)) / 2a, derived by completing the square.",
      "**Discriminant rule.** Let D = b² − 4ac. D > 0 → two distinct real roots; D = 0 → real and equal; D < 0 → no real roots.",
      "**Nature of roots (important for board exams).** Also relate D to the parabola: the graph of y = ax² + bx + c cuts the x-axis twice, touches once, or misses it entirely.",
      "**Sum & product.** If α, β are roots: α + β = −b/a and αβ = c/a.",
    ],
    practice: [
      "Solve x² − 5x + 6 = 0 by factorisation.",
      "Find the discriminant of 2x² − 4x + 3 = 0 and state the nature of its roots.",
      "Find k so that kx² − 2x + 1 = 0 has equal roots.",
      "**Challenge:** The sum of a number and its reciprocal is 13/6. Form and solve a quadratic.",
    ],
    notes: [
      "Form: ax² + bx + c = 0, a ≠ 0.",
      "Formula: x = (−b ± √D) / 2a, D = b² − 4ac.",
      "D > 0: two distinct real roots; D = 0: equal real roots; D < 0: no real roots.",
      "Sum of roots = −b/a, product = c/a.",
      "Parabola: opens up if a > 0, down if a < 0; vertex at x = −b/2a.",
    ],
    example:
      "Solve x² − 5x + 6 = 0 by factorisation:\n\nx² − 2x − 3x + 6 = 0\nx(x − 2) − 3(x − 2) = 0\n(x − 2)(x − 3) = 0\n\nx = 2 or x = 3. Both check: 4 − 10 + 6 = 0 ✓ and 9 − 15 + 6 = 0 ✓.",
    followUp:
      "Want to practice completing the square, or see a word problem where the quadratic formula is needed?",
    sources: [
      { label: "Khan Academy — Quadratic functions & equations", url: "https://www.khanacademy.org/math/algebra/x2f8bb11595b61c86:quadratic-functions-equations" },
      { label: "Math is Fun — Quadratic Equations", url: "https://www.mathsisfun.com/algebra/quadratic-equation.html" },
    ],
  },
  {
    id: "emi",
    keywords: ["electromagnetic induction", "faraday", "lenz", "magnetic flux", "induced emf", "ac generator", "mutual induction", "self induction"],
    title: "Electromagnetic Induction",
    explain: [
      "**Electromagnetic induction** is the production of an emf (voltage) in a conductor when the **magnetic flux** through it changes with time. Faraday showed that a *changing* field — not a steady one — induces a current.",
      "**Faraday's law** states that the induced emf equals the negative rate of change of magnetic flux: ε = −N·dΦ/dt. The N is the number of turns; more turns = bigger emf.",
      "**Lenz's law** gives the minus sign its meaning: the induced current flows in the direction that *opposes the change* that produced it. That's why the flux through the coil 'fights' the magnet moving in or out.",
      "Every generator, transformer and induction cooktop runs on this idea — Faraday's discovery literally powers the modern grid.",
    ],
    simple:
      "Moving a magnet near a coil of wire creates electricity — but only while the magnet is moving. That's electromagnetic induction. Faraday's law says: the faster you change the magnetic field, the more voltage you get. Lenz's law says the electricity always pushes back against whatever is changing the field.",
    exam: [
      "**Define.** Electromagnetic induction is the phenomenon of inducing an emf in a conductor by changing the magnetic flux linked with it.",
      "**Faraday's law.** The magnitude of induced emf is ε = N·dΦ/dt — directly proportional to the rate of change of magnetic flux.",
      "**Lenz's law.** The direction of induced current is such that it opposes the change in magnetic flux that causes it (a consequence of conservation of energy).",
      "**Applications.** AC generator: a coil rotating in a magnetic field produces sinusoidally varying emf. Transformer: mutual induction between two coils changes voltage. Induced emf ε = −L·dI/dt for self-induction.",
    ],
    practice: [
      "A coil of 200 turns has flux change from 0.2 Wb to 0.8 Wb in 0.5 s. Find the induced emf.",
      "You push a bar magnet's north pole into a coil. What is the direction of the induced current as seen from the magnet side? Explain with Lenz's law.",
      "Why does the induced current in a generator increase when you spin it faster?",
      "**Challenge:** A magnet is dropped through a vertical copper tube and falls slowly. Explain using Lenz's law.",
    ],
    notes: [
      "Induction happens when magnetic flux changes with time.",
      "Faraday: ε = −N·dΦ/dt.",
      "Lenz: induced current opposes the change causing it (energy conservation).",
      "Φ = BA·cosθ (B field, A area, θ angle).",
      "Applications: generator, transformer, induction cooktop, eddy-current brakes.",
    ],
    example:
      "A 100-turn coil's flux changes from 0.1 Wb to 0.5 Wb in 0.2 s:\n\nε = N·ΔΦ/Δt = 100 × (0.5 − 0.1)/0.2 = 100 × 2 = 200 V.",
    followUp:
      "Want to derive the emf of a rotating coil in an AC generator, or work through Lenz's-law direction problems?",
    sources: [
      { label: "Khan Academy — Electromagnetic Induction", url: "https://www.khanacademy.org/science/ap-physics-2/x0e2f5a2c:magnetism-and-electromagnetism/x0e2f5a2c:electromagnetic-induction/v/electromagnetic-induction-faradays-experiments" },
      { label: "MIT 8.02 — Electromagnetic Induction (Lewin)", url: "https://ocw.mit.edu/courses/8-02-physics-ii-electricity-and-magnetism-spring-2007/" },
    ],
  },
  {
    id: "recursion",
    keywords: ["recursion", "recursive", "base case", "call stack", "stack overflow", "factorial", "fractal"],
    title: "Recursion",
    explain: [
      "**Recursion** is when a function solves a problem by calling itself on a smaller version of the same problem. Every recursive function needs two parts: a **base case** that stops the recursion, and a **recursive case** that breaks the problem down.",
      "Trace what actually happens: each call is pushed onto the **call stack**, runs, and pops off when it returns. So recursion works because the stack remembers all the intermediate steps.",
      "The common pitfalls: a missing or unreachable base case → **stack overflow**; exponential time if you recompute the same subproblems (fix with memoization).",
    ],
    simple:
      "Recursion is a function that calls itself — like Russian nesting dolls. Each doll is a smaller copy of the last, and you stop when you reach the smallest doll (the base case). If you never put a stop in, the dolls never end and your program crashes.",
    exam: [
      "**Define.** Recursion is the technique where a function calls itself, either directly or indirectly, to solve a problem by reducing it to smaller instances of the same problem.",
      "**Components.** Base case: terminates recursion. Recursive case: reduces the input toward the base case.",
      "**Working.** Uses the system call stack; each activation record holds local variables and the return address.",
      "**Examples.** factorial(n) = n·factorial(n−1), Fibonacci, tree/graph traversal, quicksort.",
      "**Drawbacks.** Overhead of function calls; risk of stack overflow; exponential time without memoization.",
    ],
    practice: [
      "Write factorial(5) as a recursion tree and compute its value.",
      "The function fib(6) calls fib(3) how many times? Why is this wasteful?",
      "Write a recursive function to reverse a string without loops.",
      "**Challenge:** Convert recursive Fibonacci to iterative — is the call count the only difference?",
    ],
    notes: [
      "Recursive function = base case + recursive case.",
      "Each call uses the call stack (LIFO).",
      "Missing base case → stack overflow.",
      "Naive recursion can be exponential → use memoization.",
      "Used in: DFS, trees, divide & conquer, backtracking.",
    ],
    example:
      "```\ndef factorial(n):\n    if n <= 1:        # base case\n        return 1\n    return n * factorial(n - 1)  # recursive case\n```",
    followUp:
      "Want to see how to convert this into a tail-recursive or iterative version, or trace a recursion tree for Fibonacci?",
    sources: [
      { label: "MDN — Recursion guide (JavaScript)", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions" },
    ],
  },
  {
    id: "dbms",
    keywords: ["dbms", "database", "database management", "sql", "relation", "transaction", "acid", "rdbms", "schema", "primary key", "foreign key", "index"],
    title: "Database Management Systems",
    explain: [
      "A **DBMS** is software that stores, organises and retrieves data efficiently and safely. **RDBMS** (relational) stores data in **tables** (relations) with rows and columns, linked by keys.",
      "The key concepts: **primary key** (uniquely identifies each row), **foreign key** (links tables), **schema** (the structure), and **normalization** (removing redundancy).",
      "**ACID** transactions keep the database reliable: **Atomicity** (all-or-nothing), **Consistency** (valid state to valid state), **Isolation** (concurrent transactions don't interfere), **Durability** (committed data survives crashes).",
      "SQL is the language you use to talk to a relational database — SELECT, INSERT, UPDATE, DELETE, plus JOINs to combine tables.",
    ],
    simple:
      "A database is like a giant set of well-organized spreadsheets. A DBMS is the app that runs them — it keeps them fast, safe from corruption, and lets multiple people use them at once. SQL is the simple language you type to ask it questions like 'give me every student who scored above 90'.",
    exam: [
      "**Define DBMS.** A collection of interrelated data plus a set of programs to access it — providing efficient, reliable, concurrent and secure data management.",
      "**Three-schema architecture.** External (views), conceptual (overall design), internal (physical storage).",
      "**Keys.** Super key, candidate key, primary key, foreign key.",
      "**ACID.** Atomicity, Consistency, Isolation, Durability — guarantees for transaction processing.",
      "**Schema vs instance.** Schema is the logical structure (stable); instance is the actual data at a moment (changes).",
    ],
    practice: [
      "Design a Students and Courses schema. What are the primary and foreign keys? What's the join table and why?",
      "Write an SQL query to list students who enrolled in more than one course.",
      "Why is a transaction a 'single unit of work'? Give a real-world example that needs atomicity.",
      "**Challenge:** Indexes speed up reads but slow down writes. Explain why.",
    ],
    notes: [
      "RDBMS stores data in tables (relations).",
      "Primary key: unique per row. Foreign key: references another table.",
      "ACID: Atomicity, Consistency, Isolation, Durability.",
      "Normalization removes redundancy & update anomalies.",
      "SQL: DDL (schema) + DML (data) + DQL (queries).",
    ],
    example:
      "```sql\nSELECT s.name, COUNT(e.course_id) AS courses\nFROM students s\nJOIN enrollments e ON e.student_id = s.id\nGROUP BY s.id, s.name\nHAVING COUNT(e.course_id) > 1;\n```",
    followUp:
      "Want to go deeper into normalization, or practice writing JOIN and GROUP BY queries?",
    sources: [
      { label: "GeeksforGeeks — DBMS tutorials", url: "https://www.geeksforgeeks.org/dbms/" },
      { label: "Khan Academy — Intro to SQL", url: "https://www.khanacademy.org/computing/computer-programming/sql" },
    ],
  },
  {
    id: "normalization",
    keywords: ["normalization", "normal form", "1nf", "2nf", "3nf", "bcnf", "functional dependency", "redundancy", "anomaly", "decomposition"],
    title: "Database Normalization",
    explain: [
      "**Normalization** is the process of structuring a database to remove redundancy and avoid update anomalies. We do it by decomposing tables into well-designed ones, guided by **functional dependencies** (which attributes determine others).",
      "**1NF** — every column holds atomic (single) values, no repeating groups. **2NF** — 1NF + no partial dependency on a composite key. **3NF** — 2NF + no transitive dependency (non-key column depends on another non-key column). **BCNF** — every determinant is a candidate key.",
      "Why bother? Without normalization, the same fact lives in many rows: updating it once and forgetting the others corrupts the data (an update anomaly), deleting a row can delete facts you wanted to keep (deletion anomaly).",
    ],
    simple:
      "Normalization is 'don't repeat yourself' for databases. Instead of writing the teacher's name in every row of a class table, you split it into its own table and just reference it. The normal forms (1NF, 2NF, 3NF) are checklists that make your tables clean and free of silly duplication bugs.",
    exam: [
      "**Define.** Normalization is the process of organizing data to reduce redundancy and improve integrity by dividing a table into smaller, well-structured tables.",
      "**1NF.** Atomic values; no multi-valued or repeating groups.",
      "**2NF.** 1NF and no partial dependency of non-key attributes on a proper subset of a composite key.",
      "**3NF.** 2NF and no transitive dependency — non-key attributes depend on the primary key, the whole key, nothing but the key.",
      "**BCNF.** 3NF with every determinant being a candidate key.",
      "**Lossless decomposition.** Normalization must be reversible without losing information.",
    ],
    practice: [
      "Given Student(roll, name, course, teacher), identify the redundancy and which normal form it violates.",
      "Convert it to 3NF by splitting into appropriate tables.",
      "For a table in 3NF that's not BCNF, give a concrete example and fix it.",
      "**Challenge:** Explain why lossless decomposition matters with a counter-example.",
    ],
    notes: [
      "Goal: remove redundancy, avoid update/insertion/deletion anomalies.",
      "1NF: atomic values only.",
      "2NF: no partial dependency (composite keys).",
      "3NF: no transitive dependency.",
      "BCNF: every determinant is a candidate key.",
      "Always decompose losslessly.",
    ],
    example:
      "Course(teacher_name, course_id, student_id)\n\nstudent_id → course_id, but course_id → teacher_name is a transitive dep.\n\nFix (3NF):\n- Course(teacher_name, course_id)\n- Enrollment(student_id, course_id)",
    followUp:
      "Want to work through a full normalization example from UNF → 1NF → 2NF → 3NF?",
    sources: [
      { label: "GeeksforGeeks — Normalization", url: "https://www.geeksforgeeks.org/normal-forms-in-dbms/" },
      { label: "GeeksforGeeks — Functional Dependencies", url: "https://www.geeksforgeeks.org/functional-dependency-and-attribute-closure/" },
    ],
  },
  {
    id: "os",
    keywords: ["operating system", "process", "thread", "scheduling", "deadlock", "semaphore", "page", "memory", "fifo", "round robin", "priority scheduling", "system call", "kernel"],
    title: "Operating Systems",
    explain: [
      "An **operating system** is the software layer between hardware and applications. It manages the CPU (process scheduling), memory (virtual memory, paging), storage (file systems) and I/O devices.",
      "**Processes vs threads:** a process is an isolated program in execution; a thread is a lightweight unit within a process that shares its memory. Threads are cheaper but risk race conditions.",
      "**CPU scheduling algorithms:** FCFS, Shortest-Job-First, Round Robin (fair, time-sliced), and Priority scheduling. The scheduler picks which process runs next to balance throughput, latency and fairness.",
      "**Deadlock** happens when processes hold resources and wait for each other's forever — the four Coffman conditions: mutual exclusion, hold-and-wait, no preemption, circular wait. Prevent one and deadlock is impossible.",
    ],
    simple:
      "The operating system is the traffic controller of your computer. It decides which app gets the CPU next (scheduling), gives each app its own private memory (so they don't crash each other), and manages files. A deadlock is the 'traffic jam' where every car is waiting for another to move first — nobody moves.",
    exam: [
      "**Define OS.** System software that manages computer hardware and provides services to application programs.",
      "**Process vs thread.** Process = independent unit with own address space; thread = execution unit within a process, shares address space. Threads: faster context switch, but synchronization needed.",
      "**Scheduling.** FCFS, SJF (optimal avg. waiting time, needs future knowledge), Round Robin (preemptive, time quantum), Priority (starvation possible → aging).",
      "**Deadlock conditions.** Mutual exclusion, hold-and-wait, no preemption, circular wait. Prevention: eliminate any one; avoidance: Banker's algorithm.",
      "**Memory.** Paging with a TLB speeds address translation; page replacement: FIFO, LRU, Optimal.",
    ],
    practice: [
      "Compute average waiting time for FCFS, SJF and Round Robin (q=2) on the processes you're given.",
      "A process is in deadlock — list the four conditions and show which one a timeout eliminates.",
      "Why is LRU page replacement hard to implement perfectly in practice? What's a good approximation?",
      "**Challenge:** Why does thread context switching usually cost less than process context switching?",
    ],
    notes: [
      "OS manages CPU, memory, storage, I/O.",
      "Process = isolated; thread = shared-memory lightweight.",
      "Scheduling: FCFS, SJF, RR, Priority (aging for starvation).",
      "Deadlock: 4 Coffman conditions; prevent/avoid/detect.",
      "Paging + TLB; replacement: FIFO, LRU, Optimal.",
    ],
    example:
      "Round Robin (q = 2ms):\nP1(3ms) P2(4ms) P3(2ms)\n→ P1 runs 2ms, P2 runs 2ms, P3 runs 2ms (done), P1 runs 1ms (done), P2 runs 2ms (done).\nCompletion times: P1 = 7, P2 = 9, P3 = 6.",
    followUp:
      "Want to practice a full scheduling problem with Gantt charts, or go into semaphores and the producer–consumer problem?",
    sources: [
      { label: "GeeksforGeeks — Operating Systems", url: "https://www.geeksforgeeks.org/operating-systems/" },
    ],
  },
  {
    id: "graphs",
    keywords: ["graph", "bfs", "dfs", "breadth first", "depth first", "adjacency list", "dijkstra", "shortest path", "topological", "edge", "vertex", "cycle"],
    title: "Graphs",
    explain: [
      "A **graph** is a set of vertices (nodes) connected by edges. It's the model for networks: social graphs, road maps, the web, and dependency graphs.",
      "Two core traversals: **DFS** (depth-first) explores down one branch before backtracking — natural for recursion, cycles and connectivity. **BFS** (breadth-first) explores level by level using a queue — it finds the *shortest path in unweighted graphs*.",
      "Common algorithms: **Dijkstra** for shortest paths with non-negative weights, **topological sort** for dependencies (DAGs), and union-find or DFS for cycle detection.",
    ],
    simple:
      "A graph is just dots (nodes) and lines (edges) — like a friend network where dots are people and lines are friendships. DFS is 'go as deep as you can, then backtrack'; BFS is 'ask everyone at your distance first, then spread outward.' BFS gives you the shortest hop-count between two people.",
    exam: [
      "**Define.** A graph G = (V, E) consists of vertices V and edges E; edges may be directed or undirected, weighted or unweighted.",
      "**Representation.** Adjacency matrix (O(V²) space, O(1) edge lookup) vs adjacency list (O(V+E) space, iterate neighbours quickly).",
      "**DFS.** Uses a stack (or recursion); time O(V+E). Applications: cycle detection, topological sort, connected components, solving mazes.",
      "**BFS.** Uses a queue; O(V+E). Finds shortest path in unweighted graphs.",
      "**Dijkstra.** Greedy; works for non-negative weights; O((V+E) log V) with a priority queue.",
    ],
    practice: [
      "Run DFS and BFS on a given graph and compare the orders you visit vertices.",
      "Detect a cycle in a directed graph using both DFS (back-edge) and indegree (Kahn's algorithm).",
      "In an unweighted graph, why is BFS guaranteed to find the shortest path but DFS is not?",
      "**Challenge:** Count connected components using one traversal.",
    ],
    notes: [
      "Graph = vertices + edges (directed/undirected, weighted/unweighted).",
      "Adjacency list: space O(V+E).",
      "DFS: stack/recursion; BFS: queue (shortest path, unweighted).",
      "Dijkstra: non-negative weights only.",
      "Topological sort: DAGs; cycle detection: DFS back-edge or indegree.",
    ],
    example:
      "BFS shortest path, adj list:\n\n```\nfrom collections import deque\n\ndef bfs_shortest(graph, start):\n    dist = {n: float('inf') for n in graph}\n    dist[start] = 0\n    q = deque([start])\n    while q:\n        u = q.popleft()\n        for v in graph[u]:\n            if dist[v] == float('inf'):\n                dist[v] = dist[u] + 1\n                q.append(v)\n    return dist\n```",
    followUp:
      "Want to contrast BFS vs DFS on a cycle-detection problem, or see Dijkstra's algorithm traced on a weighted graph?",
    sources: [
      { label: "GeeksforGeeks — Graph Data Structure", url: "https://www.geeksforgeeks.org/graph-data-structure-and-algorithms/" },
      { label: "freeCodeCamp — Graph Algorithms course", url: "https://www.youtube.com/watch?v=tWVWeAqZ0WU" },
    ],
  },
  {
    id: "trees",
    keywords: ["tree", "binary tree", "binary search tree", "bst", "traversal", "inorder", "preorder", "postorder", "heap", "node", "leaf", "root"],
    title: "Trees & Binary Search Trees",
    explain: [
      "A **tree** is a connected, acyclic graph with a root — a hierarchical structure of nodes and edges. **Binary trees** restrict each node to at most two children.",
      "A **Binary Search Tree (BST)** keeps the ordering invariant: every node's left subtree holds smaller keys, the right subtree larger ones. That makes search O(h), where h is the tree height — O(log n) if balanced, O(n) if skewed.",
      "**Traversals:** inorder (left–root–right, gives sorted order in a BST), preorder (root–left–right, good for copying), postorder (left–right–root, good for deletion).",
    ],
    simple:
      "A tree is like a family tree: one root on top, children branching below. A binary tree has at most two children per person. A BST adds a rule — everything on the left is smaller, everything on the right is bigger — so finding a number is like playing a fast guessing game.",
    exam: [
      "**Define.** A tree is a connected acyclic graph. A binary tree has at most two children per node.",
      "**BST invariant.** For every node, all keys in the left subtree are smaller and all keys in the right subtree are larger.",
      "**Traversals.** Inorder: L−R visit root between → sorted order. Preorder: root first. Postorder: root last.",
      "**Complexities.** Search/insert/delete O(h); O(log n) balanced, O(n) skewed. Height of a complete binary tree with n nodes = ⌊log₂n⌋.",
      "**Properties.** In a full binary tree, leaf nodes = internal nodes + 1.",
    ],
    practice: [
      "Draw the BST you get inserting 50, 30, 70, 20, 40, 60, 80. Do an inorder traversal.",
      "Delete the node with key 30 from your tree and re-arrange correctly (two-child case).",
      "Why does inorder traversal of a BST print keys in sorted order?",
      "**Challenge:** Write iterative versions of inorder/preorder/postorder without recursion.",
    ],
    notes: [
      "Tree = connected acyclic graph; binary tree ≤ 2 children.",
      "BST: left < node < right for all subtrees.",
      "Traversals: inorder (sorted), preorder, postorder.",
      "Search O(h); balanced → O(log n), skewed → O(n).",
      "Full binary tree: leaves = internal + 1.",
    ],
    example:
      "Inorder traversal of:\n\n      50\n     /  \\\n   30    70\n  /  \\\n 20  40\n\n→ 20, 30, 40, 50, 70  (sorted ✓)",
    followUp:
      "Want to compare BST vs heap, or learn about tree balancing next (AVL)?",
    sources: [
      { label: "GeeksforGeeks — Tree Data Structure", url: "https://www.geeksforgeeks.org/tree-data-structure/" },
    ],
  },
  {
    id: "dp",
    keywords: ["dynamic programming", "memoization", "tabulation", "overlapping subproblems", "optimal substructure", "knapsack", "coin change", "lcs", "fibonacci"],
    title: "Dynamic Programming",
    explain: [
      "**Dynamic programming** is an optimisation technique for problems with two properties: **overlapping subproblems** (the same small problem recurs) and **optimal substructure** (the optimal answer builds from optimal answers to subproblems).",
      "Two styles: **memoization** (top-down) — solve recursively but cache results; **tabulation** (bottom-up) — fill a table in dependency order. Both avoid recomputation; the key is writing the **recurrence** first.",
      "Classic problems: Fibonacci, climbing stairs, coin change, 0/1 knapsack, LCS, and grid paths. The hard part is recognising the state and the transitions.",
    ],
    simple:
      "Dynamic programming = 'don't solve the same thing twice.' If your recursive solution keeps recalculating the same answer, save it in a dictionary (memoization) or fill a table (tabulation). That turns exponential solutions into polynomial ones. Like writing answers in a notebook instead of doing the sum over and over.",
    exam: [
      "**Define.** DP is a method for solving complex problems by breaking them into overlapping subproblems and storing their results to avoid recomputation.",
      "**Two properties.** Overlapping subproblems and optimal substructure.",
      "**Approaches.** Top-down (memoized recursion) vs bottom-up (tabulation). Space O(n) for the table; can often be reduced to O(1) for sliding-window states.",
      "**0/1 Knapsack recurrence.** dp[i][w] = max(dp[i−1][w], dp[i−1][w−wt[i]] + val[i]).",
      "**LCS.** dp[i][j] = dp[i−1][j−1]+1 if equal else max(dp[i−1][j], dp[i][j−1]).",
    ],
    practice: [
      "Climbing stairs: n steps, take 1 or 2 at a time. Write the recurrence and count ways for n = 5.",
      "Coin change: minimum coins for amount 6 with coins {1, 3, 4}.",
      "0/1 knapsack with capacity 5, items (w, v) = (2,3), (3,4), (4,5). Find the max value.",
      "**Challenge:** Why does greedy fail for coin change with {1, 3, 4} and amount 6, but DP works?",
    ],
    notes: [
      "DP = overlapping subproblems + optimal substructure.",
      "Memoization: top-down with a cache.",
      "Tabulation: bottom-up table.",
      "Always write the recurrence first, then optimize space.",
      "Classics: Fibonacci, stairs, coin change, knapsack, LCS.",
    ],
    example:
      "Fibonacci with memoization:\n\n```\ndef fib(n, memo={}):\n    if n in memo: return memo[n]\n    if n < 2: return n\n    memo[n] = fib(n-1, memo) + fib(n-2, memo)\n    return memo[n]\n```\n\nF(6) computes each of 0..6 once → O(n) instead of O(2ⁿ).",
    followUp:
      "Want a full walkthrough of the coin-change table, or a comparison of memoization vs tabulation on a grid-path problem?",
    sources: [
      { label: "freeCodeCamp — Dynamic Programming course", url: "https://www.youtube.com/watch?v=oBt53YbR9Kk" },
    ],
  },
  {
    id: "neural-networks",
    keywords: ["neural network", "neuron", "backpropagation", "gradient descent", "activation", "relu", "sigmoid", "deep learning", "layer", "weights", "bias", "attention"],
    title: "Neural Networks & Deep Learning",
    explain: [
      "A **neural network** is a function composed of layers of simple units called neurons. Each neuron computes a weighted sum of its inputs, adds a bias, and squashes it through an **activation function** (ReLU, sigmoid).",
      "**Learning** = adjusting the weights to reduce error. **Backpropagation** computes how much each weight contributed to the error using the chain rule; **gradient descent** then nudges the weights downhill.",
      "Modern deep learning extends this with specialized architectures — **CNNs** for images, **RNNs/transformers** for sequences — where **attention** lets the model focus on relevant parts of the input.",
    ],
    simple:
      "A neural network is a giant guessing machine. It starts with random guesses, compares each guess to the right answer, and works backwards ('backpropagation') to figure out which knobs (weights) to turn and by how much. Repeat thousands of times and the guesses get really good.",
    exam: [
      "**Define neuron.** Computes z = Σ wᵢxᵢ + b, then a = σ(z) with a non-linear activation.",
      "**Why non-linear activations?** Without them, stacked layers collapse into one linear function.",
      "**Forward pass.** Input → hidden layers → output; cost = loss(prediction, target).",
      "**Backpropagation.** Uses the chain rule to compute ∂loss/∂w for every weight, layer by layer from output to input.",
      "**Gradient descent.** w ← w − η·∂loss/∂w. Learning rate η too large → divergence; too small → slow.",
      "**Overfitting.** Model memorizes training data; fixes: more data, regularization, dropout.",
    ],
    practice: [
      "A single neuron with weights (2, −1), bias 0.5, sigmoid activation: compute the output for input (1, 1).",
      "Why is ReLU usually preferred over sigmoid in hidden layers? (Hint: vanishing gradient.)",
      "Explain backpropagation in your own words using the chain rule.",
      "**Challenge:** Why can't a one-layer network learn XOR, and how does a hidden layer fix it?",
    ],
    notes: [
      "Neuron: z = Σwᵢxᵢ + b, then activation.",
      "Non-linearity lets deep networks express complex functions.",
      "Training = forward pass + loss + backprop (chain rule) + gradient descent.",
      "Learning rate η balances speed and stability.",
      "CNNs → images; transformers/attention → sequences.",
    ],
    example:
      "One neuron, input (1, 1), weights (2, −1), bias 0.5:\n\nz = 2(1) + (−1)(1) + 0.5 = 1.5\nσ(1.5) = 1 / (1 + e^−1.5) ≈ 0.82",
    followUp:
      "Want me to break down the chain rule in backpropagation step by step, or explain the attention mechanism?",
    sources: [
      { label: "3Blue1Brown — But what is a neural network?", url: "https://www.3blue1brown.com/lessons/neural-networks/" },
      { label: "MIT 6.S191 — Intro to Deep Learning", url: "http://introtodeeplearning.com/" },
    ],
  },
  {
    id: "docker",
    keywords: ["docker", "container", "image", "dockerfile", "volume", "docker compose", "kubernetes", "k8s", "orchestration", "devops"],
    title: "Docker & Containers",
    explain: [
      "**Docker** packages an app with all its dependencies into a **container** — a lightweight, isolated environment that runs the same anywhere. Containers share the host OS kernel, so they start in seconds and use far less than VMs.",
      "A **Dockerfile** is a recipe: FROM a base image, COPY code, RUN installs, CMD the start command. Building it produces an **image**; running an image creates a **container**.",
      "**Volumes** persist data across container restarts; **Docker Compose** defines multi-container apps (e.g. app + database) in one file. At scale, **Kubernetes** orchestrates containers across many machines.",
    ],
    simple:
      "Docker is like a shipping container for your app: you pack your code, tools and settings into one box that works identically everywhere. A Dockerfile is the packing list, an image is the packed box, and a container is a running box.",
    exam: [
      "**Define.** A container is an OS-level virtualization unit sharing the host kernel but isolating processes, files and network.",
      "**Image vs container.** Image = immutable blueprint; container = running instance (image + writable layer).",
      "**Dockerfile.** FROM → base image; WORKDIR; COPY; RUN; EXPOSE; CMD/ENTRYPOINT.",
      "**Volumes.** Named volumes persist data independently of container lifecycle.",
      "**Kubernetes.** Declarative orchestration: pods (smallest unit), deployments (replicas), services (networking), scaling and self-healing.",
      "**VM vs container.** VMs virtualize hardware with a guest OS (heavy); containers share the host kernel (light, fast).",
    ],
    practice: [
      "Write a Dockerfile for a Node app (node:20 base, copy package.json, npm ci, copy src, expose 3000, CMD npm start).",
      "Why would you put a volume on a database container?",
      "A container starts and exits immediately — what's the most likely cause?",
      "**Challenge:** When would you choose a VM over a container?",
    ],
    notes: [
      "Container = isolated, shares host kernel.",
      "Dockerfile → build → image → run → container.",
      "Volumes persist data; Compose = multi-container.",
      "Kubernetes: pods, deployments, services.",
      "Containers ≠ VMs (kernel sharing).",
    ],
    example:
      "```dockerfile\nFROM node:20-alpine\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci --omit=dev\nCOPY . .\nEXPOSE 3000\nCMD [\"npm\", \"start\"]\n```",
    followUp:
      "Want to go deeper into Docker Compose networking or Kubernetes pods and services?",
    sources: [
      { label: "Docker — Get started", url: "https://docs.docker.com/get-started/" },
      { label: "Kubernetes — Documentation", url: "https://kubernetes.io/docs/" },
    ],
  },
  {
    id: "react",
    keywords: ["react", "component", "jsx", "props", "state", "hooks", "usestate", "useeffect", "usememo", "useref", "virtual dom", "rerender", "hook"],
    title: "React",
    explain: [
      "**React** builds UIs from **components** — functions that return **JSX** (HTML-like markup). Components take **props** (inputs) and hold **state** (data that changes over time).",
      "When state changes, React re-renders the component and reconciles a **virtual DOM** with the real one, updating only what changed. That's why UIs stay fast without manual DOM surgery.",
      "**Hooks** are functions that give components superpowers: **useState** (local state), **useEffect** (side effects like fetching), **useRef** (stable references), **useMemo** (memoized values). Rules: only call hooks at the top level, and only from React functions.",
    ],
    simple:
      "React is a way to build websites out of little reusable pieces called components. Each component is like a function that returns some HTML. State is the component's memory — when it changes, React automatically updates just that part of the page.",
    exam: [
      "**Define.** React is a JavaScript library for building user interfaces from reusable, declarative components.",
      "**JSX.** Syntax extension allowing HTML-like code in JS; compiled to React.createElement calls.",
      "**Props vs state.** Props are immutable inputs from parent; state is mutable data owned by the component.",
      "**Reconciliation.** Diffing virtual DOM against previous version minimizes real DOM updates.",
      "**Hooks.** useState, useEffect, useRef, useMemo, useCallback; rules of hooks: top-level only, React functions only.",
      "**Controlled components.** Form inputs driven by state (value + onChange).",
    ],
    practice: [
      "Build a counter component using useState and explain each re-render.",
      "When would you use useEffect with an empty dependency array vs with dependencies?",
      "Why shouldn't you call a hook inside a loop or an if statement?",
      "**Challenge:** A component re-renders more than expected — what tools (memo, key, lifting state) fix it and why?",
    ],
    notes: [
      "Component = function returning JSX.",
      "Props in, state local.",
      "State change → re-render → virtual DOM diff → minimal updates.",
      "Hooks: useState, useEffect, useRef, useMemo.",
      "Rules of hooks: top-level, in React functions.",
    ],
    example:
      "```jsx\nimport { useState } from \"react\";\n\nfunction Counter() {\n  const [count, setCount] = useState(0);\n  return (\n    <button onClick={() => setCount(c => c + 1)}>\n      Clicked {count} times\n    </button>\n  );\n}\n```",
    followUp:
      "Want to go deeper into useEffect cleanup, or the difference between useMemo and useCallback?",
    sources: [
      { label: "React — Official docs", url: "https://react.dev" },
      { label: "MDN — JavaScript Guide", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript" },
    ],
  },
  {
    id: "crypto",
    keywords: ["cryptography", "encryption", "decryption", "aes", "rsa", "hash", "hashing", "public key", "private key", "cipher", "symmetric", "asymmetric", "digital signature"],
    title: "Cryptography",
    explain: [
      "**Cryptography** protects data using keys and algorithms. **Symmetric** encryption (e.g. **AES**) uses one shared key for both encrypt and decrypt — fast, but the key must be shared secretly.",
      "**Asymmetric** (public-key) crypto uses a **key pair**: a public key anyone can use to encrypt, and a private key only the owner holds to decrypt (e.g. **RSA**). This solves the key-sharing problem.",
      "**Hashing** (SHA-256) maps data to a fixed-size digest — one-way, collision-resistant. Hashes verify integrity and store passwords (with salt). **Digital signatures** combine hashing + private key to prove authenticity and integrity.",
    ],
    simple:
      "Cryptography is secret writing for computers. Symmetric crypto is like a single padlock key both people copy. Asymmetric crypto is like a mailbox: anyone can drop a letter in (public key), but only you have the key to open it (private key). Hashing is like a fingerprint for a file — even a tiny change makes a totally different fingerprint.",
    exam: [
      "**Define.** Cryptography is the study of techniques for secure communication in the presence of adversaries.",
      "**Symmetric vs asymmetric.** Symmetric (AES, DES): same key, fast. Asymmetric (RSA, ECC): public/private pair, solves key distribution.",
      "**AES.** Block cipher (128-bit blocks), SP-network with substitution-permutation, 10/12/14 rounds for 128/192/256-bit keys.",
      "**RSA.** Relies on integer factorisation difficulty; key generation uses two large primes.",
      "**Hash.** SHA-256: deterministic, one-way, avalanche effect, collision-resistant.",
      "**Digital signature.** Sign = hash + encrypt hash with private key; verify = decrypt with public key and compare hash.",
    ],
    practice: [
      "Why can't you use a hash to encrypt a message, and why can't you reverse SHA-256?",
      "In RSA, why is the private key kept secret while the public key is shared?",
      "You receive a file signed with someone's private key — how do you verify it's really from them?",
      "**Challenge:** Explain why using a single symmetric key for two people over the internet is a chicken-and-egg problem and how Diffie–Hellman solves it.",
    ],
    notes: [
      "Symmetric (AES): one key, fast.",
      "Asymmetric (RSA): public + private keys.",
      "Hash (SHA-256): one-way fingerprint.",
      "Sign = hash + private key; verify with public key.",
      "AES rounds: 10/12/14 for 128/192/256-bit keys.",
    ],
    example:
      "Verification flow:\n\nSender: hash(msg) → encrypt with private key → send msg + signature.\nReceiver: decrypt signature with public key → hash(msg) → compare.\n\nIf the two digests match, the message is authentic and untampered.",
    followUp:
      "Want me to explain the Diffie–Hellman key exchange, or break down how AES works round by round?",
    sources: [
      { label: "Computerphile — AES Explained", url: "https://www.youtube.com/watch?v=O4xNJsjtN6E" },
      { label: "NIST — FIPS 197 (AES standard)", url: "https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.197.pdf" },
    ],
  },
  {
    id: "light",
    keywords: ["light", "reflection", "refraction", "mirror", "lens", "prism", "ray", "image formation", "dispersion", "concave", "convex"],
    title: "Light — Reflection & Refraction",
    explain: [
      "Light travels in straight lines. **Reflection** is light bouncing off a surface — the law: angle of incidence equals angle of reflection. Plane mirrors produce virtual, same-size images.",
      "**Curved mirrors** (concave/convex) form images by geometry: concave mirrors converge light (used in torches, shaving mirrors); convex mirrors diverge (car side mirrors). The **mirror formula** 1/f = 1/v + 1/u ties focal length, image and object distances.",
      "**Refraction** is light bending when it changes medium (e.g. air → water), governed by **Snell's law**: n₁ sinθ₁ = n₂ sinθ₂. A prism disperses white light into colours; a lens uses refraction to form images.",
    ],
    simple:
      "Light bounces off mirrors (reflection) and bends when it enters water or glass (refraction). Mirrors follow one simple rule: the bounce-in angle equals the bounce-out angle. Lenses and prisms work because light bends at surfaces.",
    exam: [
      "**Law of reflection.** Angle of incidence = angle of reflection, both measured to the normal; incident, reflected ray and normal lie in the same plane.",
      "**Mirror formula.** 1/f = 1/v + 1/u, with the sign convention (concave: f negative by convention depending on your board's rules).",
      "**Snell's law.** n₁ sinθ₁ = n₂ sinθ₂; light bends toward the normal when entering a denser medium.",
      "**Image by plane mirror.** Virtual, erect, same size, laterally inverted.",
      "**Dispersion.** White light splits into VIBGYOR because different wavelengths refract by different amounts.",
      "**Lens formula.** 1/f = 1/v − 1/u; convex lens converges, concave diverges; power P = 1/f (in dioptres, f in metres).",
    ],
    practice: [
      "A ray hits a plane mirror at 40° to the surface. What's the angle of reflection?",
      "An object is 15 cm in front of a convex mirror of focal length 20 cm. Find the image distance and its nature.",
      "Why does a straw look bent in a glass of water? Draw the refraction.",
      "**Challenge:** Light moves from water (n=1.33) to glass (n=1.5) at 45°. Does it bend toward or away from the normal?",
    ],
    notes: [
      "Reflection: ∠i = ∠r (same plane, normal).",
      "Plane mirror: virtual, erect, same size.",
      "Snell: n₁ sinθ₁ = n₂ sinθ₂.",
      "Mirror formula 1/f = 1/v + 1/u; lens formula 1/f = 1/v − 1/u.",
      "Prism disperses → VIBGYOR; power P = 1/f.",
    ],
    example:
      "Snell's law — air (n=1) to water (n=1.33), θ₁ = 45°:\n\nsinθ₂ = (1 × sin45°)/1.33 = 0.532\nθ₂ ≈ 32°  (bends toward the normal ✓)",
    followUp:
      "Want to work through a lens/mirror numerical with the sign convention, or understand total internal reflection?",
    sources: [
      { label: "Khan Academy — Reflection of light", url: "https://www.khanacademy.org/science/in-in-class10th-physics/in-in-10th-physics-light-reflection-refraction/in-in-reflection-of-light/v/laws-of-reflection2" },
    ],
  },
  {
    id: "python",
    keywords: ["python", "list comprehension", "dictionary", "tuple", "pandas", "numpy", "decorator", "generator", "indentation", "pep"],
    title: "Python",
    explain: [
      "**Python** is an interpreted, dynamically-typed language prized for readable, expressive code. Core data structures: **list** (ordered, mutable), **tuple** (ordered, immutable), **dict** (key→value), **set** (unique items).",
      "Idiomatic Python uses **list comprehensions**, **generators** (yield) for lazy iteration, and **decorators** to wrap functions. Indentation defines blocks — so indentation errors are syntax errors.",
      "The standard library plus **NumPy/Pandas** (data), **requests** (HTTP), and **matplotlib** (plots) make it the default for scripting, data science and automation.",
    ],
    simple:
      "Python is a programming language that reads almost like English, so it's the most popular first language. Lists hold ordered items, dictionaries store 'label → value' pairs, and indentation (spaces) tells Python which code belongs together — unlike most languages that use braces.",
    exam: [
      "**Define.** Python is a high-level, interpreted, general-purpose language with dynamic typing and automatic memory management.",
      "**Data structures.** list (mutable), tuple (immutable), dict (hash map), set (unique).",
      "**Mutable vs immutable.** Lists/dicts/sets mutable; tuples/strings/numbers immutable.",
      "**List comprehension.** [x*2 for x in range(10) if x % 2 == 0].",
      "**Decorator.** Function that takes a function and returns an extended version (@decorator syntax).",
      "**GIL.** Global Interpreter Lock allows one thread at a time for CPU work — use multiprocessing for CPU-bound, threads for I/O.",
    ],
    practice: [
      "Write a list comprehension to get squares of even numbers up to 20.",
      "Why does mutating a list inside a loop while iterating cause bugs? How do you avoid it?",
      "What does the @property decorator do, and why use it?",
      "**Challenge:** Write a generator that yields an infinite sequence of prime numbers.",
    ],
    notes: [
      "Interpreted, dynamically typed.",
      "list/tuple/dict/set are the core types.",
      "Indentation = block structure.",
      "Comprehensions & generators are idiomatic.",
      "GIL limits parallel CPU work in threads.",
    ],
    example:
      "```python\nsquares = [x**2 for x in range(10) if x % 2 == 0]\n# [0, 4, 16, 36, 64]\n\ndef gen():\n    for i in range(3):\n        yield i\n```",
    followUp:
      "Want to practice list comprehensions vs loops, or look at how Python's memory model handles mutable defaults?",
    sources: [
      { label: "Python — Official tutorial", url: "https://docs.python.org/3/tutorial/" },
    ],
  },
  {
    id: "java",
    keywords: ["java", "jvm", "jre", "jdk", "class", "object", "inheritance", "interface", "exception", "thread", "garbage collection", "nullpointerexception", "compile error"],
    title: "Java",
    explain: [
      "**Java** is a compiled, statically-typed, object-oriented language that runs on the **JVM** — write once, run anywhere. The **JDK** compiles to bytecode; the **JRE** provides the runtime; the JVM executes it with a built-in **garbage collector** for memory management.",
      "OOP pillars: **encapsulation** (private fields + public methods), **inheritance** (extends), **polymorphism** (overloading/overriding, interfaces), **abstraction** (abstract classes, interfaces).",
      "Common runtime error: **NullPointerException** (calling a method on null). Fix: check nulls, use Optional, or initialize properly. Compile errors usually mean types or syntax mismatch.",
    ],
    simple:
      "Java is a language that runs on a 'virtual machine' (JVM), so the same code works on any computer. Everything lives inside classes. Memory is cleaned up automatically (garbage collection). The most common crash — a NullPointerException — just means you tried to use something that was empty/null.",
    exam: [
      "**Define.** Java is a statically-typed, object-oriented language compiled to JVM bytecode.",
      "**JDK vs JRE vs JVM.** JDK = compiler + tools; JRE = runtime libraries + JVM; JVM = executes bytecode.",
      "**OOP.** Encapsulation, inheritance (extends/implements), polymorphism (overload/override), abstraction.",
      "**Exceptions.** Checked (compile-time, must handle) vs unchecked (runtime, e.g. NullPointerException).",
      "**Memory.** Objects on the heap; garbage collection reclaims unreachable objects automatically.",
      "**Concurrency.** Threads via Runnable/Thread; synchronized blocks prevent races.",
    ],
    practice: [
      "Explain why a final class cannot be extended.",
      "What's the difference between an abstract class and an interface (pre- and post-Java 8)?",
      "Why does the code throw a NullPointerException? Write the fix.",
      "**Challenge:** How does the JVM's garbage collector decide what is 'garbage'?",
    ],
    notes: [
      "Runs on JVM bytecode; JDK compiles, JVM runs.",
      "OOP: encapsulation, inheritance, polymorphism, abstraction.",
      "Checked vs unchecked exceptions.",
      "Heap + garbage collection.",
      "NPE = calling a method on null.",
    ],
    example:
      "```java\npublic class Counter {\n    private int count = 0;         // encapsulation\n    public synchronized void inc() { count++; }\n    public int value() { return count; }\n}\n```",
    followUp:
      "Want to debug a specific Java error you hit, or go deeper into threads and synchronization?",
    sources: [
      { label: "Oracle — Java Tutorials", url: "https://docs.oracle.com/javase/tutorial/" },
    ],
  },
  {
    id: "big-o",
    keywords: ["big-o", "big o", "time complexity", "complexity", "o(n", "o(n²", "o(logn", "asymptotic", "growth of functions"],
    title: "Big-O & Time Complexity",
    explain: [
      "Big-O describes how the runtime (or memory) of an algorithm **grows as the input size n grows**, ignoring constants and smaller terms.",
      "**Common classes:** O(1) constant · O(log n) logarithmic · O(n) linear · O(n log n) linearithmic · O(n²) quadratic · O(2ⁿ) exponential.",
      "**How to find it:** count the loops — a single pass is O(n); nested loops over n are O(n²); halving the search space each step (binary search, balanced trees) is O(log n).",
    ],
    simple:
      "Big-O is a way of saying \"how much slower does this get as I give it more data?\". If it's O(n), twice the data takes twice the time. If it's O(log n), even a million items only needs ~20 steps. If it's O(n²), big inputs get slow very fast.",
    exam: [
      "**Definition.** f(n) = O(g(n)) if there exist constants c > 0 and n₀ such that f(n) ≤ c·g(n) for all n ≥ n₀ — g(n) is an asymptotic upper bound.",
      "**Rules of thumb.** Drop constants and lower-order terms; keep the fastest-growing term.",
      "**Common orders (fast → slow).** O(1) < O(log n) < O(n) < O(n log n) < O(n²) < O(2ⁿ) < O(n!).",
      "**Examples.** Binary search O(log n); merge sort O(n log n); naive bubble sort O(n²); matrix multiply O(n³).",
      "**Best/average/worst.** Always state which case you mean; e.g. quick sort is O(n log n) average but O(n²) worst.",
    ],
    practice: [
      "What is the time complexity of a nested loop that runs i from 1..n and j from 1..i?",
      "What is the complexity of binary search and why is it logarithmic?",
      "Classify: accessing an array index, inserting at the head of a linked list, searching a sorted array.",
      "**Challenge:** prove that f(n) = 3n² + 2n + 1 is O(n²) from the definition.",
    ],
    notes: [
      "Big-O = asymptotic upper bound; Ω = lower bound; Θ = tight bound.",
      "Drop constants and lower-order terms.",
      "log₂n grows slower than n; n·log n sits between n and n².",
      "State best/average/worst cases explicitly.",
    ],
    example: "Classify this: for (i=0; i<n; i++) for (j=0; j<n; j++) x += a[i][j];\n\nOuter loop runs n times, inner runs n times → n × n = n² → **O(n²)**.",
    followUp: "Want me to analyse a specific algorithm you're studying, or quiz you on classifying complexities?",
    sources: [
      { label: "Khan Academy — Asymptotic notation", url: "https://www.khanacademy.org/computing/computer-science/algorithms/asymptotic-notation" },
    ],
  },
  {
    id: "linked-lists",
    keywords: ["linked list", "singly linked", "doubly linked", "circular linked", "node"],
    title: "Linked Lists",
    explain: [
      "A linked list is a sequence of **nodes**, each holding data and a pointer to the next node. Unlike arrays, nodes are not stored contiguously.",
      "**Singly linked** each node points forward only; **doubly linked** nodes point both ways (good for deletion); **circular** links the tail back to the head.",
      "Trade-off vs arrays: **insert/delete at head is O(1)** but **access by index is O(n)** (must walk). Arrays give O(1) indexing but O(n) insertion in the middle.",
    ],
    simple:
      "A linked list is like a conga line where each person holds the hand of the person behind them. To reach the 10th person you count one by one. Adding someone at the front is instant — you just change who the front person is holding hands with.",
    exam: [
      "**Define.** A linked list is a linear data structure in which elements (nodes) are linked using pointers, not stored in contiguous memory.",
      "**Node.** Each node = data + next pointer (and prev for doubly linked).",
      "**Complexities.** Insert/delete at head O(1); search and index access O(n).",
      "**Advantages.** Dynamic size, efficient insertion/deletion, no memory waste from pre-allocation.",
      "**Disadvantages.** No random access, extra memory for pointers, poor cache locality vs arrays.",
    ],
    practice: [
      "Reverse a singly linked list in O(n) time and O(1) space.",
      "Detect a cycle in a linked list — how would Floyd's algorithm work?",
      "Delete a node given only a pointer to that node (no head).",
      "**Challenge:** why is a doubly linked list better than singly for deleting a given node?",
    ],
    notes: [
      "Insert/delete at head: O(1). Search/access: O(n).",
      "Singly vs doubly vs circular.",
      "Pointer-heavy → watch for null dereference.",
      "Poor cache locality vs arrays.",
    ],
    example: "Reverse a list: prev=null; cur=head; while(cur){ next=cur.next; cur.next=prev; prev=cur; cur=next; } → O(n), O(1).",
    followUp: "Want to implement insertion/deletion, or compare linked lists with arrays and stacks?",
    sources: [
      { label: "GeeksforGeeks — Linked List", url: "https://www.geeksforgeeks.org/data-structures/linked-list/" },
    ],
  },
  {
    id: "stacks-queues",
    keywords: ["stack", "queue", "deque", "lifo", "fifo", "push", "pop", "enqueue", "dequeue"],
    title: "Stacks & Queues",
    explain: [
      "A **stack** is a LIFO (Last-In-First-Out) structure — push adds to the top, pop removes from the top. Think of a pile of plates.",
      "A **queue** is FIFO (First-In-First-Out) — enqueue at the rear, dequeue at the front. Think of a ticket line.",
      "Common applications: stacks → function calls (call stack), expression evaluation, undo; queues → scheduling, BFS, print spooling.",
    ],
    simple:
      "A stack is a pile — the last thing you put on is the first you take off. A queue is a line — the first person in line is served first. That's the whole difference!",
    exam: [
      "**Stack (LIFO).** push/pop/top all O(1); used in recursion, expression conversion, backtracking.",
      "**Queue (FIFO).** enqueue/dequeue O(1); used in scheduling and BFS.",
      "**Array vs linked-list implementations** and the circular-array trick to reuse space.",
      "**Deque** supports insert/remove at both ends.",
      "**Priority queue** removes the highest-priority item, usually backed by a heap.",
    ],
    practice: [
      "Convert infix to postfix using a stack: a + b * (c − d).",
      "Evaluate postfix 5 3 2 * + with a stack.",
      "Implement a queue using two stacks.",
      "**Challenge:** why is a circular buffer better than a simple array for a fixed-size queue?",
    ],
    notes: [
      "Stack: LIFO, push/pop O(1). Queue: FIFO, enqueue/dequeue O(1).",
      "Applications: call stack, undo, BFS, scheduling.",
      "Deque = double-ended queue; priority queue = heap.",
    ],
    example: "Infix → postfix for a+b*c: output a, push +, push *, output b, output c, pop *, pop + → a b c * +.",
    followUp: "Want to compare array vs linked implementations, or move on to trees and graphs?",
    sources: [
      { label: "GeeksforGeeks — Stack / Queue", url: "https://www.geeksforgeeks.org/stack-data-structure/" },
    ],
  },
  {
    id: "hash-tables",
    keywords: ["hash table", "hashing", "hash map", "hashmap", "dictionary", "collision", "hash function"],
    title: "Hash Tables",
    explain: [
      "A hash table maps **keys to values** using a hash function that turns a key into an array index, giving O(1) average lookup, insert and delete.",
      "**Collisions** happen when two keys hash to the same index. Handled with **chaining** (a linked list per bucket) or **open addressing** (probing to the next free slot).",
      "**Load factor** (items/buckets) drives performance; when it grows past a threshold (e.g. 0.75), the table is resized and rehashed.",
    ],
    simple:
      "A hash table is like a locker room where the locker number is computed from your name. Open your name's locker and your stuff is right there — instant. If two names map to the same locker, you chain lockers or try the next one.",
    exam: [
      "**Define.** A hash table stores key-value pairs and uses a hash function h(key) → index to locate a value in O(1) average time.",
      "**Good hash function.** Distributes keys uniformly, cheap to compute, deterministic.",
      "**Collision resolution.** Chaining (bucket = linked list) vs open addressing (linear/quadratic/double probing).",
      "**Complexities.** Average O(1) for search/insert/delete; worst case O(n) with many collisions.",
      "**Load factor** α = n/m; resizing keeps α bounded.",
    ],
    practice: [
      "Insert keys 12, 44, 13, 88, 23 into a table of size 10 using h(k)=k mod 10 with chaining.",
      "Same keys with linear probing — show every probe.",
      "Why should a hash function for strings consider character positions?",
      "**Challenge:** derive why load factor 0.75 is a common resize threshold.",
    ],
    notes: [
      "Average O(1) search/insert/delete.",
      "Chaining vs open addressing.",
      "Load factor + resizing/rehashing.",
      "Hash tables power hash maps, dictionaries, caches, sets.",
    ],
    example: "h(k)=k mod 7, insert 50,700,76 → 50→1, 700→0, 76→6, all distinct, no collision.",
    followUp: "Want to compare chaining vs open addressing, or see how hash maps are used in practice?",
    sources: [
      { label: "GeeksforGeeks — Hashing", url: "https://www.geeksforgeeks.org/hashing-data-structure/" },
    ],
  },
  {
    id: "heaps",
    keywords: ["heap", "priority queue", "heapify", "min heap", "max heap", "heap sort"],
    title: "Heaps & Priority Queues",
    explain: [
      "A **heap** is a complete binary tree where every node satisfies the heap property: in a **max-heap** each node ≥ its children; in a **min-heap** each node ≤ its children.",
      "Stored compactly in an **array**: children of index i are at 2i+1 and 2i+2, parent at ⌊(i−1)/2⌋.",
      "**Operations:** insert and extract-min/max are O(log n); find-min/max is O(1). Used to build **priority queues** and **heap sort** (O(n log n)).",
    ],
    simple:
      "A heap is a tree that keeps the biggest (or smallest) value at the top, and it's stored in a plain array. Adding an item or grabbing the top takes just a few swaps — about log n steps.",
    exam: [
      "**Define.** A binary heap is a complete binary tree with the heap property; a priority queue is usually implemented with a heap.",
      "**Array layout.** Children of i: 2i+1, 2i+2; parent: ⌊(i−1)/2⌋.",
      "**Operations.** Insert: O(log n) via up-heap; extract max/min: O(log n) via down-heap; peek: O(1).",
      "**Heap sort.** Build max-heap O(n) then extract n times O(n log n); in-place, not stable.",
      "**Applications.** Priority queues, Dijkstra/Prim (faster with heaps), task schedulers.",
    ],
    practice: [
      "Insert 3,1,6,5,2,4 into a min-heap and show the array after each insert.",
      "Show the array form of a max-heap and then extract the max twice.",
      "Build a heap from array [4,10,3,5,1] in O(n) using heapify.",
      "**Challenge:** prove that a complete binary tree of n nodes has height ⌊log₂n⌋.",
    ],
    notes: [
      "Max-heap: parent ≥ children. Min-heap: parent ≤ children.",
      "Array storage: children at 2i+1, 2i+2.",
      "Insert/extract O(log n); peek O(1); build O(n).",
      "Heap sort O(n log n), in-place, not stable.",
    ],
    example: "Min-heap insert sequence 3,1,6: [3] → [1,3] → [1,3,6] (1 bubbles to root).",
    followUp: "Want to compare heaps with BSTs, or implement a priority queue in code?",
    sources: [
      { label: "GeeksforGeeks — Heap", url: "https://www.geeksforgeeks.org/heap-data-structure/" },
    ],
  },
  {
    id: "binary-search",
    keywords: ["binary search", "binary searching", "divide and conquer search", "log n search"],
    title: "Binary Search",
    explain: [
      "Binary search finds an item in a **sorted** array by repeatedly halving the search range: compare the middle element, then continue in the left or right half.",
      "Each step halves the range, so it needs at most ⌊log₂n⌋+1 comparisons → **O(log n)** time and O(1) space (iterative).",
      "The sorted precondition is the key: on unsorted data it returns wrong answers.",
    ],
    simple:
      "Think of guessing a number between 1 and 100. Instead of 1,2,3… you guess 50, then 75 or 25 — each guess halves the possibilities. That's binary search.",
    exam: [
      "**Define.** Binary search is a search algorithm that, on a sorted array, compares the target with the middle element and discards half the array each iteration.",
      "**Algorithm.** low=0, high=n−1; mid=(low+high)/2; if a[mid]==target return; else if a[mid]<target low=mid+1 else high=mid−1; repeat until low>high.",
      "**Complexity.** O(log n) time, O(1) space (iterative); recursive uses O(log n) stack.",
      "**Precondition.** The array must be sorted.",
      "**Variants.** Lower bound / upper bound (first/last occurrence), search in rotated sorted array.",
    ],
    practice: [
      "Trace binary search for 7 in [1,3,5,7,9,11,13] — list every mid.",
      "Find the first occurrence of 4 in [1,2,4,4,4,5].",
      "Search in a rotated sorted array [4,5,6,7,0,1,2] for 0.",
      "**Challenge:** why must mid be computed as low + (high−low)/2, not (low+high)/2?",
    ],
    notes: [
      "Requires a sorted array.",
      "Halves the range each step → O(log n).",
      "Iterative version avoids recursion overhead.",
      "Used in tree search, DB indexes, debugging bisection.",
    ],
    example: "Search 7 in [1,3,5,7,9,11,13]: low=0,high=6,mid=3 → a[3]=7 ✓ found in 1 step.",
    followUp: "Want the code in C++/Python, or to cover the lower-bound/rotated variants?",
    sources: [
      { label: "GeeksforGeeks — Binary Search", url: "https://www.geeksforgeeks.org/binary-search/" },
    ],
  },
  {
    id: "sorting",
    keywords: ["sorting", "sort", "merge sort", "quick sort", "bubble sort", "insertion sort", "selection sort", "heap sort", "radix sort", "counting sort"],
    title: "Sorting Algorithms",
    explain: [
      "Sorting arranges elements in order; many algorithms exist with different trade-offs.",
      "**Comparison sorts:** bubble (O(n²)), insertion (O(n²), great on nearly-sorted data), selection (O(n²)), merge (O(n log n), stable, extra space), quick (O(n log n) average, in-place), heap (O(n log n), in-place, not stable).",
      "**Non-comparison sorts** beat O(n log n) using key properties: counting/radix sorts run in O(n + k).",
    ],
    simple:
      "Sorting just puts things in order. Slow-but-simple sorts like bubble sort compare neighbours again and again. Fast sorts like merge sort split the list in half, sort each half, then merge them back together in order.",
    exam: [
      "**Merge sort.** Divide into halves, sort recursively, merge → O(n log n) always, stable, requires O(n) extra space.",
      "**Quick sort.** Pick a pivot, partition around it, recurse → O(n log n) average, O(n²) worst (sorted input with bad pivot), in-place.",
      "**Stability** means equal elements keep their relative order — merge & insertion are stable; quick, heap, selection are not.",
      "**Complexity summary.** Best/average/worst per algorithm is a classic exam table.",
      "**Non-comparison.** Counting sort O(n+k) for small integer ranges; radix sort O(d·(n+k)).",
    ],
    practice: [
      "Trace merge sort on [38,27,43,3,9,82,10] step by step.",
      "Show the first partition of quick sort with pivot=last on [10,80,30,90,40,50,70].",
      "Which sort is stable: merge, quick, heap, selection?",
      "**Challenge:** why can't any comparison-based sort beat O(n log n) in the worst case?",
    ],
    notes: [
      "Merge: O(n log n), stable, O(n) space.",
      "Quick: O(n log n) avg, O(n²) worst, in-place.",
      "Heap: O(n log n), in-place, not stable.",
      "Bubble/selection/insertion: O(n²) — insertion best on nearly-sorted data.",
      "Counting/radix: O(n+k) for special inputs.",
    ],
    example: "Insertion sort on [5,2,4,6,1,3]: insert 2 before 5 → [2,5,4,6,1,3]; insert 4 → [2,4,5,6,1,3]; … final [1,2,3,4,5,6].",
    followUp: "Want a full comparison table, code for any of these, or a quiz?",
    sources: [
      { label: "GeeksforGeeks — Sorting algorithms", url: "https://www.geeksforgeeks.org/sorting-algorithms/" },
    ],
  },
  {
    id: "bfs-dfs",
    keywords: ["bfs", "dfs", "breadth first", "depth first", "graph traversal", "level order", "graph search"],
    title: "BFS & DFS (Graph Traversal)",
    explain: [
      "**DFS (Depth-First Search)** explores as far as possible along each branch before backtracking — implemented with a stack (or recursion).",
      "**BFS (Breadth-First Search)** explores level by level — implemented with a queue; it finds the **shortest path** in an unweighted graph.",
      "Both visit each vertex and edge once: **O(V + E)** time; O(V) space for the visited set.",
    ],
    simple:
      "DFS is like exploring a maze by always turning left until you hit a dead end, then backtracking. BFS is like ripples in a pond — you visit everything one step away first, then two steps, and so on.",
    exam: [
      "**DFS.** Uses a stack; order is pre-order/in-order/post-order for trees; good for connectivity, cycle detection, topological sort.",
      "**BFS.** Uses a queue; visits in level order; finds shortest path in unweighted graphs; good for connected components.",
      "**Complexity.** Both O(V + E) with adjacency lists; O(V²) with adjacency matrix.",
      "**Cycle detection.** DFS (back edge) or BFS (visited from different parent) on undirected graphs.",
      "**Applications.** BFS → shortest path, web crawling; DFS → topological sort, maze solving, detecting cycles.",
    ],
    practice: [
      "Write the BFS visit order of a given graph starting at vertex A.",
      "Write the DFS visit order with a stack (list push/pop steps).",
      "How does BFS find the shortest path in an unweighted graph?",
      "**Challenge:** detect a cycle in a directed graph using DFS colours (white/grey/black).",
    ],
    notes: [
      "DFS → stack/recursion; BFS → queue.",
      "Both O(V + E) time, O(V) space.",
      "BFS = shortest path (unweighted); DFS = topological sort, cycles.",
    ],
    example: "Graph A–B, A–C, B–D: BFS from A → A, B, C, D. DFS from A → A, B, D, C.",
    followUp: "Want code for both, or to move on to Dijkstra / shortest paths?",
    sources: [
      { label: "GeeksforGeeks — BFS / DFS", url: "https://www.geeksforgeeks.org/breadth-first-search-or-bfs-for-a-graph/" },
    ],
  },
  {
    id: "dijkstra",
    keywords: ["dijkstra", "shortest path", "single source shortest"],
    title: "Dijkstra's Algorithm",
    explain: [
      "Dijkstra's finds the **shortest path from one source** to all other vertices in a graph with **non-negative** edge weights.",
      "It's a **greedy** algorithm: repeatedly pick the unvisited vertex with the smallest known distance, relax its edges (if dist[u] + w < dist[v], update v).",
      "Complexity: O(V²) with a simple array, or **O((V+E) log V)** with a binary min-heap (priority queue).",
    ],
    simple:
      "Start at your source. Keep a running note of the cheapest known cost to every city. Always visit the city with the smallest note, then see if going through it makes any route cheaper. Repeat until all cities are visited.",
    exam: [
      "**Idea.** Maintain dist[] (initially ∞ except source=0) and a visited set; extract-min each step and relax edges.",
      "**Why greedy works.** Non-negative weights → once a vertex is extracted its distance is final.",
      "**Complexity.** Binary heap: O((V+E) log V); adjacency matrix: O(V²).",
      "**Limitation.** Fails with negative edge weights → use Bellman-Ford (O(VE)).",
      "**Applications.** GPS routing, network routing (OSPF), maps.",
    ],
    practice: [
      "Run Dijkstra on a 5-vertex weighted graph from a given source; show dist[] after each step.",
      "Why does Dijkstra fail on a graph with a negative-weight edge?",
      "Which data structure makes Dijkstra faster on sparse graphs?",
      "**Challenge:** prove that when a vertex is extracted, its distance is minimal.",
    ],
    notes: [
      "Single-source shortest paths, non-negative weights.",
      "Greedy: extract-min + relaxation.",
      "O((V+E) log V) with a heap.",
      "Negative weights → Bellman-Ford.",
    ],
    example: "Source A: dist[A]=0. Edge A→B(4), A→C(1), C→B(2). Visit C (dist1), relax B→3 via C, then visit B (dist3). Shortest A→B = 3.",
    followUp: "Want the priority-queue code, or to compare with Bellman-Ford and Floyd-Warshall?",
    sources: [
      { label: "GeeksforGeeks — Dijkstra", url: "https://www.geeksforgeeks.org/dijkstras-shortest-path-algorithm-greedy-algo-7/" },
    ],
  },
  {
    id: "java-inheritance",
    keywords: ["inheritance in java", "extends", "super keyword", "method overriding", "java inheritance"],
    title: "Inheritance in Java",
    explain: [
      "Inheritance lets a class **reuse** another class's fields and methods using `extends`. The subclass adds or overrides behaviour.",
      "`super()` calls the parent constructor; `super.method()` calls a parent method; `@Override` marks overridden methods.",
      "Java supports **single inheritance** between classes (one parent) but multiple interfaces; access modifiers (private, default, protected, public) control visibility.",
    ],
    simple:
      "Inheritance is like a child inheriting traits from a parent. A Dog class inherits from an Animal class — it already has eat() and sleep(), and adds bark().",
    exam: [
      "**Define.** Inheritance is an OOP mechanism where a subclass acquires the properties and behaviour of a parent (super) class.",
      "**Syntax.** `class Dog extends Animal { }`; use `super` to access the parent.",
      "**Single inheritance.** A class can extend only one class; multiple inheritance is simulated via interfaces.",
      "**Overriding vs overloading.** Overriding = redefining a parent method (same signature, runtime polymorphism); overloading = same name, different parameters.",
      "**Type compatibility.** A subclass IS-A parent → an Animal variable can hold a Dog (upcasting); dynamic dispatch calls the subclass method.",
    ],
    practice: [
      "Write a Java class hierarchy: Animal → Dog, Cat with overriding speak().",
      "What is printed if a subclass constructor doesn't call super() explicitly?",
      "Why can't Java have multiple class inheritance, and how do interfaces help?",
      "**Challenge:** explain how method resolution works with upcasting and overriding.",
    ],
    notes: [
      "extends for class inheritance; implements for interfaces.",
      "Single class inheritance; multiple via interfaces.",
      "super() must be the first statement in a constructor.",
      "Overriding = runtime polymorphism; overloading = compile-time.",
    ],
    example: "```java\nclass Animal { void speak() { System.out.println(\"...\"); } }\nclass Dog extends Animal { @Override void speak() { System.out.println(\"Woof\"); } }\n```",
    followUp: "Want to explore abstract classes vs interfaces, or polymorphism in depth?",
    sources: [
      { label: "Oracle — Inheritance tutorial", url: "https://docs.oracle.com/javase/tutorial/java/IandI/subclasses.html" },
    ],
  },
  {
    id: "cpp-pointers",
    keywords: ["pointer", "pointers", "segmentation fault", "segfault", "dereference", "memory address", "null pointer"],
    title: "Pointers in C/C++",
    explain: [
      "A pointer is a **variable that stores a memory address**. `int *p = &x;` stores the address of x; `*p` dereferences it to read/write the value.",
      "Pointer arithmetic: `p + 1` moves to the next element of the pointed type (e.g. next int). Arrays decay to pointers to their first element.",
      "**Common bugs:** dereferencing null, using a dangling pointer (freed memory), buffer overruns — these often cause a **segmentation fault**.",
    ],
    simple:
      "A pointer is just the address of a box in memory. Instead of handing a function the whole box, you hand it the address — cheap and lets the function change the box's contents directly.",
    exam: [
      "**Define.** A pointer stores the memory address of another variable; declaration `type *name`, dereference with `*`, address-of with `&`.",
      "**Pointer arithmetic.** p+i advances by i × sizeof(*p).",
      "**Arrays & pointers.** `arr[i]` ≡ `*(arr + i)`; arrays decay to pointers in function arguments.",
      "**Dynamic memory.** malloc/calloc (C) and new (C++) return pointers to heap memory; must be freed/delete'd.",
      "**Segfault causes.** Dereferencing NULL, dangling pointers, accessing freed/out-of-range memory.",
    ],
    practice: [
      "What does *(&x) print, and why?",
      "Write a C function that swaps two ints using pointers.",
      "Explain why this segfaults: int *p; *p = 10;",
      "**Challenge:** how does pointer arithmetic know the size of the pointed type?",
    ],
    notes: [
      "& = address-of, * = dereference.",
      "p+i advances by i*sizeof(*p).",
      "arr[i] == *(arr+i).",
      "NULL/dangling dereference → segmentation fault.",
      "Always free/new-delete match.",
    ],
    example: "```c\nint x = 7, *p = &x;\nprintf(\"%d\", *p); // 7\n*p = 9;           // x is now 9\n```",
    followUp: "Want to cover pointer arithmetic, function pointers, or debug a segfault?",
    sources: [
      { label: "cppreference — Pointers", url: "https://en.cppreference.com/w/c/language/pointer" },
    ],
  },
  {
    id: "sql-joins",
    keywords: ["sql join", "inner join", "left join", "right join", "outer join", "full join", "self join", "join"],
    title: "SQL JOINs",
    explain: [
      "JOINs combine rows from two tables based on a related column. **INNER JOIN** keeps only matching rows; **LEFT JOIN** keeps all left rows plus matches; **RIGHT** and **FULL OUTER** are the mirrors.",
      "Join condition usually compares a foreign key to a primary key: `ON orders.customer_id = customers.id`.",
      "Join behaviour is easiest to visualise with sets/Venn diagrams.",
    ],
    simple:
      "A JOIN is how you glue two tables together using a shared column. INNER keeps only rows that match in both; LEFT keeps every row of the left table and fills gaps with NULL.",
    exam: [
      "**INNER JOIN.** Returns rows where the join condition matches in both tables.",
      "**LEFT (OUTER) JOIN.** All rows from the left table; unmatched right columns become NULL.",
      "**RIGHT / FULL OUTER JOIN.** Mirrors of the above; FULL keeps everything.",
      "**SELF JOIN.** Joining a table to itself, e.g. employees with their manager.",
      "**Cross join** = Cartesian product (every pair); usually avoided.",
    ],
    practice: [
      "Given customers & orders tables, list customers with no orders using a LEFT JOIN.",
      "Write the query for employees and their manager with a self join.",
      "What's the difference between INNER and FULL OUTER when every left row matches?",
      "**Challenge:** why does a LEFT JOIN followed by WHERE on the right table sometimes behave like INNER?",
    ],
    notes: [
      "INNER: matching rows only.",
      "LEFT/RIGHT: keep one side fully, NULL elsewhere.",
      "FULL OUTER: keep both sides.",
      "Self join joins a table to itself.",
      "Filtering on the right table in WHERE can nullify outer-join behaviour.",
    ],
    example: "```sql\nSELECT c.name, o.amount\nFROM customers c\nLEFT JOIN orders o ON o.customer_id = c.id;\n```",
    followUp: "Want a deep dive on GROUP BY + HAVING, subqueries, or index-based join performance?",
    sources: [
      { label: "PostgreSQL — JOIN documentation", url: "https://www.postgresql.org/docs/current/tutorial-join.html" },
    ],
  },
  {
    id: "os-process-thread",
    keywords: ["process", "thread", "process vs thread", "multithreading", "context switch", "thread vs process"],
    title: "Processes vs Threads",
    explain: [
      "A **process** is an executing program with its own memory space, registers and resources. A **thread** is a lightweight unit of execution **within** a process; threads of one process share its memory.",
      "Context switching between processes is expensive (must swap memory maps); between threads it's cheaper since memory is shared.",
      "Threads communicate easily via shared memory but need **synchronisation** (locks/semaphores) to avoid race conditions.",
    ],
    simple:
      "A process is like a separate house with its own rooms. Threads are the people inside one house sharing those rooms. Sharing a house (memory) is fast, but you need rules so two people don't use the same room at once.",
    exam: [
      "**Process.** A program in execution; owns code, data, heap, stack, PCB, and resources; isolated from other processes.",
      "**Thread.** A unit of execution within a process; shares code, data, heap with sibling threads but has its own stack and registers.",
      "**Context switch.** Process switch involves switching memory (expensive); thread switch is lighter.",
      "**Benefits of threads.** Faster creation, cheaper context switch, easy shared-memory communication.",
      "**Costs.** Synchronisation overhead; a crash in one thread can crash the whole process.",
    ],
    practice: [
      "List four differences between a process and a thread.",
      "Why is thread creation cheaper than process creation?",
      "What data does each thread own vs share?",
      "**Challenge:** how do processes communicate if they don't share memory?",
    ],
    notes: [
      "Process = own address space; thread = shares with process.",
      "Threads: own stack + registers, shared heap/code.",
      "Thread switch cheaper than process switch.",
      "Shared memory needs synchronisation.",
      "IPC: pipes, sockets, shared memory, message queues.",
    ],
    example: "Web server: one process, many threads each handling a connection — all share the server's config and cache (heap), each keeps its own request stack.",
    followUp: "Want to cover scheduling, or the classic '100 processes vs 1000 threads' interview question?",
    sources: [
      { label: "GeeksforGeeks — Process vs Thread", url: "https://www.geeksforgeeks.org/difference-between-process-and-thread/" },
    ],
  },
  {
    id: "os-deadlock",
    keywords: ["deadlock", "deadlock avoidance", "banker's algorithm", "mutual exclusion", "hold and wait", "circular wait"],
    title: "Deadlock (Operating Systems)",
    explain: [
      "**Deadlock** is when a set of processes is blocked forever because each holds a resource another needs — a circular wait.",
      "Four necessary conditions: **mutual exclusion**, **hold and wait**, **no preemption**, and **circular wait**.",
      "Handling: **prevention** (break a condition), **avoidance** (Banker's algorithm checks safe states), **detection & recovery** (detect cycle, kill/rollback).",
    ],
    simple:
      "Deadlock is when two people each need the other's tool. Alice has a hammer and needs a screwdriver; Bob has the screwdriver and needs a hammer. Neither lets go — nothing gets done.",
    exam: [
      "**Define.** A set of processes is deadlocked if every process is waiting for a resource held by another process in the set.",
      "**Four conditions.** Mutual exclusion, hold-and-wait, no preemption, circular wait — all four must hold.",
      "**Prevention.** Break any one condition (e.g. request all resources up-front, or allow preemption).",
      "**Avoidance.** Banker's algorithm — grant a request only if the resulting state is safe.",
      "**Detection.** Resource allocation graph; a cycle indicates deadlock (with single-instance resources).",
    ],
    practice: [
      "Name the four necessary conditions and one prevention for each.",
      "Given an RAG with processes P1..P3 and resources R1..R3, is there a deadlock?",
      "Walk through the Banker's algorithm safe-state check.",
      "**Challenge:** why is a cycle necessary but not sufficient in a multi-instance resource system?",
    ],
    notes: [
      "4 conditions: mutual exclusion, hold & wait, no preemption, circular wait.",
      "Prevention vs avoidance (Banker's) vs detection & recovery.",
      "RAG cycle = deadlock (single-instance).",
      "Starvation ≠ deadlock — starvation is indefinite postponement.",
    ],
    example: "Two processes P1 (holds R1, wants R2) and P2 (holds R2, wants R1) form a cycle → deadlock.",
    followUp: "Want to work through a Banker's algorithm example, or the dining philosophers problem?",
    sources: [
      { label: "GeeksforGeeks — Deadlock", url: "https://www.geeksforgeeks.org/deadlock-in-operating-system/" },
    ],
  },
  {
    id: "networks-osi",
    keywords: ["osi model", "osi layers", "physical layer", "transport layer", "network layer", "application layer", "7 layers", "protocol stack"],
    title: "The OSI Model",
    explain: [
      "The OSI model splits networking into **7 layers**: Physical, Data Link, Network, Transport, Session, Presentation, Application.",
      "Each layer has a clear job: L1 moves bits, L2 frames between neighbours, L3 routes packets (IP), L4 delivers reliably (TCP), L5-7 handle sessions, encoding and applications (HTTP).",
      "Data flows **down** the stack at the sender (each layer adds a header) and **up** at the receiver (headers stripped) — think of Russian dolls.",
    ],
    simple:
      "The OSI model is a checklist of the 7 jobs needed to send data: plug in a cable, put it into frames, route it across the internet, deliver it reliably, and finally hand it to the app. Each layer only worries about its own job.",
    exam: [
      "**The 7 layers (top→bottom).** Application, Presentation, Session, Transport, Network, Data Link, Physical — mnemonics: 'Please Do Not Throw Sausage Pizza Away'.",
      "**Layer duties.** Physical (bits), Data Link (frames, MAC), Network (packets, IP, routing), Transport (segments, TCP/UDP, port numbers), Session (dialog control), Presentation (encoding/compression), Application (HTTP, DNS, SMTP).",
      "**Encapsulation.** Each layer adds a header to the payload; the receiver strips them in reverse.",
      "**vs TCP/IP model.** 4 layers: Application, Transport, Internet, Network Access (or Link).",
      "**Devices per layer.** Hub (L1), Switch (L2), Router (L3), Firewall/gateway (higher).",
    ],
    practice: [
      "Name all 7 layers and one protocol/device for each.",
      "What header/name is data called at each layer (bits, frame, packet, segment)?",
      "Compare OSI and TCP/IP models.",
      "**Challenge:** at which layer would encryption typically happen, and why does that choice matter?",
    ],
    notes: [
      "7 layers: P-D-N-T-S-P-A.",
      "Data names: bits, frame, packet, segment.",
      "TCP/IP: 4 layers (App, Transport, Internet, Link).",
      "Encapsulation = add header per layer.",
    ],
    example: "Sending 'hi': Application (HTTP) → Transport (TCP segment) → Network (IP packet) → Data Link (Ethernet frame) → Physical (bits) → wire → reverse on the other side.",
    followUp: "Want to map protocols to layers, or compare with the TCP/IP model in depth?",
    sources: [
      { label: "Cloudflare — OSI model", url: "https://www.cloudflare.com/learning/ddos/glossary/open-systems-interconnection-model-osi/" },
    ],
  },
  {
    id: "oop-pillars",
    keywords: ["four pillars", "oop concepts", "encapsulation", "abstraction", "polymorphism", "oops"],
    title: "The Four Pillars of OOP",
    explain: [
      "OOP rests on four pillars: **Encapsulation** (bundle data + methods, hide internals), **Abstraction** (expose only what's needed), **Inheritance** (reuse via parent classes), and **Polymorphism** (one interface, many forms).",
      "Encapsulation is implemented with private fields + getters/setters; abstraction with abstract classes/interfaces.",
      "Polymorphism appears as overloading (compile-time) and overriding (runtime).",
    ],
    simple:
      "Encapsulation: keep your secrets behind getters/setters. Abstraction: the car's pedals, not the engine. Inheritance: children get parent's traits. Polymorphism: the same \"speak()\" button makes a dog bark and a cat meow.",
    exam: [
      "**Encapsulation.** Data + methods bound together; access modifiers hide state; getters/setters control access.",
      "**Abstraction.** Show essential features, hide implementation; achieved via abstract classes and interfaces.",
      "**Inheritance.** Reuse of parent behaviour; single vs multiple (via interfaces).",
      "**Polymorphism.** Compile-time (overloading) and runtime (overriding with virtual methods / dynamic dispatch).",
      "**Relationship.** Inheritance supports polymorphism; encapsulation supports both.",
    ],
    practice: [
      "Give one real-world example of each pillar.",
      "How do interfaces support abstraction better than concrete classes?",
      "What's the difference between overloading and overriding?",
      "**Challenge:** how does the 'open/closed principle' relate to polymorphism?",
    ],
    notes: [
      "4 pillars: Encapsulation, Abstraction, Inheritance, Polymorphism.",
      "private + getters/setters → encapsulation.",
      "abstract class / interface → abstraction.",
      "Overload (compile-time) vs override (runtime).",
    ],
    example: "Encapsulation: class BankAccount { private double balance; public void deposit(double amt) { ... } }",
    followUp: "Want to apply these pillars in Java, C++ or Python, or cover SOLID principles?",
    sources: [
      { label: "Oracle — Object-Oriented Programming Concepts", url: "https://docs.oracle.com/javase/tutorial/java/concepts/" },
    ],
  },
  {
    id: "react-hooks",
    keywords: ["hooks", "usestate", "useeffect", "custom hook", "react hooks"],
    title: "React Hooks",
    explain: [
      "Hooks let function components use state and lifecycle features. **useState** adds state; **useEffect** runs side effects (fetch, timers) after render.",
      "Rules of hooks: only call hooks **at the top level** (never in loops/conditions) and only from React functions.",
      "useEffect deps array controls when the effect re-runs: [] = once, [value] = when value changes, omitted = every render.",
    ],
    simple:
      "useState gives your component a memory slot that re-renders when changed. useEffect is a 'do this after painting' hook — like fetching data when the page loads. Keep their order fixed and they behave predictably.",
    exam: [
      "**useState.** const [count, setCount] = useState(0); returns [value, setter]; re-renders the component on change.",
      "**useEffect.** Runs after render; takes (callback, deps). Cleanup function runs on unmount / before next effect.",
      "**Rules.** Top-level only, no conditions/loops — React relies on consistent hook order.",
      "**Other hooks.** useContext (context), useReducer (complex state), useMemo/useCallback (perf), useRef (mutable refs).",
      "**Custom hooks** encapsulate reusable logic; names start with 'use'.",
    ],
    practice: [
      "Write a counter with useState + a button.",
      "Fetch data in useEffect with a loading state and cleanup for unmount.",
      "Why does a useEffect with [] sometimes show stale state?",
      "**Challenge:** when would you choose useReducer over useState?",
    ],
    notes: [
      "useState: [state, setter]; triggers re-render.",
      "useEffect: side effects + cleanup; deps array controls runs.",
      "Rules: top-level only, React functions only.",
      "useMemo/useCallback/useRef/useReducer/useContext.",
    ],
    example: "```jsx\nconst [count, setCount] = useState(0);\nuseEffect(() => { document.title = count; }, [count]);\n```",
    followUp: "Want to cover useEffect dependency pitfalls, custom hooks, or context vs props?",
    sources: [
      { label: "React — Hooks reference", url: "https://react.dev/reference/react" },
    ],
  },
  {
    id: "python-basics",
    keywords: ["python function", "python loop", "python list", "python dictionary", "python syntax", "python basics", "indentation", "python program"],
    title: "Python Basics",
    explain: [
      "Python is interpreted and dynamically typed — no type declarations needed. Blocks are defined by **indentation**, not braces.",
      "Core types: int, float, str, bool, list, tuple, dict, set. Lists are ordered and mutable; tuples immutable; dicts map keys to values.",
      "Control flow: if/elif/else, for (iterate), while. Functions defined with `def`, may return multiple values as a tuple.",
    ],
    simple:
      "Python is the friendliest language to start with: you just write what you mean and the indentation (spaces) tells the computer where blocks begin and end.",
    exam: [
      "**Syntax.** Indentation defines blocks; `#` comments; no semicolons or braces required.",
      "**Types.** Dynamic typing; `type(x)` reveals the type; strings immutable; lists mutable.",
      "**Collections.** list [ ], tuple ( ), dict {key:value}, set { } — know when to use each.",
      "**Functions.** def name(params): body; default args, *args/**kwargs; returns a tuple when multiple values.",
      "**Common built-ins.** len(), range(), enumerate(), zip(), map(), sorted().",
    ],
    practice: [
      "Write a function that returns the second largest number in a list.",
      "Explain the difference between a list, tuple and set.",
      "What does this do: {k: v for k, v in zip(keys, vals)}?",
      "**Challenge:** why is 'a' * 3 valid but 'a' - 1 not?",
    ],
    notes: [
      "Indentation = blocks; dynamic typing.",
      "list/tuple/dict/set — pick by mutability & lookup.",
      "def for functions; len/range/enumerate built-ins.",
      "List/dict comprehensions are exam favourites.",
    ],
    example: "```python\ndef square(x):\n    return x * x\n\nprint(square(5))  # 25\n```",
    followUp: "Want to go deeper into comprehensions, OOP in Python, or common Python mistakes?",
    sources: [
      { label: "Python — tutorial", url: "https://docs.python.org/3/tutorial/" },
    ],
  },
  {
    id: "js-closures",
    keywords: ["closure", "closures", "lexical scope", "function in function", "hoisting", "event loop"],
    title: "Closures in JavaScript",
    explain: [
      "A **closure** is a function that remembers the variables from the scope where it was created, even after that scope has finished running.",
      "Closures power callbacks, event handlers, module patterns and **data privacy** (private variables via factories).",
      "**Classic pitfall:** closures in a loop capture the same loop variable — fix with `let` or an IIFE/extra parameter.",
    ],
    simple:
      "A closure is a backpack: when a function is created, it packs the variables it could see, and keeps them even after you leave the room.",
    exam: [
      "**Define.** A closure is formed when an inner function references variables from an outer function's scope after the outer function has returned.",
      "**How it works.** Lexical scoping + a reference to the creation context.",
      "**Uses.** Private state, memoization, function factories, module pattern.",
      "**Loop pitfall.** var captures the shared loop variable; let creates a fresh binding per iteration.",
      "**Memory.** Closures keep referenced objects alive — misuse can leak memory.",
    ],
    practice: [
      "Create a counter factory using closures and explain how count is private.",
      "What does an array of for-loop callbacks print with var vs let?",
      "Write a memoize() using a closure.",
      "**Challenge:** explain the closure created by an event listener and how to remove it.",
    ],
    notes: [
      "Inner function + outer scope reference = closure.",
      "Keeps state private (factory pattern).",
      "Loop + var pitfall; use let.",
      "Memory leak risk if closures outlive their purpose.",
    ],
    example: "```js\nfunction makeCounter() {\n  let n = 0;\n  return () => ++n;\n}\nconst c = makeCounter();\nconsole.log(c(), c(), c()); // 1 2 3\n```",
    followUp: "Want to cover the event loop, hoisting, or arrow-function vs function scope?",
    sources: [
      { label: "MDN — Closures", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures" },
    ],
  },
];

// ------------------------------------------------------------------
// Layer 2a — Algorithm complexity table (curated, factual).
// Used by the generator whenever the detected topic is an algorithm.
// ------------------------------------------------------------------

export interface AlgorithmFacts {
  time: string;
  space: string;
  best?: string;
  worst?: string;
}

export const algorithmComplexity: Record<string, AlgorithmFacts> = {
  "linear search": { time: "O(n)", space: "O(1)", best: "O(1)", worst: "O(n)" },
  "binary search": { time: "O(log n)", space: "O(1) iterative", worst: "O(log n)" },
  "bubble sort": { time: "O(n²)", space: "O(1)", best: "O(n)", worst: "O(n²)" },
  "insertion sort": { time: "O(n²)", space: "O(1)", best: "O(n)", worst: "O(n²)" },
  "selection sort": { time: "O(n²)", space: "O(1)", worst: "O(n²)" },
  "merge sort": { time: "O(n log n)", space: "O(n)", worst: "O(n log n)" },
  "quick sort": { time: "O(n log n)", space: "O(log n)", best: "O(n log n)", worst: "O(n²)" },
  "heap sort": { time: "O(n log n)", space: "O(1)", worst: "O(n log n)" },
  "counting sort": { time: "O(n + k)", space: "O(k)", worst: "O(n + k)" },
  "radix sort": { time: "O(d·(n+k))", space: "O(n+k)", worst: "O(d·(n+k))" },
  "bucket sort": { time: "O(n)", space: "O(n)", worst: "O(n²)" },
  "bfs": { time: "O(V + E)", space: "O(V)" },
  "dfs": { time: "O(V + E)", space: "O(V)" },
  "breadth first search": { time: "O(V + E)", space: "O(V)" },
  "depth first search": { time: "O(V + E)", space: "O(V)" },
  "dijkstra": { time: "O((V+E) log V)", space: "O(V)", worst: "O((V+E) log V)" },
  "bellman ford": { time: "O(V·E)", space: "O(V)", worst: "O(V·E)" },
  "floyd warshall": { time: "O(V³)", space: "O(V²)", worst: "O(V³)" },
  "prim's": { time: "O(E log V)", space: "O(V)", worst: "O(E log V)" },
  "kruskal's": { time: "O(E log E)", space: "O(V)", worst: "O(E log E)" },
  "topological sort": { time: "O(V + E)", space: "O(V)" },
  "n queens / backtracking": { time: "O(n!)", space: "O(n)" },
  "knapsack": { time: "O(n·W)", space: "O(W)" },
  "fibonacci (memoized)": { time: "O(n)", space: "O(n)" },
  "fibonacci (recursive)": { time: "O(2ⁿ)", space: "O(n)" },
  "matrix chain multiplication": { time: "O(n³)", space: "O(n²)" },
  "lcs": { time: "O(m·n)", space: "O(m·n)" },
  "longest common subsequence": { time: "O(m·n)", space: "O(m·n)" },
  "edit distance": { time: "O(m·n)", space: "O(m·n)" },
  "kmp": { time: "O(n + m)", space: "O(m)" },
  "rabin karp": { time: "O(n + m) avg", space: "O(1)", worst: "O(n·m)" },
  "trie": { time: "O(L) insert/search", space: "O(ALPHABET·nodes)" },
  "avl": { time: "O(log n)", space: "O(n)" },
  "red black tree": { time: "O(log n)", space: "O(n)" },
  "binary search tree": { time: "O(log n) avg", space: "O(n)", worst: "O(n)" },
  "heap": { time: "O(log n) push/pop", space: "O(n)" },
  "hash table": { time: "O(1) avg", space: "O(n)", worst: "O(n)" },
  "union find": { time: "O(α(n))", space: "O(n)" },
  "disjoint set": { time: "O(α(n))", space: "O(n)" },
  "quick select": { time: "O(n) avg", space: "O(1)", worst: "O(n²)" },
};

// ------------------------------------------------------------------
// Layer 2b — Code snippets keyed by topic + language (curated).
// ------------------------------------------------------------------

export const codeSnippets: Record<string, { lang: string; code: string }> = {
  "binary search": {
    lang: "python",
    code: "def binary_search(a, target):\n    lo, hi = 0, len(a) - 1\n    while lo <= hi:\n        mid = (lo + hi) // 2\n        if a[mid] == target:\n            return mid\n        elif a[mid] < target:\n            lo = mid + 1\n        else:\n            hi = mid - 1\n    return -1",
  },
  "merge sort": {
    lang: "python",
    code: "def merge_sort(a):\n    if len(a) <= 1:\n        return a\n    mid = len(a) // 2\n    left = merge_sort(a[:mid])\n    right = merge_sort(a[mid:])\n    return merge(left, right)\n\ndef merge(l, r):\n    out, i, j = [], 0, 0\n    while i < len(l) and j < len(r):\n        if l[i] <= r[j]:\n            out.append(l[i]); i += 1\n        else:\n            out.append(r[j]); j += 1\n    return out + l[i:] + r[j:]",
  },
  "quick sort": {
    lang: "python",
    code: "def quick_sort(a):\n    if len(a) <= 1:\n        return a\n    pivot = a[-1]\n    left = [x for x in a[:-1] if x <= pivot]\n    right = [x for x in a[:-1] if x > pivot]\n    return quick_sort(left) + [pivot] + quick_sort(right)",
  },
  "bfs": {
    lang: "python",
    code: "from collections import deque\n\ndef bfs(graph, start):\n    seen = {start}\n    q = deque([start])\n    order = []\n    while q:\n        node = q.popleft()\n        order.append(node)\n        for nxt in graph[node]:\n            if nxt not in seen:\n                seen.add(nxt)\n                q.append(nxt)\n    return order",
  },
  "dfs": {
    lang: "python",
    code: "def dfs(graph, node, seen=None, order=None):\n    if seen is None:\n        seen, order = set(), []\n    seen.add(node)\n    order.append(node)\n    for nxt in graph[node]:\n        if nxt not in seen:\n            dfs(graph, nxt, seen, order)\n    return order",
  },
  "dijkstra": {
    lang: "python",
    code: "import heapq\n\ndef dijkstra(graph, start):\n    dist = {v: float('inf') for v in graph}\n    dist[start] = 0\n    pq = [(0, start)]\n    while pq:\n        d, u = heapq.heappop(pq)\n        if d > dist[u]:\n            continue\n        for v, w in graph[u]:\n            nd = d + w\n            if nd < dist[v]:\n                dist[v] = nd\n                heapq.heappush(pq, (nd, v))\n    return dist",
  },
  "fibonacci": {
    lang: "python",
    code: "def fib(n, memo={}):\n    if n <= 1:\n        return n\n    if n not in memo:\n        memo[n] = fib(n - 1) + fib(n - 2)\n    return memo[n]",
  },
};

// ------------------------------------------------------------------
// Layer 2c — Interview / viva question banks per subject id.
// ------------------------------------------------------------------

export const interviewQuestions: Record<string, string[]> = {
  dsa: [
    "What's the difference between an array and a linked list? When do you pick each?",
    "How would you reverse a linked list iteratively?",
    "What is the difference between a stack and a queue? Give a real use of each.",
    "How does a hash table resolve collisions, and what is its average lookup time?",
    "Explain the difference between a heap and a binary search tree.",
    "What's the time complexity of BFS vs DFS, and when would you prefer each?",
    "Why is merge sort stable but quick sort isn't?",
    "Explain Dijkstra's algorithm and why it fails with negative weights.",
  ],
  algorithms: [
    "Describe the four algorithm design paradigms with one example each.",
    "When would you choose quick sort over merge sort?",
    "Explain the difference between best, average and worst-case complexity.",
    "How does binary search work and what precondition does it need?",
    "What is dynamic programming and how does it differ from divide & conquer?",
    "Explain greedy choice vs optimal substructure.",
    "What is NP-completeness in simple terms?",
    "How would you find the k-th largest element efficiently?",
  ],
  daa: [
    "Solve T(n) = 2T(n/2) + n using the Master theorem.",
    "Prove that f(n) = 5n² + 3n is Θ(n²).",
    "Difference between divide & conquer and dynamic programming.",
    "Explain amortised analysis with an example (e.g. dynamic array).",
    "Why can't comparison-based sorting beat O(n log n)?",
    "Define P, NP, NP-hard and NP-complete.",
    "What is the optimal substructure property? Give an example.",
    "Compare greedy vs DP with the knapsack problem.",
  ],
  dbms: [
    "Explain the ACID properties with examples.",
    "What is normalization and why do we do it? Explain 1NF, 2NF, 3NF.",
    "What's the difference between a primary key and a foreign key?",
    "Explain the difference between DELETE, TRUNCATE and DROP.",
    "What are the different types of joins in SQL?",
    "How does indexing speed up queries, and what's a B+ tree?",
    "What is a deadlock in a database and how is it resolved?",
    "What is the difference between a view and a table?",
  ],
  sql: [
    "Write a query to find duplicate emails in a users table.",
    "What's the difference between WHERE and HAVING?",
    "Explain INNER, LEFT and FULL OUTER joins with examples.",
    "How would you find the second-highest salary in a table?",
    "What is a subquery and when is a JOIN better?",
    "Explain GROUP BY with aggregate functions.",
    "What is the difference between UNION and UNION ALL?",
    "How do indexes affect INSERT performance?",
  ],
  os: [
    "What is the difference between a process and a thread?",
    "Explain the four conditions for deadlock.",
    "Describe the difference between preemptive and non-preemptive scheduling.",
    "What is paging and how does it differ from segmentation?",
    "Explain virtual memory and demand paging.",
    "What are the common CPU scheduling algorithms?",
    "What is a semaphore? Explain binary vs counting semaphores.",
    "What is a system call and give three examples.",
  ],
  cn: [
    "Explain the OSI and TCP/IP models and how they map to each other.",
    "What is the difference between TCP and UDP?",
    "How does TCP handle congestion control?",
    "Explain IP addressing and subnetting.",
    "What happens when you type a URL in a browser?",
    "What is the difference between a hub, switch and router?",
    "Explain DNS resolution step by step.",
    "What is a routing algorithm? Compare distance-vector and link-state.",
  ],
  coa: [
    "Explain the instruction cycle (fetch-decode-execute).",
    "What are the different addressing modes?",
    "Explain pipelining and its hazards.",
    "What is cache memory and how does locality help?",
    "Compare RISC and CISC.",
    "Explain the difference between SRAM and DRAM.",
    "What is virtual memory from a hardware perspective?",
    "Explain the concept of a bus and its types.",
  ],
  toc: [
    "What is the difference between DFA and NFA?",
    "State the pumping lemma for regular languages.",
    "What is a Turing machine and what are its components?",
    "Explain the Chomsky hierarchy.",
    "What is the difference between a regular and a context-free language?",
    "What does it mean for a problem to be undecidable?",
    "Explain the halting problem.",
    "How do you convert an NFA to a DFA?",
  ],
  "compiler-design": [
    "List the phases of a compiler.",
    "What is the difference between a token, lexeme and pattern?",
    "Explain top-down vs bottom-up parsing.",
    "What is the difference between LL(1) and LR parsing?",
    "What is an intermediate code representation?",
    "Explain common code optimisations.",
    "What is a symbol table and what does it store?",
    "Explain operator precedence parsing.",
  ],
  oop: [
    "What are the four pillars of OOP? Explain each.",
    "Difference between overloading and overriding.",
    "What is the difference between an abstract class and an interface?",
    "Explain encapsulation and give an example.",
    "What is polymorphism and how is it achieved?",
    "What is composition and why prefer it over inheritance?",
    "Explain constructor chaining and the super keyword.",
    "What are the SOLID principles?",
  ],
  java: [
    "Why is Java called platform-independent?",
    "Explain the Java memory model: stack vs heap.",
    "What is the difference between String, StringBuilder and StringBuffer?",
    "How does garbage collection work in Java?",
    "Difference between ArrayList and LinkedList in Java.",
    "Explain checked vs unchecked exceptions.",
    "What is the difference between == and equals()?",
    "How do you create a thread? Compare Thread and Runnable.",
  ],
  cpp: [
    "What is the difference between a pointer and a reference?",
    "Explain RAII.",
    "What are the different types of inheritance?",
    "What is a virtual function and why is it used?",
    "Explain the difference between stack and heap allocation in C++.",
    "What are templates and how are they different from macros?",
    "Explain move semantics and std::move.",
    "What is the rule of three / five?",
  ],
  c: [
    "Explain the difference between calloc and malloc.",
    "What is a pointer to a function?",
    "Explain the difference between arrays and pointers.",
    "What are the storage classes in C?",
    "How does the stack vs heap work in C?",
    "What is a segmentation fault?",
    "Explain recursion with an example in C.",
    "What is the difference between ++i and i++?",
  ],
  python: [
    "What is the difference between a list and a tuple?",
    "Explain Python's GIL.",
    "What are decorators and how do they work?",
    "Explain the difference between deep copy and shallow copy.",
    "What are generators and when would you use them?",
    "How does Python handle memory?",
    "What is the difference between __str__ and __repr__?",
    "Explain lambda functions.",
  ],
  "webdev": [
    "What is the difference between GET and POST?",
    "Explain the client-server model.",
    "What is a REST API?",
    "How do cookies and sessions work?",
    "What is CORS and why does it exist?",
    "Explain HTTP status code classes.",
    "What is the difference between SQL and NoSQL?",
    "How would you secure a web app?",
  ],
  react: [
    "What is the virtual DOM and how does React use it?",
    "Explain the component lifecycle.",
    "What are the rules of hooks?",
    "Difference between state and props.",
    "What is reconciliation and keys?",
    "Explain controlled vs uncontrolled components.",
    "What is lifting state up?",
    "How do you optimise React performance?",
  ],
  "system-design": [
    "How would you design a URL shortener?",
    "Explain the CAP theorem.",
    "How do you scale a read-heavy system?",
    "What is a load balancer and what strategies exist?",
    "Explain caching strategies and cache invalidation.",
    "What is sharding and when would you use it?",
    "How do message queues help decouple systems?",
    "Design a chat application end to end.",
  ],
  ml: [
    "Explain supervised vs unsupervised learning.",
    "What is overfitting and how do you prevent it?",
    "Explain the bias-variance trade-off.",
    "What is cross-validation?",
    "How does K-means work and what are its limitations?",
    "What is gradient descent?",
    "Explain precision vs recall.",
    "What is the difference between bagging and boosting?",
  ],
  security: [
    "Explain the CIA triad.",
    "What are the OWASP Top 10 and give examples?",
    "Explain symmetric vs asymmetric encryption.",
    "What is SQL injection and how do you prevent it?",
    "Explain XSS and its types.",
    "What is a man-in-the-middle attack?",
    "Explain the difference between authentication and authorization.",
    "What is a zero-day vulnerability?",
  ],
  "distributed": [
    "Explain the CAP theorem.",
    "What is eventual consistency?",
    "Explain the two-phase commit protocol.",
    "What is the difference between vertical and horizontal scaling?",
    "Explain how Raft achieves consensus.",
    "What is the difference between message queues and pub/sub?",
    "How do you handle clock synchronisation in distributed systems?",
    "Explain consistent hashing.",
  ],
};

// ------------------------------------------------------------------
// Layer 2d — MCQ bank per subject id (curated, with explanations).
// ------------------------------------------------------------------

export interface Mcq {
  q: string;
  options: string[];
  answer: number;
  why: string;
}

export const mcqBank: Record<string, Mcq[]> = {
  dsa: [
    { q: "What is the worst-case time complexity of searching an unsorted array of size n?", options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"], answer: 2, why: "With no ordering to exploit, you may have to inspect every element." },
    { q: "Which data structure gives O(1) insertion and deletion at both ends?", options: ["Array", "Deque", "Binary tree", "Graph"], answer: 1, why: "A deque (double-ended queue) supports push/pop at both ends in O(1)." },
    { q: "A stack is used to convert:", options: ["Infix to postfix", "Encrypt data", "Sort a graph", "Hash a key"], answer: 0, why: "Operator precedence in infix-to-postfix conversion is managed with a stack." },
    { q: "What is the average time complexity of hash table lookup?", options: ["O(n)", "O(log n)", "O(1)", "O(n²)"], answer: 2, why: "A good hash function spreads keys evenly, giving O(1) average lookup." },
    { q: "Which traversal visits a binary tree level by level?", options: ["Pre-order", "In-order", "Post-order", "Level-order (BFS)"], answer: 3, why: "Level-order uses a queue and visits nodes by depth — that is BFS." },
  ],
  algorithms: [
    { q: "Binary search requires the array to be:", options: ["Unsorted", "Sorted", "Of even length", "Composed of distinct primes"], answer: 1, why: "The halving strategy only works when ordering is known." },
    { q: "The worst-case time complexity of merge sort is:", options: ["O(n)", "O(n²)", "O(n log n)", "O(log n)"], answer: 2, why: "Merge sort always divides in half and merges in linear time." },
    { q: "Which algorithm is an example of the greedy paradigm?", options: ["Kruskal's MST", "Merge sort", "Binary search", "Matrix chain"], answer: 0, why: "Kruskal repeatedly picks the cheapest safe edge — a greedy choice." },
    { q: "Dijkstra's algorithm finds:", options: ["All-pairs shortest paths", "Single-source shortest paths (non-negative weights)", "The longest path", "Minimum spanning tree"], answer: 1, why: "Dijkstra solves single-source shortest paths but requires non-negative edges." },
    { q: "Dynamic programming requires:", options: ["Optimal substructure only", "Overlapping subproblems only", "Both", "Neither"], answer: 2, why: "DP needs overlapping subproblems plus optimal substructure to reuse results." },
  ],
  dbms: [
    { q: "Which normal form removes partial dependency?", options: ["1NF", "2NF", "3NF", "BCNF"], answer: 1, why: "2NF removes partial dependencies (non-key → part of key)." },
    { q: "Which property ensures that a transaction is atomic?", options: ["Consistency", "Isolation", "Durability", "Atomicity"], answer: 3, why: "Atomicity means all-or-nothing execution of a transaction." },
    { q: "Which SQL statement removes all rows but keeps the table?", options: ["DROP", "TRUNCATE", "DELETE without WHERE", "Both TRUNCATE and DELETE without WHERE"], answer: 3, why: "Both TRUNCATE and DELETE (without WHERE) clear rows while the table structure remains." },
    { q: "A B+ tree index is preferred because:", options: ["All keys in leaves linked for range scans", "It is always O(1)", "It stores data in RAM", "It never needs balancing"], answer: 0, why: "B+ trees keep all data in leaves, linked for fast range scans." },
    { q: "In the ER model, a relationship between two entities is drawn as a:", options: ["Rectangle", "Ellipse", "Diamond", "Line"], answer: 2, why: "Relationships are represented by diamonds in ER diagrams." },
  ],
  sql: [
    { q: "Which clause filters groups created by GROUP BY?", options: ["WHERE", "HAVING", "ORDER BY", "LIMIT"], answer: 1, why: "HAVING filters after aggregation; WHERE filters rows before grouping." },
    { q: "Which join returns only matching rows from both tables?", options: ["LEFT JOIN", "INNER JOIN", "RIGHT JOIN", "FULL OUTER JOIN"], answer: 1, why: "INNER JOIN keeps only rows with matches on both sides." },
    { q: "SELECT COUNT(*) FROM t counts:", options: ["Distinct values", "Rows including NULLs", "Non-null values only", "Columns"], answer: 1, why: "COUNT(*) counts every row; COUNT(col) ignores NULLs." },
    { q: "Which of these removes duplicates?", options: ["SELECT ALL", "SELECT DISTINCT", "SELECT UNIQUE VALUES", "GROUP BY every column"], answer: 1, why: "DISTINCT collapses duplicate rows in the result." },
    { q: "UNION ALL differs from UNION because it:", options: ["Removes duplicates", "Keeps duplicates", "Sorts the result", "Joins two tables"], answer: 1, why: "UNION ALL keeps all rows including duplicates; UNION deduplicates." },
  ],
  os: [
    { q: "Which is NOT a necessary condition for deadlock?", options: ["Mutual exclusion", "Hold and wait", "Preemption", "Circular wait"], answer: 2, why: "No preemption (not preemption) is the condition; allowing preemption prevents deadlock." },
    { q: "Round Robin scheduling is:", options: ["Non-preemptive", "Preemptive", "Deadlock-prone", "Used only in batch systems"], answer: 1, why: "RR gives each process a time slice and preempts when it expires." },
    { q: "Paging solves the problem of:", options: ["External fragmentation", "Internal fragmentation", "Deadlock", "Starvation"], answer: 0, why: "Fixed-size pages remove external fragmentation; internal fragmentation remains possible." },
    { q: "A semaphore that can take values 0 and 1 is called:", options: ["Counting", "Binary", "Mutex", "Spinlock"], answer: 1, why: "A binary semaphore only holds values 0 or 1." },
    { q: "Virtual memory allows:", options: ["Programs larger than physical memory", "Faster CPU", "No page faults", "No context switches"], answer: 0, why: "Demand paging loads only needed pages, so programs can exceed physical RAM." },
  ],
  cn: [
    { q: "Which layer does the IP protocol operate at?", options: ["Transport", "Network", "Data link", "Application"], answer: 1, why: "IP is a network-layer (layer 3) protocol." },
    { q: "Which protocol is connection-oriented and reliable?", options: ["UDP", "IP", "TCP", "ARP"], answer: 2, why: "TCP establishes connections and guarantees ordered, reliable delivery." },
    { q: "A MAC address is how many bits?", options: ["16", "32", "48", "64"], answer: 2, why: "MAC addresses are 48 bits (6 bytes)." },
    { q: "Which device works at the data link layer?", options: ["Hub", "Router", "Switch", "Repeater"], answer: 2, why: "Switches forward frames using MAC addresses at layer 2." },
    { q: "Which of these is a private IP address?", options: ["8.8.8.8", "172.16.10.5", "192.168.1.1", "Both 172.16.10.5 and 192.168.1.1"], answer: 3, why: "Both 10.x, 172.16–31.x and 192.168.x.x are private ranges." },
  ],
  oop: [
    { q: "Which pillar hides implementation details behind an interface?", options: ["Inheritance", "Encapsulation", "Abstraction", "Polymorphism"], answer: 2, why: "Abstraction exposes only essentials and hides implementation." },
    { q: "Method overloading is an example of:", options: ["Runtime polymorphism", "Compile-time polymorphism", "Data hiding", "Encapsulation"], answer: 1, why: "Overloading is resolved at compile time by signature." },
    { q: "In Java, a class can extend at most:", options: ["One class", "Two classes", "Any number", "Only interfaces"], answer: 0, why: "Java uses single class inheritance; multiple interfaces are allowed." },
    { q: "Which keyword prevents a method from being overridden?", options: ["static", "final", "private", "Both final and private"], answer: 3, why: "Final methods cannot be overridden; private methods are not inherited." },
    { q: "A constructor:", options: ["Initialises an object", "Destroys an object", "Is called by garbage collector", "Returns a value"], answer: 0, why: "Constructors run at creation to initialise object state." },
  ],
  toc: [
    { q: "The language a^n b^n (n ≥ 1) is:", options: ["Regular", "Context-free but not regular", "Context-sensitive only", "Recursively enumerable only"], answer: 1, why: "Pumping lemma shows it is not regular; a CFG generates it." },
    { q: "A DFA has exactly one transition per symbol from each state, an NFA:", options: ["Has zero or more", "Has exactly one", "Has none", "Has two"], answer: 0, why: "NFAs allow zero or many transitions per symbol." },
    { q: "The halting problem is:", options: ["Decidable", "Undecidable", "NP-complete", "Regular"], answer: 1, why: "No Turing machine can decide whether another halts — it is undecidable." },
    { q: "Which machine recognises context-free languages?", options: ["DFA", "NFA", "Pushdown automaton", "Linear bounded automaton"], answer: 2, why: "PDAs (finite control + stack) recognise exactly the context-free languages." },
    { q: "The Chomsky hierarchy orders grammars as:", options: ["Type 3 < Type 2 < Type 1 < Type 0", "Type 0 < Type 1 < Type 2 < Type 3", "Type 1 = Type 2", "No ordering exists"], answer: 0, why: "Type 3 (regular) ⊂ Type 2 (CF) ⊂ Type 1 (CS) ⊂ Type 0 (recursively enumerable)." },
  ],
  java: [
    { q: "Which component makes Java platform-independent?", options: ["JIT", "Garbage collector", "Bytecode + JVM", "Class loader"], answer: 2, why: "Bytecode runs on any JVM, giving 'write once, run anywhere'." },
    { q: "Which collection is backed by an array and is fast for random access?", options: ["LinkedList", "ArrayList", "HashSet", "HashMap"], answer: 1, why: "ArrayList offers O(1) indexed access via a backing array." },
    { q: "NullPointerException occurs when:", options: ["Array is out of bounds", "Calling a method on null", "Dividing by zero", "Casting an int to String"], answer: 1, why: "NPE arises from dereferencing a null reference." },
    { q: "What is the default value of an object reference field?", options: ["0", "null", "undefined", "empty string"], answer: 1, why: "Instance reference fields default to null." },
    { q: "Which keyword is used to inherit a class?", options: ["implements", "extends", "inherits", "super"], answer: 1, why: "Classes inherit with 'extends'; 'implements' is for interfaces." },
  ],
  python: [
    { q: "Which of these is immutable in Python?", options: ["list", "dict", "tuple", "set"], answer: 2, why: "Tuples are immutable; lists, dicts and sets are mutable." },
    { q: "What does the GIL limit?", options: ["Memory", "True parallelism of threads", "Number of processes", "Recursion depth"], answer: 1, why: "The GIL serialises bytecode execution, limiting thread parallelism." },
    { q: "A generator is created by:", options: ["A function with return", "A function with yield", "A list comprehension", "A lambda"], answer: 1, why: "Functions containing 'yield' produce generators that yield lazily." },
    { q: "Which method returns the object's human-readable string?", options: ["__str__", "__repr__", "__init__", "__len__"], answer: 0, why: "__str__ is for display; __repr__ is for unambiguous representation." },
    { q: "What is the output of print(2 ** 3)?", options: ["6", "8", "9", "23"], answer: 1, why: "** is the exponent operator: 2³ = 8." },
  ],
};

// ------------------------------------------------------------------
// Layer 2e — Learning paths per subject id.
// ------------------------------------------------------------------

export interface LearningLevel {
  level: number;
  title: string;
  topics: string[];
}

export const defaultLearningPath: LearningLevel[] = [
  { level: 1, title: "Fundamentals", topics: ["Core concepts and definitions", "Why this subject matters"] },
  { level: 2, title: "Core topics", topics: ["Key syllabus topics", "Basic worked examples"] },
  { level: 3, title: "Intermediate", topics: ["Linked concepts", "Problem solving"] },
  { level: 4, title: "Advanced", topics: ["Deep dives", "Edge cases"] },
  { level: 5, title: "Mastery", topics: ["Exam practice", "Interview-style questions"] },
];

export const learningPaths: Record<string, LearningLevel[]> = {
  dsa: [
    { level: 1, title: "Programming fundamentals", topics: ["Variables, loops, functions", "Time complexity intuition"] },
    { level: 2, title: "Arrays & Strings", topics: ["Traversal", "Two pointers", "Sliding window"] },
    { level: 3, title: "Linked Lists", topics: ["Reversal", "Cycle detection", "Fast & slow pointers"] },
    { level: 4, title: "Stacks & Queues", topics: ["LIFO/FIFO", "Monotonic stack", "Implementations"] },
    { level: 5, title: "Trees", topics: ["Binary trees", "BST", "Traversals", "AVL"] },
    { level: 6, title: "Graphs", topics: ["BFS/DFS", "Topological sort", "Connected components"] },
    { level: 7, title: "Sorting & Searching", topics: ["Binary search", "Merge/Quick sort", "Selection"] },
    { level: 8, title: "Greedy", topics: ["Greedy choice", "Interval problems"] },
    { level: 9, title: "Dynamic Programming", topics: ["Fibonacci to DP", "1D & 2D DP", "Memoization"] },
    { level: 10, title: "Advanced", topics: ["Heaps", "Tries", "Union-Find", "Segment trees"] },
  ],
  algorithms: [
    { level: 1, title: "Complexity basics", topics: ["Big-O", "Best/average/worst"] },
    { level: 2, title: "Searching & Sorting", topics: ["Binary search", "Merge/Quick/Heap sort"] },
    { level: 3, title: "Divide & Conquer", topics: ["Recurrences", "Master theorem"] },
    { level: 4, title: "Greedy", topics: ["MST", "Huffman coding", "Fractional knapsack"] },
    { level: 5, title: "Dynamic Programming", topics: ["Knapsack", "LCS", "Matrix chain"] },
    { level: 6, title: "Graph algorithms", topics: ["Shortest paths", "MST", "Topological sort"] },
    { level: 7, title: "Backtracking & B&B", topics: ["N-Queens", "Graph colouring"] },
    { level: 8, title: "Advanced", topics: ["NP-completeness", "Approximation algorithms"] },
  ],
  java: [
    { level: 1, title: "Java basics", topics: ["Syntax", "Data types", "Operators"] },
    { level: 2, title: "OOP in Java", topics: ["Classes", "Inheritance", "Interfaces", "Polymorphism"] },
    { level: 3, title: "Core APIs", topics: ["Strings", "Exceptions", "Collections framework"] },
    { level: 4, title: "Advanced", topics: ["Generics", "Streams", "Multithreading"] },
    { level: 5, title: "JVM internals", topics: ["Memory model", "Garbage collection"] },
  ],
  python: [
    { level: 1, title: "Python basics", topics: ["Syntax", "Data types", "Control flow"] },
    { level: 2, title: "Collections", topics: ["Lists", "Tuples", "Dicts", "Comprehensions"] },
    { level: 3, title: "Functions", topics: ["def", "Lambdas", "Decorators", "Generators"] },
    { level: 4, title: "OOP & modules", topics: ["Classes", "Modules", "Packages"] },
    { level: 5, title: "Real-world", topics: ["File I/O", "Errors", "Standard library"] },
  ],
  dbms: [
    { level: 1, title: "Relational basics", topics: ["Tables", "Keys", "ER model"] },
    { level: 2, title: "SQL", topics: ["SELECT", "JOINs", "GROUP BY"] },
    { level: 3, title: "Design", topics: ["Normalization 1NF-3NF", "BCNF"] },
    { level: 4, title: "Transactions", topics: ["ACID", "Concurrency control"] },
    { level: 5, title: "Performance", topics: ["Indexing", "B+ trees", "Query optimization"] },
  ],
  os: [
    { level: 1, title: "Processes & Threads", topics: ["Process states", "Threads", "IPC"] },
    { level: 2, title: "Scheduling", topics: ["FCFS", "SJF", "Round Robin", "Priority"] },
    { level: 3, title: "Synchronization", topics: ["Semaphores", "Mutex", "Classic problems"] },
    { level: 4, title: "Deadlock", topics: ["Conditions", "Banker's algorithm", "Detection"] },
    { level: 5, title: "Memory", topics: ["Paging", "Segmentation", "Virtual memory"] },
    { level: 6, title: "Storage", topics: ["File systems", "Disk scheduling"] },
  ],
  cn: [
    { level: 1, title: "Models", topics: ["OSI", "TCP/IP", "Encapsulation"] },
    { level: 2, title: "Addressing", topics: ["IPv4", "Subnetting", "IPv6"] },
    { level: 3, title: "Transport", topics: ["TCP vs UDP", "Flow & congestion control"] },
    { level: 4, title: "Routing", topics: ["Distance vector", "Link state"] },
    { level: 5, title: "Application", topics: ["DNS", "HTTP", "Email protocols"] },
  ],
};
