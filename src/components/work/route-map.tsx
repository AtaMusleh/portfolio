"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";

/**
 * The stylised journey referenced by Roam's "Scroll-driven route animation"
 * highlight — the page demonstrating the thing it describes rather than only
 * saying it.
 *
 * Decorative: the prose already carries the meaning, so the whole thing is
 * aria-hidden.
 */
const VIEW_W = 640;
const VIEW_H = 220;

/** A single curved route through six stops. */
const PATH =
  "M 30 170 C 90 60, 150 200, 215 120 S 330 30, 400 110 S 520 200, 610 60";

const WAYPOINTS = [
  { x: 30, y: 170 },
  { x: 145, y: 128 },
  { x: 215, y: 120 },
  { x: 330, y: 74 },
  { x: 470, y: 148 },
  { x: 610, y: 60 },
];

export function RouteMap() {
  const rootRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const path = pathRef.current;
    if (!root || !path) return;

    const length = path.getTotalLength();
    const dots = gsap.utils.toArray<SVGCircleElement>(root.querySelectorAll("[data-dot]"));

    // gsap.matchMedia handles the reduced-motion branch and cleans itself up.
    const mm = gsap.matchMedia();

    mm.add(
      {
        motion: "(prefers-reduced-motion: no-preference)",
        reduced: "(prefers-reduced-motion: reduce)",
      },
      (context) => {
        const { motion } = context.conditions as { motion: boolean; reduced: boolean };

        if (!motion) {
          // Fully drawn, every dot visible, no scroll dependency at all.
          gsap.set(path, { strokeDasharray: length, strokeDashoffset: 0 });
          gsap.set(dots, { opacity: 1, scale: 1, transformOrigin: "center" });
          return;
        }

        gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
        gsap.set(dots, { opacity: 0, scale: 0.4, transformOrigin: "center" });

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: root,
            start: "top 85%",
            end: "bottom 55%",
            // scrub: 1 gives a second of catch-up rather than a rigid 1:1 tie,
            // so fast scrolling does not snap the line.
            scrub: 1,
          },
        });

        timeline.to(path, { strokeDashoffset: 0, ease: "none", duration: dots.length });
        // Each dot lands as the line reaches it.
        dots.forEach((dot, index) => {
          timeline.to(dot, { opacity: 1, scale: 1, duration: 0.35, ease: "power2.out" }, index * 0.92);
        });

        return () => {
          timeline.scrollTrigger?.kill();
          timeline.kill();
        };
      }
    );

    // Positions are only correct once fonts and images have settled.
    const refresh = window.setTimeout(() => ScrollTrigger.refresh(), 150);

    return () => {
      window.clearTimeout(refresh);
      mm.revert();
    };
  }, []);

  return (
    <div ref={rootRef} aria-hidden="true" className="mb-10">
      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        className="h-auto w-full max-w-prose overflow-visible"
        fill="none"
      >
        <path
          ref={pathRef}
          d={PATH}
          stroke="var(--brand)"
          strokeWidth={2}
          strokeLinecap="round"
        />
        {WAYPOINTS.map((point) => (
          <circle
            key={`${point.x}-${point.y}`}
            data-dot=""
            cx={point.x}
            cy={point.y}
            r={6}
            fill="var(--brand-2)"
          />
        ))}
      </svg>
    </div>
  );
}
