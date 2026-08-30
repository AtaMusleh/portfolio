import Link from "next/link";

import { Container } from "@/components/layout/Container";
import { site } from "@/content";

const navLinks = [
  { label: "Work", href: "/#work" },
  { label: "Experience", href: "/#experience" },
  { label: "Contact", href: "/#contact" },
];

export function SiteNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background">
      <Container>
        <nav className="flex items-center justify-between py-4" aria-label="Main">
          <Link href="/" className="mono-label text-foreground hover:text-brand">
            {site.name}
          </Link>

          {/* Below sm the three anchors collapse to a single mailto — no menu,
              no JavaScript, so this stays a server component. */}
          <ul className="hidden items-center gap-8 sm:flex">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="mono-label text-muted-foreground hover:text-brand">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <a
            href={`mailto:${site.email}`}
            className="mono-label text-muted-foreground hover:text-brand sm:hidden"
          >
            Email
          </a>
        </nav>
      </Container>
    </header>
  );
}
