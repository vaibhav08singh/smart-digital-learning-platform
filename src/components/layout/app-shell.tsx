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
  Home,
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
import { useStudentProfile } from "@/services/auth.service";
import { levelLabel } from "@/services/student.service";

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

  return (
    <div className="flex h-full flex-col gap-4 p-4">
      <div className="flex items-center justify-between px-2">
        <Logo />
      </div>

      <Link
        href="/profile"
        onClick={onNavigate}
        className="flex items-center gap-3 rounded-xl border bg-card p-3 transition-colors hover:border-primary/50 hover:bg-accent/50"
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

      <nav className="flex flex-1 flex-col gap-1" aria-label="Sidebar">
        <p className="px-3 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
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
        <p className="px-3 pb-1 pt-4 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
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
        <p className="px-3 pb-1 pt-4 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
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
      </nav>

      <Link
        href="/onboarding"
        className="flex items-center gap-2 rounded-lg border border-dashed px-3 py-2 text-xs text-muted-foreground hover:border-primary hover:text-primary"
      >
        <Home className="h-3.5 w-3.5" />
        Change education level
      </Link>
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
