import { site } from "@/content";

const links = [
  { label: "GitHub", href: site.github },
  { label: "LinkedIn", href: site.linkedin },
];

export function Contact() {
  return (
    <div>
      <a
        href={`mailto:${site.email}`}
        className="block break-words text-h2 text-foreground transition duration-150 hover:text-brand"
      >
        {site.email}
      </a>

      <div className="mt-10 border border-border bg-sky p-8 md:p-12">
        <p className="max-w-prose text-body-lg text-foreground">{site.availability}</p>
      </div>

      <ul className="mt-10 flex flex-wrap items-center gap-8">
        {links.map((link) => (
          <li key={link.label}>
            <a
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="mono-label text-muted-foreground hover:text-brand"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
