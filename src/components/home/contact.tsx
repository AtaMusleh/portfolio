import { site } from "@/content";

const links = [
  { label: "GitHub", href: site.github },
  { label: "LinkedIn", href: site.linkedin },
];

export function Contact() {
  return (
    <div>
      {/* h3 semantically — Section already renders the h2 for this block. */}
      <h3 className="text-h2 text-foreground">Get in touch</h3>

      <p className="mt-6 max-w-prose text-body-lg text-muted-foreground">{site.availability}</p>

      <p className="mt-10">
        <a
          href={`mailto:${site.email}`}
          className="text-h3 text-foreground transition duration-150 hover:text-brand"
        >
          {site.email}
        </a>
      </p>

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
