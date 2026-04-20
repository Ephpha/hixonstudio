"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SparkleSymbol from "@/components/SparkleSymbol";
import CreationCanvas from "@/components/CreationCanvas";
import type { PostMeta } from "@/lib/blog";

gsap.registerPlugin(ScrollTrigger);

export default function HomeClient({ recentPosts }: { recentPosts: PostMeta[] }) {
  const heroRef = useRef<HTMLHeadingElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLElement>(null);
  const postsRef = useRef<HTMLElement>(null);
  const bottomCtaRef = useRef<HTMLDivElement>(null);
  const glitchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
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

      // Scroll sections
      [aboutRef, postsRef, bottomCtaRef].forEach((ref) => {
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
    });

    // Periodic glitch burst — fires every 3–8 seconds randomly
    const runGlitch = () => {
      const el = heroRef.current;
      if (!el) return;

      gsap.timeline()
        // slam left + red/blue channel split
        .to(el, { x: -7, textShadow: "7px 0 rgba(255,30,30,0.95), -7px 0 rgba(30,80,255,0.95)", opacity: 0.82, duration: 0.05, ease: "none" })
        // slam right
        .to(el, { x: 6, textShadow: "-6px 0 rgba(255,30,30,0.95), 6px 0 rgba(30,80,255,0.95)", opacity: 1, duration: 0.05, ease: "none" })
        // snap to center, clear shadow
        .to(el, { x: 0, textShadow: "0px 0 transparent, 0px 0 transparent", duration: 0.04, ease: "none" })
        // second micro-stutter
        .to(el, { x: -4, textShadow: "4px 0 rgba(255,30,30,0.75), 0px 0 transparent", opacity: 0.9, duration: 0.04, ease: "none" })
        .to(el, { x: 0, textShadow: "0px 0 transparent, 0px 0 transparent", opacity: 1, duration: 0.04, ease: "none" })
        // one last ghost
        .to(el, { x: 3, textShadow: "0px 0 transparent, -3px 0 rgba(30,80,255,0.6)", duration: 0.05, ease: "none" })
        .to(el, { x: 0, textShadow: "0px 0 transparent, 0px 0 transparent", duration: 0.15, ease: "power2.out" });

      glitchTimer.current = setTimeout(runGlitch, 3000 + Math.random() * 5000);
    };

    // Wait for entry animation to finish before first glitch
    glitchTimer.current = setTimeout(runGlitch, 2800);

    return () => {
      ctx.revert();
      if (glitchTimer.current) clearTimeout(glitchTimer.current);
    };
  }, []);

  return (
    <div className="min-h-screen">
      <CreationCanvas />
      {/* Hero */}
      <section className="flex flex-col items-center justify-center min-h-[90vh] px-6 text-center">
        <SparkleSymbol size="sm" className="mb-8 opacity-40" />

        <h1
          ref={heroRef}
          className="mb-6"
          style={{
            fontFamily: "Syncopate, sans-serif",
            fontStyle: "normal",
            fontSize: "clamp(1.8rem, 6.5vw, 5rem)",
            color: "#fff",
            lineHeight: 1.1,
            letterSpacing: "0.18em",
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
        className="max-w-2xl mx-auto px-8 pb-28"
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
        <p
          style={{
            fontFamily: "Fraunces, Georgia, serif",
            fontStyle: "italic",
            fontSize: "1.5rem",
            color: "rgba(255,255,255,0.75)",
            lineHeight: 1.75,
          }}
        >
          I build AI tools, web apps, and products that feel alive. Everything
          here was made from scratch — no templates, no shortcuts. Just ideas
          turned into real software.
        </p>
      </section>

      {/* Latest posts */}
      <section
        ref={postsRef}
        className="max-w-2xl mx-auto px-8 pb-28"
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
