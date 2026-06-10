"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SparkleSymbol from "@/components/SparkleSymbol";

gsap.registerPlugin(ScrollTrigger);

const SUBHEAD =
  "Got an idea, a question, or want to collaborate? Send a note — I read everything that comes through.";

const alts = [
  {
    label: "Email",
    handle: "matthix96@gmail.com",
    href: "mailto:matthix96@gmail.com",
    external: false,
  },
  {
    label: "X",
    handle: "@HixonStudio",
    href: "https://x.com/HixonStudio",
    external: true,
  },
  {
    label: "Substack",
    handle: "@hunchohix",
    href: "https://substack.com/@hunchohix",
    external: true,
  },
  {
    label: "GitHub",
    handle: "@Hixly",
    href: "https://github.com/Hixly",
    external: true,
  },
];

export default function ContactPage() {
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [typed, setTyped] = useState("");
  const [opened, setOpened] = useState(false);

  const heroRef = useRef<HTMLDivElement>(null);
  const formCardRef = useRef<HTMLDivElement>(null);
  const altsRef = useRef<HTMLElement>(null);
  const closingRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        heroRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power2.out", delay: 0.1 }
      );

      // Typewriter subhead
      const counter = { i: 0 };
      gsap.to(counter, {
        i: SUBHEAD.length,
        duration: SUBHEAD.length * 0.022,
        delay: 0.75,
        ease: "none",
        onUpdate: () => setTyped(SUBHEAD.slice(0, Math.floor(counter.i))),
      });

      // Form card fades in as a whole
      gsap.fromTo(
        formCardRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          delay: 1.1,
        }
      );

      // Form fields stagger inside the card
      const fields = formCardRef.current?.querySelectorAll(".field");
      if (fields?.length) {
        gsap.fromTo(
          fields,
          { opacity: 0, y: 14 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.09,
            duration: 0.5,
            delay: 1.35,
            ease: "power2.out",
          }
        );
      }

      gsap.fromTo(
        altsRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power2.out",
          scrollTrigger: { trigger: altsRef.current, start: "top 88%" },
        }
      );

      gsap.fromTo(
        closingRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.7,
          ease: "power2.out",
          scrollTrigger: { trigger: closingRef.current, start: "top 92%" },
        }
      );
    });
    return () => ctx.revert();
  }, []);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const body = `From: ${name}\n\n${message}`;
    const mailto = `mailto:matthix96@gmail.com?subject=${encodeURIComponent(
      subject || `Hello from hixon.studio${name ? ` — ${name}` : ""}`
    )}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
    setOpened(true);
  };

  const inputBase: React.CSSProperties = {
    background: "rgba(255,255,255,0.025)",
    border: "1px solid rgba(255,255,255,0.09)",
    color: "#fff",
    fontFamily: "Fraunces, Georgia, serif",
    transition: "border-color 0.2s ease, box-shadow 0.2s ease",
  };

  const onFocusStyle = (el: HTMLInputElement | HTMLTextAreaElement) => {
    el.style.borderColor = "rgba(255,255,255,0.4)";
    el.style.boxShadow = "0 0 0 4px rgba(255,255,255,0.03)";
  };
  const onBlurStyle = (el: HTMLInputElement | HTMLTextAreaElement) => {
    el.style.borderColor = "rgba(255,255,255,0.09)";
    el.style.boxShadow = "none";
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-8 py-10 sm:py-20">
      {/* Hero */}
      <div
        ref={heroRef}
        className="mb-12 sm:mb-16 text-center"
        style={{ opacity: 0 }}
      >
        <div className="inline-block mb-7 opacity-30">
          <SparkleSymbol size="sm" />
        </div>
        <h1
          style={{
            fontFamily: "Fraunces, Georgia, serif",
            fontStyle: "italic",
            fontSize: "clamp(2.5rem, 8vw, 4rem)",
            color: "#fff",
            lineHeight: 1.05,
            marginBottom: "1.5rem",
          }}
        >
          Let&apos;s talk.
        </h1>
        <p
          style={{
            fontFamily: "Fraunces, Georgia, serif",
            fontStyle: "italic",
            color: "rgba(255,255,255,0.55)",
            fontSize: "clamp(1rem, 2.6vw, 1.2rem)",
            lineHeight: 1.65,
            minHeight: "4em",
            maxWidth: "32rem",
            margin: "0 auto",
          }}
        >
          {typed}
          <span
            aria-hidden="true"
            style={{
              display: "inline-block",
              width: "0.45em",
              marginLeft: "0.05em",
              color: "rgba(255,255,255,0.7)",
              animation: "hixonCursor 1s steps(1) infinite",
            }}
          >
            ▌
          </span>
        </p>
      </div>

      {/* Form Card */}
      <div
        ref={formCardRef}
        className="mb-16 sm:mb-24 p-6 sm:p-10 rounded-2xl relative overflow-hidden"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.025) 0%, rgba(255,255,255,0.005) 100%)",
          border: "1px solid rgba(255,255,255,0.08)",
          opacity: 0,
        }}
      >
        {/* Faint corner glow */}
        <div
          style={{
            position: "absolute",
            top: "-30%",
            right: "-15%",
            width: "55%",
            height: "100%",
            background:
              "radial-gradient(ellipse at center, rgba(255,255,255,0.05) 0%, transparent 60%)",
            pointerEvents: "none",
          }}
        />

        <form onSubmit={handleSend} className="relative">
          <div className="field mb-6" style={{ opacity: 0 }}>
            <label
              htmlFor="name"
              className="block text-xs tracking-widest uppercase mb-3"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              Name
            </label>
            <input
              id="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="w-full px-4 py-3 rounded-lg outline-none text-base"
              style={inputBase}
              onFocus={(e) => onFocusStyle(e.currentTarget)}
              onBlur={(e) => onBlurStyle(e.currentTarget)}
            />
          </div>

          <div className="field mb-6" style={{ opacity: 0 }}>
            <label
              htmlFor="subject"
              className="block text-xs tracking-widest uppercase mb-3"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              Subject
            </label>
            <input
              id="subject"
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="What's this about?"
              className="w-full px-4 py-3 rounded-lg outline-none text-base"
              style={inputBase}
              onFocus={(e) => onFocusStyle(e.currentTarget)}
              onBlur={(e) => onBlurStyle(e.currentTarget)}
            />
          </div>

          <div className="field mb-7" style={{ opacity: 0 }}>
            <label
              htmlFor="message"
              className="block text-xs tracking-widest uppercase mb-3"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              Message
            </label>
            <textarea
              id="message"
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={6}
              placeholder="Say anything. Pitch an idea. Ask a question. Just say hi."
              className="w-full px-4 py-3 rounded-lg outline-none text-base resize-none"
              style={{ ...inputBase, lineHeight: 1.6 }}
              onFocus={(e) => onFocusStyle(e.currentTarget)}
              onBlur={(e) => onBlurStyle(e.currentTarget)}
            />
          </div>

          <div
            className="field flex items-center justify-between flex-wrap gap-4"
            style={{ opacity: 0 }}
          >
            <button
              type="submit"
              className="group inline-flex items-center gap-3 text-sm px-6 py-3 rounded-full transition-all"
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.22)",
                color: "#fff",
                letterSpacing: "0.06em",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.12)";
                e.currentTarget.style.boxShadow =
                  "0 0 24px rgba(255,255,255,0.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <span>Send message</span>
              <span className="transition-transform group-hover:translate-x-1">
                →
              </span>
            </button>
            {opened && (
              <span
                className="text-xs tracking-widest uppercase"
                style={{ color: "rgba(120,255,160,0.85)" }}
              >
                ● Opening your mail app
              </span>
            )}
          </div>
        </form>
      </div>

      {/* Other ways */}
      <section ref={altsRef} className="mb-14 sm:mb-20" style={{ opacity: 0 }}>
        <p
          className="text-xs tracking-widest uppercase mb-5"
          style={{ color: "rgba(255,255,255,0.22)" }}
        >
          Or find me here
        </p>
        <div
          className="w-8 h-px mb-8"
          style={{ background: "rgba(255,255,255,0.18)" }}
        />
        <div className="flex flex-col">
          {alts.map((a, i) => (
            <a
              key={a.label}
              href={a.href}
              target={a.external ? "_blank" : undefined}
              rel={a.external ? "noopener noreferrer" : undefined}
              className="group flex items-center justify-between py-4 transition-colors"
              style={{
                borderTop:
                  i === 0 ? "1px solid rgba(255,255,255,0.06)" : undefined,
                borderBottom: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <div className="flex items-baseline gap-4 min-w-0 flex-1">
                <span
                  className="text-xs tracking-widest uppercase shrink-0"
                  style={{
                    color: "rgba(255,255,255,0.32)",
                    width: "5.5rem",
                  }}
                >
                  {a.label}
                </span>
                <span
                  className="truncate"
                  style={{
                    fontFamily: "Fraunces, Georgia, serif",
                    fontStyle: "italic",
                    fontSize: "clamp(0.95rem, 2.6vw, 1.15rem)",
                    color: "rgba(255,255,255,0.82)",
                  }}
                >
                  {a.handle}
                </span>
              </div>
              <span
                className="transition-transform group-hover:translate-x-1 shrink-0 ml-3"
                style={{ color: "rgba(255,255,255,0.45)" }}
              >
                →
              </span>
            </a>
          ))}
        </div>
      </section>

      {/* Closing italic */}
      <p
        ref={closingRef}
        className="text-center pb-16"
        style={{
          fontFamily: "Fraunces, Georgia, serif",
          fontStyle: "italic",
          color: "rgba(255,255,255,0.4)",
          fontSize: "0.95rem",
          lineHeight: 1.7,
          opacity: 0,
        }}
      >
        Reply time varies — but every message gets read.
      </p>
    </div>
  );
}
