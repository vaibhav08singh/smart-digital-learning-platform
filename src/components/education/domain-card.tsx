"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Domain } from "@/types";
import { cn } from "@/lib/utils";

import { DomainIcon } from "@/components/education/domain-icon";

export function DomainCard({
  domain,
  selected,
  onSelect,
  href,
}: {
  domain: Domain;
  selected?: boolean;
  onSelect?: (domain: Domain) => void;
  href?: string;
}) {
  const isCardLink = Boolean(href && !onSelect);
  const inner = (
    <div
      className={cn(
        "group flex h-full cursor-pointer flex-col rounded-2xl border bg-card p-5 transition-all",
        selected
          ? "border-primary ring-2 ring-primary/40"
          : "hover:-translate-y-1 hover:border-primary/40 hover:shadow-md",
      )}
      onClick={onSelect ? () => onSelect(domain) : undefined}
      role={onSelect ? "button" : undefined}
      tabIndex={onSelect ? 0 : undefined}
      aria-pressed={selected}
      onKeyDown={
        onSelect
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSelect(domain);
              }
            }
          : undefined
      }
    >
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-md transition-transform group-hover:scale-110" style={{ backgroundColor: domain.color }}>
        <DomainIcon domainId={domain.id} className="h-5 w-5" />
      </div>
      <p className="font-semibold">{domain.name}</p>
      <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{domain.description}</p>
      <div className="mt-auto pt-3 text-xs font-medium text-primary">
        {href &&
          (isCardLink ? (
            <span className="inline-flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
              Explore <ArrowRight className="h-3 w-3" />
            </span>
          ) : (
            <Link href={href} onClick={(e) => e.stopPropagation()} className="inline-flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
              Explore <ArrowRight className="h-3 w-3" />
            </Link>
          ))}
      </div>
    </div>
  );

  if (href && !onSelect) {
    return <Link href={href} className="block h-full">{inner}</Link>;
  }
  return inner;
}
