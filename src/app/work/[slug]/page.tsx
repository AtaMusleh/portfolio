import { ExternalLink } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { GitHubIcon } from "@/components/icons/github";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { HighlightList } from "@/components/work/highlight-list";
import { MediaFrame } from "@/components/work/media-frame";
import { NextProject } from "@/components/work/next-project";
import { getAdjacentProject, getProject, projects, site } from "@/content";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata(props: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const project = getProject(slug);

  if (!project) return {};

  const title = `${project.name} — ${site.name}`;

  return {
    title,
    description: project.tagline,
    openGraph: { title, description: project.tagline },
  };
}

const NUMBER_WORDS = [
  "zero",
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
  "ten",
  "eleven",
  "twelve",
];

/** "five problems" / "one problem" — mono-label uppercases it on render. */
function countLabel(count: number, singular: string, plural: string) {
  const word = NUMBER_WORDS[count] ?? String(count);
  return `${word} ${count === 1 ? singular : plural}`;
}

export default async function CaseStudyPage(props: PageProps<"/work/[slug]">) {
  const { slug } = await props.params;
  const project = getProject(slug);

  if (!project) notFound();

  const next = getAdjacentProject(project.slug);

  return (
    <Container>
      {/* HEADER */}
      <div className="border-b border-border py-section">
        <Link
          href="/#work"
          className="mono-label inline-flex min-h-11 items-center gap-2 text-muted-foreground hover:text-brand md:min-h-0"
        >
          <span aria-hidden="true">←</span>
          Selected Work
        </Link>

        <h1 className="mt-10 text-display text-foreground">{project.name}</h1>

        <p className="mt-8 max-w-prose text-body-lg text-muted-foreground">{project.tagline}</p>

        <p className="mono-label mt-10 text-muted-foreground">
          {project.year}
          <span className="text-brand"> / </span>
          {project.role}
        </p>

        <ul className="mt-8 flex flex-wrap items-center gap-8">
          {project.repos.map((repo) => (
            <li key={repo.url}>
              <a
                href={repo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mono-label flex min-h-11 items-center gap-2 text-muted-foreground hover:text-brand md:min-h-0"
              >
                <GitHubIcon className="size-4" />
                {repo.label}
                <span className="sr-only"> for {project.name} (opens in a new tab)</span>
              </a>
            </li>
          ))}
          <li>
            <a
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              className="mono-label flex min-h-11 items-center gap-2 text-muted-foreground hover:text-brand md:min-h-0"
            >
              <ExternalLink aria-hidden="true" className="size-4" />
              Live site
              <span className="sr-only"> for {project.name} (opens in a new tab)</span>
            </a>
          </li>
        </ul>
      </div>

      {/* HERO MEDIA */}
      <div className="py-16">
        <MediaFrame
          project={project}
          aspect="aspect-[16/9]"
          sizes="(min-width: 1440px) 1296px, 100vw"
        />
      </div>

      <Section number="01" title="Overview" meta={project.name}>
        <p className="max-w-prose text-body-lg text-muted-foreground">{project.summary}</p>
      </Section>

      <Section
        number="02"
        title="Engineering"
        meta={countLabel(project.highlights.length, "problem", "problems")}
      >
        <HighlightList highlights={project.highlights} />
      </Section>

      <Section
        number="03"
        title="Stack"
        meta={countLabel(project.stack.length, "technology", "technologies")}
      >
        <ul className="flex flex-wrap gap-3">
          {project.stack.map((item) => (
            <li
              key={item}
              className="mono-label rounded-full border border-border bg-muted px-4 py-2 text-foreground"
            >
              {item}
            </li>
          ))}
        </ul>
      </Section>

      <NextProject project={next} />
    </Container>
  );
}
