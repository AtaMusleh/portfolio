import { Container } from "@/components/layout/Container";
import { experience, site } from "@/content";

const elsewhere = [
  { label: "Email", href: `mailto:${site.email}`, external: false },
  { label: "GitHub", href: site.github, external: true },
  { label: "LinkedIn", href: site.linkedin, external: true },
];

export function Hero() {
  // Read the current role from the array rather than hardcoding it.
  const current = experience[0];

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
          <h1 className="text-display text-foreground">{site.name}</h1>
          <p className="mt-8 max-w-prose text-body-lg text-muted-foreground">{site.tagline}</p>
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
              {elsewhere.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="mono-label text-foreground hover:text-brand"
                    {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  >
                    {link.label}
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
