"use client";

import { ArrowUpRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { usePointerEffects } from "@/components/motion/use-pointer-effects";
import { cn } from "@/lib/utils";

/**
 * Easing factor applied per frame. 0.2 is the number that matters most here:
 * below ~0.15 the cursor drags behind and reads as broken, above ~0.25 it snaps
 * and there is no point having it at all.
 */
const LERP = 0.2;

type CursorState = "default" | "interactive" | "card" | "selecting";

const SIZE: Record<CursorState, number> = {
  default: 8,
  interactive: 32,
  card: 48,
  selecting: 2,
};

export function Cursor() {
  const enabled = usePointerEffects();
  const [moved, setMoved] = useState(false);
  const [state, setState] = useState<CursorState>("default");
  const dotRef = useRef<HTMLDivElement>(null);

  // Pointer target and the eased position that chases it.
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!enabled) {
      // Whatever happens, never leave someone without a cursor.
      document.documentElement.classList.remove("cursor-hidden");
      setMoved(false);
      return;
    }

    let frame = 0;
    let seenMove = false;

    const onMove = (event: PointerEvent) => {
      target.current.x = event.clientX;
      target.current.y = event.clientY;
      if (!seenMove) {
        seenMove = true;
        // Jump to the pointer on the very first move so it does not fly in
        // from the corner.
        current.current.x = event.clientX;
        current.current.y = event.clientY;
        setMoved(true);
        document.documentElement.classList.add("cursor-hidden");
      }
    };

    const onOver = (event: PointerEvent) => {
      const el = event.target as Element | null;
      if (!el?.closest) return;
      if (el.closest('a[href^="/work/"], #explore a')) setState("card");
      else if (el.closest("a, button, [role='button']"))
        setState("interactive");
      else setState("default");
    };

    const onSelectionChange = () => {
      const selection = document.getSelection();
      const selecting = !!selection && !selection.isCollapsed;
      setState((previous) =>
        selecting
          ? "selecting"
          : previous === "selecting"
            ? "default"
            : previous,
      );
    };

    const tick = () => {
      current.current.x += (target.current.x - current.current.x) * LERP;
      current.current.y += (target.current.y - current.current.y) * LERP;
      const node = dotRef.current;
      if (node) {
        node.style.transform = `translate3d(${current.current.x}px, ${current.current.y}px, 0) translate(-50%, -50%)`;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    document.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    document.addEventListener("selectionchange", onSelectionChange);

    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("selectionchange", onSelectionChange);
      document.documentElement.classList.remove("cursor-hidden");
    };
  }, [enabled]);

  // Nothing at all before the first pointer move, so a keyboard-only user never
  // sees it and the native cursor is never hidden for them.
  if (!enabled || !moved) return null;

  const size = SIZE[state];

  return (
    <div
      ref={dotRef}
      aria-hidden="true"
      data-cursor={state}
      // z-90 sits above page content but below the skip link (z-100), so it can
      // never cover the one thing a keyboard user needs to see. pointer-events
      // none means it can never absorb a click.
      className={cn(
        "pointer-events-none fixed top-0 left-0 z-90 flex items-center justify-center rounded-full",
        "transition-[width,height,background-color,border-color,opacity,border-radius] duration-150 ease-out",
        state === "selecting" ? "rounded-none bg-brand" : "bg-brand",
        state === "interactive" && "border border-brand bg-brand/20",
        state === "card" && "border border-brand bg-brand/20",
      )}
      style={{
        width: state === "selecting" ? 2 : size,
        height: state === "selecting" ? 24 : size,
      }}
    >
      {state === "card" ? (
        <ArrowUpRight aria-hidden="true" className="size-5 text-brand" />
      ) : null}
    </div>
  );
}
