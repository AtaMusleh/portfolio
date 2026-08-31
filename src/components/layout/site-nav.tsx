import { FileDown } from "lucide-react";
import Link from "next/link";

import { Container } from "@/components/layout/Container";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { site } from "@/content";

const navLinks = [
  { label: "Work", href: "/#work" },
  { label: "About", href: "/#about" },
  { label: "Explore", href: "/#explore" },
  { label: "Experience", href: "/#experience" },
  { label: "Contact", href: "/#contact" },
];

export function SiteNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background">
      <Container>
        <nav
          className="flex items-center justify-between py-4"
          aria-label="Main"
        >
          <Link
            href="/"
            className="mono-label flex min-h-11 items-center text-foreground hover:text-brand md:min-h-0"
          >
            {site.name}
          </Link>

          <div className="flex items-center gap-6 sm:gap-8">
            {/* Below sm the anchors collapse to a single mailto — no menu,
                no JavaScript, so this stays a server component. */}
            <ul className="hidden items-center gap-8 sm:flex">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="mono-label flex min-h-11 items-center text-muted-foreground hover:text-brand md:min-h-0"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <a
              href={`mailto:${site.email}`}
              className="mono-label flex min-h-11 items-center text-muted-foreground hover:text-brand sm:hidden"
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
                className="mono-label hidden min-h-11 items-center gap-2 rounded-full border border-border px-3 py-1.5 text-muted-foreground transition duration-150 hover:bg-muted hover:text-brand sm:flex md:min-h-0"
              >
                <FileDown aria-hidden="true" className="size-4" />
                Resume
              </a>
            ) : null}

            <ThemeToggle />
          </div>
        </nav>
      </Container>
    </header>
  );
}
