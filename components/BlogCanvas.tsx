"use client";

export default function BlogCanvas() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/creation-adam-stars.jpg"
        alt=""
        style={{
          width: "clamp(480px, 70vw, 900px)",
          opacity: 0.13,
          userSelect: "none",
          maskImage:
            "radial-gradient(ellipse 75% 65% at 50% 50%, black 30%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 75% 65% at 50% 50%, black 30%, transparent 100%)",
        }}
      />
    </div>
  );
}
