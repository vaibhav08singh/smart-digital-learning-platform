"use client";

import { Accessibility, Check, Moon, Sun, ZoomIn, ZoomOut } from "lucide-react";
import { useSyncExternalStore, useState } from "react";
import { useTheme } from "@/lib/theme";
import { Button } from "@/components/ui/button";

const emptySubscribe = () => () => {};

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const isDark = mounted && theme === "dark";
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Light mode" : "Dark mode"}
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  );
}

/** Accessibility controls: high contrast + adjustable font size. */
export function AccessibilityControls() {
  const { contrast, setContrast, fontScale, setFontScale } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        aria-label="Accessibility controls"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        title="Accessibility"
      >
        <Accessibility className="h-4 w-4" />
      </Button>
      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-64 rounded-xl border bg-popover p-4 text-popover-foreground shadow-lg">
          <p className="mb-3 text-sm font-medium">Accessibility</p>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">High contrast</span>
              <button
                type="button"
                role="switch"
                aria-checked={contrast === "high"}
                onClick={() => setContrast(contrast === "high" ? "normal" : "high")}
                className="relative h-5 w-9 rounded-full bg-muted transition-colors data-[on=true]:bg-primary"
                data-on={contrast === "high" || undefined}
              >
                <span
                  className={`absolute top-0.5 h-4 w-4 rounded-full bg-foreground transition-transform ${
                    contrast === "high" ? "translate-x-4" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs text-muted-foreground">Font size</span>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="iconSm"
                  aria-label="Decrease font size"
                  disabled={fontScale <= 80}
                  onClick={() => setFontScale(fontScale - 10)}
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <span className="w-8 text-center text-xs tabular-nums">{fontScale}%</span>
                <Button
                  variant="ghost"
                  size="iconSm"
                  aria-label="Increase font size"
                  disabled={fontScale >= 140}
                  onClick={() => setFontScale(fontScale + 10)}
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          <p className="mt-3 flex items-center gap-1 text-[11px] text-muted-foreground">
            <Check className="h-3 w-3" /> Changes are saved automatically
          </p>
        </div>
      )}
    </div>
  );
}
