import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import type { Project } from "@/content";

type ProjectRowProps = {
  project: Project;
  index: number;
};

/**
 * A dense typographic row. The internal rhythm is deliberately tight — name,
 * tagline, stack and repos read as one block — with the breathing room pushed
 * out into the row padding and the hairline separators.
 *
 * `group` drives the hover state, and every group-hover rule is paired with a
 * group-focus-visible rule so keyboard users get identical feedback on top of
 * the global brand focus outline.
 *
 * No nested anchors: the whole row is the link, so repo labels and "Live"
 * render as plain text.
 */
export function ProjectRow({ project, index }: ProjectRowProps) {
  const number = String(index + 1).padStart(2, "0");
  const sources = [...project.repos.map((repo) => repo.label), "Live"];

  return (
    <li>
      <Link
        href={`/work/${project.slug}`}
        className="group block border-t border-border py-10 transition duration-150 hover:bg-muted focus-visible:bg-muted lg:py-12"
      >
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
          <span className="mono-label text-brand lg:col-span-1 lg:pt-2">{number}</span>

          <div className="min-w-0 lg:col-span-5">
            <div className="flex items-baseline gap-3">
              <h3 className="text-h2 text-foreground transition duration-150 group-hover:text-brand group-focus-visible:text-brand">
                {project.name}
              </h3>
              <ArrowRight
                aria-hidden="true"
                className="size-5 shrink-0 text-muted-foreground transition duration-150 group-hover:translate-x-1 group-hover:text-brand group-focus-visible:translate-x-1 group-focus-visible:text-brand"
              />
            </div>

            <p className="mt-2 max-w-prose text-body text-muted-foreground">{project.tagline}</p>

            <p className="mono-label mt-3 text-muted-foreground">{project.stack.join(" / ")}</p>

            <p className="mono-label mt-3 text-muted-foreground">
              {sources.map((label, i) => (
                <span key={label}>
                  {i > 0 ? <span className="text-brand"> / </span> : null}
                  {label}
                </span>
              ))}
            </p>
          </div>

          {/* Media slot. The width cap keeps the 16/10 frame from driving the
              row past its height budget at wide viewports; it right-aligns
              inside cols 7-12 rather than stretching across them. */}
          <div className="lg:col-span-6">
            <div className="relative aspect-[16/10] w-full overflow-hidden border border-border bg-sky lg:ml-auto lg:max-w-[480px]">
              {project.image ? (
                <Image
                  src={project.image}
                  alt={`${project.name} screenshot`}
                  fill
                  sizes="(min-width: 1024px) 480px, 100vw"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <span className="mono-label text-muted-foreground">{project.name}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>
    </li>
  );
}
