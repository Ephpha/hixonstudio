"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SparkleSymbol from "@/components/SparkleSymbol";
import { prefersReducedMotion } from "@/lib/useReducedMotion";

gsap.registerPlugin(ScrollTrigger);

const buildingTools = ["Claude Code", "Cursor", "ChatGPT 5.6", "Next.js", "React", "TypeScript", "Tailwind", "Supabase", "GSAP", "Electron", "Python"];

export default function AboutClient() {
  const heroRef = useRef<HTMLDivElement>(null);
  const storyRef = useRef<HTMLElement>(null);
  const stackRef = useRef<HTMLElement>(null);
  const elsewhereRef = useRef<HTMLElement>(null);
  const closingRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const sections = [storyRef, stackRef, elsewhereRef, closingRef];

    // Sections start at opacity 0 for the reveal. If the user asked for reduced
    // motion, skip straight to the visible state rather than animating into it.
    if (prefersReducedMotion()) {
      gsap.set([heroRef.current, ...sections.map((r) => r.current)], {
        opacity: 1,
        y: 0,
      });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        heroRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power2.out", delay: 0.1 }
      );

      sections.forEach((ref) => {
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
    return () => ctx.revert();
  }, []);

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-8 py-10 sm:py-16">
      {/* Hero */}
      <div ref={heroRef} className="mb-16 sm:mb-28" style={{ opacity: 0 }}>
        <SparkleSymbol size="sm" className="mb-8 opacity-25" />
        <h1
          className="mb-6"
          style={{
            fontFamily: "Fraunces, Georgia, serif",
            fontStyle: "italic",
            fontSize: "clamp(2.25rem, 8vw, 3.5rem)",
            color: "#fff",
            lineHeight: 1.05,
          }}
        >
          I&apos;m Hix.
        </h1>
        <p
          style={{
            fontFamily: "Fraunces, Georgia, serif",
            fontStyle: "italic",
            fontSize: "clamp(1.1rem, 3.5vw, 1.4rem)",
            color: "rgba(255,255,255,0.58)",
            lineHeight: 1.7,
          }}
        >
          I build under Hixon.Studio — a place to test ideas, ship them
          publicly, and figure things out in the open.
        </p>
      </div>

      {/* The story */}
      <section ref={storyRef} className="mb-14 sm:mb-24" style={{ opacity: 0 }}>
        <p
          className="text-xs tracking-widest uppercase mb-5"
          style={{ color: "rgba(255,255,255,0.22)" }}
        >
          How I got here
        </p>
        <div
          className="w-8 h-px mb-8"
          style={{ background: "rgba(255,255,255,0.18)" }}
        />
        <div
          className="flex flex-col gap-5 text-base"
          style={{ color: "rgba(255,255,255,0.62)", lineHeight: 1.85 }}
        >
          <p>
            Back in February 2026, I started getting pulled deeper into AI and
            the tech world in general. It started with curiosity. I already knew
            the basics — ChatGPT had been around for years, and like most people
            around me, I leaned on it every day. But I wanted to understand what
            was actually happening underneath it.
          </p>
          <p>
            I don&apos;t come from a traditional software background. For over
            six years I&apos;ve been a software production manager at Pump Peelz,
            a company that makes custom, decorative patches and stickers for
            insulin pumps and CGMs — turning medical devices people have no
            choice but to wear into something that finally feels like their own.
            I work with code there every day: building it into our software
            files, uploading new products to the site, and keeping track of the
            data behind all of it.
          </p>
          <p>
            It&apos;s not the standard picture of a tech job — but I&apos;ve come
            to believe there isn&apos;t one. There are countless paths to being
            handed a problem inside a codebase or a website and finding your way
            to a solution. AI has quietly collapsed the old idea that only a
            small, select group of people are allowed to do these things.
          </p>
          <p>
            Trying to figure out what OpenClaw was opened a wormhole. OpenClaw
            pulled me into Claude Code. Claude Code pulled me into agents, then
            Cursor, then everything after it. The deeper I went, the more I
            realized this wasn&apos;t a gimmick — it was a real glimpse of where
            the world could be heading, and a tool that could change my life and
            a lot of other people&apos;s.
          </p>
          <p>
            A lot of people still don&apos;t know what&apos;s genuinely possible
            right now — through frontier models or open source. And open source
            is catching up faster than most expected, which I think is a good
            thing. It keeps the game fair and honest, instead of a handful of
            labs deciding who does and doesn&apos;t get to use this kind of
            intelligence.
          </p>
          <p
            style={{
              fontFamily: "Fraunces, Georgia, serif",
              fontStyle: "italic",
              color: "rgba(255,255,255,0.85)",
              fontSize: "1.15em",
            }}
          >
            Somewhere in that rabbit hole, my entire perception of what is
            possible changed. Claude Code made the technical side of building
            feel less like a locked door, and more like a language I could
            slowly learn to speak.
          </p>
        </div>
      </section>

      {/* Stack */}
      <section ref={stackRef} className="mb-14 sm:mb-24" style={{ opacity: 0 }}>
        <p
          className="text-xs tracking-widest uppercase mb-5"
          style={{ color: "rgba(255,255,255,0.22)" }}
        >
          What I build with
        </p>
        <div
          className="w-8 h-px mb-8"
          style={{ background: "rgba(255,255,255,0.18)" }}
        />
        <div className="flex flex-wrap gap-2">
          {buildingTools.map((item) => (
            <span
              key={item}
              className="text-xs px-3 py-1 rounded-full"
              style={{
                fontFamily: "Courier New, monospace",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.09)",
                color: "rgba(255,255,255,0.5)",
              }}
            >
              {item}
            </span>
          ))}
        </div>
        <p
          className="text-sm mt-6"
          style={{ color: "rgba(255,255,255,0.4)", lineHeight: 1.75 }}
        >
          Claude Code and Cursor daily for building — writing code, navigating
          codebases, and mapping out projects. ChatGPT 5.6 for visual direction,
          layouts, coloring, and shaping how things feel.
        </p>
      </section>

      {/* Elsewhere */}
      <section
        ref={elsewhereRef}
        className="mb-14 sm:mb-24"
        style={{ opacity: 0 }}
      >
        <p
          className="text-xs tracking-widest uppercase mb-5"
          style={{ color: "rgba(255,255,255,0.22)" }}
        >
          Elsewhere
        </p>
        <div
          className="w-8 h-px mb-8"
          style={{ background: "rgba(255,255,255,0.18)" }}
        />
        <div className="flex flex-col">
          {[
            { label: "X", handle: "@HixonStudio", href: "https://x.com/HixonStudio" },
            { label: "Substack", handle: "@hunchohix", href: "https://substack.com/@hunchohix" },
            { label: "GitHub", handle: "@Hixly", href: "https://github.com/Hixly" },
          ].map((link, i) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between py-4 transition-colors"
              style={{
                borderTop: i === 0 ? "1px solid rgba(255,255,255,0.06)" : undefined,
                borderBottom: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <div className="flex items-baseline gap-4">
                <span
                  className="text-xs tracking-widest uppercase"
                  style={{ color: "rgba(255,255,255,0.32)", width: "5rem" }}
                >
                  {link.label}
                </span>
                <span
                  style={{
                    fontFamily: "Fraunces, Georgia, serif",
                    fontStyle: "italic",
                    fontSize: "1.15rem",
                    color: "rgba(255,255,255,0.82)",
                  }}
                >
                  {link.handle}
                </span>
              </div>
              <span
                className="transition-transform group-hover:translate-x-1"
                style={{ color: "rgba(255,255,255,0.45)" }}
              >
                →
              </span>
            </a>
          ))}
        </div>
      </section>

      {/* Closing */}
      <section ref={closingRef} className="pb-16" style={{ opacity: 0 }}>
        <div
          className="p-8 sm:p-10 rounded-xl"
          style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <SparkleSymbol size="sm" className="mb-5 opacity-25" />
          <p
            className="text-xs tracking-widest uppercase mb-5"
            style={{ color: "rgba(255,255,255,0.22)" }}
          >
            Where I&apos;m headed
          </p>
          <div
            className="flex flex-col gap-5"
            style={{
              fontFamily: "Fraunces, Georgia, serif",
              fontStyle: "italic",
              fontSize: "1.2rem",
              color: "rgba(255,255,255,0.78)",
              lineHeight: 1.75,
            }}
          >
            <p>
              Right now, most of what I&apos;m building points toward Hackyard —
              small, community-driven hackathons where every project actually
              gets seen. I&apos;m not just trying to launch a product; I&apos;m
              trying to grow a community around it.
            </p>
            <p>
              A big part of that is promoting other builders — the ones who&apos;d
              otherwise go unnoticed. If AI is going to let more people make real
              things, then the least I can do is help make sure that work gets in
              front of people instead of quietly disappearing.
            </p>
            <p>
              I&apos;m figuring it out as I go, learning from my successes and my
              failures at the same time. That&apos;s what Hixon.Studio is really
              for — to build, test, learn, fail, improve, and share the whole
              process out in the open.
            </p>
          </div>
          <p
            className="mt-8 text-sm"
            style={{
              color: "rgba(255,255,255,0.35)",
              letterSpacing: "0.04em",
            }}
          >
            — Hix
          </p>
        </div>
      </section>
    </div>
  );
}
