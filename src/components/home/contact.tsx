import { Reveal } from "@/components/motion/reveal";
import { site } from "@/content";

const links = [
  { label: "GitHub", href: site.github },
  { label: "LinkedIn", href: site.linkedin },
];

export function Contact() {
  return (
    <div>
      <Reveal>
        <a
          href={`mailto:${site.email}`}
          className="block min-h-12 break-words text-h2 text-foreground transition duration-150 hover:text-brand"
        >
          {site.email}
        </a>
      </Reveal>

      <Reveal delay={60} className="mt-10">
        <div className="border border-border bg-sky p-8 md:p-12">
          <p className="max-w-prose text-body-lg text-foreground">
            {site.availability}
          </p>
        </div>
      </Reveal>

      <Reveal delay={120} className="mt-10">
        <ul className="flex flex-wrap items-center gap-8">
          {links.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="mono-label flex min-h-12 items-center text-muted-foreground hover:text-brand md:min-h-0"
              >
                {link.label}
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
          ))}
        </ul>
      </Reveal>
    </div>
  );
}
