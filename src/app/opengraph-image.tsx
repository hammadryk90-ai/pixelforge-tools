import { ImageResponse } from "next/og";

export const alt = "PixelForge Studio — Free, Private Image & PDF Tools";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px",
          background:
            "linear-gradient(135deg, #0f172a 0%, #312e81 55%, #4f46e5 100%)",
          color: "#ffffff",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        {/* Top brand row */}
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div
            style={{
              width: "68px",
              height: "68px",
              borderRadius: "18px",
              background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "38px",
              fontWeight: 900,
              color: "#ffffff",
              border: "2px solid rgba(255,255,255,0.25)",
            }}
          >
            P
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: "32px", fontWeight: 800, letterSpacing: "-0.02em" }}>
              PixelForge Studio
            </span>
            <span style={{ fontSize: "18px", color: "#c7d2fe" }}>
              pixelforgeimg.com
            </span>
          </div>
        </div>

        {/* Center headline */}
        <div style={{ display: "flex", flexDirection: "column", gap: "18px", maxWidth: "960px" }}>
          <div
            style={{
              fontSize: "60px",
              fontWeight: 900,
              lineHeight: 1.1,
              letterSpacing: "-0.03em",
            }}
          >
            Free, Private Browser-Based Image &amp; PDF Tools
          </div>
          <div style={{ fontSize: "26px", color: "#e0e7ff", lineHeight: 1.4 }}>
            Compress to Exact KB, Convert HEIC/WebP/AVIF, Edit Photos, Enhance
            Quality &amp; Merge PDFs — Zero Server Uploads.
          </div>
        </div>

        {/* Bottom tool badges */}
        <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
          {[
            "Image Compressor",
            "Exact KB",
            "HEIC to JPG",
            "Photo Editor",
            "PDF Toolkit",
            "QR & Colors",
          ].map((label) => (
            <div
              key={label}
              style={{
                padding: "10px 20px",
                borderRadius: "999px",
                background: "rgba(255,255,255,0.14)",
                border: "1px solid rgba(255,255,255,0.25)",
                fontSize: "18px",
                fontWeight: 700,
                color: "#ffffff",
              }}
            >
              {label}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
