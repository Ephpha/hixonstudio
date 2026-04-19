"use client";

import { useRef, useState, useCallback } from "react";
import type { Project } from "@/lib/projects";

const MESSAGES = [
  "Hey, I'm Duxy! 👋",
  "Ask me anything.",
  "I can see your screen.",
  "Need help with that?",
  "I'm always listening.",
  "Point me somewhere.",
  "Hmm, interesting choice.",
  "I've got my eye on you.",
  "Try clicking around!",
  "I live in your desktop.",
  "What are we looking at?",
  "Tell me what to do.",
];

export default function DuxyCard({ project }: { project: Project }) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const targetPos = useRef({ x: 0, y: 0 });
  const currentPos = useRef({ x: 0, y: 0 });

  const [active, setActive] = useState(false);
  const [message, setMessage] = useState(MESSAGES[0]);
  const [showBubble, setShowBubble] = useState(false);
  const [iconAngle, setIconAngle] = useState(0);
  const msgTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const rotateTo = useCallback((cx: number, cy: number, mx: number, my: number) => {
    const angle = Math.atan2(my - cy, mx - cx) * (180 / Math.PI);
    setIconAngle(angle);
  }, []);

  const pickMessage = useCallback(() => {
    const next = MESSAGES[Math.floor(Math.random() * MESSAGES.length)];
    setMessage(next);
    setShowBubble(true);
    if (msgTimer.current) clearTimeout(msgTimer.current);
    msgTimer.current = setTimeout(() => setShowBubble(false), 2200);
  }, []);

  function animate() {
    const icon = iconRef.current;
    if (!icon) return;
    const dx = targetPos.current.x - currentPos.current.x;
    const dy = targetPos.current.y - currentPos.current.y;
    currentPos.current.x += dx * 0.12;
    currentPos.current.y += dy * 0.12;
    icon.style.transform = `translate(${currentPos.current.x}px, ${currentPos.current.y}px)`;
    rafRef.current = requestAnimationFrame(animate);
  }

  function handleMouseMove(e: React.MouseEvent<HTMLAnchorElement>) {
    const card = cardRef.current;
    const glow = glowRef.current;
    if (!card || !glow) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Clamp icon within card with padding
    const pad = 36;
    targetPos.current = {
      x: Math.max(pad, Math.min(rect.width - pad, x)) - rect.width / 2,
      y: Math.max(pad, Math.min(rect.height - pad, y)) - rect.height / 2,
    };

    // Rotate icon to face cursor
    rotateTo(rect.width / 2, rect.height / 2, x, y);

    // Spotlight
    glow.style.opacity = "1";
    glow.style.background = `radial-gradient(180px circle at ${x}px ${y}px, rgba(255,255,255,0.07), transparent 70%)`;

    // 3D tilt
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rotX = ((y - cy) / cy) * -8;
    const rotY = ((x - cx) / cx) * 8;
    card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.03)`;
  }

  function handleMouseEnter() {
    const card = cardRef.current;
    const glow = glowRef.current;
    if (!card || !glow) return;
    setActive(true);
    card.style.borderColor = "rgba(255,255,255,0.22)";
    rafRef.current = requestAnimationFrame(animate);
    pickMessage();
  }

  function handleMouseLeave() {
    const card = cardRef.current;
    const glow = glowRef.current;
    if (!card || !glow) return;
    setActive(false);
    setShowBubble(false);
    card.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)";
    card.style.borderColor = "rgba(255,255,255,0.08)";
    glow.style.opacity = "0";
    targetPos.current = { x: 0, y: 0 };
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  }

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    pickMessage();
  }

  return (
    <a
      ref={cardRef}
      href={project.url}
      target="_blank"
      rel="noopener noreferrer"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      style={{
        display: "block",
        textDecoration: "none",
        position: "relative",
        borderRadius: "0.75rem",
        border: "1px solid rgba(255,255,255,0.08)",
        background: "rgba(255,255,255,0.02)",
        cursor: "none",
        transition: "transform 0.15s ease, border-color 0.25s ease",
        transformStyle: "preserve-3d",
        willChange: "transform",
        overflow: "hidden",
        minHeight: "200px",
      }}
    >
      {/* Spotlight */}
      <div ref={glowRef} style={{
        position: "absolute", inset: 0, borderRadius: "0.75rem",
        opacity: 0, transition: "opacity 0.3s ease", pointerEvents: "none", zIndex: 0,
      }} />

      {/* Top shimmer */}
      <div style={{
        position: "absolute", top: 0, left: "10%", right: "10%", height: "1px",
        borderRadius: "999px",
        background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)",
        opacity: active ? 1 : 0, transition: "opacity 0.3s ease",
        zIndex: 1, pointerEvents: "none",
      }} />

      {/* Floating Duxy icon */}
      <div
        ref={iconRef}
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          marginTop: -24,
          marginLeft: -24,
          zIndex: 10,
          pointerEvents: "none",
          willChange: "transform",
        }}
      >
        {/* Speech bubble */}
        <div style={{
          position: "absolute",
          bottom: "calc(100% + 10px)",
          left: "50%",
          transform: "translateX(-50%)",
          background: "rgba(20,20,20,0.92)",
          border: "1px solid rgba(255,255,255,0.15)",
          borderRadius: "10px",
          padding: "5px 10px",
          whiteSpace: "nowrap",
          fontSize: "0.65rem",
          color: "rgba(255,255,255,0.85)",
          fontFamily: "Fraunces, Georgia, serif",
          fontStyle: "italic",
          opacity: showBubble ? 1 : 0,
          transition: "opacity 0.3s ease",
          pointerEvents: "none",
        }}>
          {message}
          <div style={{
            position: "absolute", bottom: -5, left: "50%", transform: "translateX(-50%)",
            width: 0, height: 0,
            borderLeft: "5px solid transparent", borderRight: "5px solid transparent",
            borderTop: "5px solid rgba(255,255,255,0.15)",
          }} />
        </div>

        {/* Icon rotates to face cursor */}
        <div style={{
          width: 48, height: 48,
          transform: `rotate(${iconAngle + 90}deg)`,
          transition: "transform 0.1s ease",
          filter: active ? "drop-shadow(0 0 8px rgba(255,255,255,0.4))" : "none",
        }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={project.logo ?? `https://www.google.com/s2/favicons?domain=${project.domain}&sz=64`}
            alt="Duxy"
            width={48}
            height={48}
            style={{ borderRadius: "50%", display: "block" }}
          />
        </div>
      </div>

      {/* Card content */}
      <div className="p-6" style={{ position: "relative", zIndex: 2 }}>
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={project.logo ?? `https://www.google.com/s2/favicons?domain=${project.domain}&sz=64`}
              alt=""
              width={32}
              height={32}
              className="rounded"
              style={{ opacity: 0.92 }}
            />
            <h3 className="text-lg" style={{
              fontFamily: "Fraunces, Georgia, serif",
              fontStyle: "italic",
              color: "#fff",
            }}>
              {project.name}
            </h3>
          </div>
          <span className="flex items-center gap-1.5 text-xs mt-1 shrink-0"
            style={{ color: "rgba(255,255,255,0.28)" }}>
            <span>○</span> In Progress
          </span>
        </div>

        <p className="text-sm" style={{
          color: "rgba(255,255,255,0.42)",
          lineHeight: 1.65,
          marginBottom: "3.5rem",
        }}>
          {project.description}
        </p>

        <div style={{
          position: "absolute", bottom: "1.5rem", right: "1.5rem",
          fontSize: "0.7rem",
          fontFamily: "Fraunces, Georgia, serif",
          fontStyle: "italic",
          color: "rgba(255,255,255,0.25)",
        }}>
          {active ? "click to chat · double-click to visit ↗" : "hover me"}
        </div>
      </div>
    </a>
  );
}
