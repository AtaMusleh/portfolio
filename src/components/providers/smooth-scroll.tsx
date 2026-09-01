"use client";

// The only client component added here. It owns the Lenis instance, its rAF
// loop, and everything that has to change because Lenis bypasses native
// scrolling: in-page anchors, deep links, and history restoration.

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { usePathname } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from "react";

/**
 * Matches the `scroll-mt-20` (5rem) offset the sections carry for native hash
 * navigation. Lenis does not apply scroll-margin, so the gap under the sticky
 * nav has to be passed explicitly.
 */
const NAV_OFFSET = 80;

// Registered once, at module scope. gsap.registerPlugin is idempotent, but
// doing it here keeps every ScrollTrigger consumer from having to think about
// it.
gsap.registerPlugin(ScrollTrigger);

type ScrollToHash = (
  hash: string,
  options: { immediate: boolean; focus: boolean },
) => boolean;

/**
 * Exposes this provider's own scroll-to-hash so other components (the
 * scroll-spy) reuse the exact Lenis path the anchor links take — same offset,
 * same focus move, same reduced-motion fallback — instead of reimplementing it.
 */
const SmoothScrollContext = createContext<ScrollToHash | null>(null);

export function useScrollToHash() {
  return useContext(SmoothScrollContext);
}

/** easeOutExpo. */
const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  /** Set when the pending route change came from back/forward. */
  const poppedRef = useRef(false);
  const pathname = usePathname();

  // --- instance lifecycle, gated on prefers-reduced-motion -----------------
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    let tickerFn: ((time: number) => void) | null = null;

    const start = () => {
      if (lenisRef.current) return;
      const lenis = new Lenis({
        duration: 1.1,
        easing: easeOutExpo,
        smoothWheel: true,
        // syncTouch stays false (the default): native momentum scrolling on
        // touch is better than anything Lenis does, and overriding it feels
        // wrong.
        autoRaf: false,
      });
      lenisRef.current = lenis;

      // --- GSAP <-> Lenis ---------------------------------------------------
      // ScrollTrigger reads native scroll position, but Lenis animates its own
      // value and writes it out. Without these two lines every trigger fires at
      // the wrong place, or never.
      //
      // 1. Tell ScrollTrigger to re-evaluate on Lenis's own scroll event.
      // 2. Drive Lenis from GSAP's ticker instead of a second rAF loop, so
      //    scroll and tween updates happen in one frame, in a known order.
      //    lagSmoothing(0) stops GSAP compensating for dropped frames, which
      //    would otherwise desync Lenis's position from the tweens.
      lenis.on("scroll", ScrollTrigger.update);
      tickerFn = (time: number) => lenis.raf(time * 1000); // GSAP ticks in seconds
      gsap.ticker.add(tickerFn);
      gsap.ticker.lagSmoothing(0);
    };

    const stop = () => {
      if (tickerFn) {
        gsap.ticker.remove(tickerFn);
        tickerFn = null;
      }
      // Hand pacing back to GSAP's default when Lenis is not driving.
      gsap.ticker.lagSmoothing(500, 33);
      lenisRef.current?.off("scroll", ScrollTrigger.update);
      lenisRef.current?.destroy();
      lenisRef.current = null;
      // Native scrolling now: ScrollTrigger falls back to its own listeners,
      // but its cached positions were computed while Lenis was driving.
      ScrollTrigger.refresh();
    };

    // Reduced motion means Lenis never initialises at all — native scrolling,
    // not a Lenis instance configured to be instant. Re-evaluated live, because
    // the setting can be toggled without a reload.
    const sync = () => (query.matches ? stop() : start());
    sync();
    query.addEventListener("change", sync);

    return () => {
      query.removeEventListener("change", sync);
      stop();
    };
  }, []);

  /**
   * Scroll so the hash target sits NAV_OFFSET below the viewport top.
   *
   * The destination is computed as an absolute document position rather than
   * handed to Lenis as an element. Passing the element makes the result depend
   * on Lenis's internal animated position, which is stale right after the
   * browser's own jump to a hash on load — that produced a doubled offset.
   *
   * Focus moves immediately rather than on scroll completion: assistive tech
   * should not wait out a 1.1s animation, and `preventScroll` stops the browser
   * from short-circuiting the animation to bring the target into view.
   */
  const scrollToHash = useCallback(
    (
      hash: string,
      { immediate, focus }: { immediate: boolean; focus: boolean },
    ) => {
      const id = decodeURIComponent(hash.slice(1));
      const target = document.getElementById(id);
      if (!target) return false;

      const top = Math.max(
        0,
        target.getBoundingClientRect().top + window.scrollY - NAV_OFFSET,
      );

      // Same class of bug as the skip link: scrolling is not focusing. The
      // sections carry tabIndex={-1} so they can receive it.
      if (focus) {
        if (!target.hasAttribute("tabindex"))
          target.setAttribute("tabindex", "-1");
        target.focus({ preventScroll: true });
      }

      const lenis = lenisRef.current;
      if (lenis) lenis.scrollTo(top, { immediate, force: true });
      else window.scrollTo({ top, behavior: "auto" });

      return true;
    },
    [],
  );

  // --- in-page anchor clicks ------------------------------------------------
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
        return;

      const anchor = (event.target as Element | null)?.closest?.("a");
      if (!anchor) return;
      if (anchor.target && anchor.target !== "_self") return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      let url: URL;
      try {
        url = new URL(href, window.location.href);
      } catch {
        return;
      }

      if (url.origin !== window.location.origin) return;
      if (!url.hash) return;
      // A different page: let Next navigate, then the pathname effect below
      // scrolls to the hash on arrival.
      if (url.pathname !== window.location.pathname) return;

      if (!scrollToHash(url.hash, { immediate: false, focus: true })) return;
      event.preventDefault();
      // Capture phase, so this runs before next/link's own handler. Stopping
      // propagation here keeps Link from also pushing a route for what is only
      // an in-page move.
      event.stopPropagation();
      // Keep the URL shareable, and match what a native anchor does to history.
      window.history.pushState(null, "", url.hash);
    };

    // Capture: next/link calls preventDefault() on the anchor, so a
    // bubble-phase listener would always see defaultPrevented and bail.
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [scrollToHash]);

  // --- deep links, cross-page anchors, and hashed history entries ----------
  useEffect(() => {
    if (!window.location.hash) return;

    // Runs on first paint, on arrival from a cross-page anchor, and when
    // back/forward lands on a hashed entry. In every case the hash is where
    // that entry means to be, so scrolling to it *is* the correct restoration.
    // One tick for layout, so the target has its final position. `immediate`:
    // arriving at a deep link should not animate thousands of pixels.
    // Back/forward: wait out the browser's own scroll restoration, which lands
    // after React renders and would otherwise overwrite this correction.
    const popped = poppedRef.current;
    poppedRef.current = false;

    const timer = window.setTimeout(
      () => {
        scrollToHash(window.location.hash, { immediate: true, focus: !popped });
      },
      popped ? 450 : 120,
    );
    return () => window.clearTimeout(timer);
  }, [pathname, scrollToHash]);

  // The App Router keeps the same document across navigations, so every
  // trigger's cached start/end is stale after a route change.
  useEffect(() => {
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 200);
    return () => window.clearTimeout(id);
  }, [pathname]);

  useEffect(() => {
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  // --- history restoration --------------------------------------------------
  useEffect(() => {
    const onPopState = () => {
      poppedRef.current = true;
      // Two frames: one for the browser to apply its restore, one to read it.
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          const hash = window.location.hash;

          // A hashed entry on the page we are already on: fix it up now. On a
          // cross-route restore the target is not mounted at popstate time, so
          // this returns false and the pathname effect above handles it once
          // the new route renders.
          if (hash && scrollToHash(hash, { immediate: true, focus: false }))
            return;
          if (hash) return;

          // No hash: the browser's restored scrollY is the source of truth.
          // Lenis keeps its own animated position and would otherwise glide
          // back to where it thought it was.
          lenisRef.current?.scrollTo(window.scrollY, {
            immediate: true,
            force: true,
          });
        }),
      );
    };

    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [scrollToHash]);

  return (
    <SmoothScrollContext.Provider value={scrollToHash}>
      {children}
    </SmoothScrollContext.Provider>
  );
}
