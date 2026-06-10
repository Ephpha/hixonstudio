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
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(255,255,255,0.08) 0%, rgba(0,0,0,0) 70%)",
            display: "flex",
          }}
        />
        <div
          style={{
            fontFamily: "Monowire",
            fontSize: 140,
            color: "#fff",
            letterSpacing: "0.12em",
            textShadow:
              "0 0 24px rgba(255,255,255,0.35), 0 0 64px rgba(255,255,255,0.15)",
            display: "flex",
          }}
        >
          HIXON
          <span style={{ color: "rgba(255,255,255,0.35)" }}>.</span>
          STUDIO
        </div>
        <div
          style={{
            marginTop: 36,
            fontSize: 22,
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.45)",
            display: "flex",
          }}
        >
          AI developer · Builder · Making things worth using
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
