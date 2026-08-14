"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  BookOpen,
  Bot,
  Brain,
  CalendarDays,
  Compass,
  GraduationCap,
  LayoutDashboard,
  Library,
  Settings,
  Terminal,
  User,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/layout/logo";
import { AccessibilityControls } from "@/components/layout/accessibility";
import { UserAvatar } from "@/components/profile/user-avatar";
import { Button } from "@/components/ui/button";
import { useStudentProfile, isAdminUser } from "@/services/auth.service";
import { levelLabel } from "@/services/student.service";
import { ShieldCheck } from "lucide-react";

const mainNav = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Explore", href: "/explore", icon: Compass },
  { label: "Courses", href: "/courses", icon: BookOpen },
  { label: "Practice", href: "/practice", icon: Zap },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
  { label: "AI Tutor", href: "/ai-tutor", icon: Bot },
  { label: "Subjects", href: "/subjects", icon: BookOpen },
];

const learnNav = [
  { label: "Coding Lab", href: "/coding-lab", icon: Terminal },
  { label: "Study Planner", href: "/planner", icon: CalendarDays },
  { label: "Weakness Detector", href: "/weakness", icon: Brain },
  { label: "Resource Hub", href: "/resources", icon: Library },
];

const accountNav = [
  { label: "Profile", href: "/profile", icon: User },
  { label: "Settings", href: "/settings", icon: Settings },
];

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const profile = useStudentProfile();
  const isAdmin = isAdminUser(profile.email);

  return (
    <div className="flex h-full min-h-0 flex-col gap-3 p-4">
      <div className="flex shrink-0 items-center justify-between px-2">
        <Logo />
      </div>

      <Link
        href="/profile"
        onClick={onNavigate}
        className="flex shrink-0 items-center gap-3 rounded-xl border bg-card p-3 transition-colors hover:border-primary/50 hover:bg-accent/50"
        title="Go to profile"
      >
        <UserAvatar avatarId={profile.avatarId} name={profile.name} className="h-9 w-9" />
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{profile.name}</p>
          <p className="truncate text-xs text-muted-foreground">
            {levelLabel(profile.levelId)}
          </p>
        </div>
      </Link>

      <nav className="flex flex-1 min-h-0 flex-col gap-1 overflow-y-auto pr-1" aria-label="Sidebar">
        <p className="px-3 pb-1 pt-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Learn
        </p>
        {mainNav.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              )}
              aria-current={active ? "page" : undefined}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
        <p className="px-3 pb-1 pt-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          AI Tools
        </p>
        {learnNav.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              )}
              aria-current={active ? "page" : undefined}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
        <p className="px-3 pb-1 pt-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Account
        </p>
        {accountNav.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              )}
              aria-current={active ? "page" : undefined}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
        {isAdmin && (
          <Link
            href="/admin"
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-semibold transition-colors border border-amber-500/30 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 my-1",
              pathname === "/admin" && "bg-amber-500/25 text-amber-200"
            )}
          >
            <ShieldCheck className="h-4 w-4 text-amber-400" />
            👑 Admin Portal
          </Link>
        )}
      </nav>

      <div className="shrink-0 pt-2 border-t border-border/50">
        <Link
          href="/onboarding"
          onClick={onNavigate}
          className="flex items-center gap-2.5 rounded-xl border border-dashed border-primary/30 bg-primary/5 px-3 py-2.5 text-xs font-medium text-muted-foreground transition-all hover:border-primary hover:bg-primary/10 hover:text-primary"
        >
          <GraduationCap className="h-4 w-4 text-primary shrink-0" />
          <span>Change education level</span>
        </Link>
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const profile = useStudentProfile();

  return (
    <div className="min-h-dvh w-full">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r bg-background lg:block">
        <SidebarContent />
      </aside>

      <div className="flex min-h-dvh flex-col lg:pl-64">
        {/* Mobile top bar */}
        <div className="sticky top-0 z-30 flex h-14 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-md lg:hidden">
          <Logo compact />
          <div className="flex items-center gap-1">
            <AccessibilityControls />
            <Button asChild variant="ghost" size="icon" aria-label="Go to profile" title="Go to profile">
              <Link href="/profile">
                <UserAvatar
                  avatarId={profile.avatarId}
                  name={profile.name}
                  className="h-7 w-7"
                />
              </Link>
            </Button>
            <MobileNav />
          </div>
        </div>

        {/* Desktop top bar */}
        <div className="sticky top-0 z-20 hidden h-14 items-center justify-between border-b bg-background/80 px-6 backdrop-blur-md lg:flex">
          <Breadcrumb pathname={pathname} />
          <div className="flex items-center gap-1">
            <AccessibilityControls />
            <Button asChild variant="ghost" size="icon" aria-label="Go to profile" title="Go to profile">
              <Link href="/profile">
                <UserAvatar
                  avatarId={profile.avatarId}
                  name={profile.name}
                  className="h-8 w-8"
                />
              </Link>
            </Button>
          </div>
        </div>

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}

function MobileNav() {
  return (
    <details className="group relative">
      <summary
        className="flex h-9 w-9 cursor-pointer list-none items-center justify-center rounded-md hover:bg-accent"
        aria-label="Open navigation"
      >
        <span className="flex flex-col gap-1">
          <span className="h-0.5 w-4 rounded-full bg-foreground" />
          <span className="h-0.5 w-4 rounded-full bg-foreground" />
        </span>
      </summary>
      <div className="absolute right-0 top-11 z-50 w-64 overflow-hidden rounded-xl border bg-popover shadow-lg">
        <div className="max-h-[70dvh] overflow-y-auto">
          <SidebarContent onNavigate={() => (document.querySelector("summary") as HTMLElement)?.click()} />
        </div>
      </div>
    </details>
  );
}

const breadcrumbMap: Record<string, string> = {
  dashboard: "Dashboard",
  explore: "Knowledge Explorer",
  courses: "Courses",
  practice: "Practice",
  quiz: "Quiz",
  results: "Results",
  analytics: "Analytics",
  "ai-tutor": "AI Tutor",
  subjects: "Subjects",
  profile: "Profile",
  settings: "Settings",
  learning: "Learning",
  onboarding: "Onboarding",
  "coding-lab": "Coding Lab",
  planner: "Study Planner",
  weakness: "Weakness Detector",
  resources: "Resource Hub",
};

function Breadcrumb({ pathname }: { pathname: string }) {
  const segment = pathname.split("/").filter(Boolean)[0] ?? "dashboard";
  const label = breadcrumbMap[segment] ?? "CodeZen";
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex items-center gap-2 text-sm">
        <li className="text-muted-foreground">CodeZen</li>
        <li className="text-muted-foreground">/</li>
        <li aria-current="page" className="font-medium">
          {label}
        </li>
      </ol>
    </nav>
  );
}
