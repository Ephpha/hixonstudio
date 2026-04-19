"use client";

import { useRef } from "react";
import type { Project } from "@/lib/projects";

export default function ProjectCard({ project }: { project: Project }) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  function handleMouseMove(e: React.MouseEvent<HTMLAnchorElement>) {
    const card = cardRef.current;
    const glow = glowRef.current;
    if (!card || !glow) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;

    // 3D tilt — max 10deg
    const rotX = ((y - cy) / cy) * -10;
    const rotY = ((x - cx) / cx) * 10;

    card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.03)`;

    // Spotlight glow follows cursor
    glow.style.opacity = "1";
    glow.style.background = `radial-gradient(180px circle at ${x}px ${y}px, rgba(255,255,255,0.07), transparent 70%)`;
  }

  function handleMouseLeave() {
    const card = cardRef.current;
    const glow = glowRef.current;
    if (!card || !glow) return;

    card.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)";
    card.style.borderColor = "rgba(255,255,255,0.08)";
    glow.style.opacity = "0";

    // Hide visit label
    const visit = card.querySelector<HTMLSpanElement>(".visit-label");
    if (visit) { visit.style.opacity = "0"; visit.style.transform = "translateY(4px)"; }
  }

  function handleMouseEnter() {
    const card = cardRef.current;
    if (!card) return;
    card.style.borderColor = "rgba(255,255,255,0.22)";

    // Show visit label
    const visit = card.querySelector<HTMLSpanElement>(".visit-label");
    if (visit) { visit.style.opacity = "1"; visit.style.transform = "translateY(0px)"; }
  }

  return (
    <a
      ref={cardRef}
      href={project.url}
      target="_blank"
      rel="noopener noreferrer"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      style={{
        display: "block",
        textDecoration: "none",
        position: "relative",
        borderRadius: "0.75rem",
        border: "1px solid rgba(255,255,255,0.08)",
        background: "rgba(255,255,255,0.02)",
        cursor: "pointer",
        transition: "transform 0.15s ease, border-color 0.25s ease",
        transformStyle: "preserve-3d",
        willChange: "transform",
      }}
    >
      {/* Spotlight glow layer */}
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

      {/* Animated top-edge shimmer line */}
      <div style={{
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
        ref={(el) => {
          if (!el) return;
          const card = cardRef.current;
          if (!card) return;
          card.addEventListener("mouseenter", () => { el.style.opacity = "1"; });
          card.addEventListener("mouseleave", () => { el.style.opacity = "0"; });
        }}
      />

      {/* Card content */}
      <div ref={innerRef} className="p-6" style={{ position: "relative", zIndex: 2 }}>

        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={project.logo ?? `https://www.google.com/s2/favicons?domain=${project.domain}&sz=64`}
              alt=""
              width={32}
              height={32}
              className="rounded"
              style={{
                opacity: 0.92,
                transition: "transform 0.3s ease, opacity 0.3s ease",
                transform: "translateZ(0)",
              }}
              ref={(el) => {
                if (!el) return;
                const card = cardRef.current;
                if (!card) return;
                card.addEventListener("mouseenter", () => {
                  el.style.transform = "translateZ(20px) scale(1.12)";
                  el.style.opacity = "1";
                });
                card.addEventListener("mouseleave", () => {
                  el.style.transform = "translateZ(0) scale(1)";
                  el.style.opacity = "0.92";
                });
              }}
            />
            <h3
              className="text-lg"
              style={{
                fontFamily: "Fraunces, Georgia, serif",
                fontStyle: "italic",
                color: "#fff",
                transition: "letter-spacing 0.3s ease",
              }}
              ref={(el) => {
                if (!el) return;
                const card = cardRef.current;
                if (!card) return;
                card.addEventListener("mouseenter", () => { el.style.letterSpacing = "0.02em"; });
                card.addEventListener("mouseleave", () => { el.style.letterSpacing = "normal"; });
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
          className="text-sm mb-5"
          style={{
            color: "rgba(255,255,255,0.42)",
            lineHeight: 1.65,
            transition: "color 0.3s ease",
          }}
          ref={(el) => {
            if (!el) return;
            const card = cardRef.current;
            if (!card) return;
            card.addEventListener("mouseenter", () => { el.style.color = "rgba(255,255,255,0.58)"; });
            card.addEventListener("mouseleave", () => { el.style.color = "rgba(255,255,255,0.42)"; });
          }}
        >
          {project.description}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-0.5 rounded"
                style={{
                  fontFamily: "Courier New, monospace",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "rgba(255,255,255,0.38)",
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          <span
            className="visit-label text-xs ml-3 shrink-0"
            style={{
              fontFamily: "Fraunces, Georgia, serif",
              fontStyle: "italic",
              color: "rgba(255,255,255,0.7)",
              opacity: 0,
              transform: "translateY(4px)",
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
