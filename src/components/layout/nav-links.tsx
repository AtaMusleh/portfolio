"use client";

// Client component: the links highlight the section currently in view, which
// comes from the shared ActiveSectionProvider. Same state as the scroll-spy —
// one observer, two consumers.

import Link from "next/link";

import { SECTIONS, useActiveSection } from "@/components/motion/active-section";
import { cn } from "@/lib/utils";

export function NavLinks() {
  const active = useActiveSection();

  return (
    <ul className="hidden items-center gap-8 sm:flex">
      {SECTIONS.map((section) => {
        const isActive = active === section.id;
        return (
          <li key={section.id}>
            <Link
              href={`/#${section.id}`}
              aria-current={isActive ? "true" : undefined}
              className={cn(
                "mono-label flex min-h-12 items-center hover:text-brand md:min-h-0",
                isActive ? "text-brand" : "text-muted-foreground",
              )}
            >
              {section.label === "Selected Work" ? "Work" : section.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
