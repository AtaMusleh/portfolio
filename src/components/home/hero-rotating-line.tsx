"use client";

import { useEffect, useRef, useState } from "react";

import { site } from "@/content";

const TYPE_MS = 55;
const DELETE_MS = 35;
const HOLD_MS = 1500;

// Same reduced-motion detection pattern as reveal.tsx / about-tabs.tsx: starts
// false so the server and first client render agree.
function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  return reduced;
}

/**
 * Typewriter line: types a phrase, holds, deletes it, moves to the next,
 * loops forever. The visible span is aria-hidden — it is mid-word for most of
 * its life, which is not useful to a screen reader — and a permanent sr-only
 * span carries the full phrase list instead, so AT users get the complete
 * information immediately rather than waiting on an animation.
 *
 * min-h-[1lh] + whitespace-nowrap on the visible span fixes the line's box to
 * exactly one line height regardless of which phrase (or how much of it) is
 * currently rendered, so typing/deleting never shifts surrounding layout.
 */
export function HeroRotatingLine({ className }: { className?: string }) {
  const reducedMotion = usePrefersReducedMotion();
  const [text, setText] = useState("");
  const phraseIndexRef = useRef(0);

  useEffect(() => {
    if (reducedMotion) {
      setText(site.rotatingPhrases[0] ?? "");
      return;
    }

    let cancelled = false;
    let timeoutId: number;

    function type(phrase: string, i: number) {
      if (cancelled) return;
      setText(phrase.slice(0, i));
      if (i < phrase.length) {
        timeoutId = window.setTimeout(() => type(phrase, i + 1), TYPE_MS);
      } else {
        timeoutId = window.setTimeout(() => erase(phrase, phrase.length), HOLD_MS);
      }
    }

    function erase(phrase: string, i: number) {
      if (cancelled) return;
      setText(phrase.slice(0, i));
      if (i > 0) {
        timeoutId = window.setTimeout(() => erase(phrase, i - 1), DELETE_MS);
      } else {
        const next = (phraseIndexRef.current + 1) % site.rotatingPhrases.length;
        phraseIndexRef.current = next;
        timeoutId = window.setTimeout(() => type(site.rotatingPhrases[next], 0), TYPE_MS);
      }
    }

    type(site.rotatingPhrases[phraseIndexRef.current] ?? "", 0);

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [reducedMotion]);

  return (
    <p className={className}>
      <span
        aria-hidden="true"
        className="mono-label inline-block min-h-[1lh] overflow-hidden whitespace-nowrap align-middle text-brand"
      >
        {text}
        {!reducedMotion && (
          <span className="ml-0.5 inline-block h-[1em] w-[2px] translate-y-[0.15em] animate-[caret-blink_1s_steps(1)_infinite] bg-brand align-middle" />
        )}
      </span>
      <span className="sr-only">{site.rotatingPhrases.join(" / ")}</span>
    </p>
  );
}
