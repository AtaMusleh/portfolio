"use client";

import { useEffect, useState } from "react";

/**
 * The single gate for every pointer-driven effect.
 *
 * Two conditions, both watched live so plugging in a mouse — or toggling the OS
 * motion setting — takes effect without a reload:
 *
 *  - `(hover: hover) and (pointer: fine)` — a real pointing device. On touch the
 *    calling components render nothing at all rather than hiding with CSS.
 *  - not `prefers-reduced-motion: reduce`.
 *
 * Starts `false` so the server render and the first client render agree; the
 * effects appear a tick after hydration, which is invisible because none of
 * them are part of the page's content.
 */
export function usePointerEffects() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    const sync = () => setEnabled(fine.matches && !reduced.matches);
    sync();

    fine.addEventListener("change", sync);
    reduced.addEventListener("change", sync);
    return () => {
      fine.removeEventListener("change", sync);
      reduced.removeEventListener("change", sync);
    };
  }, []);

  return enabled;
}
