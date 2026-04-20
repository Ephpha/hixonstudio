"use client";

import { useRef } from "react";
import type { Project } from "@/lib/projects";

export default function ProjectCard({ project }: { project: Project }) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const shimmerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);

  const isTouch =
    typeof window !== "undefined" && window.matchMedia("(hover: none)").matches;

  // ── Desktop: mouse interactions ──────────────────────────────────────────
  function handleMouseMove(e: React.MouseEvent<HTMLAnchorElement>) {
    if (isTouch) return;
    const card = cardRef.current;
    const glow = glowRef.current;
    if (!card || !glow) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;

    card.style.transform = `perspective(800px) rotateX(${((y - cy) / cy) * -10}deg) rotateY(${((x - cx) / cx) * 10}deg) scale(1.03)`;
    glow.style.opacity = "1";
    glow.style.background = `radial-gradient(180px circle at ${x}px ${y}px, rgba(255,255,255,0.07), transparent 70%)`;
  }

  function handleMouseEnter() {
    if (isTouch) return;
    const card = cardRef.current;
    if (!card) return;
    card.style.borderColor = "rgba(255,255,255,0.22)";
    if (shimmerRef.current) shimmerRef.current.style.opacity = "1";
    if (logoRef.current) { logoRef.current.style.transform = "translateZ(20px) scale(1.12)"; logoRef.current.style.opacity = "1"; }
    if (titleRef.current) titleRef.current.style.letterSpacing = "0.02em";
    if (descRef.current) descRef.current.style.color = "rgba(255,255,255,0.58)";
    const visit = card.querySelector<HTMLSpanElement>(".visit-label");
    if (visit) { visit.style.opacity = "1"; visit.style.transform = "translateY(0px)"; }
  }

  function handleMouseLeave() {
    if (isTouch) return;
    const card = cardRef.current;
    const glow = glowRef.current;
    if (!card || !glow) return;
    card.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)";
    card.style.borderColor = "rgba(255,255,255,0.08)";
    glow.style.opacity = "0";
    if (shimmerRef.current) shimmerRef.current.style.opacity = "0";
    if (logoRef.current) { logoRef.current.style.transform = "translateZ(0) scale(1)"; logoRef.current.style.opacity = "0.92"; }
    if (titleRef.current) titleRef.current.style.letterSpacing = "normal";
    if (descRef.current) descRef.current.style.color = "rgba(255,255,255,0.42)";
    const visit = card.querySelector<HTMLSpanElement>(".visit-label");
    if (visit) { visit.style.opacity = "0"; visit.style.transform = "translateY(4px)"; }
  }

  // ── Mobile: touch interactions ───────────────────────────────────────────
  function handleTouchStart() {
    const card = cardRef.current;
    const glow = glowRef.current;
    if (!card || !glow) return;
    // Press-down feel
    card.style.transform = "scale(0.97)";
    card.style.borderColor = "rgba(255,255,255,0.28)";
    // Centre glow burst
    glow.style.opacity = "1";
    glow.style.background = "radial-gradient(ellipse at 50% 50%, rgba(255,255,255,0.09), transparent 70%)";
    if (shimmerRef.current) shimmerRef.current.style.opacity = "1";
    if (logoRef.current) { logoRef.current.style.transform = "scale(1.15)"; logoRef.current.style.opacity = "1"; }
  }

  function handleTouchEnd() {
    const card = cardRef.current;
    const glow = glowRef.current;
    if (!card || !glow) return;
    card.style.transform = "scale(1)";
    card.style.borderColor = "rgba(255,255,255,0.08)";
    glow.style.opacity = "0";
    if (shimmerRef.current) shimmerRef.current.style.opacity = "0";
    if (logoRef.current) { logoRef.current.style.transform = "scale(1)"; logoRef.current.style.opacity = "0.92"; }
  }

  return (
    <a
      ref={cardRef}
      href={project.url}
      target="_blank"
      rel="noopener noreferrer"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
      style={{
        display: "block",
        textDecoration: "none",
        position: "relative",
        borderRadius: "0.75rem",
        border: "1px solid rgba(255,255,255,0.08)",
        background: "rgba(255,255,255,0.02)",
        cursor: "pointer",
        transition: "transform 0.18s ease, border-color 0.25s ease",
        transformStyle: "preserve-3d",
        willChange: "transform",
      }}
    >
      {/* Glow layer */}
      <div
        ref={glowRef}
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "0.75rem",
          opacity: 0,
          transition: "opacity 0.3s ease",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Top shimmer line */}
      <div
        ref={shimmerRef}
        style={{
          position: "absolute",
          top: 0,
          left: "10%",
          right: "10%",
          height: "1px",
          borderRadius: "999px",
          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)",
          opacity: 0,
          transition: "opacity 0.3s ease",
          zIndex: 1,
          pointerEvents: "none",
        }}
      />

      {/* Card content */}
      <div className="p-5 sm:p-6" style={{ position: "relative", zIndex: 2 }}>

        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={logoRef}
              src={project.logo ?? `https://www.google.com/s2/favicons?domain=${project.domain}&sz=64`}
              alt=""
              width={32}
              height={32}
              className="rounded"
              style={{
                opacity: 0.92,
                transition: "transform 0.3s ease, opacity 0.3s ease",
              }}
            />
            <h3
              ref={titleRef}
              className="text-lg"
              style={{
                fontFamily: "Fraunces, Georgia, serif",
                fontStyle: "italic",
                color: "#fff",
                transition: "letter-spacing 0.3s ease",
              }}
            >
              {project.name}
            </h3>
          </div>

          <span
            className="flex items-center gap-1.5 text-xs mt-1 shrink-0"
            style={{
              color: project.status === "live"
                ? "rgba(255,255,255,0.65)"
                : "rgba(255,255,255,0.28)",
            }}
          >
            <span style={{
              display: "inline-block",
              animation: project.status === "live" ? "pulse 2s ease-in-out infinite" : "none",
            }}>
              {project.status === "live" ? "●" : "○"}
            </span>
            {project.status === "live" ? "Live" : "In Progress"}
          </span>
        </div>

        {/* Description */}
        <p
          ref={descRef}
          className="text-sm mb-4"
          style={{
            color: "rgba(255,255,255,0.42)",
            lineHeight: 1.65,
            transition: "color 0.3s ease",
          }}
        >
          {project.description}
        </p>

        {/* Footer row */}
        <div className="flex items-center justify-between">
          {/* Domain pill — always visible on mobile as a tap hint */}
          <span
            className="text-xs"
            style={{
              color: "rgba(255,255,255,0.2)",
              letterSpacing: "0.04em",
            }}
          >
            {project.domain}
          </span>

          <span
            className="visit-label text-xs"
            style={{
              fontFamily: "Fraunces, Georgia, serif",
              fontStyle: "italic",
              color: "rgba(255,255,255,0.7)",
              // Always visible on touch; fades in on hover for desktop
              opacity: isTouch ? 1 : 0,
              transform: isTouch ? "translateY(0px)" : "translateY(4px)",
              transition: "opacity 0.25s ease, transform 0.25s ease",
            }}
          >
            Visit ↗
          </span>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.35; }
        }
      `}</style>
    </a>
  );
}
