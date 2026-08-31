"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, useRef } from "react";

import { usePointerEffects } from "@/components/motion/use-pointer-effects";

/** Pull starts this far from the button's centre. */
const RADIUS = 80;
/** Hard ceiling on displacement. 8px reads as a pull; 20px reads as a toy. */
const MAX_SHIFT = 8;

/** Settles in roughly 250ms. */
const SPRING = { stiffness: 400, damping: 32, mass: 0.6 } as const;

/**
 * Wraps a single interactive element and nudges it toward the pointer.
 *
 * The wrapper is `inline-flex` and never changes size, so nothing around it
 * reflows — the effect is a transform and nothing else.
 */
export function Magnetic({ children }: { children: React.ReactNode }) {
  const enabled = usePointerEffects();
  const ref = useRef<HTMLSpanElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, SPRING);
  const springY = useSpring(y, SPRING);

  useEffect(() => {
    if (!enabled) {
      x.set(0);
      y.set(0);
      return;
    }

    // Listening on the window rather than the element: the pull has to begin
    // before the pointer arrives, otherwise there is nothing magnetic about it.
    const onMove = (event: PointerEvent) => {
      const node = ref.current;
      if (!node) return;
      const rect = node.getBoundingClientRect();
      const dx = event.clientX - (rect.left + rect.width / 2);
      const dy = event.clientY - (rect.top + rect.height / 2);
      const distance = Math.hypot(dx, dy);

      if (distance > RADIUS) {
        x.set(0);
        y.set(0);
        return;
      }

      // Full strength at the centre, zero at the radius.
      const strength = (1 - distance / RADIUS) * MAX_SHIFT;
      const unit = distance === 0 ? 0 : 1 / distance;
      x.set(dx * unit * strength);
      y.set(dy * unit * strength);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      x.set(0);
      y.set(0);
    };
  }, [enabled, x, y]);

  if (!enabled) return <>{children}</>;

  return (
    <motion.span
      ref={ref}
      className="inline-flex"
      style={{ x: springX, y: springY }}
    >
      {children}
    </motion.span>
  );
}
