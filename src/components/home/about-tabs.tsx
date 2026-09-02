"use client";

// Client component: the tab panel is selected state. Radix Tabs owns the
// roving-tabindex keyboard behaviour (arrow keys, Home, End), which is exactly
// why this is not hand-rolled.

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Dumbbell, Gamepad2, GraduationCap, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { about, experience, site } from "@/content";

// Mapped by interest name, with a neutral fallback so adding an interest to
// content never crashes the page.
const INTEREST_ICONS: Record<string, LucideIcon> = {
  Lifting: Dumbbell,
  Gaming: Gamepad2,
};

type TabValue = "me" | "education" | "interests";

// Starts false so the server and the first client render agree — same
// reduced-motion detection pattern as reveal.tsx.
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

// The dark: duplicates are required, not redundant: the shadcn base carries
// `dark:data-active:text-foreground`, which is a more specific variant stack
// than `data-active:text-brand` and would otherwise win in dark mode.
// after:hidden kills shadcn's own static underline pseudo-element — the
// sliding bar below (a shared-layoutId motion.span) replaces it so there is
// only ever one indicator.
const TRIGGER =
  // min-h-11 below md: the trigger is a touch target, and its natural height is
  // well under 44px. outline-2/outline-brand overrides the shadcn default 1px
  // ring so the focus indicator matches the rest of the site.
  "mono-label min-h-11 min-w-11 justify-start rounded-none px-0 pb-3 text-muted-foreground after:hidden md:min-h-0 md:min-w-0 " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand " +
  "data-active:bg-transparent data-active:text-brand " +
  "dark:text-muted-foreground dark:data-active:text-brand";

// Radix gives the active panel tabindex=0, and shadcn's base sets outline-none
// on it — that would leave a focusable element with no visible focus ring.
// focus-visible:outline-solid is required: shadcn's base sets outline-none,
// which zeroes --tw-outline-style, and outline-2 only sets the width.
// absolute + inset-0 keeps the (never simultaneously mounted, see below)
// panels from contributing to layout height — the fixed min-h on the
// wrapper is what holds the box's size, not the panels.
//
// This is an instant swap, not a crossfade: an opacity-based crossfade here
// briefly painted both panels at partial opacity at once, which read as
// overlapping text (e.g. "Gaming"/"Lifting" chips ghosting over fading
// Education text) since neither panel has its own opaque background to mask
// the other. Making it non-simultaneous (fade the outgoing panel out fully,
// *then* fade the incoming one in) would need Radix's Presence-driven
// content to mount hidden during that gap via animation-delay +
// animation-fill-mode:backwards — but Radix also force-zeroes
// animation-duration inline on whichever panel is selected at mount, and
// fill-mode:backwards applies regardless of duration, so the initially
// active panel would render invisible for the delay window on first paint.
// Dropping the animation entirely sidesteps that: with no animation for
// Presence to detect, it unmounts the outgoing panel the instant the trigger
// changes, so exactly one panel is ever painted.
const PANEL =
  "absolute inset-0 p-8 md:p-12 focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand";

function TabUnderline({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <motion.span
      layoutId="about-tab-underline"
      className="absolute inset-x-0 -bottom-[5px] h-0.5 bg-brand"
      transition={reducedMotion ? { duration: 0 } : { duration: 0.25, ease: "easeOut" }}
    />
  );
}

export function AboutTabs({ age }: { age: number }) {
  const current = experience[0];
  const [value, setValue] = useState<TabValue>("me");
  const reducedMotion = usePrefersReducedMotion();

  return (
    <Tabs value={value} onValueChange={(v) => setValue(v as TabValue)} className="gap-0">
      <TabsList variant="line" className="h-auto gap-4 p-0 md:gap-8">
        <TabsTrigger value="me" className={TRIGGER}>
          Me
          {value === "me" && <TabUnderline reducedMotion={reducedMotion} />}
        </TabsTrigger>
        <TabsTrigger value="education" className={TRIGGER}>
          Education
          {value === "education" && <TabUnderline reducedMotion={reducedMotion} />}
        </TabsTrigger>
        <TabsTrigger value="interests" className={TRIGGER}>
          Interests
          {value === "interests" && <TabUnderline reducedMotion={reducedMotion} />}
        </TabsTrigger>
      </TabsList>

      {/* min-h keeps the block a fixed size across tabs so switching does not
          make the page jump — sized to the tallest tab's content (Me) at the
          narrowest width in each padding tier, measured directly rather than
          guessed: 26rem covers Me's wrapped intro up to 320px (measured
          ~405px including padding, at the p-8 tier), 15rem covers it from
          md up (measured ~234px including padding at 768px, the narrowest
          width in the p-12 tier — content only gets shorter as the viewport
          widens past that, since the intro is also capped by max-w-prose).
          A single fixed value across both tiers can't fit both: Me's intro
          wraps onto more lines at narrow widths, so it is taller there than
          at desktop, not shorter. relative anchors the absolutely-positioned
          panels (see PANEL above). */}
      <div className="relative mt-8 min-h-[26rem] border border-border bg-muted md:min-h-[15rem]">
        <TabsContent value="me" className={PANEL}>
          <p className="max-w-prose text-body-lg text-foreground">{about.intro}</p>
          <p className="mono-label mt-8 text-muted-foreground">
            {age} years old
            <span className="text-brand"> / </span>
            {site.location}
            {current ? (
              <>
                <span className="text-brand"> / </span>
                {current.company}
              </>
            ) : null}
          </p>
        </TabsContent>

        <TabsContent value="education" className={PANEL}>
          <div className="flex items-start gap-4">
            <GraduationCap aria-hidden="true" className="mt-1 size-5 shrink-0 text-brand" />
            <div>
              <h3 className="text-h3 text-foreground">{about.education.degree}</h3>
              <p className="mono-label mt-3 text-muted-foreground">
                {about.education.institution}
                <span className="text-brand"> / </span>
                {about.education.period}
              </p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="interests" className={PANEL}>
          <ul className="flex flex-wrap gap-3">
            {about.interests.map((interest) => {
              const Icon = INTEREST_ICONS[interest] ?? Sparkles;
              return (
                <li
                  key={interest}
                  className="mono-label flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-foreground"
                >
                  <Icon aria-hidden="true" className="size-4 text-brand" />
                  {interest}
                </li>
              );
            })}
          </ul>
        </TabsContent>
      </div>
    </Tabs>
  );
}
