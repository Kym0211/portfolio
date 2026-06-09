import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "Kavyam — I build fast, correct systems";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "#07070c",
          backgroundImage:
            "radial-gradient(700px 600px at 78% 12%, rgba(99,102,241,0.35), transparent 60%), radial-gradient(600px 520px at 8% 92%, rgba(34,211,238,0.28), transparent 60%)",
          color: "#f0f1f7",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: 26,
            letterSpacing: 6,
            color: "#22d3ee",
            fontWeight: 600,
          }}
        >
          KAVYAM
          <span style={{ color: "#5d5f73", marginLeft: 14 }}>· PORTFOLIO</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 92,
              fontWeight: 800,
              lineHeight: 1.02,
              letterSpacing: -3,
            }}
          >
            I build fast,
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 92,
              fontWeight: 800,
              lineHeight: 1.02,
              letterSpacing: -3,
              color: "#22d3ee",
            }}
          >
            correct systems.
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 28,
              fontSize: 30,
              color: "#9ea0b5",
              maxWidth: 880,
            }}
          >
            Full-stack apps &amp; Solana infrastructure · IIT Ropar
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 24,
            color: "#9ea0b5",
          }}
        >
          <div style={{ display: "flex" }}>kavyam.ksingh@gmail.com</div>
          <div style={{ display: "flex", gap: 24, color: "#5d5f73" }}>
            <span>github.com/Kym0211</span>
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
