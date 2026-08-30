import Link from "next/link";

import type { Project } from "@/content";

type ProjectRowProps = {
  project: Project;
  index: number;
};

/**
 * A full-width typographic row, not a card. `group` drives the hover state, and
 * every group-hover rule is paired with a group-focus-visible rule so keyboard
 * users get the same visual feedback as mouse users, on top of the global
 * brand focus outline from globals.css.
 */
export function ProjectRow({ project, index }: ProjectRowProps) {
  const number = String(index + 1).padStart(2, "0");

  return (
    <li>
      <Link
        href={`/work/${project.slug}`}
        className="group block border-t border-border py-12 transition duration-150 hover:bg-muted focus-visible:bg-muted sm:py-16"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-10">
          <span className="mono-label text-brand sm:w-12 sm:shrink-0 sm:pt-3">{number}</span>

          <div className="min-w-0 flex-1">
            <h3 className="text-h2 text-foreground transition duration-150 group-hover:text-brand group-focus-visible:text-brand">
              {project.name}
            </h3>
            <p className="mt-4 max-w-prose text-body text-muted-foreground">{project.tagline}</p>
            <p className="mono-label mt-6 text-muted-foreground">{project.stack.join(" / ")}</p>
          </div>

          <span
            aria-hidden="true"
            className="text-body text-muted-foreground transition duration-150 group-hover:translate-x-1 group-hover:text-brand group-focus-visible:translate-x-1 group-focus-visible:text-brand sm:shrink-0 sm:self-center"
          >
            →
          </span>
        </div>
      </Link>
    </li>
  );
}
