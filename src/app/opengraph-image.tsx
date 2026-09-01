import { ImageResponse } from "next/og";

import { projects, site } from "@/content";

export const alt = `${site.name} — ${site.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Generated at build time rather than shipped as a static PNG, so it cannot
 * drift from the palette. The colours are the dark-theme tokens, hard-coded
 * because Satori has no access to CSS custom properties.
 */
const BACKGROUND = "#0B0F14";
const FOREGROUND = "#E6EDF5";
const BRAND = "#5B9CFF";
const MUTED = "#8B99AC";
const BORDER = "#222B36";

export default function Image() {
  const parts = site.name.split(" ");
  const lastName = parts.length > 1 ? parts[parts.length - 1] : "";
  const firstNames = parts.length > 1 ? parts.slice(0, -1).join(" ") : site.name;

  return new ImageResponse(
    (
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
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 108, fontWeight: 600, letterSpacing: "-0.03em" }}>
            <span>{firstNames}</span>
            {lastName ? <span style={{ color: BRAND, marginLeft: 24 }}>{lastName}</span> : null}
          </div>
          <div style={{ display: "flex", marginTop: 24, fontSize: 34, color: MUTED }}>
            <span>{site.role}</span>
            <span style={{ color: BRAND, margin: "0 16px" }}>/</span>
            <span>{site.location}</span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", height: 1, background: BORDER, marginBottom: 28 }} />
          <div style={{ display: "flex", fontSize: 26, color: MUTED, letterSpacing: "0.05em" }}>
            {projects.map((project, index) => (
              <div key={project.slug} style={{ display: "flex" }}>
                {index > 0 ? <span style={{ color: BRAND, margin: "0 18px" }}>/</span> : null}
                <span>{project.name.toUpperCase()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    size
  );
}
