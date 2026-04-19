"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ProjectCard from "@/components/ProjectCard";
import DuxyCard from "@/components/DuxyCard";
import { projects } from "@/lib/projects";

gsap.registerPlugin(ScrollTrigger);

export default function ProjectsPage() {
  const liveRef = useRef<HTMLDivElement>(null);
  const wipRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out", delay: 0.1 }
      );

      [liveRef, wipRef].forEach((ref) => {
        const cards = ref.current?.querySelectorAll(".project-card");
        if (!cards?.length) return;
        gsap.fromTo(
          cards,
          { opacity: 0, y: 28 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.1,
            duration: 0.6,
            ease: "power2.out",
            scrollTrigger: { trigger: ref.current, start: "top 85%" },
          }
        );
      });
    });
    return () => ctx.revert();
  }, []);

  const live = projects.filter((p) => p.status === "live");
  const wip = projects.filter((p) => p.status === "in-progress");

  return (
    <div className="max-w-4xl mx-auto px-8 py-16">
      <div ref={headerRef} style={{ opacity: 0 }}>
        <h1
          className="mb-2"
          style={{
            fontFamily: "Fraunces, Georgia, serif",
            fontStyle: "italic",
            fontSize: "3rem",
            color: "#fff",
            lineHeight: 1.1,
          }}
        >
          Projects
        </h1>
        <p
          className="mb-16 text-sm"
          style={{ color: "rgba(255,255,255,0.3)" }}
        >
          Things I&apos;ve built and things I&apos;m building.
        </p>
      </div>

      {/* Live */}
      <section className="mb-20">
        <div className="flex items-center gap-4 mb-8">
          <span
            className="text-xs tracking-widest uppercase shrink-0"
            style={{ color: "rgba(255,255,255,0.22)" }}
          >
            Live
          </span>
          <div
            className="flex-1 h-px"
            style={{ background: "rgba(255,255,255,0.07)" }}
          />
        </div>
        <div
          ref={liveRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {live.map((p) => (
            <div key={p.name} className="project-card" style={{ opacity: 0 }}>
              <ProjectCard project={p} />
            </div>
          ))}
        </div>
      </section>

      {/* In Progress */}
      <section>
        <div className="flex items-center gap-4 mb-8">
          <span
            className="text-xs tracking-widest uppercase shrink-0"
            style={{ color: "rgba(255,255,255,0.22)" }}
          >
            In Progress
          </span>
          <div
            className="flex-1 h-px"
            style={{ background: "rgba(255,255,255,0.07)" }}
          />
        </div>
        <div
          ref={wipRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {wip.map((p) => (
            <div key={p.name} className="project-card" style={{ opacity: 0 }}>
              <ProjectCard project={p} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
