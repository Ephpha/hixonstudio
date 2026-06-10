import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "Hixon.Studio — AI developer. Builder. Making things worth using.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const monowire = await readFile(
    join(process.cwd(), "public/fonts/MONOWIRE.otf")
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#000",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "120px",
          position: "relative",
        }}
      >
        {/* soft center glow */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(255,255,255,0.06) 0%, rgba(0,0,0,0) 70%)",
            display: "flex",
          }}
        />

        {/* tiny corner mark */}
        <div
          style={{
            position: "absolute",
            top: 56,
            left: 64,
            fontFamily: "Monowire",
            fontSize: 22,
            color: "rgba(255,255,255,0.35)",
            letterSpacing: "0.04em",
            display: "flex",
          }}
        >
          H<span style={{ color: "rgba(255,255,255,0.18)" }}>.</span>S
        </div>

        {/* tiny corner status */}
        <div
          style={{
            position: "absolute",
            top: 62,
            right: 64,
            fontSize: 13,
            color: "rgba(255,255,255,0.3)",
            letterSpacing: "0.35em",
            textTransform: "uppercase",
            display: "flex",
          }}
        >
          Est. 2026
        </div>

        {/* wordmark */}
        <div
          style={{
            fontFamily: "Monowire",
            fontSize: 96,
            color: "#fff",
            letterSpacing: "0.04em",
            textShadow:
              "0 0 18px rgba(255,255,255,0.30), 0 0 56px rgba(255,255,255,0.10)",
            display: "flex",
            lineHeight: 1,
          }}
        >
          Hixon<span style={{ color: "rgba(255,255,255,0.35)" }}>.</span>Studio
        </div>

        {/* divider */}
        <div
          style={{
            width: 48,
            height: 1,
            background: "rgba(255,255,255,0.25)",
            marginTop: 40,
            marginBottom: 32,
            display: "flex",
          }}
        />

        {/* tagline */}
        <div
          style={{
            fontSize: 18,
            color: "rgba(255,255,255,0.55)",
            letterSpacing: "0.4em",
            textTransform: "uppercase",
            display: "flex",
          }}
        >
          AI Developer · Builder · Designer
        </div>

        {/* bottom domain */}
        <div
          style={{
            position: "absolute",
            bottom: 60,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
            fontSize: 14,
            color: "rgba(255,255,255,0.32)",
            letterSpacing: "0.5em",
            textTransform: "uppercase",
          }}
        >
          hixon.studio
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Monowire",
          data: monowire,
          style: "normal",
          weight: 400,
        },
      ],
    }
  );
}
