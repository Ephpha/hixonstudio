"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import BlogCanvas from "@/components/BlogCanvas";

gsap.registerPlugin(ScrollTrigger);

type WritingLink = {
  source: string;
  date?: string;
  title: string;
  excerpt: string;
  href: string;
  cta: string;
};

const recent: WritingLink[] = [
  {
    source: "Essay · X",
    date: "June 9, 2026",
    title: "The Last Four Months Changed How I See AI",
    excerpt:
      "Back in February 2026, I started getting pulled deeper into AI and the tech world in general. Somewhere in that rabbit hole, my entire perception of what is possible changed. Anyone can generate code. Not everyone can decide what should exist.",
    href: "https://x.com/HixonStudio/status/2064463514115190983",
    cta: "Read on X",
  },
];

export default function BlogClient() {
  const headerRef = useRef<HTMLDivElement>(null);
  const recentRef = useRef<HTMLElement>(null);
  const substackRef = useRef<HTMLElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power2.out", delay: 0.1 }
      );

      [recentRef, substackRef, footerRef].forEach((ref, i) => {
        gsap.fromTo(
          ref.current,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power2.out",
            delay: 0.3 + i * 0.12,
            scrollTrigger: { trigger: ref.current, start: "top 88%" },
          }
        );
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-8 py-10 sm:py-16">
      <BlogCanvas />

      {/* Header */}
      <div ref={headerRef} style={{ opacity: 0 }}>
        <h1
          className="mb-3"
          style={{
            fontFamily: "Fraunces, Georgia, serif",
            fontStyle: "italic",
            fontSize: "clamp(2rem, 7vw, 3rem)",
            color: "#fff",
            lineHeight: 1.1,
          }}
        >
          Writing
        </h1>
        <p
          className="mb-12 sm:mb-20"
          style={{
            fontFamily: "Fraunces, Georgia, serif",
            fontStyle: "italic",
            color: "rgba(255,255,255,0.55)",
            fontSize: "clamp(1rem, 2.6vw, 1.2rem)",
            lineHeight: 1.6,
            maxWidth: "32rem",
          }}
        >
          The process, the rabbit holes, the wins, the failures — and what I&apos;m
          learning while turning ideas into real projects.
        </p>
      </div>

      {/* Recent */}
      <section ref={recentRef} className="mb-14 sm:mb-20" style={{ opacity: 0 }}>
        <div className="flex items-center justify-between mb-5">
          <p
            className="text-xs tracking-widest uppercase"
            style={{ color: "rgba(255,255,255,0.25)" }}
          >
            Recent
          </p>
          <p
            className="text-xs tracking-widest uppercase"
            style={{ color: "rgba(255,255,255,0.18)" }}
          >
            01 / 01
          </p>
        </div>
        <div
          className="w-full h-px mb-8"
          style={{ background: "rgba(255,255,255,0.08)" }}
        />

        <div className="flex flex-col gap-8">
          {recent.map((post) => (
            <a
              key={post.href}
              href={post.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group block p-6 sm:p-8 rounded-xl transition-all"
              style={{
                background: "rgba(255,255,255,0.025)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <div className="flex items-center justify-between mb-5">
                <span
                  className="text-xs tracking-widest uppercase"
                  style={{ color: "rgba(255,255,255,0.4)" }}
                >
                  {post.source}
                </span>
                {post.date && (
                  <span
                    className="text-xs"
                    style={{ color: "rgba(255,255,255,0.3)" }}
                  >
                    {post.date}
                  </span>
                )}
              </div>

              <h2
                className="mb-4 transition-colors"
                style={{
                  fontFamily: "Fraunces, Georgia, serif",
                  fontStyle: "italic",
                  fontSize: "clamp(1.3rem, 4vw, 1.75rem)",
                  color: "rgba(255,255,255,0.92)",
                  lineHeight: 1.25,
                }}
              >
                {post.title}
              </h2>

              <p
                className="mb-6 text-sm sm:text-base"
                style={{
                  color: "rgba(255,255,255,0.55)",
                  lineHeight: 1.75,
                }}
              >
                {post.excerpt}
              </p>

              <div className="flex items-center justify-between">
                <span
                  className="text-xs tracking-widest uppercase transition-opacity group-hover:opacity-100"
                  style={{
                    color: "rgba(255,255,255,0.7)",
                    opacity: 0.85,
                  }}
                >
                  {post.cta}
                </span>
                <span
                  className="transition-transform group-hover:translate-x-1"
                  style={{ color: "rgba(255,255,255,0.5)", fontSize: "1rem" }}
                >
                  →
                </span>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Substack */}
      <section
        ref={substackRef}
        className="mb-14 sm:mb-20"
        style={{ opacity: 0 }}
      >
        <p
          className="text-xs tracking-widest uppercase mb-5"
          style={{ color: "rgba(255,255,255,0.25)" }}
        >
          Subscribe
        </p>
        <div
          className="w-full h-px mb-8"
          style={{ background: "rgba(255,255,255,0.08)" }}
        />

        <a
          href="https://substack.com/@hunchohix"
          target="_blank"
          rel="noopener noreferrer"
          className="group block p-8 sm:p-10 rounded-xl transition-all relative overflow-hidden"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.015) 100%)",
            border: "1px solid rgba(255,255,255,0.09)",
          }}
        >
          {/* faint corner glow */}
          <div
            style={{
              position: "absolute",
              top: "-40%",
              right: "-20%",
              width: "60%",
              height: "120%",
              background:
                "radial-gradient(ellipse at center, rgba(255,255,255,0.05) 0%, transparent 60%)",
              pointerEvents: "none",
            }}
          />

          <div className="relative">
            <span
              className="text-xs tracking-widest uppercase block mb-5"
              style={{ color: "rgba(255,255,255,0.42)" }}
            >
              Hixon Studio · Substack
            </span>

            <h2
              className="mb-5"
              style={{
                fontFamily: "Fraunces, Georgia, serif",
                fontStyle: "italic",
                fontSize: "clamp(1.3rem, 4vw, 1.8rem)",
                color: "rgba(255,255,255,0.95)",
                lineHeight: 1.2,
                maxWidth: "26rem",
              }}
            >
              Longer pieces. Process notes. The building, in writing.
            </h2>

            <p
              className="mb-7 text-sm sm:text-base"
              style={{
                color: "rgba(255,255,255,0.55)",
                lineHeight: 1.7,
                maxWidth: "32rem",
              }}
            >
              Deeper writing on what I&apos;m building, what I&apos;m learning,
              and the rabbit holes I keep falling into. Free. Whenever I have
              something worth saying.
            </p>

            <div className="flex items-center gap-3">
              <span
                className="text-sm px-5 py-2.5 rounded-full transition-opacity group-hover:opacity-80"
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.18)",
                  color: "#fff",
                  letterSpacing: "0.05em",
                }}
              >
                Subscribe on Substack
              </span>
              <span
                className="transition-transform group-hover:translate-x-1"
                style={{ color: "rgba(255,255,255,0.5)", fontSize: "1rem" }}
              >
                →
              </span>
            </div>
          </div>
        </a>
      </section>

      {/* Footer note */}
      <div
        ref={footerRef}
        className="pb-16 text-center"
        style={{ opacity: 0 }}
      >
        <div
          className="w-12 h-px mx-auto mb-6"
          style={{ background: "rgba(255,255,255,0.15)" }}
        />
        <p
          style={{
            fontFamily: "Fraunces, Georgia, serif",
            fontStyle: "italic",
            color: "rgba(255,255,255,0.4)",
            fontSize: "0.95rem",
            lineHeight: 1.7,
          }}
        >
          More coming. The good ones take a minute.
        </p>
      </div>
    </div>
  );
}
