import { Mail } from "lucide-react";

import { GitHubIcon } from "@/components/icons/github";
import { LinkedInIcon } from "@/components/icons/linkedin";
import { Container } from "@/components/layout/Container";
import { site } from "@/content";

export function SiteFooter() {
  // Server component, so this is evaluated once at build time and never
  // re-evaluated on the client — no hydration mismatch.
  const year = new Date().getFullYear();

  const links = [
    { label: "Email", href: `mailto:${site.email}`, external: false, Icon: Mail },
    { label: "GitHub", href: site.github, external: true, Icon: GitHubIcon },
    { label: "LinkedIn", href: site.linkedin, external: true, Icon: LinkedInIcon },
  ];

  return (
    <footer className="border-t border-border bg-muted py-20">
      <Container>
        <div className="flex flex-col gap-12 sm:flex-row sm:justify-between">
          <div>
            <p className="text-h3 text-foreground">{site.name}</p>
            <p className="mt-2 text-body text-muted-foreground">{site.location}</p>
            <p className="mt-6 max-w-prose text-body text-muted-foreground">{site.availability}</p>
          </div>

          <ul className="flex flex-col gap-3 sm:items-end">
            {links.map(({ label, href, external, Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  className="mono-label flex items-center gap-2 text-muted-foreground hover:text-brand"
                  {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                >
                  <Icon aria-hidden="true" className="size-4" />
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <p className="mono-label mt-16 text-muted-foreground">
          © {year} {site.name}
        </p>
      </Container>
    </footer>
  );
}
