"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SparkleSymbol from "@/components/SparkleSymbol";

gsap.registerPlugin(ScrollTrigger);

const buildingTools = ["Claude Code", "GPT-5.5", "Next.js", "React", "TypeScript", "Tailwind", "Supabase", "GSAP", "Electron", "Python"];

export default function AboutPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const storyRef = useRef<HTMLElement>(null);
  const shiftRef = useRef<HTMLElement>(null);
  const distributionRef = useRef<HTMLElement>(null);
  const stackRef = useRef<HTMLElement>(null);
  const elsewhereRef = useRef<HTMLElement>(null);
  const closingRef = useRef<HTMLElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let breatheTimer: ReturnType<typeof setTimeout>;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        heroRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power2.out", delay: 0.1 }
      );

      [storyRef, shiftRef, distributionRef, stackRef, elsewhereRef, closingRef].forEach((ref) => {
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

    if (portraitRef.current) {
      const el = portraitRef.current;
      el.style.transition = "opacity 1.8s ease-out, filter 1.8s ease-out, transform 1.8s ease-out";
      requestAnimationFrame(() => {
        el.style.opacity = "0.6";
        el.style.filter = "blur(0px)";
        el.style.transform = "scale(1)";
      });
      breatheTimer = setTimeout(() => {
        el.style.transition = "none";
        el.style.animation = "portraitBreathe 6s ease-in-out infinite";
      }, 2000);
    }

    return () => {
      ctx.revert();
      clearTimeout(breatheTimer);
    };
  }, []);

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-8 py-10 sm:py-16">
      {/* Hero with portrait background */}
      <div className="relative mb-16 sm:mb-28">
        {/* Portrait — behind the text, masked into the page */}
        <div
          ref={portraitRef}
          aria-hidden="true"
          className="pointer-events-none select-none"
          style={{
            position: "absolute",
            top: "-1rem",
            right: "-2rem",
            width: "clamp(180px, 40vw, 360px)",
            opacity: 0,
            filter: "blur(8px)",
            transform: "scale(1.08)",
            zIndex: 0,
            mixBlendMode: "screen",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/hix-portrait.png"
            alt=""
            style={{
              width: "100%",
              height: "auto",
              display: "block",
              maskImage:
                "radial-gradient(ellipse 70% 75% at 55% 38%, black 20%, transparent 75%)",
              WebkitMaskImage:
                "radial-gradient(ellipse 70% 75% at 55% 38%, black 20%, transparent 75%)",
              filter: "grayscale(100%) invert(1) brightness(0.7) blur(2.5px)",
            }}
          />
        </div>

        <div
          ref={heroRef}
          className="relative"
          style={{ opacity: 0, zIndex: 1 }}
        >
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
              maxWidth: "26rem",
            }}
          >
            I build under Hixon.Studio — a place to test ideas, ship them
            publicly, and figure things out in the open.
          </p>
        </div>
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
            the tech world in general. It started with curiosity. I was trying
            to understand what OpenClaw was. That led me to API keys. Then
            tokenization. Then agents. Then MiniMax. Then Claude. Then Claude
            Code.
          </p>
          <p>
            Somewhere in that rabbit hole, my entire perception of what is
            possible changed.
          </p>
          <p>
            I don&apos;t come from a traditional software background. I work a
            software production job in the medical field. I had little real
            experience with Python, full coding environments, or building
            software from the ground up. So when I first started seeing what
            these tools could do, it felt almost unrealistic.
          </p>
          <p
            style={{
              fontFamily: "Fraunces, Georgia, serif",
              fontStyle: "italic",
              color: "rgba(255,255,255,0.85)",
              fontSize: "1.15em",
            }}
          >
            But Claude Code changed everything for me. It made the technical
            side of building feel less like a locked door and more like a
            language I could slowly learn how to speak.
          </p>
        </div>
      </section>

      {/* The shift */}
      <section ref={shiftRef} className="mb-14 sm:mb-24" style={{ opacity: 0 }}>
        <p
          className="text-xs tracking-widest uppercase mb-5"
          style={{ color: "rgba(255,255,255,0.22)" }}
        >
          What I&apos;ve learned
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
            A lot of people call this &ldquo;vibe coding.&rdquo; I understand
            why. But after months doing it every day, I don&apos;t think it&apos;s
            simply easy or hard. It rewards patience. Clear thinking. Having an
            actual vision for what you want to build, how you want it to work,
            and how you want the end user to feel when they use it.
          </p>
          <p>
            Prompting is communication. You have to understand how these models
            interpret what you&apos;re asking, how they structure their output,
            and how specific you need to be to get the result you actually
            imagined.
          </p>
          <p
            style={{
              fontFamily: "Fraunces, Georgia, serif",
              fontStyle: "italic",
              color: "rgba(255,255,255,0.85)",
              fontSize: "1.15em",
            }}
          >
            Anyone can generate code. Not everyone can decide what should exist,
            why it should exist, who it&apos;s for, and what it should feel like.
          </p>
        </div>
      </section>

      {/* The other side */}
      <section
        ref={distributionRef}
        className="mb-14 sm:mb-24"
        style={{ opacity: 0 }}
      >
        <p
          className="text-xs tracking-widest uppercase mb-5"
          style={{ color: "rgba(255,255,255,0.22)" }}
        >
          The other side
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
            It&apos;s a lot harder to get rich off a vibe-coded project than
            people make it sound. Coding isn&apos;t always the hardest part
            anymore.
          </p>
          <p>
            The harder part is what comes after — getting people to notice it,
            understand it, trust it, use it, and care enough to come back.
          </p>
          <p>
            We could have millions of builders making useful, life-changing
            products. But if they can&apos;t get them in front of people, a lot
            of great ideas will still disappear.
          </p>
          <p
            style={{
              color: "rgba(255,255,255,0.85)",
              fontFamily: "Fraunces, Georgia, serif",
              fontStyle: "italic",
              fontSize: "1.15em",
            }}
          >
            Building is one side. Distribution is the other.
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
          Claude Code daily for building, navigating codebases, and mapping out
          projects. GPT-5.5 for visual direction, layouts, color, and helping
          shape how things feel.
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
          ].map((link, i, arr) => (
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
              AI lowered the cost of trying. It didn&apos;t remove the need for
              taste, patience, direction, or persistence — it made those things
              matter more.
            </p>
            <p>
              The question is no longer &ldquo;Can I build this?&rdquo; The
              better question is: &ldquo;Am I willing to spend the time, tokens,
              patience, and energy to figure it out?&rdquo;
            </p>
            <p>
              That&apos;s what Hixon.Studio has become for me. A place to build,
              test, learn, fail, improve, and share the process publicly.
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
