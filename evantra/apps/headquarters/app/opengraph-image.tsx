import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt =
  "Evantra — Global Technology Enterprise: Software, Cybersecurity & Systems Engineering";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background:
            "linear-gradient(135deg, #06131f 0%, #0a2438 55%, #0e3350 100%)",
          padding: "72px 80px",
          fontFamily: "sans-serif",
        }}
      >
        {/* Brand mark */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 24,
          }}
        >
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 18,
              background: "linear-gradient(135deg, #e6b24a, #c98f1f)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#06131f",
              fontSize: 36,
              fontWeight: 800,
            }}
          >
            EV
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 34,
              fontWeight: 700,
              letterSpacing: 6,
              color: "#ffffff",
              textTransform: "uppercase",
            }}
          >
            Evantra
          </div>
        </div>

        {/* Headline */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 28,
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 74,
              fontWeight: 800,
              lineHeight: 1.08,
              color: "#ffffff",
              maxWidth: 940,
            }}
          >
            Building the Technology Backbone of Global Enterprise
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 30,
              color: "rgba(255,255,255,0.72)",
              maxWidth: 860,
            }}
          >
            Software engineering · Sovereign cybersecurity · Mission-critical
            systems · Applied AI
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: "rgba(255,255,255,0.55)",
            fontSize: 24,
          }}
        >
          <div style={{ display: "flex" }}>evantradebuckman.com</div>
          <div style={{ display: "flex", color: "#e6b24a" }}>
            Global Standards. Operational Agility.
          </div>
        </div>
      </div>
    ),
    size,
  );
}
