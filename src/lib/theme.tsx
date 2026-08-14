"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type Theme = "light" | "dark";
type Contrast = "normal" | "high";

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
  contrast: Contrast;
  setContrast: (c: Contrast) => void;
  fontScale: number;
  setFontScale: (s: number) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const THEME_KEY = "codezen:theme";
const CONTRAST_KEY = "codezen:contrast";
const FONT_KEY = "codezen:font-scale";

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "light";
  const stored = window.localStorage.getItem(THEME_KEY) as Theme | null;
  if (stored === "light" || stored === "dark") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => getInitialTheme());
  const [contrast, setContrast] = useState<Contrast>(() => {
    if (typeof window === "undefined") return "normal";
    return (window.localStorage.getItem(CONTRAST_KEY) as Contrast) || "normal";
  });
  const [fontScale, setFontScale] = useState<number>(() => {
    if (typeof window === "undefined") return 100;
    const stored = Number(window.localStorage.getItem(FONT_KEY));
    return Number.isFinite(stored) && stored >= 80 && stored <= 140 ? stored : 100;
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    window.localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  useEffect(() => {
    const root = document.documentElement;
    if (contrast === "high") root.dataset.contrast = "high";
    else delete root.dataset.contrast;
    window.localStorage.setItem(CONTRAST_KEY, contrast);
  }, [contrast]);

  useEffect(() => {
    document.documentElement.style.setProperty("--font-scale", `${fontScale}%`);
    window.localStorage.setItem(FONT_KEY, String(fontScale));
  }, [fontScale]);

  const toggleTheme = useCallback(() => {
    setTheme((t) => (t === "dark" ? "light" : "dark"));
  }, []);

  const value = useMemo(
    () => ({ theme, toggleTheme, contrast, setContrast, fontScale, setFontScale }),
    [theme, toggleTheme, contrast, fontScale],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
