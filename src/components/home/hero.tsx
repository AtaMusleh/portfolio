import { ArrowDown, ChevronDown, Mail } from "lucide-react";
import Link from "next/link";

import { GitHubIcon } from "@/components/icons/github";
import { LinkedInIcon } from "@/components/icons/linkedin";
import { CodePanel } from "@/components/home/code-panel";
import { HeroRotatingLine } from "@/components/home/hero-rotating-line";
import { Reveal } from "@/components/motion/reveal";
import { Magnetic } from "@/components/motion/magnetic";
import { Container } from "@/components/layout/Container";
import { experience, site } from "@/content";

const elsewhere = [
  { label: "Email", href: `mailto:${site.email}`, external: false, Icon: Mail },
  { label: "GitHub", href: site.github, external: true, Icon: GitHubIcon },
  {
    label: "LinkedIn",
    href: site.linkedin,
    external: true,
    Icon: LinkedInIcon,
  },
];

export function Hero() {
  const current = experience[0];

  // The last word is drawn as an outline; everything before it stays solid.
  const parts = site.name.split(" ");
  const lastName = parts.length > 1 ? parts[parts.length - 1] : "";
  const firstNames =
    parts.length > 1 ? parts.slice(0, -1).join(" ") : site.name;

  return (
    <Container>
      {/* svh, not vh: vh is measured against the largest viewport on mobile
          browsers with retracting toolbars, which pushes the bottom block off
          the first screen.
          The subtraction matters: <main> now carries pt-[var(--nav-clearance)]
          to clear the floating pill, and that padding sits ABOVE this div. If
          the hero were still a flat 100svh, the padding would make hero +
          padding taller than one screen, pushing the AVAILABLE/CURRENTLY/
          ELSEWHERE strip below the fold on first load. Subtracting the same
          clearance here keeps hero + padding exactly one screen again.

          md:min-h-0, re-pinned at lg: below lg the CodePanel (absolutely
          positioned, see below) is hidden, so forcing this column to a full
          screen's height left nothing to fill the leftover space between the
          CTAs and the scroll chevron — worst at md, where lines wrap least
          and the leftover is largest. Below md the content wraps enough on
          its own to mostly fill the screen, so the gap was never visible
          there; from lg up the CodePanel needs the full-height column to
          center against. */}
      <div className="flex min-h-[calc(100svh-var(--nav-clearance))] flex-col md:min-h-0 lg:min-h-[calc(100svh-var(--nav-clearance))]">
        {/* TOP */}
        <Reveal trigger="mount">
          <div className="flex flex-wrap justify-between gap-x-8 gap-y-1 border-b border-border py-6">
            <p className="mono-label text-muted-foreground">{site.role}</p>
            <p className="mono-label text-muted-foreground">{site.location}</p>
          </div>
        </Reveal>

        {/* MIDDLE */}
        <div className="py-20">
          <Reveal trigger="mount" delay={60}>
            <h1 className="text-display text-foreground">
              {firstNames}
              {lastName ? (
                <>
                  {" "}
                  <span className="text-stroked">{lastName}</span>
                </>
              ) : null}
            </h1>
          </Reveal>

          <Reveal trigger="mount" delay={90}>
            <HeroRotatingLine className="mt-4" />
          </Reveal>

          <Reveal trigger="mount" delay={120}>
            <p className="mt-8 max-w-prose text-body-lg text-muted-foreground">
              {site.tagline}
            </p>
          </Reveal>

          <Reveal trigger="mount" delay={180}>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
              <Magnetic>
                <Link
                  href="#contact"
                  className="mono-label flex h-12 items-center justify-center gap-2 rounded-full bg-brand px-6 text-brand-foreground transition duration-150 hover:bg-brand/85"
                >
                  <Mail aria-hidden="true" className="size-4" />
                  Get in touch
                </Link>
              </Magnetic>
              <Magnetic>
                <Link
                  href="#work"
                  className="mono-label flex h-12 items-center justify-center gap-2 rounded-full border border-border px-6 text-foreground transition duration-150 hover:bg-muted"
                >
                  <ArrowDown aria-hidden="true" className="size-4" />
                  View work
                </Link>
              </Magnetic>
            </div>
          </Reveal>
        </div>

        {/* Fills the empty band between the CTAs and the bottom strip on
            desktop only. Absolutely positioned — not a flex sibling — because
            the band is produced by mt-auto on the chevron below soaking up
            whatever space the flex column has left over. An in-flow panel
            here competes with that slack for room: at typical viewport
            heights the panel's own content (header + 10 lines) is taller than
            the slack, so the flex column would grow past min-h-[100svh] to
            fit it, adding real scroll height. Taking it out of flow removes
            that coupling entirely — the hero's height-driven layout cannot
            react to this panel's size at all. It anchors to Container, the
            nearest positioned ancestor, so `right-0` lands on the gutter
            edge and `top-1/2` centers it in the hero regardless of how tall
            the hero ends up being. */}
        <div className="hidden lg:absolute lg:top-1/2 lg:right-0 lg:block lg:w-full lg:max-w-md lg:-translate-y-1/2">
          <Reveal trigger="mount" delay={210}>
            <CodePanel />
          </Reveal>
        </div>

        {/* BOTTOM — mt-auto pins it to the foot of the first screen without
            taking it out of flow, so it still pushes down if content grows. */}
        {/* Scroll indicator. Static in this pass. */}
        <div className="mt-auto flex justify-center pb-8">
          <ChevronDown
            aria-hidden="true"
            className="size-5 text-muted-foreground"
          />
        </div>

        <Reveal trigger="mount" delay={240}>
          <div className="grid grid-cols-1 gap-10 border-t border-border py-10 md:grid-cols-3 md:gap-8">
            <div>
              <p className="mono-label text-muted-foreground">Available for</p>
              <p className="mt-3 text-body text-foreground">
                {site.availability}
              </p>
            </div>

            {current ? (
              <div>
                <p className="mono-label text-muted-foreground">Currently</p>
                <p className="mt-3 text-body text-foreground">
                  {current.company}
                </p>
                <p className="text-body text-foreground">{current.title}</p>
              </div>
            ) : null}

            <div>
              <p className="mono-label text-muted-foreground">Elsewhere</p>
              <ul className="mt-3 flex flex-col gap-2">
                {elsewhere.map(({ label, href, external, Icon }) => (
                  <li key={label}>
                    <a
                      href={href}
                      className="mono-label flex min-h-12 items-center gap-2 text-foreground hover:text-brand md:min-h-0"
                      {...(external
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                    >
                      <Icon aria-hidden="true" className="size-4" />
                      <span className="link-draw">{label}</span>
                      {external ? (
                        <span className="sr-only"> (opens in a new tab)</span>
                      ) : null}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </div>
    </Container>
  );
}
