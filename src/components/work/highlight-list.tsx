import { Reveal } from "@/components/motion/reveal";
import { RouteMap } from "@/components/work/route-map";
import type { Highlight } from "@/content";

/**
 * The engineering highlights — the reason the page exists.
 *
 * PROBLEM and APPROACH sit side by side from lg up. Both blocks carry the same
 * padding and border box so their text baselines line up; only APPROACH paints
 * its border and surface, which is what makes the pair read as two distinct
 * things rather than one run of prose.
 */
export function HighlightList({
  highlights,
  slug,
}: {
  highlights: Highlight[];
  slug?: string;
}) {
  return (
    <ol className="flex list-none flex-col">
      {highlights.map((highlight, index) => (
        // One unit, no internal stagger: these sit far apart, so each simply
        // triggers on its own as you scroll.
        <Reveal
          as="li"
          key={highlight.title}
          className="border-t border-border py-12 first:border-t-0 first:pt-0 lg:py-16 lg:first:pt-0"
        >
          <div className="flex flex-col gap-3 lg:flex-row lg:gap-10">
            <span className="mono-label text-brand lg:w-12 lg:shrink-0 lg:pt-1">
              {String(index + 1).padStart(2, "0")}
            </span>

            <div className="min-w-0 flex-1">
              {/* Roam's route highlight demonstrates itself. */}
              {slug === "roam" &&
              highlight.title.startsWith("Scroll-driven") ? (
                <RouteMap />
              ) : null}
              <h3 className="text-h3 text-foreground">{highlight.title}</h3>

              <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2 lg:items-start lg:gap-8">
                <div className="max-w-prose border border-transparent p-6">
                  <p className="mono-label text-muted-foreground">Problem</p>
                  <p className="mt-4 text-body text-muted-foreground">
                    {highlight.problem}
                  </p>
                </div>

                <div className="max-w-prose border border-border bg-muted p-6">
                  <p className="mono-label text-brand">Approach</p>
                  <p className="mt-4 text-body text-foreground">
                    {highlight.approach}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      ))}
    </ol>
  );
}
