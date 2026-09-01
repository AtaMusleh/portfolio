"use client";

import { gsap } from "gsap";
import { useEffect, useRef } from "react";

import { usePointerEffects } from "@/components/motion/use-pointer-effects";

// 12x8 as specified. A reduction to 8x5 was measured and made no difference
// (56.6ms vs 56.1ms), because the cost is not this grid: an animating element
// in the same stacking context as the Bloom forces its 120px blur to re-run
// every frame, and only where a machine falls back to software rasterisation.
// On GPU rasterisation the mesh is free. Shipping a smaller grid would have
// been a cosmetic concession that bought nothing.
const COLS = 12;
const ROWS = 8;
const VIEW_W = 1200;
const VIEW_H = 800;

/** Sine drift: full cycle, peak displacement. */
const CYCLE_MS = 24000;
const DRIFT = 8;

/** Pointer attraction: radius and peak pull. */
const POINTER_RADIUS = 120;
const POINTER_PULL = 6;

/**
 * Geometry rewrite interval. The drift cycle is 24 seconds — resolving it at
 * 60fps repaints a large stroked area every frame for motion far too slow to
 * need it. 40ms (25fps) is visually identical here and cuts the paint work to
 * roughly a third.
 */
const FRAME_MS = 40;

type Point = { baseX: number; baseY: number; phase: number };

const POINTS: Point[] = [];
for (let row = 0; row < ROWS; row++) {
  for (let col = 0; col < COLS; col++) {
    POINTS.push({
      baseX: (col / (COLS - 1)) * VIEW_W,
      baseY: (row / (ROWS - 1)) * VIEW_H,
      // Offsetting the phase per point is what makes it breathe rather than
      // slide as one sheet.
      phase: (col * 0.7 + row * 1.3) % (Math.PI * 2),
    });
  }
}

const index = (row: number, col: number) => row * COLS + col;

/**
 * Thin-line wireframe behind the contact section.
 *
 * Purely decorative and pointer-inert. Drawn as 20 polylines (8 rows + 12
 * columns) over 96 shared points, so a frame is 96 sine evaluations and 20
 * attribute writes — cheap enough to sit on GSAP's existing ticker rather than
 * opening another rAF loop.
 *
 * Kept at 15%/8% opacity so it reads as texture under the bloom rather than
 * competing with it.
 */
export function ContactMesh() {
  const pointerEnabled = usePointerEffects();
  const svgRef = useRef<SVGSVGElement>(null);
  const pointer = useRef<{ x: number; y: number } | null>(null);
  const pointerDirtyRef = useRef(false);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const rows = gsap.utils.toArray<SVGPolylineElement>(
      svg.querySelectorAll("[data-row]"),
    );
    const cols = gsap.utils.toArray<SVGPolylineElement>(
      svg.querySelectorAll("[data-col]"),
    );
    const positions = POINTS.map((p) => ({ x: p.baseX, y: p.baseY }));

    // Reused buffers: no per-frame array or string allocation beyond the join.
    const rowBuf = new Array(COLS);
    const colBuf = new Array(ROWS);
    const r1 = (n: number) => Math.round(n * 10) / 10;

    const write = () => {
      for (let row = 0; row < rows.length; row++) {
        for (let col = 0; col < COLS; col++) {
          const p = positions[index(row, col)];
          rowBuf[col] = r1(p.x) + "," + r1(p.y);
        }
        rows[row].setAttribute("points", rowBuf.join(" "));
      }
      for (let col = 0; col < cols.length; col++) {
        for (let row = 0; row < ROWS; row++) {
          const p = positions[index(row, col)];
          colBuf[row] = r1(p.x) + "," + r1(p.y);
        }
        cols[col].setAttribute("points", colBuf.join(" "));
      }
    };

    write();

    // Reading getBoundingClientRect inside the tick forced a synchronous
    // layout every frame, right after writing 20 attributes — classic
    // read-after-write thrash, and it cost ~37ms/frame. The rect is cached and
    // only refreshed on scroll and resize.
    let rect = svg.getBoundingClientRect();
    const measure = () => {
      rect = svg.getBoundingClientRect();
    };
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure, { passive: true });

    // The mesh sits at the foot of the page. There is no reason to animate it
    // while it is nowhere near the viewport.
    let visible = false;

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) measure();
      },
      { rootMargin: "200px" },
    );
    observer.observe(svg);

    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      let lastWrite = 0;
      const tick = () => {
        if (!visible) return;
        const now = performance.now();
        // Pointer pull still wants to feel responsive, so allow a rewrite as
        // soon as the pointer has moved, otherwise stick to the slow cadence.
        if (now - lastWrite < FRAME_MS && !pointerDirtyRef.current) return;
        lastWrite = now;
        pointerDirtyRef.current = false;
        const t = (now % CYCLE_MS) / CYCLE_MS;
        const angle = t * Math.PI * 2;

        // Pointer position in SVG user units.
        let px: number | null = null;
        let py: number | null = null;
        let scaleX = 1;
        let scaleY = 1;
        if (pointerEnabled && pointer.current) {
          scaleX = VIEW_W / rect.width;
          scaleY = VIEW_H / rect.height;
          px = (pointer.current.x - rect.left) * scaleX;
          py = (pointer.current.y - rect.top) * scaleY;
        }
        const radius = POINTER_RADIUS * Math.max(scaleX, scaleY);
        const pull = POINTER_PULL * Math.max(scaleX, scaleY);

        for (let i = 0; i < POINTS.length; i++) {
          const p = POINTS[i];
          let x = p.baseX + Math.sin(angle + p.phase) * DRIFT;
          let y = p.baseY + Math.cos(angle + p.phase * 0.8) * DRIFT;

          if (px !== null && py !== null) {
            const dx = px - x;
            const dy = py - y;
            const dist = Math.hypot(dx, dy);
            if (dist < radius && dist > 0.001) {
              const strength = (1 - dist / radius) * pull;
              x += (dx / dist) * strength;
              y += (dy / dist) * strength;
            }
          }

          positions[i].x = x;
          positions[i].y = y;
        }
        write();
      };

      gsap.ticker.add(tick);
      return () => gsap.ticker.remove(tick);
    });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
      mm.revert();
    };
  }, [pointerEnabled]);

  useEffect(() => {
    if (!pointerEnabled) {
      pointer.current = null;
      return;
    }
    const onMove = (event: PointerEvent) => {
      pointer.current = { x: event.clientX, y: event.clientY };
      pointerDirtyRef.current = true;
    };
    const onLeave = () => {
      pointer.current = null;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
      pointer.current = null;
    };
  }, [pointerEnabled]);

  return (
    <div
      aria-hidden="true"
      // isolate + a compositing hint keep this layer's repaints to itself. Without
      // them the mesh invalidates the blurred Bloom stacked in the same context,
      // which then has to re-run a 120px blur every frame.
      className="pointer-events-none absolute inset-0 -z-10 isolate transform-gpu overflow-hidden opacity-[0.08] will-change-transform dark:opacity-[0.15]"
    >
      <svg
        ref={svgRef}
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        preserveAspectRatio="none"
        // Anti-aliasing thin strokes over a large area is the dominant paint cost
        // when a machine falls back to software rasterisation. The mesh sits at
        // 8-15% opacity, where the difference is invisible.
        shapeRendering="optimizeSpeed"
        className="h-full w-full"
        fill="none"
      >
        {Array.from({ length: ROWS }, (_, row) => (
          <polyline
            key={`row-${row}`}
            data-row=""
            stroke="var(--brand)"
            strokeWidth={1}
          />
        ))}
        {Array.from({ length: COLS }, (_, col) => (
          <polyline
            key={`col-${col}`}
            data-col=""
            stroke="var(--brand)"
            strokeWidth={1}
          />
        ))}
      </svg>
    </div>
  );
}
