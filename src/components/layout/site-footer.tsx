import Link from "next/link";
import { Logo } from "@/components/layout/logo";
import { navLinks } from "@/config/nav";

const resourceLinks = [
  { label: "Explore the Universe", href: "/explore" },
  { label: "All courses", href: "/courses" },
  { label: "Onboarding", href: "/onboarding" },
  { label: "Dashboard", href: "/dashboard" },
];

export function SiteFooter() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-3">
            <Logo />
            <p className="text-sm text-muted-foreground">
              One platform. Every level of learning — from Class 1 to advanced university and
              research.
            </p>
          </div>
          <div>
            <p className="mb-3 text-sm font-semibold">Product</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-foreground">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="mb-3 text-sm font-semibold">Learn</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {resourceLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-foreground">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="mb-3 text-sm font-semibold">The journey</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Class 1 → 12</li>
              <li>Undergraduate</li>
              <li>BTech / BE</li>
              <li>MTech / ME</li>
              <li>Advanced & Research</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} CodeZen. Built for Hackathon PS-013.
        </div>
      </div>
    </footer>
  );
}
