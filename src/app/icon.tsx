import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/** Initials mark, brand blue on the dark background — same palette as the site. */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0B0F14",
          color: "#5B9CFF",
          fontSize: 17,
          fontWeight: 700,
          letterSpacing: "-0.02em",
          fontFamily: "sans-serif",
        }}
      >
        AM
      </div>
    ),
    size
  );
}
