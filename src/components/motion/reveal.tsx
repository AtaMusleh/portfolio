"use client";

// The only new client component. Motion needs the browser, and the
// reduced-motion decision has to be made in JS (see below).

import { motion } from "motion/react";
import { useEffect, useState } from "react";

/** 24px and 300ms are deliberate. Longer or further reads as slow, not considered. */
const DISTANCE = 24;
const DURATION = 0.3;
const EASE = [0.22, 1, 0.36, 1] as const;

const TAGS = {
  div: motion.div,
  section: motion.section,
  li: motion.li,
} as const;

type RevealProps = {
  children: React.ReactNode;
  /** Stagger offset in **milliseconds**. */
  delay?: number;
  className?: string;
  as?: "div" | "section" | "li";
  /**
   * `scroll` (default) waits for the element to enter the viewport.
   *
   * `mount` animates immediately. This exists because the mandated viewport
   * margin of `-10% 0px` shrinks the observer root at the top as well as the
   * bottom, so an element sitting in the top 10% of the first screen — the hero
   * rule, the case study back link — never intersects it and would stay hidden
   * forever. Above-the-fold blocks are given `mount` instead.
   */
  trigger?: "scroll" | "mount";
};

export function Reveal({
  children,
  delay = 0,
  className,
  as = "div",
  trigger = "scroll",
}: RevealProps) {
  // Starts false so the server and the first client render agree. A reduce user
  // is covered before this resolves by the `!important` guard in globals.css,
  // which outranks the inline styles Motion server-renders.
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(query.matches);
    sync();
    // Re-evaluated live: the setting can be toggled without a reload.
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  // Reduced motion renders the final state with no motion wrapper at all — no
  // inline styles for CSS to have to fight, no initial hidden state, no flash.
  // A faster animation is not the same thing.
  if (reduced) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  const Component = TAGS[as];

  return (
    <Component
      // Hook for the reduced-motion and no-JS guards in globals.css / layout.
      data-reveal=""
      className={className}
      initial={{ opacity: 0, y: DISTANCE }}
      {...(trigger === "mount"
        ? { animate: { opacity: 1, y: 0 } }
        : {
            whileInView: { opacity: 1, y: 0 },
            viewport: { once: true, margin: "-10% 0px" as const },
          })}
      // No `exit`: nothing animates out.
      transition={{ duration: DURATION, ease: EASE, delay: delay / 1000 }}
    >
      {children}
    </Component>
  );
}
