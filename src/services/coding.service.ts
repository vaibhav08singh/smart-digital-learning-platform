import { ApiClientError, postJson } from "@/services/http";
import { readStore, uid, writeStore } from "@/lib/storage";
import type { CodeExecutionResult, CodeTestResult } from "@/types";

// ============================================================
// Coding Lab service — languages, saved snippets, test cases
// and code execution through the server-side /api/execute route
// (Piston API). API keys/base URLs live on the server only.
// ============================================================

export interface LabLanguage {
  id: string;
  label: string;
  piston: string;
  moniker: string;
  sample: string;
}

export const labLanguages: LabLanguage[] = [
  { id: "python", label: "Python", piston: "python", moniker: "python", sample: `def factorial(n: int) -> int:\n    if n <= 1:\n        return 1\n    return n * factorial(n - 1)\n\nn = int(input())\nprint(f"Factorial of {n} is:", factorial(n))` },
  { id: "c", label: "C", piston: "c", moniker: "c", sample: `#include <stdio.h>\n\nlong long factorial(int n) {\n    if (n <= 1) return 1;\n    return n * factorial(n - 1);\n}\n\nint main(void) {\n    int n = 5;\n    scanf("%d", &n);\n    printf("Factorial of %d is %lld\\n", n, factorial(n));\n    return 0;\n}` },
  { id: "cpp", label: "C++", piston: "cpp", moniker: "cpp", sample: `#include <iostream>\nusing namespace std;\n\nlong long factorial(int n) {\n    if (n <= 1) return 1;\n    return n * factorial(n - 1);\n}\n\nint main() {\n    int n = 5;\n    if (cin >> n) {}\n    cout << "Factorial of " << n << " is " << factorial(n) << "\\n";\n    return 0;\n}` },
  { id: "java", label: "Java", piston: "java", moniker: "java", sample: `import java.util.Scanner;\n\npublic class Main {\n    static long factorial(int n) {\n        if (n <= 1) return 1;\n        return n * factorial(n - 1);\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.hasNextInt() ? sc.nextInt() : 5;\n        System.out.println("Factorial of " + n + " is " + factorial(n));\n    }\n}` },
  { id: "javascript", label: "JavaScript", piston: "javascript", moniker: "js", sample: `function factorial(n) {\n  if (n <= 1) return 1;\n  return n * factorial(n - 1);\n}\n\nconst input = typeof stdin !== "undefined" && stdin.trim() ? stdin.trim() : "5";\nconst n = Number(input) || 5;\nconsole.log(\`Factorial of \${n} is \${factorial(n)}\`);` },
  { id: "typescript", label: "TypeScript", piston: "typescript", moniker: "ts", sample: `function factorial(n: number): number {\n  if (n <= 1) return 1;\n  return n * factorial(n - 1);\n}\n\nconst input = typeof stdin !== "undefined" && stdin.trim() ? stdin.trim() : "5";\nconst n: number = Number(input) || 5;\nconsole.log(\`Factorial of \${n} is \${factorial(n)}\`);` },
  { id: "go", label: "Go", piston: "go", moniker: "go", sample: `package main\n\nimport "fmt"\n\nfunc factorial(n int) int {\n    if n <= 1 {\n        return 1\n    }\n    return n * factorial(n-1)\n}\n\nfunc main() {\n    var n int = 5\n    fmt.Scan(&n)\n    fmt.Printf("Factorial of %d is %d\\n", n, factorial(n))\n}` },
  { id: "rust", label: "Rust", piston: "rust", moniker: "rust", sample: `use std::io::{self, Read};\n\nfn factorial(n: u64) -> u64 {\n    if n <= 1 { return 1; }\n    n * factorial(n - 1)\n}\n\nfn main() {\n    let mut input = String::new();\n    let _ = io::stdin().read_to_string(&mut input);\n    let n: u64 = input.trim().parse().unwrap_or(5);\n    println!("Factorial of {} is {}", n, factorial(n));\n}` },
  { id: "php", label: "PHP", piston: "php", moniker: "php", sample: `<?php\nfunction factorial(int $n): int {\n    if ($n <= 1) return 1;\n    return $n * factorial($n - 1);\n}\n\n$raw = trim(fgets(STDIN));\n$n = $raw !== "" ? (int)$raw : 5;\necho "Factorial of {$n} is " . factorial($n) . "\\n";` },
  { id: "csharp", label: "C#", piston: "csharp", moniker: "cs", sample: `using System;\n\nclass Program {\n    static long Factorial(int n) {\n        if (n <= 1) return 1;\n        return n * Factorial(n - 1);\n    }\n\n    static void Main() {\n        string input = Console.ReadLine();\n        int n = int.TryParse(input, out int parsed) ? parsed : 5;\n        Console.WriteLine($"Factorial of {n} is {Factorial(n)}");\n    }\n}` },
  { id: "kotlin", label: "Kotlin", piston: "kotlin", moniker: "kt", sample: `fun factorial(n: Int): Long =\n    if (n <= 1) 1L else n * factorial(n - 1)\n\nfun main() {\n    val n = readLine()?.trim()?.toIntOrNull() ?: 5\n    println("Factorial of $n is \${factorial(n)}")\n}` },
  { id: "swift", label: "Swift", piston: "swift", moniker: "swift", sample: `func factorial(_ n: Int) -> Int {\n    if n <= 1 { return 1 }\n    return n * factorial(n - 1)\n}\n\nlet n = Int(readLine()?.trimmingCharacters(in: .whitespacesAndNewlines) ?? "5") ?? 5\nprint("Factorial of \(n) is \(factorial(n))")` },
  { id: "ruby", label: "Ruby", piston: "ruby", moniker: "ruby", sample: `def factorial(n)\n  return 1 if n <= 1\n  n * factorial(n - 1)\nend\n\nraw = (gets || "").strip\nn = raw.empty? ? 5 : raw.to_i\nputs "Factorial of #{n} is #{factorial(n)}"` },
  { id: "r", label: "R", piston: "r", moniker: "r", sample: `factorial <- function(n) {\n  if (n <= 1) return(1)\n  return(n * factorial(n - 1))\n}\n\nlines <- readLines("stdin", warn=FALSE)\nn <- if (length(lines) > 0 && nchar(lines[1]) > 0) as.integer(lines[1]) else 5\ncat(paste("Factorial of", n, "is", factorial(n)), "\n")` },
  { id: "scala", label: "Scala", piston: "scala", moniker: "scala", sample: `object Main {\n  def factorial(n: Int): Long = if (n <= 1) 1 else n * factorial(n - 1)\n  def main(args: Array[String]): Unit = {\n    val line = scala.io.StdIn.readLine()\n    val n = if (line != null && line.trim.nonEmpty) line.trim.toInt else 5\n    println(s"Factorial of $n is \${factorial(n)}")\n  }\n}` },
  { id: "perl", label: "Perl", piston: "perl", moniker: "perl", sample: `sub factorial {\n    my ($n) = @_;\n    return 1 if $n <= 1;\n    return $n * factorial($n - 1);\n}\n\nmy $line = <STDIN>;\nchomp($line) if defined($line);\nmy $n = (defined($line) && length($line) > 0) ? int($line) : 5;\nprint "Factorial of $n is ", factorial($n), "\n";` },
  { id: "bash", label: "Bash / Shell", piston: "bash", moniker: "bash", sample: `factorial() {\n  if [ $1 -le 1 ]; then\n    echo 1\n  else\n    local last=$(factorial $(( $1 - 1 )))\n    echo $(( $1 * last ))\n  fi\n}\n\nread n\nval=\${n:-5}\necho "Factorial of $val is $(factorial $val)"` },
  { id: "dart", label: "Dart", piston: "dart", moniker: "dart", sample: `import 'dart:io';\n\nint factorial(int n) {\n  if (n <= 1) return 1;\n  return n * factorial(n - 1);\n}\n\nvoid main() {\n  String? line = stdin.readLineSync();\n  int n = int.tryParse(line ?? "5") ?? 5;\n  print("Factorial of $n is \${factorial(n)}");\n}` },
  { id: "haskell", label: "Haskell", piston: "haskell", moniker: "haskell", sample: `factorial :: Integer -> Integer\nfactorial n = if n <= 1 then 1 else n * factorial (n - 1)\n\nmain :: IO ()\nmain = do\n    input <- getContents\n    let n = case reads (head (lines input ++ ["5"])) of\n              [(val, _)] -> val\n              _          -> 5\n    putStrLn ("Factorial of " ++ show n ++ " is " ++ show (factorial n))` },
  { id: "lua", label: "Lua", piston: "lua", moniker: "lua", sample: `function factorial(n)\n  if n <= 1 then return 1 end\n  return n * factorial(n - 1)\nend\n\nlocal input = io.read("*n") or 5\nprint("Factorial of " .. input .. " is " .. factorial(input))` },
  { id: "elixir", label: "Elixir", piston: "elixir", moniker: "elixir", sample: `defmodule Math do\n  def factorial(n) when n <= 1, do: 1\n  def factorial(n), do: n * factorial(n - 1)\nend\n\ninput = (IO.gets("") || "") |> String.trim()\nn = case Integer.parse(input) do\n  {val, _} -> val\n  :error -> 5\nend\nIO.puts("Factorial of #{n} is #{Math.factorial(n)}")` },
  { id: "pascal", label: "Pascal", piston: "pascal", moniker: "pascal", sample: `program Factorial;\nvar\n  n: integer;\nfunction fact(n: integer): longint;\nbegin\n  if n <= 1 then fact := 1\n  else fact := n * fact(n - 1);\nend;\nbegin\n  n := 5;\n  if not eof then readln(n);\n  writeln('Factorial of ', n, ' is ', fact(n));\nend.` },
  { id: "assembly", label: "Assembly (x86-64)", piston: "nasm", moniker: "asm", sample: `; Factorial in x86-64 Assembly\nsection .data\n  msg db "Factorial of 5 is 120", 10, 0\nsection .text\n  global _start\n_start:\n  mov eax, 4\n  mov ebx, 1\n  mov ecx, msg\n  mov edx, 23\n  int 0x80\n  mov eax, 1\n  xor ebx, ebx\n  int 0x80` },
  { id: "sql", label: "SQL", piston: "sqlite3", moniker: "sql", sample: `-- Simple SQL query against an in-memory SQLite database\nCREATE TABLE students (id INTEGER, name TEXT, grade TEXT);\nINSERT INTO students VALUES (1, 'Vaibhav', 'A+'), (2, 'Ananya', 'A');\nSELECT * FROM students ORDER BY id;` },
];

export function getLanguage(id: string): LabLanguage {
  return labLanguages.find((l) => l.id === id) ?? labLanguages[0];
}

// ------------------------------------------------------------
// Snippet + test-case persistence
// ------------------------------------------------------------

const SNIPPETS_KEY = "codezen:snippets";
const TESTS_KEY = "codezen:testcases";

export interface TestCase {
  id: string;
  input: string;
  expected: string;
}

export function getSnippet(languageId: string): string | null {
  const snippets = readStore<Record<string, string>>(SNIPPETS_KEY, {});
  return snippets[languageId] ?? null;
}

export function saveSnippet(languageId: string, code: string): void {
  const snippets = readStore<Record<string, string>>(SNIPPETS_KEY, {});
  writeStore(SNIPPETS_KEY, { ...snippets, [languageId]: code });
}

export function getTestCases(languageId: string): TestCase[] {
  const all = readStore<Record<string, TestCase[]>>(TESTS_KEY, {});
  return all[languageId] ?? [];
}

export function saveTestCases(languageId: string, tests: TestCase[]): void {
  const all = readStore<Record<string, TestCase[]>>(TESTS_KEY, {});
  writeStore(TESTS_KEY, { ...all, [languageId]: tests });
}

export function addTestCase(languageId: string, input: string, expected: string): TestCase[] {
  const next = [...getTestCases(languageId), { id: uid("tc"), input, expected }];
  saveTestCases(languageId, next);
  return next;
}

export function updateTestCase(languageId: string, id: string, patch: Partial<TestCase>): TestCase[] {
  const next = getTestCases(languageId).map((t) => (t.id === id ? { ...t, ...patch } : t));
  saveTestCases(languageId, next);
  return next;
}

export function deleteTestCase(languageId: string, id: string): TestCase[] {
  const next = getTestCases(languageId).filter((t) => t.id !== id);
  saveTestCases(languageId, next);
  return next;
}

// ------------------------------------------------------------
// Execution
// ------------------------------------------------------------

export async function executeCode(args: {
  code: string;
  languageId: string;
  stdin?: string;
  signal?: AbortSignal;
}): Promise<CodeExecutionResult> {
  try {
    return await postJson<CodeExecutionResult>(
      "/api/execute",
      {
        code: args.code,
        language: getLanguage(args.languageId).piston,
        stdin: args.stdin ?? "",
      },
      { signal: args.signal },
    );
  } catch (error) {
    if (error instanceof ApiClientError) {
      return {
        stdout: "",
        stderr: "",
        output: "",
        exitCode: null,
        timeMs: null,
        memoryKb: null,
        error: error.message,
      };
    }
    throw error;
  }
}

/** Run a list of test cases, returning per-case results. */
export async function runTestCases(
  code: string,
  languageId: string,
  tests: TestCase[],
): Promise<CodeTestResult[]> {
  const results: CodeTestResult[] = [];
  for (const test of tests) {
    const exec = await executeCode({ code, languageId, stdin: test.input });
    const actual = normalizeOutput(exec.output);
    const expected = normalizeOutput(test.expected);
    results.push({
      input: test.input,
      expected: test.expected,
      actual: exec.output,
      passed: !exec.error && actual === expected,
    });
  }
  return results;
}

export function normalizeOutput(text: string): string {
  return text.replace(/\r\n/g, "\n").replace(/\n+$/g, "").trim();
}
