import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "Hixon.Studio";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const stars = [
  { x: 8, y: 18, o: 0.35, s: 2 },
  { x: 14, y: 72, o: 0.25, s: 1.5 },
  { x: 22, y: 35, o: 0.18, s: 1.5 },
  { x: 28, y: 84, o: 0.3, s: 2 },
  { x: 36, y: 12, o: 0.22, s: 1.5 },
  { x: 42, y: 88, o: 0.18, s: 1.5 },
  { x: 58, y: 14, o: 0.28, s: 2 },
  { x: 64, y: 80, o: 0.2, s: 1.5 },
  { x: 72, y: 28, o: 0.3, s: 2 },
  { x: 78, y: 68, o: 0.18, s: 1.5 },
  { x: 86, y: 22, o: 0.25, s: 1.5 },
  { x: 92, y: 86, o: 0.32, s: 2 },
];

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
        {/* starfield */}
        {stars.map((star, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: star.s,
              height: star.s,
              borderRadius: "50%",
              background: "#fff",
              opacity: star.o,
              display: "flex",
            }}
          />
        ))}

        {/* center halo */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 50% 45% at 50% 50%, rgba(255,255,255,0.10) 0%, rgba(0,0,0,0) 70%)",
            display: "flex",
          }}
        />

        {/* the mark */}
        <div
          style={{
            fontFamily: "Monowire",
            fontSize: 280,
            color: "#fff",
            letterSpacing: "-0.02em",
            lineHeight: 1,
            textShadow:
              "0 0 36px rgba(255,255,255,0.45), 0 0 100px rgba(255,255,255,0.18)",
            display: "flex",
          }}
        >
          H<span style={{ color: "rgba(255,255,255,0.32)" }}>.</span>
        </div>

        {/* wordmark whisper */}
        <div
          style={{
            marginTop: 52,
            fontSize: 17,
            color: "rgba(255,255,255,0.55)",
            letterSpacing: "0.6em",
            textTransform: "uppercase",
            display: "flex",
            paddingLeft: "0.6em",
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
