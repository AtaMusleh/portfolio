import { ArrowDown, Mail } from "lucide-react";
import Link from "next/link";

import { GitHubIcon } from "@/components/icons/github";
import { LinkedInIcon } from "@/components/icons/linkedin";
import { Container } from "@/components/layout/Container";
import { experience, site } from "@/content";

const elsewhere = [
  { label: "Email", href: `mailto:${site.email}`, external: false, Icon: Mail },
  { label: "GitHub", href: site.github, external: true, Icon: GitHubIcon },
  { label: "LinkedIn", href: site.linkedin, external: true, Icon: LinkedInIcon },
];

export function Hero() {
  const current = experience[0];

  // The last word is drawn as an outline; everything before it stays solid.
  const parts = site.name.split(" ");
  const lastName = parts.length > 1 ? parts[parts.length - 1] : "";
  const firstNames = parts.length > 1 ? parts.slice(0, -1).join(" ") : site.name;

  return (
    <Container>
      {/* svh, not vh: vh is measured against the largest viewport on mobile
          browsers with retracting toolbars, which pushes the bottom block off
          the first screen. */}
      <div className="flex min-h-[100svh] flex-col">
        {/* TOP */}
        <div className="flex flex-wrap justify-between gap-x-8 gap-y-1 border-b border-border py-6">
          <p className="mono-label text-muted-foreground">{site.role}</p>
          <p className="mono-label text-muted-foreground">{site.location}</p>
        </div>

        {/* MIDDLE */}
        <div className="py-20">
          <h1 className="text-display text-foreground">
            {firstNames}
            {lastName ? (
              <>
                {" "}
                <span className="text-stroked">{lastName}</span>
              </>
            ) : null}
          </h1>

          <p className="mt-8 max-w-prose text-body-lg text-muted-foreground">{site.tagline}</p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Link
              href="#contact"
              className="mono-label flex h-12 items-center justify-center gap-2 rounded-full bg-brand px-6 text-brand-foreground transition duration-150 hover:bg-brand/85"
            >
              <Mail aria-hidden="true" className="size-4" />
              Get in touch
            </Link>
            <Link
              href="#work"
              className="mono-label flex h-12 items-center justify-center gap-2 rounded-full border border-border px-6 text-foreground transition duration-150 hover:bg-muted"
            >
              <ArrowDown aria-hidden="true" className="size-4" />
              View work
            </Link>
          </div>
        </div>

        {/* BOTTOM — mt-auto pins it to the foot of the first screen without
            taking it out of flow, so it still pushes down if content grows. */}
        <div className="mt-auto grid grid-cols-1 gap-10 border-t border-border py-10 md:grid-cols-3 md:gap-8">
          <div>
            <p className="mono-label text-muted-foreground">Available for</p>
            <p className="mt-3 text-body text-foreground">{site.availability}</p>
          </div>

          {current ? (
            <div>
              <p className="mono-label text-muted-foreground">Currently</p>
              <p className="mt-3 text-body text-foreground">{current.company}</p>
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
                    className="mono-label flex min-h-11 items-center gap-2 text-foreground hover:text-brand md:min-h-0"
                    {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  >
                    <Icon aria-hidden="true" className="size-4" />
                    {label}
                    {external ? <span className="sr-only"> (opens in a new tab)</span> : null}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Container>
  );
}
