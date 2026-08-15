import Link from "next/link";
import { cn } from "@/lib/utils";

export function LogoIcon({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", className)}
      aria-hidden="true"
    >
      <defs>
        {/* Core Purple/Violet Futuristic Gradient */}
        <linearGradient
          id="cz-logo-gradient"
          x1="4"
          y1="4"
          x2="36"
          y2="36"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#818CF8" />
          <stop offset="45%" stopColor="#A855F7" />
          <stop offset="100%" stopColor="#EC4899" />
        </linearGradient>

        {/* Outer Frame Glow Gradient */}
        <linearGradient
          id="cz-frame-gradient"
          x1="0"
          y1="0"
          x2="40"
          y2="40"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#6366F1" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#8B5CF6" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#D946EF" stopOpacity="0.8" />
        </linearGradient>

        {/* Cosmic Background Gradient */}
        <linearGradient
          id="cz-bg-gradient"
          x1="0"
          y1="0"
          x2="40"
          y2="40"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#1E1B4B" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#0B092A" stopOpacity="0.98" />
        </linearGradient>

        {/* Neural Core Glow Filter */}
        <filter id="cz-glow-blur" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.8" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Outer Hex/Superellipse Housing with Cyber Border */}
      <rect
        x="2.5"
        y="2.5"
        width="35"
        height="35"
        rx="10"
        fill="url(#cz-bg-gradient)"
        stroke="url(#cz-frame-gradient)"
        strokeWidth="1.5"
      />

      {/* Ambient Neural Core Glow */}
      <circle cx="20" cy="20" r="11" fill="#8B5CF6" opacity="0.18" className="animate-pulse" />

      {/* Left Code Bracket / 'C' Path */}
      <path
        d="M 16.5 12 L 10.5 20 L 16.5 28"
        stroke="url(#cz-logo-gradient)"
        strokeWidth="2.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#cz-glow-blur)"
      />

      {/* Right Code Bracket / '>' Path */}
      <path
        d="M 23.5 12 L 29.5 20 L 23.5 28"
        stroke="url(#cz-logo-gradient)"
        strokeWidth="2.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#cz-glow-blur)"
      />

      {/* Central Neural AI Zen Connector Axis */}
      <path
        d="M 13.5 24.5 L 26.5 15.5"
        stroke="url(#cz-logo-gradient)"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.85"
      />

      {/* Neural AI Nodes */}
      <circle cx="20" cy="20" r="2.75" fill="#EC4899" />
      <circle cx="20" cy="20" r="1.25" fill="#FFFFFF" />

      {/* Terminal Pulse Points */}
      <circle cx="10.5" cy="20" r="1.5" fill="#818CF8" />
      <circle cx="29.5" cy="20" r="1.5" fill="#F472B6" />
      <circle cx="16.5" cy="12" r="1.25" fill="#C084FC" />
      <circle cx="23.5" cy="28" r="1.25" fill="#C084FC" />
    </svg>
  );
}

export function Logo({
  href = "/",
  className,
  compact = false,
}: {
  href?: string;
  className?: string;
  compact?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn("group flex items-center gap-2.5 select-none focus:outline-none", className)}
      aria-label="CodeZen home"
    >
      <div className="relative flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
        {/* Glow halo behind logo on hover */}
        <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-indigo-500/30 via-purple-500/30 to-fuchsia-500/30 opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-100" />
        <LogoIcon className="h-8 w-8 relative z-10" />
      </div>

      {!compact && (
        <span className="text-lg font-extrabold tracking-tight flex items-center gap-0.5">
          <span className="text-slate-100 font-bold group-hover:text-white transition-colors">
            Code
          </span>
          <span className="bg-gradient-to-r from-violet-400 via-purple-300 to-fuchsia-400 bg-clip-text text-transparent group-hover:from-violet-300 group-hover:to-fuchsia-300 transition-all font-black">
            Zen
          </span>
          {/* Subtle AI brand node dot */}
          <span className="h-1.5 w-1.5 rounded-full bg-fuchsia-400 ml-0.5 shadow-sm shadow-fuchsia-400/50 inline-block animate-pulse" />
        </span>
      )}
    </Link>
  );
}

