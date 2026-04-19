"use client";

import { useRef } from "react";
import gsap from "gsap";
import type { Project } from "@/lib/projects";

export default function ProjectCard({ project }: { project: Project }) {
  const cardRef = useRef<HTMLAnchorElement>(null);

  function handleMouseEnter() {
    gsap.to(cardRef.current, {
      scale: 1.02,
      borderColor: "rgba(255,255,255,0.25)",
      duration: 0.25,
      ease: "power2.out",
    });
  }

  function handleMouseLeave() {
    gsap.to(cardRef.current, {
      scale: 1,
      borderColor: "rgba(255,255,255,0.08)",
      duration: 0.25,
      ease: "power2.out",
    });
  }

  return (
    <a
      ref={cardRef}
      href={project.url}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="group p-6 rounded-xl flex flex-col"
      style={{
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.08)",
        cursor: "pointer",
        textDecoration: "none",
        display: "block",
      }}
    >
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
            style={{ opacity: 0.92 }}
          />
          <h3
            className="text-lg"
            style={{
              fontFamily: "Fraunces, Georgia, serif",
              fontStyle: "italic",
              color: "#fff",
            }}
          >
            {project.name}
          </h3>
        </div>
        <span
          className="flex items-center gap-1.5 text-xs mt-1 shrink-0"
          style={{
            color:
              project.status === "live"
                ? "rgba(255,255,255,0.65)"
                : "rgba(255,255,255,0.28)",
          }}
        >
          <span>{project.status === "live" ? "●" : "○"}</span>
          {project.status === "live" ? "Live" : "In Progress"}
        </span>
      </div>

      {/* Description */}
      <p
        className="text-sm mb-5"
        style={{ color: "rgba(255,255,255,0.42)", lineHeight: 1.65 }}
      >
        {project.description}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between mt-auto">
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

        {/* Visit link — visible on hover */}
        <span
          className="text-xs ml-3 shrink-0 flex items-center gap-1 transition-all duration-200"
          style={{
            fontFamily: "Fraunces, Georgia, serif",
            fontStyle: "italic",
            color: "rgba(255,255,255,0.28)",
            opacity: 0,
          }}
          ref={(el) => {
            if (!el) return;
            const card = cardRef.current;
            if (!card) return;
            const show = () => { el.style.opacity = "1"; el.style.color = "rgba(255,255,255,0.75)"; };
            const hide = () => { el.style.opacity = "0"; };
            card.addEventListener("mouseenter", show);
            card.addEventListener("mouseleave", hide);
          }}
        >
          Visit ↗
        </span>
      </div>
    </a>
  );
}
