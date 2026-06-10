import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "Hixon.Studio";
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
          position: "relative",
        }}
      >
        {/* soft center glow */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 55% 45% at 50% 50%, rgba(255,255,255,0.08) 0%, rgba(0,0,0,0) 70%)",
            display: "flex",
          }}
        />

        {/* the mark */}
        <div
          style={{
            fontFamily: "Monowire",
            fontSize: 320,
            color: "#fff",
            letterSpacing: "-0.02em",
            lineHeight: 1,
            textShadow:
              "0 0 32px rgba(255,255,255,0.4), 0 0 96px rgba(255,255,255,0.15)",
            display: "flex",
          }}
        >
          H<span style={{ color: "rgba(255,255,255,0.32)" }}>.</span>
        </div>

        {/* whisper wordmark */}
        <div
          style={{
            marginTop: 56,
            fontSize: 18,
            color: "rgba(255,255,255,0.5)",
            letterSpacing: "0.55em",
            textTransform: "uppercase",
            display: "flex",
            paddingLeft: "0.55em",
          }}
        >
          Hixon.Studio
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
