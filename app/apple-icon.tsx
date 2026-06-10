import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default async function AppleIcon() {
  const monowire = await readFile(
    join(process.cwd(), "public/fonts/MONOWIRE.otf")
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "transparent",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Monowire",
          fontSize: 120,
          color: "#fff",
          letterSpacing: "-0.02em",
          textShadow:
            "0 0 14px rgba(255,255,255,0.45), 0 0 40px rgba(255,255,255,0.18)",
        }}
      >
        H<span style={{ color: "rgba(255,255,255,0.4)" }}>.</span>
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
