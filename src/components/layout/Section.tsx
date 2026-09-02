import { PinHeader } from "@/components/motion/pin-header";
import { Reveal } from "@/components/motion/reveal";
import { Fragment } from "react";

import { cn } from "@/lib/utils";

type SectionProps = {
  number: string;
  title: string;
  children: React.ReactNode;
  className?: string;
  id?: string;
  /** Short right-aligned descriptor in the header row. */
  meta?: string;
  /** Pin the header while the section's content scrolls past (lg and up). */
  pinHeader?: boolean;
};

/**
 * A numbered top-level section. `scroll-mt-[var(--nav-clearance)]` keeps the
 * hairline border and header clear of the floating nav pill when an anchor
 * link lands here — scroll-margin-top is what Next uses for hash navigation.
 * --nav-clearance is the single source of truth for that distance; see its
 * definition in globals.css for why it isn't just one fixed number.
 *
 * The header stacks below sm: at 320px the title and meta together exceed the
 * content width, so justify-between only kicks in from sm up.
 */
export function Section({
  number,
  title,
  children,
  className,
  id,
  meta,
  pinHeader = false,
}: SectionProps) {
  // Fragment when unpinned, so an unpinned section's DOM is byte-identical to
  // what it was before this prop existed.
  const Wrapper = pinHeader ? PinHeader : Fragment;

  return (
    // tabIndex={-1} so an anchor link can move focus here, not just scroll —
    // outline-none because a brand ring around a whole section reads as an
    // error, and this is never a Tab stop.
    <section
      id={id}
      tabIndex={-1}
      className={cn(
        "scroll-mt-[var(--nav-clearance)] border-t border-border py-section outline-none",
        className,
      )}
    >
      <Wrapper>
        <Reveal className="mb-16">
          <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
            <div>
              <p className="mono-label text-brand">{number} /</p>
              <h2 className="mt-4 text-h2 text-foreground">{title}</h2>
            </div>
            {meta ? (
              <p className="mono-label text-muted-foreground sm:pt-1 sm:text-right">
                {meta}
              </p>
            ) : null}
          </header>
        </Reveal>
      </Wrapper>
      {children}
    </section>
  );
}
