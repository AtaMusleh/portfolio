import { marqueeItems } from "@/content";

/**
 * Full-bleed stack ticker. Static for now — it gets motion in a later pass.
 *
 * The full-bleed is achieved by rendering this outside any Container in
 * page.tsx, so it inherits the body width. It deliberately uses no 100vw math:
 * 100vw includes the classic scrollbar and would push the page into horizontal
 * scroll on desktop. `overflow-hidden` clips the non-wrapping row, so the strip
 * can never widen the document at any viewport size.
 */
export function Marquee() {
  return (
    <div aria-hidden="true"
      className="w-full overflow-hidden border-y border-border bg-sky py-10">
      <ul className="flex w-max flex-nowrap items-center gap-6 px-gutter">
        {marqueeItems.map((item, index) => (
          <li key={item} className="flex shrink-0 items-center gap-6">
            <span className="mono-label whitespace-nowrap text-foreground">{item}</span>
            {index < marqueeItems.length - 1 ? (
              <span aria-hidden="true" className="text-brand">
                ✦
              </span>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
