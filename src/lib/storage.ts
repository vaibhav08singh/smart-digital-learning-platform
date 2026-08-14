// ============================================================
// Client-side storage + mock-database helpers.
// The app persists user data in localStorage (acting as the
// "database" layer) behind these small utilities. Swap them for
// real server persistence later without touching callers.
// ============================================================

/** Simulated network latency so loading states are visible. */
export function simulateLatency(ms = 350): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Read a JSON value from localStorage with a fallback. */
export function readStore<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

/** Write a JSON value to localStorage. */
export function writeStore<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage unavailable — ignore for the mock layer
  }
}

/** Remove a key from localStorage. */
export function removeStore(key: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(key);
}

let idCounter = 0;

/** Generate a unique-ish id for client-created entities. */
export function uid(prefix = "id"): string {
  idCounter += 1;
  return `${prefix}-${Date.now().toString(36)}-${idCounter}`;
}
