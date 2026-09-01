import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** Same mark at touch-icon size, with room to breathe. */
export default function AppleIcon() {
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
          fontSize: 92,
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
