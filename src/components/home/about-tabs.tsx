"use client";

// Client component: the tab panel is selected state. Radix Tabs owns the
// roving-tabindex keyboard behaviour (arrow keys, Home, End), which is exactly
// why this is not hand-rolled.

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

// The dark: duplicates are required, not redundant: the shadcn base carries
// `dark:data-active:text-foreground`, which is a more specific variant stack
// than `data-active:text-brand` and would otherwise win in dark mode.
const TRIGGER =
  // min-h-11 below md: the trigger is a touch target, and its natural height is
  // well under 44px. outline-2/outline-brand overrides the shadcn default 1px
  // ring so the focus indicator matches the rest of the site.
  "mono-label min-h-11 min-w-11 justify-start rounded-none px-0 pb-3 text-muted-foreground after:bg-brand md:min-h-0 md:min-w-0 " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand " +
  "data-active:bg-transparent data-active:text-brand " +
  "dark:text-muted-foreground dark:data-active:text-brand";

// Radix gives the active panel tabindex=0, and shadcn's base sets outline-none
// on it — that would leave a focusable element with no visible focus ring.
// focus-visible:outline-solid is required: shadcn's base sets outline-none,
// which zeroes --tw-outline-style, and outline-2 only sets the width.
const PANEL =
  "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand";

export function AboutTabs({ age }: { age: number }) {
  const current = experience[0];

  return (
    <Tabs defaultValue="me" className="gap-0">
      <TabsList variant="line" className="h-auto gap-4 p-0 md:gap-8">
        <TabsTrigger value="me" className={TRIGGER}>
          Me
        </TabsTrigger>
        <TabsTrigger value="education" className={TRIGGER}>
          Education
        </TabsTrigger>
        <TabsTrigger value="interests" className={TRIGGER}>
          Interests
        </TabsTrigger>
      </TabsList>

      {/* min-h keeps the block a fixed size across tabs so switching does not
          make the page jump. */}
      <div className="mt-8 min-h-[18rem] border border-border bg-muted p-8 md:p-12">
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
