"use client";

import { useRef } from "react";
import gsap from "gsap";
import type { Project } from "@/lib/projects";

export default function ProjectCard({ project }: { project: Project }) {
  const cardRef = useRef<HTMLDivElement>(null);

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
    <div
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="p-6 rounded-xl"
      style={{
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.08)",
        cursor: "default",
      }}
    >
      <div className="flex items-start justify-between mb-3">
        <h3
          className="text-lg"
          style={{
            fontFamily: "EB Garamond, Georgia, serif",
            fontStyle: "italic",
            color: "#fff",
          }}
        >
          {project.name}
        </h3>
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

      <p
        className="text-sm mb-5"
        style={{ color: "rgba(255,255,255,0.42)", lineHeight: 1.65 }}
      >
        {project.description}
      </p>

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
        <a
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm transition-colors hover:text-white ml-3 shrink-0"
          style={{ color: "rgba(255,255,255,0.28)" }}
          onClick={(e) => e.stopPropagation()}
        >
          ↗
        </a>
      </div>
    </div>
  );
}
