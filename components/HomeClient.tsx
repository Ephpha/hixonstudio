"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SparkleSymbol from "@/components/SparkleSymbol";
import CreationCanvas from "@/components/CreationCanvas";
import type { PostMeta } from "@/lib/blog";
import { timeAgo, type GithubData } from "@/lib/github";
import { prefersReducedMotion, useReducedMotion } from "@/lib/useReducedMotion";

gsap.registerPlugin(ScrollTrigger);

const BUILD_COPY =
  "Anyone can generate code. Not everyone can decide what should exist, why it should exist, or what it should feel like.\n\nThe distance between imagination and execution has collapsed. AI didn't remove the need for taste, patience, or direction — it made those things matter more.\n\nHixon.Studio is where I build, test, learn, and share the process publicly.";

export default function HomeClient({
  recentPosts,
  github,
}: {
  recentPosts: PostMeta[];
  github: GithubData | null;
}) {
  const [typed, setTyped] = useState("");
  const [typingDone, setTypingDone] = useState(false);
  const reducedMotion = useReducedMotion();
  // Under reduced motion the typewriter never runs, so show the finished copy.
  const buildCopy = reducedMotion ? BUILD_COPY : typed;
  const buildCopyDone = reducedMotion || typingDone;
  const heroRef = useRef<HTMLHeadingElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLElement>(null);
  const githubRef = useRef<HTMLElement>(null);
  const postsRef = useRef<HTMLElement>(null);
  const bottomCtaRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (prefersReducedMotion()) {
      // Skip the word reveal, the typewriter, and the breathing glow — land
      // directly on the finished state. The copy itself comes from `buildCopy`,
      // which already resolves to the full text under reduced motion.
      const words = Array.from(
        heroRef.current?.querySelectorAll(".hero-word") ?? []
      );
      gsap.set([...words], { clipPath: "inset(0 0 0% 0)", opacity: 1, y: 0 });
      gsap.set(
        [
          taglineRef.current,
          ctaRef.current,
          aboutRef.current,
          githubRef.current,
          postsRef.current,
          bottomCtaRef.current,
        ],
        { opacity: 1, y: 0 }
      );

      if (heroRef.current) {
        // Fixed glow at the midpoint of what the breathe cycle would produce.
        heroRef.current.style.textShadow = [
          "0 0 8px  rgba(255, 255, 255, 0.28)",
          "0 0 28px rgba(255, 255, 255, 0.12)",
          "0 0 60px rgba(255, 255, 255, 0.05)",
        ].join(", ");
      }
      return;
    }

    const ctx = gsap.context(() => {
      // Hero word-by-word reveal
      const words = heroRef.current?.querySelectorAll(".hero-word");
      const tl = gsap.timeline({ delay: 0.1 });

      if (words?.length) {
        tl.fromTo(
          words,
          { clipPath: "inset(0 0 100% 0)", y: 16, opacity: 0 },
          {
            clipPath: "inset(0 0 0% 0)",
            y: 0,
            opacity: 1,
            stagger: 0.04,
            duration: 0.55,
            ease: "power3.out",
          }
        );
      }

      tl.fromTo(
        taglineRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
        "-=0.2"
      ).fromTo(
        ctaRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" },
        "-=0.2"
      );

      // Scroll sections (skip aboutRef — typewriter handles its own reveal)
      [githubRef, postsRef, bottomCtaRef].forEach((ref) => {
        gsap.fromTo(
          ref.current,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power2.out",
            scrollTrigger: { trigger: ref.current, start: "top 85%" },
          }
        );
      });

      // About section: header fades in, then text types out
      if (aboutRef.current) {
        gsap.fromTo(
          aboutRef.current,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
            scrollTrigger: { trigger: aboutRef.current, start: "top 80%" },
          }
        );

        const counter = { i: 0 };
        gsap.to(counter, {
          i: BUILD_COPY.length,
          duration: BUILD_COPY.length * 0.022,
          ease: "none",
          scrollTrigger: {
            trigger: aboutRef.current,
            start: "top 70%",
            toggleActions: "play none none none",
          },
          onUpdate: () => setTyped(BUILD_COPY.slice(0, Math.floor(counter.i))),
          onComplete: () => setTypingDone(true),
        });
      }
    });

    // Chromatic breathe — slow sine-wave RGB channel separation
    const breathe = (time: number) => {
      const el = heroRef.current;
      if (!el) return;
      // 0→1→0 cycle every ~8.4 s
      const t = (Math.sin(time * 0.75) + 1) / 2;
      el.style.textShadow = [
        `0 0 8px  rgba(255, 255, 255, ${t * 0.55})`,
        `0 0 28px rgba(255, 255, 255, ${t * 0.25})`,
        `0 0 60px rgba(255, 255, 255, ${t * 0.10})`,
      ].join(", ");
    };
    gsap.ticker.add(breathe);

    return () => {
      ctx.revert();
      gsap.ticker.remove(breathe);
    };
  }, []);

  return (
    <div className="min-h-screen">
      <CreationCanvas />
      {/* Hero */}
      <section className="flex flex-col items-center justify-center min-h-[90vh] px-4 sm:px-6 text-center">
        <SparkleSymbol size="sm" className="mb-6 sm:mb-8 opacity-40" />

        <h1
          ref={heroRef}
          className="mb-6 hero-title"
          style={{
            fontFamily: "Monowire, sans-serif",
            fontStyle: "normal",
            fontSize: "clamp(1rem, 6.5vw, 5rem)",
            color: "#fff",
            lineHeight: 1.1,
            letterSpacing: "clamp(0.04em, 1vw, 0.18em)",
            whiteSpace: "nowrap",
          }}
        >
          {"Hixon.Studio".split("").map((char, i) => (
            <span
              key={i}
              className="hero-word inline-block"
              style={{ whiteSpace: "pre" }}
            >
              {char === "." ? (
                <span style={{ color: "rgba(255,255,255,0.35)" }}>.</span>
              ) : (
                char
              )}
            </span>
          ))}
        </h1>

        <p
          ref={taglineRef}
          style={{
            color: "rgba(255,255,255,0.38)",
            fontSize: "0.75rem",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            marginBottom: "2.5rem",
            opacity: 0,
          }}
        >
          AI developer · Builder · Making things worth using
        </p>

        <div
          ref={ctaRef}
          className="flex items-center gap-5"
          style={{ opacity: 0 }}
        >
          <Link
            href="/projects"
            className="text-sm px-6 py-3 rounded-full transition-opacity hover:opacity-75"
            style={{
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.14)",
              color: "#fff",
            }}
          >
            View Projects
          </Link>
          <Link
            href="/blog"
            className="text-sm transition-colors hover:text-white"
            style={{ color: "rgba(255,255,255,0.38)" }}
          >
            Read Blog →
          </Link>
        </div>
      </section>

      {/* What I build */}
      <section
        ref={aboutRef}
        className="max-w-2xl mx-auto px-4 sm:px-8 pb-16 sm:pb-28"
        style={{ opacity: 0 }}
      >
        <p
          className="text-xs tracking-widest uppercase mb-4"
          style={{ color: "rgba(255,255,255,0.22)" }}
        >
          What I build
        </p>
        <div
          className="w-8 h-px mb-8"
          style={{ background: "rgba(255,255,255,0.18)" }}
        />
        <div
          style={{
            fontFamily: "Fraunces, Georgia, serif",
            fontStyle: "italic",
            fontSize: "clamp(1.15rem, 3.5vw, 1.5rem)",
            color: "rgba(255,255,255,0.75)",
            lineHeight: 1.75,
            whiteSpace: "pre-line",
            minHeight: "12em",
          }}
        >
          {buildCopy}
          <span
            aria-hidden="true"
            style={{
              display: "inline-block",
              width: "0.55em",
              marginLeft: "0.06em",
              transform: "translateY(0.1em)",
              color: "rgba(255,255,255,0.85)",
              animation: "hixonCursor 1s steps(1) infinite",
              opacity: buildCopyDone ? 0.6 : 1,
            }}
          >
            ▌
          </span>
        </div>
      </section>

      {/* Building in Public — live GitHub data */}
      {github && github.repos.length > 0 && (
        <section
          ref={githubRef}
          className="max-w-2xl mx-auto px-4 sm:px-8 pb-16 sm:pb-28"
          style={{ opacity: 0 }}
        >
          <div className="flex items-center justify-between mb-4">
            <p
              className="text-xs tracking-widest uppercase"
              style={{ color: "rgba(255,255,255,0.22)" }}
            >
              Building in public
            </p>
            <span
              className="text-xs tracking-widest uppercase flex items-center gap-2"
              style={{ color: "rgba(255,255,255,0.32)" }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "rgba(120,255,160,0.85)",
                  boxShadow: "0 0 8px rgba(120,255,160,0.6)",
                  display: "inline-block",
                  animation: "hixonPulse 2.4s ease-in-out infinite",
                }}
              />
              Live
            </span>
          </div>
          <div
            className="w-8 h-px mb-8"
            style={{ background: "rgba(255,255,255,0.18)" }}
          />

          {/* Inline stat strip */}
          <p
            className="mb-6 text-xs tracking-widest uppercase"
            style={{ color: "rgba(255,255,255,0.5)" }}
          >
            <span>{github.publicRepos} repos</span>
            <span style={{ color: "rgba(255,255,255,0.2)", padding: "0 0.75em" }}>
              ·
            </span>
            <span>
              last commit {github.lastPushedAt ? timeAgo(github.lastPushedAt) : "—"}
            </span>
            <span style={{ color: "rgba(255,255,255,0.2)", padding: "0 0.75em" }}>
              ·
            </span>
            <span>{github.totalStars} stars</span>
          </p>

          {/* Currently in */}
          {github.repos[0] && (
            <div className="flex items-baseline justify-between gap-4 flex-wrap">
              <a
                href={github.repos[0].url}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-baseline gap-3 transition-opacity hover:opacity-100"
                style={{ opacity: 0.92 }}
              >
                <span
                  className="text-xs tracking-widest uppercase"
                  style={{ color: "rgba(255,255,255,0.35)" }}
                >
                  Currently in
                </span>
                <span
                  style={{
                    fontFamily: "Fraunces, Georgia, serif",
                    fontStyle: "italic",
                    fontSize: "clamp(1.1rem, 3vw, 1.35rem)",
                    color: "rgba(255,255,255,0.92)",
                  }}
                >
                  {github.repos[0].name}
                </span>
                <span
                  className="transition-transform group-hover:translate-x-1"
                  style={{ color: "rgba(255,255,255,0.5)" }}
                >
                  →
                </span>
              </a>
              <a
                href={github.profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs tracking-widest uppercase transition-colors hover:text-white"
                style={{ color: "rgba(255,255,255,0.35)" }}
              >
                View on GitHub ↗
              </a>
            </div>
          )}
        </section>
      )}

      {/* Latest posts — hidden when no posts exist */}
      {recentPosts.length > 0 && (
        <section
          ref={postsRef}
          className="max-w-2xl mx-auto px-4 sm:px-8 pb-16 sm:pb-28"
          style={{ opacity: 0 }}
        >
          <p
            className="text-xs tracking-widest uppercase mb-4"
            style={{ color: "rgba(255,255,255,0.22)" }}
          >
            Latest writing
          </p>
          <div
            className="w-8 h-px mb-8"
            style={{ background: "rgba(255,255,255,0.18)" }}
          />
          <div className="flex flex-col gap-8">
            {recentPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group flex flex-col gap-1.5"
              >
                <span
                  className="text-xl group-hover:opacity-100 transition-opacity"
                  style={{
                    fontFamily: "Fraunces, Georgia, serif",
                    fontStyle: "italic",
                    color: "rgba(255,255,255,0.82)",
                  }}
                >
                  {post.title}
                </span>
                <span
                  className="text-sm"
                  style={{ color: "rgba(255,255,255,0.35)" }}
                >
                  {post.excerpt}
                </span>
                <span
                  className="text-xs"
                  style={{ color: "rgba(255,255,255,0.2)" }}
                >
                  {new Date(post.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Bottom CTA */}
      <div
        ref={bottomCtaRef}
        className="text-center pb-32"
        style={{ opacity: 0 }}
      >
        <Link
          href="/projects"
          className="text-xs tracking-widest uppercase transition-colors hover:text-white"
          style={{ color: "rgba(255,255,255,0.28)" }}
        >
          See all projects →
        </Link>
      </div>
    </div>
  );
}
