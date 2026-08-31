import { marqueeItems } from "@/content";

/**
 * Full-bleed stack ticker, scrolling right to left.
 *
 * The full-bleed is achieved by rendering this outside any Container in
 * page.tsx, so it inherits the body width. It deliberately uses no 100vw math:
 * 100vw includes the classic scrollbar and would push the page into horizontal
 * scroll on desktop. `overflow-hidden` clips the non-wrapping row, so the strip
 * can never widen the document at any viewport size.
 *
 * The loop: the list is rendered twice inside a track that translates -50%.
 * For that to be seamless the translation must equal exactly one copy's width
 * *including* the gap that follows it — so the trailing gap lives inside each
 * list (`pr-6`) rather than between the two (no gap on the track). A gap
 * between the copies would make -50% land half a gap out and show a seam.
 *
 * Every item carries its own trailing separator so the pattern is uniform
 * across the join as well as within a copy.
 *
 * The whole strip stays aria-hidden: the stack is already stated per project
 * on the rows and in each case study, so announcing 15 names mid-page is noise.
 */
export function Marquee() {
  const items = (
    <ul className="flex w-max flex-nowrap items-center gap-6 pr-6">
      {marqueeItems.map((item) => (
        <li key={item} className="flex shrink-0 items-center gap-6">
          <span className="mono-label whitespace-nowrap text-foreground">
            {item}
          </span>
          <span className="text-brand">✦</span>
        </li>
      ))}
    </ul>
  );

  return (
    <div
      aria-hidden="true"
      className="marquee-strip w-full overflow-hidden border-y border-border bg-sky py-10"
    >
      <div className="marquee-track flex w-max">
        {items}
        {/* The duplicate exists only to close the loop. */}
        <div aria-hidden="true" className="flex">
          {items}
        </div>
      </div>
    </div>
  );
}
