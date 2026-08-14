"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Plus } from "lucide-react";

interface GoogleAuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (user: { name: string; email: string }) => void;
}

const PRESET_ACCOUNTS = [
  {
    name: "Vaibhav Singh",
    email: "vaibhav.singh08@gmail.com",
    avatar: "VS",
    gradient: "from-blue-500 to-indigo-600",
  },
  {
    name: "CodeZen Learner",
    email: "student.codezen@gmail.com",
    avatar: "CL",
    gradient: "from-purple-500 to-pink-600",
  },
];

export function GoogleAuthDialog({ open, onOpenChange, onSuccess }: GoogleAuthDialogProps) {
  const [customMode, setCustomMode] = useState(false);
  const [customName, setCustomName] = useState("");
  const [customEmail, setCustomEmail] = useState("");
  const [error, setError] = useState("");

  function handleSelectAccount(account: { name: string; email: string }) {
    onSuccess(account);
    onOpenChange(false);
  }

  function handleCustomSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!customEmail.trim() || !customEmail.includes("@")) {
      setError("Please enter a valid Google email address.");
      return;
    }
    const name = customName.trim() || customEmail.split("@")[0];
    handleSelectAccount({ name, email: customEmail.trim() });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md border-border/80 bg-background/95 p-6 shadow-2xl backdrop-blur-2xl">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-background border p-2 shadow-sm">
            <svg className="h-6 w-6" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
          </div>
          <DialogTitle className="text-xl font-bold tracking-tight">
            Sign in with Google
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Choose an account to continue to <span className="font-semibold text-foreground">CodeZen</span>
          </DialogDescription>
        </DialogHeader>

        {!customMode ? (
          <div className="mt-4 space-y-2">
            {PRESET_ACCOUNTS.map((acc) => (
              <button
                key={acc.email}
                type="button"
                onClick={() => handleSelectAccount(acc)}
                className="flex w-full items-center gap-3 rounded-xl border border-border/60 bg-card p-3 text-left transition-all hover:bg-accent/50 hover:border-primary/40 group"
              >
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${acc.gradient} font-bold text-white text-xs shadow-sm`}>
                  {acc.avatar}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                    {acc.name}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">{acc.email}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
              </button>
            ))}

            <button
              type="button"
              onClick={() => setCustomMode(true)}
              className="flex w-full items-center gap-3 rounded-xl border border-dashed border-border p-3 text-left transition-colors hover:bg-accent/40"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full border bg-muted text-muted-foreground">
                <Plus className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">Use another Google account</p>
                <p className="text-xs text-muted-foreground">Sign in with your own Gmail or Workspace email</p>
              </div>
            </button>
          </div>
        ) : (
          <form onSubmit={handleCustomSubmit} className="mt-4 space-y-3">
            <div>
              <label htmlFor="g-email" className="mb-1 block text-xs font-medium text-muted-foreground">
                Google Email Address
              </label>
              <Input
                id="g-email"
                type="email"
                value={customEmail}
                onChange={(e) => setCustomEmail(e.target.value)}
                placeholder="your.email@gmail.com"
                required
                className="text-sm"
              />
            </div>
            <div>
              <label htmlFor="g-name" className="mb-1 block text-xs font-medium text-muted-foreground">
                Full Name (Optional)
              </label>
              <Input
                id="g-name"
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="Vaibhav Singh"
                className="text-sm"
              />
            </div>
            {error && <p className="text-xs text-destructive">{error}</p>}
            <div className="flex items-center gap-2 pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setCustomMode(false)}>
                Back
              </Button>
              <Button type="submit" size="sm" className="flex-1">
                Continue <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </form>
        )}

        <div className="mt-4 border-t pt-3 text-center text-[11px] text-muted-foreground">
          To continue, Google will share your name, email address, and profile picture with CodeZen.
        </div>
      </DialogContent>
    </Dialog>
  );
}
