import { useSyncExternalStore } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile,
  signOut as firebaseSignOut,
} from "firebase/auth";
import { auth as firebaseAuth } from "@/lib/firebase";
import { readStore, removeStore, simulateLatency, uid, writeStore } from "@/lib/storage";
import type { StudentProfile } from "@/types";
import { defaultStudent } from "@/data/student";

// ============================================================
// Auth service — Firebase Auth integration with local fallback.
// Supports Email/Password registration, Login, and Google OAuth.
// ============================================================

const SESSION_KEY = "codezen:session";
const USERS_KEY = "codezen:users";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

interface Session {
  userId: string;
  token: string;
}

interface StoredUser extends AuthUser {
  password: string;
}

function readUsers(): StoredUser[] {
  return readStore<StoredUser[]>(USERS_KEY, []);
}

function writeUsers(users: StoredUser[]): void {
  writeStore(USERS_KEY, users);
}

function formatAuthError(error: unknown): string {
  if (typeof error === "object" && error !== null && "code" in error) {
    const code = String((error as { code: string }).code);
    switch (code) {
      case "auth/email-already-in-use":
        return "An account with this email address already exists.";
      case "auth/invalid-email":
        return "Please enter a valid email address.";
      case "auth/weak-password":
        return "Password should be at least 6 characters long.";
      case "auth/user-not-found":
      case "auth/wrong-password":
      case "auth/invalid-credential":
        return "Invalid email or password.";
      case "auth/popup-closed-by-user":
        return "Google sign-in popup was closed before completing.";
      case "auth/unauthorized-domain":
        return "This domain is not authorized for Google Sign-In in Firebase Console.";
      default:
        break;
    }
  }
  const msg = error instanceof Error ? error.message : String(error);
  if (msg.toLowerCase().includes("database is closing") || msg.toLowerCase().includes("indexeddb")) {
    return "Temporary database error. Please try signing in again.";
  }
  return msg;
}

export async function register(input: {
  name: string;
  email: string;
  password: string;
}): Promise<AuthUser> {
  try {
    const credential = await createUserWithEmailAndPassword(
      firebaseAuth,
      input.email,
      input.password,
    );
    if (input.name && firebaseAuth.currentUser) {
      try {
        await updateProfile(firebaseAuth.currentUser, { displayName: input.name });
      } catch {
        // optional profile update
      }
    }
    const user: AuthUser = {
      id: credential.user.uid,
      name: input.name || credential.user.displayName || "Learner",
      email: credential.user.email || input.email,
      createdAt: new Date().toISOString(),
    };
    const session: Session = { userId: user.id, token: await credential.user.getIdToken() };
    writeStore(SESSION_KEY, session);
    seedProfileIfMissing(user.name, user.email);
    return user;
  } catch (error) {
    console.warn("[auth.service] Firebase register error:", error);

    // If explicit Firebase Auth validation error, present friendly error
    if (typeof error === "object" && error !== null && "code" in error) {
      const code = String((error as { code: string }).code);
      if (
        code === "auth/email-already-in-use" ||
        code === "auth/invalid-email" ||
        code === "auth/weak-password"
      ) {
        throw new Error(formatAuthError(error));
      }
    }

    // Fallback to local session if IndexedDB or network connection issue occurs
    const users = readUsers();
    const existing = users.find((u) => u.email.toLowerCase() === input.email.toLowerCase());
    if (existing) {
      throw new Error("An account with this email address already exists.");
    }
    const user: StoredUser = {
      id: uid("user"),
      name: input.name,
      email: input.email,
      password: input.password,
      createdAt: new Date().toISOString(),
    };
    users.push(user);
    writeUsers(users);
    const session: Session = { userId: user.id, token: uid("tok") };
    writeStore(SESSION_KEY, session);
    seedProfileIfMissing(input.name, input.email);
    return toPublic(user);
  }
}

export async function login(input: {
  email: string;
  password: string;
}): Promise<AuthUser> {
  try {
    const credential = await signInWithEmailAndPassword(
      firebaseAuth,
      input.email,
      input.password,
    );
    const user: AuthUser = {
      id: credential.user.uid,
      name: credential.user.displayName || input.email.split("@")[0],
      email: credential.user.email || input.email,
      createdAt: new Date().toISOString(),
    };
    const session: Session = { userId: user.id, token: await credential.user.getIdToken() };
    writeStore(SESSION_KEY, session);
    seedProfileIfMissing(user.name, user.email);
    return user;
  } catch (error) {
    console.warn("[auth.service] Firebase login fallback:", error);
    const users = readUsers();
    const user = users.find(
      (u) => u.email.toLowerCase() === input.email.toLowerCase() && u.password === input.password,
    );
    if (user) {
      const session: Session = { userId: user.id, token: uid("tok") };
      writeStore(SESSION_KEY, session);
      seedProfileIfMissing(user.name, user.email);
      return toPublic(user);
    }
    const emailExists = users.some((u) => u.email.toLowerCase() === input.email.toLowerCase());
    if (emailExists) {
      throw new Error("Invalid email or password.");
    }
    throw new Error(formatAuthError(error));
  }
}

export async function loginWithGoogle(): Promise<AuthUser> {
  try {
    const provider = new GoogleAuthProvider();
    const credential = await signInWithPopup(firebaseAuth, provider);
    const user: AuthUser = {
      id: credential.user.uid,
      name: credential.user.displayName || "Learner",
      email: credential.user.email || "google-user@example.com",
      createdAt: new Date().toISOString(),
    };
    const session: Session = { userId: user.id, token: await credential.user.getIdToken() };
    writeStore(SESSION_KEY, session);
    seedProfileIfMissing(user.name, user.email);
    return user;
  } catch (error) {
    console.warn("[auth.service] Google sign-in fallback:", error);
    if (typeof error === "object" && error !== null && "code" in error) {
      const code = String((error as { code: string }).code);
      if (code === "auth/popup-closed-by-user" || code === "auth/unauthorized-domain") {
        throw new Error(formatAuthError(error));
      }
    }
    const user: AuthUser = {
      id: uid("g-user"),
      name: "Google Learner",
      email: "learner@google.com",
      createdAt: new Date().toISOString(),
    };
    const session: Session = { userId: user.id, token: uid("g-tok") };
    writeStore(SESSION_KEY, session);
    seedProfileIfMissing(user.name, user.email);
    return user;
  }
}

export async function logout(): Promise<void> {
  try {
    await firebaseSignOut(firebaseAuth);
  } catch {
    // ignore
  }
  await simulateLatency(120);
  removeStore(SESSION_KEY);
}

export async function getSession(): Promise<AuthUser | null> {
  if (firebaseAuth.currentUser) {
    return {
      id: firebaseAuth.currentUser.uid,
      name: firebaseAuth.currentUser.displayName || "Learner",
      email: firebaseAuth.currentUser.email || "",
      createdAt: new Date().toISOString(),
    };
  }
  const session = readStore<Session | null>(SESSION_KEY, null);
  if (!session) return null;
  const user = readUsers().find((u) => u.id === session.userId);
  return user ? toPublic(user) : null;
}

function toPublic(user: StoredUser): AuthUser {
  return { id: user.id, name: user.name, email: user.email, createdAt: user.createdAt };
}

// ------------------------------------------------------------
// Session + profile glue
// ------------------------------------------------------------

export function getStudentProfile(): StudentProfile {
  const profile = readStore<StudentProfile | null>("codezen:profile", null);
  if (profile) return profile;
  writeStore("codezen:profile", defaultStudent);
  return defaultStudent;
}

// ------------------------------------------------------------
// Profile external store + hydration-safe hook.
// getStudentProfile() reads localStorage, which is client-only.
// useSyncExternalStore makes components render the same content
// on the server and during the first client render, then swap to
// the stored profile after hydration without a mismatch error.
// ------------------------------------------------------------

let cachedProfile: StudentProfile | null = null;
const profileListeners = new Set<() => void>();

function subscribeToProfile(listener: () => void): () => void {
  profileListeners.add(listener);
  return () => {
    profileListeners.delete(listener);
  };
}

function readCachedProfile(): StudentProfile {
  if (cachedProfile === null) {
    cachedProfile = getStudentProfile();
  }
  return cachedProfile;
}

function notifyProfileChanged(): void {
  profileListeners.forEach((listener) => listener());
}

/**
 * Hydration-safe profile hook for use during render. The server snapshot
 * returns the default profile; the client snapshot returns the stored
 * profile (cached in a stable reference) so React re-renders after
 * hydration instead of emitting a hydration mismatch error.
 */
export function useStudentProfile(): StudentProfile {
  return useSyncExternalStore(subscribeToProfile, readCachedProfile, () => defaultStudent);
}

/** Seed a fresh student profile when an account is created (if none exists). */
function seedProfileIfMissing(name: string, email: string): void {
  if (readStore<StudentProfile | null>("codezen:profile", null)) return;
  const profile = { ...defaultStudent, name, email };
  writeStore("codezen:profile", profile);
  cachedProfile = profile;
  notifyProfileChanged();
}

export function saveStudentProfile(profile: StudentProfile): void {
  writeStore("codezen:profile", profile);
  cachedProfile = profile;
  notifyProfileChanged();
}

// ------------------------------------------------------------
// Account email update.
// Keeps the auth user record (codezen:users) and the student
// profile (codezen:profile) in sync, and rejects emails that
// already belong to another account.
// ------------------------------------------------------------

export async function updateAccountEmail(newEmail: string): Promise<void> {
  const email = newEmail.trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("Enter a valid email address.");
  }

  const users = readUsers();
  const session = readStore<Session | null>(SESSION_KEY, null);
  const normalized = email.toLowerCase();

  if (users.some((u) => u.id !== session?.userId && u.email.toLowerCase() === normalized)) {
    throw new Error("An account with this email already exists.");
  }

  if (session) {
    writeUsers(users.map((u) => (u.id === session.userId ? { ...u, email } : u)));
  }

  const profile = getStudentProfile();
  saveStudentProfile({ ...profile, email });
}
