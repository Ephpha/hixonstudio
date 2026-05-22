"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import BlogCanvas from "@/components/BlogCanvas";

export default function BlogClient() {
  const headerRef = useRef<HTMLDivElement>(null);
  const comingSoonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out", delay: 0.1 }
      );
      gsap.fromTo(
        comingSoonRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out", delay: 0.35 }
      );
    });
    return () => ctx.revert();
  }, []);

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-8 py-10 sm:py-16">
      <BlogCanvas />
      <div ref={headerRef} style={{ opacity: 0 }}>
        <h1
          className="mb-2"
          style={{
            fontFamily: "Fraunces, Georgia, serif",
            fontStyle: "italic",
            fontSize: "clamp(2rem, 7vw, 3rem)",
            color: "#fff",
          }}
        >
          Writing
        </h1>
        <p
          className="mb-10 sm:mb-16 text-sm"
          style={{ color: "rgba(255,255,255,0.3)" }}
        >
          Personal thoughts and technical deep dives.
        </p>
      </div>

      <div ref={comingSoonRef} style={{ opacity: 0 }}>
        <div
          className="w-8 h-px mb-10"
          style={{ background: "rgba(255,255,255,0.15)" }}
        />
        <p
          style={{
            fontFamily: "Fraunces, Georgia, serif",
            fontStyle: "italic",
            fontSize: "clamp(1.1rem, 3vw, 1.35rem)",
            color: "rgba(255,255,255,0.55)",
            lineHeight: 1.75,
          }}
        >
          Something worth reading is on its way.
        </p>
        <p
          className="mt-3 text-xs tracking-widest uppercase"
          style={{ color: "rgba(255,255,255,0.2)" }}
        >
          Coming soon
        </p>
      </div>
    </div>
  );
}
