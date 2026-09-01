"use client";

// Client component: reads the shared active section and moves focus/scroll on
// click. Both need the browser.

import { usePathname } from "next/navigation";

import { SECTIONS, useActiveSection } from "@/components/motion/active-section";
import { useScrollToHash } from "@/components/providers/smooth-scroll";
import { cn } from "@/lib/utils";

export function ScrollSpy() {
  const active = useActiveSection();
  const scrollToHash = useScrollToHash();
  const pathname = usePathname();

  // Home page only — the section ids do not exist anywhere else.
  if (pathname !== "/") return null;

  return (
    // Fixed, so its position in the DOM does not matter; it lives inside <main>
    // purely to sit under the smooth-scroll provider.
    // left-3 at lg, left-6 from xl: at 1024px the page gutter is only 5vw =
    // 51.2px, and 24px + a 32px dash + a 4px focus ring would cross it.
    <nav
      aria-label="Sections"
      className="fixed top-1/2 left-3 z-40 hidden -translate-y-1/2 flex-col lg:flex xl:left-6"
    >
      {SECTIONS.map((section) => {
        const isActive = active === section.id;
        return (
          <button
            key={section.id}
            type="button"
            aria-label={`Go to ${section.label}`}
            aria-current={isActive ? "true" : undefined}
            onClick={() =>
              scrollToHash?.(`#${section.id}`, {
                immediate: false,
                focus: true,
              })
            }
            className="flex h-6 w-8 items-center justify-start"
          >
            <span
              aria-hidden="true"
              className={cn(
                // The global reduced-motion block zeroes this duration, which is
                // exactly the required behaviour: still tracking, but instant.
                "h-px transition-[width,background-color,opacity] duration-200 ease-out",
                isActive
                  ? "w-8 bg-brand opacity-100"
                  : "w-4 bg-muted-foreground opacity-30",
              )}
            />
          </button>
        );
      })}
    </nav>
  );
}
