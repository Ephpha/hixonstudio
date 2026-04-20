"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SparkleSymbol from "@/components/SparkleSymbol";

gsap.registerPlugin(ScrollTrigger);

const stack = [
  "Next.js",
  "TypeScript",
  "React",
  "Tailwind CSS",
  "Supabase",
  "GSAP",
  "Electron",
  "Node.js",
  "Python",
  "AI APIs",
];

export default function AboutPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const storyRef = useRef<HTMLElement>(null);
  const stackRef = useRef<HTMLElement>(null);
  const dreamRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        heroRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power2.out", delay: 0.1 }
      );

      [storyRef, stackRef, dreamRef].forEach((ref) => {
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
      <div ref={heroRef} className="mb-14 sm:mb-24" style={{ opacity: 0 }}>
        <SparkleSymbol size="sm" className="mb-8 opacity-25" />
        <h1
          className="mb-6"
          style={{
            fontFamily: "Fraunces, Georgia, serif",
            fontStyle: "italic",
            fontSize: "clamp(2rem, 7vw, 3rem)",
            color: "#fff",
            lineHeight: 1.1,
          }}
        >
          About
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
          I&apos;m a self-taught developer obsessed with building things at the
          intersection of AI and human experience.
        </p>
      </div>

      {/* Story */}
      <section ref={storyRef} className="mb-12 sm:mb-20" style={{ opacity: 0 }}>
        <p
          className="text-xs tracking-widest uppercase mb-6"
          style={{ color: "rgba(255,255,255,0.2)" }}
        >
          The story
        </p>
        <div
          className="flex flex-col gap-5 text-base"
          style={{ color: "rgba(255,255,255,0.6)", lineHeight: 1.85 }}
        >
          <p>
            I didn&apos;t go to school for this. I learned by building —
            shipping things, breaking them, rebuilding them better. That cycle
            is the most honest education I&apos;ve ever had.
          </p>
          <p>
            The projects on this site aren&apos;t side projects in the &ldquo;I
            made a todo app&rdquo; sense. They&apos;re real software I use,
            software other people use, and software I&apos;m building because
            the problem is genuinely unsolved and I want the solution to exist.
          </p>
          <p>
            I care most about the feeling of software. How it responds. Whether
            it feels like it understands you. That&apos;s where AI gets
            interesting to me — not as a feature to bolt on, but as
            infrastructure for products that feel alive.
          </p>
        </div>
      </section>

      {/* Stack */}
      <section ref={stackRef} className="mb-12 sm:mb-20" style={{ opacity: 0 }}>
        <p
          className="text-xs tracking-widest uppercase mb-6"
          style={{ color: "rgba(255,255,255,0.2)" }}
        >
          Tools I work with
        </p>
        <div className="flex flex-wrap gap-2">
          {stack.map((item) => (
            <span
              key={item}
              className="text-xs px-3 py-1 rounded-full"
              style={{
                fontFamily: "Courier New, monospace",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.09)",
                color: "rgba(255,255,255,0.48)",
              }}
            >
              {item}
            </span>
          ))}
        </div>
      </section>

      {/* Dream */}
      <section ref={dreamRef} className="pb-16" style={{ opacity: 0 }}>
        <div
          className="p-8 rounded-xl"
          style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <SparkleSymbol size="sm" className="mb-5 opacity-20" />
          <p
            className="text-xs tracking-widest uppercase mb-5"
            style={{ color: "rgba(255,255,255,0.2)" }}
          >
            Where I&apos;m headed
          </p>
          <p
            style={{
              fontFamily: "Fraunces, Georgia, serif",
              fontStyle: "italic",
              fontSize: "1.25rem",
              color: "rgba(255,255,255,0.72)",
              lineHeight: 1.75,
            }}
          >
            I want to work at the frontier — the teams building the models and
            the products that will define how humans relate to intelligence. If
            you&apos;re building that and you think I can help, I&apos;d love
            to talk.
          </p>
        </div>
      </section>
    </div>
  );
}
