import Link from "next/link";

import type { Project } from "@/content";

/**
 * A single link, matching the home page row hover exactly. Nothing inside it is
 * a link — nested anchors are invalid HTML.
 */
export function NextProject({ project }: { project: Project }) {
  return (
    <Link
      href={`/work/${project.slug}`}
      className="group block border-t border-border py-12 transition duration-150 hover:bg-muted focus-visible:bg-muted lg:py-16"
    >
      <p className="mono-label text-muted-foreground">Next project</p>

      <div className="mt-4 flex items-baseline gap-3">
        {/* Not a heading: the page's h2s belong to the Sections above. */}
        <p className="text-h2 text-foreground transition duration-150 group-hover:text-brand group-focus-visible:text-brand">
          {project.name}
        </p>
        <span
          aria-hidden="true"
          className="text-body text-muted-foreground transition duration-150 group-hover:translate-x-1 group-hover:text-brand group-focus-visible:translate-x-1 group-focus-visible:text-brand"
        >
          →
        </span>
      </div>

      <p className="mt-3 max-w-prose text-body text-muted-foreground">{project.tagline}</p>
    </Link>
  );
}
