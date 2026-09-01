import { ImageResponse } from "next/og";

import { getProject, projects, site } from "@/content";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** One image per project, prerendered alongside the pages. */
export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

/**
 * Supplies a per-project alt. A static `export const alt` cannot see params,
 * so every case study would otherwise share the same generic description.
 */
export async function generateImageMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  return [
    {
      id: "og",
      alt: project
        ? `${project.name} — ${project.tagline}`
        : `Case study — ${site.name}`,
      size,
      contentType,
    },
  ];
}

const BACKGROUND = "#0B0F14";
const FOREGROUND = "#E6EDF5";
const BRAND = "#5B9CFF";
const BRAND_2 = "#FB923C";
const MUTED = "#8B99AC";
const BORDER = "#222B36";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: BACKGROUND,
        color: FOREGROUND,
        padding: 80,
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          fontSize: 26,
          color: BRAND,
          letterSpacing: "0.05em",
        }}
      >
        {(project?.year ?? "").toUpperCase()}
        <span style={{ color: MUTED, margin: "0 16px" }}>/</span>
        <span style={{ color: MUTED }}>CASE STUDY</span>
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            display: "flex",
            fontSize: 96,
            fontWeight: 600,
            letterSpacing: "-0.03em",
          }}
        >
          {project?.name ?? site.name}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 28,
            fontSize: 34,
            color: MUTED,
            lineHeight: 1.4,
            maxWidth: 900,
          }}
        >
          {project?.tagline ?? site.tagline}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            display: "flex",
            height: 1,
            background: BORDER,
            marginBottom: 28,
          }}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 24,
          }}
        >
          <div
            style={{ display: "flex", color: MUTED, letterSpacing: "0.05em" }}
          >
            {(project?.stack ?? []).slice(0, 4).map((item, index) => (
              <div key={item} style={{ display: "flex" }}>
                {index > 0 ? (
                  <span style={{ color: BRAND_2, margin: "0 14px" }}>/</span>
                ) : null}
                <span>{item.toUpperCase()}</span>
              </div>
            ))}
          </div>
          <div
            style={{
              display: "flex",
              color: FOREGROUND,
              letterSpacing: "0.05em",
            }}
          >
            {site.name.toUpperCase()}
          </div>
        </div>
      </div>
    </div>,
    size,
  );
}
