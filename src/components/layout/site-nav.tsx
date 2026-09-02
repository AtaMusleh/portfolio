import { FileDown } from "lucide-react";
import Link from "next/link";

import { NavLinks } from "@/components/layout/nav-links";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { site } from "@/content";

export function SiteNav() {
  return (
    // Fixed wrapper, not the pill itself: centring and the top offset live
    // here so the pill's own width can stay content-sized (shrink-to-fit),
    // which is what makes it read as a pill rather than a bar. z-50 clears
    // page content and the scroll-spy (z-40) but stays under the skip link
    // (z-100), so a keyboard user's skip target is never covered.
    // max-w-[calc(100%-2rem)] is the overflow guard: content width is
    // otherwise unbounded, and this caps it at 16px clear of each viewport
    // edge no matter how long the nav content gets.
    // w-max is required, not decorative: a fixed element positioned with
    // left-50% and no matching `right` sizes itself via the CSS2.1 abspos
    // shrink-to-fit algorithm, whose "available width" is calculated from the
    // *left offset*, not the viewport — at left:50% that is only half the
    // viewport. With a nowrap flex row that quirk is invisible (shrink-to-fit
    // still lands on the true content width), but once the nav below can
    // wrap, the halved available width made it wrap far earlier than it
    // needed to. w-max forces sizing to true max-content width instead,
    // and max-width still clamps it on top.
    <div className="fixed top-5 left-1/2 z-50 w-max max-w-[calc(100%-2rem)] -translate-x-1/2">
      <nav
        aria-label="Main"
        // flex-wrap is a defensive fallback, not the normal case: between the
        // sm (640px, where the link row appears) and md (768px, where the
        // toggle shrinks) breakpoints, the combined content is wider than the
        // gutter-clamped pill. Without wrapping, the shrink-0 children refuse
        // to shrink and the last one renders past the pill's rounded edge
        // instead of inside it. Wrapping keeps every child inside the pill's
        // border at every width; it has no effect once content fits on one
        // line, which is true everywhere outside that narrow band.
        className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 rounded-full border border-border bg-background/80 px-6 py-3 backdrop-blur-md sm:gap-x-8"
      >
        <Link
          href="/"
          className="mono-label flex min-h-12 shrink-0 items-center text-foreground hover:text-brand md:min-h-0"
        >
          {site.name}
        </Link>

        {/* Below sm the anchors collapse to a single mailto — no menu,
            no JavaScript. NavLinks is a client component only because it
            highlights the section currently in view. */}
        <NavLinks />

        <a
          href={`mailto:${site.email}`}
          className="mono-label flex min-h-12 shrink-0 items-center text-muted-foreground hover:text-brand sm:hidden"
        >
          Email
        </a>

        {/* Renders nothing at all while resumeUrl is null — no empty
            element, so no leftover gap in the flex row. */}
        {site.resumeUrl ? (
          <a
            href={site.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mono-label hidden min-h-12 shrink-0 items-center gap-2 rounded-full border border-border px-3 py-1.5 text-muted-foreground transition duration-150 hover:bg-muted hover:text-brand sm:flex md:min-h-0"
          >
            <FileDown aria-hidden="true" className="size-4" />
            Resume
          </a>
        ) : null}

        <ThemeToggle />
      </nav>
    </div>
  );
}
