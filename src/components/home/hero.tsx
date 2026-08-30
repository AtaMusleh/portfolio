import { Container } from "@/components/layout/Container";
import { site } from "@/content";

const links = [
  { label: "Email", href: `mailto:${site.email}`, external: false },
  { label: "GitHub", href: site.github, external: true },
  { label: "LinkedIn", href: site.linkedin, external: true },
];

export function Hero() {
  return (
    <Container>
      {/* min-h rather than h-screen: the hero reaches for the viewport but
          grows past it if the content needs the room. */}
      <div className="flex min-h-[80svh] flex-col justify-center py-section">
        <h1 className="text-display text-foreground">{site.name}</h1>

        <p className="mt-8 max-w-prose text-body-lg text-muted-foreground">{site.tagline}</p>

        <p className="mono-label mt-10 text-muted-foreground">
          {site.role}
          <span className="text-brand"> / </span>
          {site.location}
        </p>

        <p className="mt-4 max-w-prose text-small text-muted-foreground">{site.availability}</p>

        <ul className="mt-10 flex flex-wrap items-center gap-8">
          {links.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                className="mono-label text-muted-foreground hover:text-brand"
                {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </Container>
  );
}
