"use client";

import Link from "next/link";
import { projects } from "@/lib/projects";

export default function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid rgba(255,255,255,0.06)",
        background: "rgba(6,6,8,0.85)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        padding: "2rem 2rem 2.5rem",
      }}
    >
      {/* Projects row */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "2rem",
          marginBottom: "1.75rem",
        }}
      >
        {projects.map((project) => {
          const iconSrc =
            project.logo ||
            `https://www.google.com/s2/favicons?domain=${project.domain}&sz=64`;

          return (
            <a
              key={project.name}
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              title={project.name}
              className="footer-project-link"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0.5rem",
                textDecoration: "none",
                opacity: 0.55,
                transition: "opacity 0.2s ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.opacity = "1")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.opacity = "0.55")
              }
            >
              {/* Icon */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={iconSrc}
                alt={project.name}
                width={28}
                height={28}
                style={{
                  borderRadius: "6px",
                  objectFit: "contain",
                }}
              />

              {/* Domain label */}
              <span
                style={{
                  fontSize: "0.6rem",
                  letterSpacing: "0.08em",
                  color: "rgba(255,255,255,0.38)",
                  fontFamily: "inherit",
                }}
              >
                {project.domain}
              </span>

              {/* Live / in-progress dot */}
              <span
                style={{
                  width: 4,
                  height: 4,
                  borderRadius: "50%",
                  background:
                    project.status === "live"
                      ? "rgba(120,255,160,0.7)"
                      : "rgba(255,200,80,0.6)",
                  display: "block",
                }}
              />
            </a>
          );
        })}
      </div>

      {/* Divider */}
      <div
        style={{
          width: "100%",
          maxWidth: "320px",
          height: "1px",
          background: "rgba(255,255,255,0.06)",
          margin: "0 auto 1.25rem",
        }}
      />

      {/* Bottom line */}
      <p
        style={{
          textAlign: "center",
          fontSize: "0.6rem",
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.18)",
          margin: 0,
        }}
      >
        Hixon.Studio · All projects by Matthew Hixon
      </p>
    </footer>
  );
}
