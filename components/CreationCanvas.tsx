"use client";

import { useEffect, useRef } from "react";

type Particle = {
  xPct: number;
  yPct: number;
  radius: number;
  speed: number;
  phase: number;
  glow: boolean;
  brightness: number;
};

function linePoints(
  x1: number, y1: number,
  x2: number, y2: number,
  n: number,
  scatter: number,
  bright = 0.6
): Particle[] {
  return Array.from({ length: n }, () => {
    const t = Math.random();
    const sx = (Math.random() - 0.5) * scatter;
    const sy = (Math.random() - 0.5) * scatter;
    return {
      xPct: x1 + (x2 - x1) * t + sx,
      yPct: y1 + (y2 - y1) * t + sy,
      radius: Math.random() * 0.75 + 0.3,
      speed: Math.random() * 0.35 + 0.15,
      phase: Math.random() * Math.PI * 2,
      glow: Math.random() < 0.08,
      brightness: bright + Math.random() * 0.35,
    };
  });
}

function ovalPoints(
  cx: number, cy: number,
  rx: number, ry: number,
  n: number,
  bright = 0.68
): Particle[] {
  return Array.from({ length: n }, () => {
    const angle = Math.random() * Math.PI * 2;
    const r = Math.sqrt(Math.random());
    return {
      xPct: cx + Math.cos(angle) * rx * r,
      yPct: cy + Math.sin(angle) * ry * r,
      radius: Math.random() * 0.85 + 0.3,
      speed: Math.random() * 0.35 + 0.15,
      phase: Math.random() * Math.PI * 2,
      glow: Math.random() < 0.1,
      brightness: bright + Math.random() * 0.32,
    };
  });
}

function buildParticles(): Particle[] {
  const p: Particle[] = [];

  // ── ADAM'S HAND (left side, reaching right) ──
  // Forearm — thick, angled up toward center
  p.push(...linePoints(2, 73, 36, 61, 90, 2.8, 0.45));
  // Palm
  p.push(...ovalPoints(39, 59, 5.2, 3.8, 55, 0.68));
  // Index finger — the reaching one
  p.push(...linePoints(39.5, 56.5, 47.2, 53.2, 38, 1.0, 0.82));
  // Middle finger
  p.push(...linePoints(40.5, 58.5, 46.5, 57.0, 30, 0.9, 0.72));
  // Ring finger
  p.push(...linePoints(40.5, 61.0, 44.5, 61.5, 24, 0.85, 0.65));
  // Pinky — curled slightly down
  p.push(...linePoints(39.5, 63.0, 43.0, 65.5, 20, 0.8, 0.58));
  // Thumb
  p.push(...linePoints(36.5, 60.5, 39.5, 64.5, 22, 0.85, 0.62));

  // ── GOD'S HAND (right side, pointing down-left) ──
  // Forearm — angled down toward center
  p.push(...linePoints(98, 45, 63, 52, 90, 2.8, 0.45));
  // Palm
  p.push(...ovalPoints(60, 53.5, 5.2, 3.8, 55, 0.68));
  // Index finger — pointing toward Adam
  p.push(...linePoints(58.5, 51.5, 49.0, 54.5, 38, 1.0, 0.82));
  // Middle finger
  p.push(...linePoints(59.5, 53.5, 51.5, 57.5, 30, 0.9, 0.72));
  // Ring finger
  p.push(...linePoints(60.5, 55.5, 53.5, 59.5, 24, 0.85, 0.65));
  // Pinky
  p.push(...linePoints(61.5, 57.5, 55.5, 62.0, 20, 0.8, 0.58));
  // Thumb — raised up
  p.push(...linePoints(62.0, 50.5, 57.5, 47.0, 22, 0.85, 0.62));

  // ── SPARK between fingertips ──
  // Dense bright cluster in the gap (~48%, 54%)
  for (let i = 0; i < 18; i++) {
    p.push({
      xPct: 48.0 + (Math.random() - 0.5) * 1.8,
      yPct: 53.8 + (Math.random() - 0.5) * 1.2,
      radius: Math.random() * 1.4 + 0.6,
      speed: Math.random() * 0.6 + 0.45,
      phase: Math.random() * Math.PI * 2,
      glow: true,
      brightness: 1.0,
    });
  }

  return p;
}

// Build once — stable reference across re-renders
const PARTICLES = buildParticles();

export default function CreationCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let w = 0;
    let h = 0;

    function resize() {
      if (!canvas) return;
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w;
      canvas.height = h;
    }

    function draw(t: number) {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, w, h);

      for (const p of PARTICLES) {
        const opacity =
          ((Math.sin(t * p.speed + p.phase) + 1) / 2) * p.brightness;
        const x = (p.xPct / 100) * w;
        const y = (p.yPct / 100) * h;

        ctx.beginPath();
        ctx.arc(x, y, p.radius, 0, Math.PI * 2);

        if (p.glow) {
          ctx.shadowBlur = 12;
          ctx.shadowColor = `rgba(255,255,255,${opacity * 0.65})`;
        } else {
          ctx.shadowBlur = 0;
        }

        ctx.fillStyle = `rgba(255,255,255,${opacity * 0.88})`;
        ctx.fill();
      }

      animId = requestAnimationFrame((ts) => draw(ts / 1000));
    }

    resize();
    animId = requestAnimationFrame((ts) => draw(ts / 1000));
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 1, opacity: 0.72 }}
      aria-hidden="true"
    />
  );
}
