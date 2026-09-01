"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";

/**
 * Pins a section header while the rest of the section scrolls past it.
 *
 * The layout-safety trick: `pinSpacing: false` means ScrollTrigger adds no
 * padding, so the document's scroll height is untouched. On its own that would
 * collapse the header's space the instant it goes `position: fixed`, and the
 * content below would jump up by the header's height. So the header sits inside
 * a holder whose min-height is pinned to the measured header height and kept in
 * sync by a ResizeObserver. The holder keeps the space; the header inside it
 * stops moving. No added height, no jump either way.
 *
 * Pinned only from lg up and only when motion is allowed — there is not enough
 * viewport height on a phone for this to be anything but annoying.
 */
export function PinHeader({ children }: { children: React.ReactNode }) {
  const holderRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const holder = holderRef.current;
    const inner = innerRef.current;
    if (!holder || !inner) return;

    const section = holder.closest("section");
    if (!section) return;

    const syncHeight = () => {
      holder.style.minHeight = `${inner.offsetHeight}px`;
    };
    syncHeight();

    const observer = new ResizeObserver(syncHeight);
    observer.observe(inner);

    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      const trigger = ScrollTrigger.create({
        trigger: section,
        // 80px clears the sticky nav, matching the anchor offset.
        start: "top top+=80",
        // Release when the section's bottom reaches the pinned header.
        end: () => `bottom top+=${80 + inner.offsetHeight}`,
        pin: inner,
        pinSpacing: false,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      });
      return () => trigger.kill();
    });

    return () => {
      observer.disconnect();
      mm.revert();
      holder.style.minHeight = "";
    };
  }, []);

  return (
    <div ref={holderRef}>
      <div ref={innerRef}>{children}</div>
    </div>
  );
}
