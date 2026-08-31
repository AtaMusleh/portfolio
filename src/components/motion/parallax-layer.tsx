"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import { useRef } from "react";

import { usePointerEffects } from "@/components/motion/use-pointer-effects";

/** Peak shift on each axis. 6px, not 20. */
const MAX_SHIFT = 6;

const SPRING = { stiffness: 260, damping: 30, mass: 0.6 } as const;

/**
 * Shifts a media frame's *contents* against the pointer. The frame itself —
 * its border, its background, its box — never moves.
 *
 * The listener sits on a non-moving `absolute inset-0` layer that exactly
 * covers the frame, and only the layer inside it translates. Listening on the
 * moving element would let the pointer slip outside it near the edges and
 * flicker between enter and leave.
 */
export function ParallaxLayer({ children }: { children: React.ReactNode }) {
  const enabled = usePointerEffects();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, SPRING);
  const springY = useSpring(y, SPRING);
  const boundsRef = useRef<HTMLDivElement>(null);

  if (!enabled) return <>{children}</>;

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const node = boundsRef.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    // -0.5 .. 0.5 across the frame, negated so the content moves against the
    // pointer, then scaled to the ±6px ceiling.
    const nx = (event.clientX - rect.left) / rect.width - 0.5;
    const ny = (event.clientY - rect.top) / rect.height - 0.5;
    x.set(-nx * MAX_SHIFT * 2);
    y.set(-ny * MAX_SHIFT * 2);
  };

  const onPointerLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div
      ref={boundsRef}
      className="absolute inset-0"
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      <motion.div className="h-full w-full" style={{ x: springX, y: springY }}>
        {children}
      </motion.div>
    </div>
  );
}
