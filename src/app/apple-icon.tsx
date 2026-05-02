import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: 180,
        height: 180,
        background: "#1c1917",
        borderRadius: 39,
        position: "relative",
        display: "flex",
      }}
    >
      {/* P stem */}
      <div
        style={{
          position: "absolute",
          left: 39,
          top: 34,
          width: 22,
          height: 113,
          background: "#faf9f7",
          borderRadius: 8,
        }}
      />
      {/* P bowl outer — D shape */}
      <div
        style={{
          position: "absolute",
          left: 39,
          top: 34,
          width: 85,
          height: 73,
          background: "#faf9f7",
          borderRadius: "8px 40px 40px 8px",
        }}
      />
      {/* P bowl inner cutout */}
      <div
        style={{
          position: "absolute",
          left: 61,
          top: 56,
          width: 45,
          height: 28,
          background: "#1c1917",
          borderRadius: "0 25px 25px 0",
        }}
      />
      {/* Cursor underscore */}
      <div
        style={{
          position: "absolute",
          left: 118,
          top: 124,
          width: 23,
          height: 11,
          background: "#faf9f7",
          borderRadius: 6,
          opacity: 0.35,
        }}
      />
    </div>,
    { ...size }
  );
}
