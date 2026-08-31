import { cn } from "@/lib/utils";

/**
 * Ambient background wash. Purely decorative — three heavily blurred radial
 * gradients in --brand and --brand-2.
 *
 * Plain CSS: no image, canvas, or SVG filter. It scales to any viewport and
 * costs nothing to download.
 *
 * Containment: this fills a parent that must carry `relative isolate
 * overflow-hidden`. `isolate` matters — without a stacking context on the
 * parent, a negative z-index here would drop the shapes behind the page
 * background and they would vanish. `overflow-hidden` clips the oversized
 * shapes, which is what keeps them from adding scroll height or horizontal
 * overflow; no 100vw is involved anywhere.
 *
 * Opacity is tuned per theme. Dark gets a glow, light gets a wash — the same
 * value looks wrong in the other theme.
 *
 * Static. No animation in this pass.
 */
export function Bloom({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 -z-10 overflow-hidden",
        className,
      )}
    >
      <div className="absolute -top-48 -left-40 size-[42rem] rounded-full bg-[radial-gradient(circle,var(--brand)_0%,transparent_70%)] opacity-[0.07] blur-[120px] will-change-transform dark:opacity-[0.16]" />
      <div className="absolute -top-24 -right-48 size-[38rem] rounded-full bg-[radial-gradient(circle,var(--brand-2)_0%,transparent_70%)] opacity-[0.06] blur-[120px] will-change-transform dark:opacity-[0.14]" />
      <div className="absolute -bottom-56 left-1/3 size-[34rem] rounded-full bg-[radial-gradient(circle,var(--brand)_0%,transparent_70%)] opacity-[0.05] blur-[120px] will-change-transform dark:opacity-[0.12]" />
    </div>
  );
}
