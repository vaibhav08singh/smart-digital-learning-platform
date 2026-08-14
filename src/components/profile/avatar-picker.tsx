"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { AvatarArt } from "@/components/profile/avatar-art";
import { avatarOptions, getAvatarOption } from "@/data/avatars";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface AvatarPickerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Currently selected avatar id. */
  value: string;
  onSelect: (id: string) => void;
}

export function AvatarPicker({ open, onOpenChange, value, onSelect }: AvatarPickerProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Choose your avatar</DialogTitle>
          <DialogDescription>
            Pick a cartoon character to represent you across CodeZen.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-4 gap-3 py-2">
          {avatarOptions.map((option) => {
            const selected = option.id === value;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => onSelect(option.id)}
                className={cn(
                  "group relative flex flex-col items-center gap-1 rounded-2xl border-2 p-2 transition-all",
                  selected
                    ? "border-indigo-500 bg-indigo-50 ring-2 ring-indigo-200"
                    : "border-transparent bg-muted/60 hover:border-indigo-300 hover:bg-muted",
                )}
              >
                <div
                  className={cn(
                    "h-16 w-16 rounded-full bg-gradient-to-br p-0.5",
                    option.gradient,
                  )}
                >
                  <AvatarArt option={option} className="h-full w-full rounded-full bg-white" />
                </div>
                <span className="text-xs font-medium">{option.label}</span>
                {selected && (
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-500 text-white">
                    <Check className="h-3 w-3" />
                  </span>
                )}
              </button>
            );
          })}
        </div>
        <p className="text-xs text-muted-foreground">
          Selected: <span className="font-medium text-foreground">{getAvatarOption(value).label}</span>
        </p>
      </DialogContent>
    </Dialog>
  );
}
