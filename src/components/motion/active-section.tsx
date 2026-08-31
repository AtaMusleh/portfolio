"use client";

// Client component: owns the single IntersectionObserver that decides which
// section is currently in view, and shares the answer through context so the
// scroll-spy and the nav do not each run their own observer.

import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useRef, useState } from "react";

export const SECTIONS = [
  { id: "work", label: "Selected Work" },
  { id: "about", label: "About" },
  { id: "explore", label: "Explore" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" },
] as const;

/** A challenger must beat the incumbent by this much before the active section
 *  changes. Without it the two sections either side of a boundary have almost
 *  identical visible heights and the smallest scroll jitter flips the state
 *  back and forth. */
const HYSTERESIS = 1.15;

const ActiveSectionContext = createContext<string | null>(null);

export function useActiveSection() {
  return useContext(ActiveSectionContext);
}

export function ActiveSectionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [active, setActive] = useState<string | null>(null);
  const activeRef = useRef<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const elements = SECTIONS.map(({ id }) =>
      document.getElementById(id),
    ).filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) {
      // Case study pages have no matching ids — nothing is active.
      activeRef.current = null;
      setActive(null);
      return;
    }

    const recompute = () => {
      const viewport = window.innerHeight;
      const shares = new Map<string, number>();
      let bestId: string | null = null;
      let bestShare = 0;

      // "Largest share of the viewport", measured directly rather than taken
      // from intersectionRatio — a ratio is relative to each section's own
      // height, so a short section can report 1.0 while filling a sliver.
      for (const el of elements) {
        const rect = el.getBoundingClientRect();
        const visible = Math.max(
          0,
          Math.min(rect.bottom, viewport) - Math.max(rect.top, 0),
        );
        shares.set(el.id, visible);
        if (visible > bestShare) {
          bestShare = visible;
          bestId = el.id;
        }
      }

      if (bestShare <= 0 || bestId === null) return; // above the first section: keep the last answer

      const current = activeRef.current;
      if (current !== null && current !== bestId) {
        const currentShare = shares.get(current) ?? 0;
        if (bestShare < currentShare * HYSTERESIS) return;
      }

      if (bestId !== current) {
        activeRef.current = bestId;
        setActive(bestId);
      }
    };

    // The observer is only the trigger — the work happens in recompute, which
    // reads five rects. Nothing polls per frame.
    const observer = new IntersectionObserver(recompute, {
      threshold: Array.from({ length: 21 }, (_, i) => i / 20),
    });
    elements.forEach((el) => observer.observe(el));
    recompute();

    window.addEventListener("resize", recompute, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", recompute);
    };
  }, [pathname]);

  return (
    <ActiveSectionContext.Provider value={active}>
      {children}
    </ActiveSectionContext.Provider>
  );
}
