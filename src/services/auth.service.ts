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
  role?: "admin" | "student";
  levelId?: string;
  institution?: string;
  lastLogin?: string;
}

interface Session {
  userId: string;
  token: string;
}

interface StoredUser extends AuthUser {
  password?: string;
}

const INITIAL_SEED_USERS: StoredUser[] = [
  {
    id: "admin-1",
    name: "Vaibhav Singh (Admin)",
    email: "vaibhav4866singh@gmail.com",
    password: "12345678",
    createdAt: "2026-08-01T09:00:00Z",
    role: "admin",
    levelId: "btech",
    institution: "State Institute of Engineering and Technology Nilokheri",
    lastLogin: new Date().toISOString(),
  },
  {
    id: "user-1",
    name: "Vaibhav Singh",
    email: "vaibhav.singh08@gmail.com",
    password: "password123",
    createdAt: "2026-08-05T11:20:00Z",
    role: "student",
    levelId: "btech",
    institution: "State Institute of Engineering and Technology Nilokheri",
    lastLogin: "2026-08-14T22:15:00Z",
  },
  {
    id: "user-demo",
    name: "Demo Learner",
    email: "demo@codezen.ai",
    password: "password123",
    createdAt: "2026-08-08T14:30:00Z",
    role: "student",
    levelId: "btech",
    institution: "SIET Nilokheri",
    lastLogin: "2026-08-14T23:00:00Z",
  },
  {
    id: "user-2",
    name: "Aanya Sharma",
    email: "aanya.sharma@siet.ac.in",
    password: "password123",
    createdAt: "2026-08-10T16:45:00Z",
    role: "student",
    levelId: "btech",
    institution: "State Institute of Engineering and Technology Nilokheri",
    lastLogin: "2026-08-14T18:40:00Z",
  },
  {
    id: "user-3",
    name: "Rohit Kumar",
    email: "rohit.k@nitk.ac.in",
    password: "password123",
    createdAt: "2026-08-12T10:15:00Z",
    role: "student",
    levelId: "mtech",
    institution: "NIT Kurukshetra",
    lastLogin: "2026-08-14T15:20:00Z",
  },
  {
    id: "user-4",
    name: "Priya Verma",
    email: "priya.class10@school.edu",
    password: "password123",
    createdAt: "2026-08-13T08:00:00Z",
    role: "student",
    levelId: "class-10",
    institution: "Model Senior Secondary School",
    lastLogin: "2026-08-14T19:10:00Z",
  },
];

function readUsers(): StoredUser[] {
  const users = readStore<StoredUser[]>(USERS_KEY, []);
  if (users.length === 0) {
    writeStore(USERS_KEY, INITIAL_SEED_USERS);
    return INITIAL_SEED_USERS;
  }
  const hasAdmin = users.some((u) => u.email.toLowerCase() === "vaibhav4866singh@gmail.com");
  if (!hasAdmin) {
    users.unshift(INITIAL_SEED_USERS[0]);
    writeStore(USERS_KEY, users);
  }
  return users;
}

function writeUsers(users: StoredUser[]): void {
  writeStore(USERS_KEY, users);
}

export function getAllUserAccounts(): StoredUser[] {
  return readUsers();
}

export function deleteUserAccount(userId: string): void {
  const users = readUsers().filter((u) => u.id !== userId);
  writeUsers(users);
}

export function createAdminAccount(input: {
  name: string;
  email: string;
  password?: string;
  role?: "admin" | "student";
  levelId?: string;
  institution?: string;
}): StoredUser {
  const users = readUsers();
  const existing = users.find((u) => u.email.toLowerCase() === input.email.toLowerCase());
  if (existing) {
    throw new Error("An account with this email address already exists.");
  }
  const newUser: StoredUser = {
    id: uid(input.role === "admin" ? "admin" : "user"),
    name: input.name,
    email: input.email.trim(),
    password: input.password || "password123",
    createdAt: new Date().toISOString(),
    role: input.role || "admin",
    levelId: input.levelId || "btech",
    institution: input.institution || "State Institute of Engineering and Technology Nilokheri",
    lastLogin: new Date().toISOString(),
  };
  users.unshift(newUser);
  writeUsers(users);
  return newUser;
}

export function updateUserRole(userId: string, role: "admin" | "student"): StoredUser {
  const users = readUsers();
  const idx = users.findIndex((u) => u.id === userId);
  if (idx === -1) {
    throw new Error("User account not found.");
  }
  if (users[idx].email.toLowerCase() === "vaibhav4866singh@gmail.com" && role !== "admin") {
    throw new Error("Superadmin role cannot be changed.");
  }
  users[idx].role = role;
  writeUsers(users);
  return users[idx];
}

export function isAdminUser(email?: string): boolean {
  if (!email) {
    const session = readStore<{ userId: string } | null>(SESSION_KEY, null);
    if (!session) return false;
    const users = readUsers();
    const u = users.find((x) => x.id === session.userId);
    return u?.role === "admin" || u?.email.toLowerCase() === "vaibhav4866singh@gmail.com";
  }
  const users = readUsers();
  const u = users.find((x) => x.email.toLowerCase() === email.toLowerCase());
  if (u?.role === "admin") return true;
  return email.toLowerCase() === "vaibhav4866singh@gmail.com";
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
    const existing = users.find(
      (u) => u.email.toLowerCase() === input.email.toLowerCase(),
    );
    if (existing) {
      const session: Session = { userId: existing.id, token: uid("tok") };
      writeStore(SESSION_KEY, session);
      seedProfileIfMissing(existing.name, existing.email);
      return toPublic(existing);
    }

    // Auto-create user session when logging in with new credentials in demo/offline mode
    const newUser: StoredUser = {
      id: uid("user"),
      name: input.email.split("@")[0] || "Learner",
      email: input.email,
      password: input.password,
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    writeUsers(users);
    const session: Session = { userId: newUser.id, token: uid("tok") };
    writeStore(SESSION_KEY, session);
    seedProfileIfMissing(newUser.name, newUser.email);
    return toPublic(newUser);
  }
}

export async function loginDemoUser(): Promise<AuthUser> {
  const user: AuthUser = {
    id: "user-demo",
    name: "Demo Learner",
    email: "demo@codezen.ai",
    createdAt: new Date().toISOString(),
  };
  const session: Session = { userId: user.id, token: "demo-token" };
  writeStore(SESSION_KEY, session);
  seedProfileIfMissing("Demo Learner", "demo@codezen.ai");
  return user;
}

export async function loginWithGoogle(
  customAccount?: { name: string; email: string },
): Promise<AuthUser | null> {
  if (customAccount) {
    const user: AuthUser = {
      id: uid("g-user"),
      name: customAccount.name,
      email: customAccount.email,
      createdAt: new Date().toISOString(),
    };
    const session: Session = { userId: user.id, token: uid("g-tok") };
    writeStore(SESSION_KEY, session);
    seedProfileIfMissing(user.name, user.email);
    return user;
  }

  try {
    const provider = new GoogleAuthProvider();
    const credential = await signInWithPopup(firebaseAuth, provider);
    const user: AuthUser = {
      id: credential.user.uid,
      name: credential.user.displayName || "Google Learner",
      email: credential.user.email || "learner@google.com",
      createdAt: new Date().toISOString(),
    };
    const session: Session = { userId: user.id, token: await credential.user.getIdToken() };
    writeStore(SESSION_KEY, session);
    seedProfileIfMissing(user.name, user.email);
    return user;
  } catch (error) {
    console.warn("[auth.service] Real Google OAuth popup unavailable on current domain:", error);
    return null;
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
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
    role: user.role || (user.email.toLowerCase() === "vaibhav4866singh@gmail.com" ? "admin" : "student"),
    levelId: user.levelId,
    institution: user.institution,
    lastLogin: user.lastLogin,
  };
}

// ------------------------------------------------------------
// Session + profile glue
// ------------------------------------------------------------

export function getStudentProfile(): StudentProfile {
  const profile = readStore<StudentProfile | null>("codezen:profile", null);
  if (profile) {
    const isMismatched =
      profile.institution === "National Institute of Technology" ||
      profile.institution === "Model Senior Secondary School" ||
      profile.branch === "Computer Science" ||
      (profile.classYear === "3rd Year" && profile.levelId === "class-10");

    if (isMismatched) {
      const updated: StudentProfile = {
        ...profile,
        levelId: profile.classYear === "3rd Year" ? "btech" : profile.levelId,
        classYear: profile.classYear || "3rd Year",
        branch: profile.branch === "Computer Science" ? "Computer Science & Engineering" : profile.branch || "Computer Science & Engineering",
        institution:
          profile.institution === "National Institute of Technology" || profile.institution === "Model Senior Secondary School"
            ? "State Institute of Engineering and Technology Nilokheri"
            : profile.institution || "State Institute of Engineering and Technology Nilokheri",
        goals: profile.goals.length > 0 ? profile.goals : ["Score 95%+ in BTech CSE Exams", "Master Data Structures & Algorithms step-by-step"],
      };
      writeStore("codezen:profile", updated);
      return updated;
    }
    return profile;
  }
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

/** Seed or update student profile name & email on authentication. */
function seedProfileIfMissing(name: string, email: string): void {
  const current = readStore<StudentProfile | null>("codezen:profile", null);
  const cleanName =
    name && name !== "Learner"
      ? name
      : email
        ? email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
        : "Learner";

  const updated: StudentProfile = current
    ? { ...current, name: cleanName, email: email || current.email }
    : { ...defaultStudent, name: cleanName, email };

  writeStore("codezen:profile", updated);
  cachedProfile = updated;
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
