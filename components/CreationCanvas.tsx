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

// Solid tube — particles distributed in an oval cross-section along a line
function tube(
  x1: number, y1: number,
  x2: number, y2: number,
  n: number,
  halfW: number,       // half-width of the limb in pct units
  bright: number,
  glowChance = 0.2
): Particle[] {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy) || 1;
  const nx = -dy / len;
  const ny = dx / len;

  return Array.from({ length: n }, () => {
    const t = Math.random();
    // fill cross-section with square-root distribution (denser at center)
    const r = (Math.random() * 2 - 1) * halfW;
    return {
      xPct: x1 + dx * t + nx * r,
      yPct: y1 + dy * t + ny * r,
      radius: 1.4 + Math.random() * 2.2,
      speed: Math.random() * 0.3 + 0.12,
      phase: Math.random() * Math.PI * 2,
      glow: Math.random() < glowChance,
      brightness: bright * (0.72 + Math.random() * 0.28),
    };
  });
}

// Dense filled oval (palm / knuckle areas)
function oval(
  cx: number, cy: number,
  rx: number, ry: number,
  n: number,
  bright: number,
  glowChance = 0.28
): Particle[] {
  return Array.from({ length: n }, () => {
    const angle = Math.random() * Math.PI * 2;
    const r = Math.sqrt(Math.random());
    return {
      xPct: cx + Math.cos(angle) * rx * r,
      yPct: cy + Math.sin(angle) * ry * r,
      radius: 1.6 + Math.random() * 2.8,
      speed: Math.random() * 0.3 + 0.12,
      phase: Math.random() * Math.PI * 2,
      glow: Math.random() < glowChance,
      brightness: bright * (0.78 + Math.random() * 0.22),
    };
  });
}

function buildParticles(): Particle[] {
  const p: Particle[] = [];

  // ══════════════════════════════════════════════
  //  ADAM'S HAND  (enters from lower-left, reaching right)
  // ══════════════════════════════════════════════

  // Forearm — wide, muscular
  p.push(...tube(0, 82, 36, 63, 320, 3.8, 0.88, 0.14));

  // Wrist — slightly narrower
  p.push(...tube(36, 63, 42, 59.5, 100, 2.4, 0.92, 0.2));

  // Palm — dense filled oval
  p.push(...oval(44.5, 58.5, 7.0, 5.2, 280, 0.93, 0.24));

  // Thumb — curves down-outward from palm base
  p.push(...tube(41, 61.5, 39, 66.5, 80, 1.4, 0.85, 0.18));
  p.push(...tube(39, 66.5, 37.5, 69.5, 45, 1.2, 0.80, 0.15));

  // Index finger — EXTENDED, the reaching finger, brightened
  p.push(...tube(44.5, 55.0, 49.5, 51.5, 130, 1.25, 1.0, 0.32));

  // Middle finger — extended but slightly shorter
  p.push(...tube(45.5, 57.0, 49.5, 55.0, 105, 1.15, 0.90, 0.24));

  // Ring finger — partly curled back
  p.push(...tube(45.5, 59.2, 48.5, 59.0, 80, 1.05, 0.83, 0.18));

  // Pinky — shortest, curled
  p.push(...tube(44.5, 61.5, 47.0, 63.0, 65, 0.95, 0.78, 0.15));

  // Knuckle ridge — bright line across top of fist
  p.push(...tube(42, 56.0, 47.0, 57.5, 60, 0.7, 0.92, 0.28));

  // ══════════════════════════════════════════════
  //  GOD'S HAND  (enters from upper-right, pointing down-left)
  // ══════════════════════════════════════════════

  // Forearm — wide, comes from upper right at a steep angle
  p.push(...tube(100, 26, 63, 46, 320, 3.8, 0.88, 0.14));

  // Wrist
  p.push(...tube(63, 46, 57.5, 50, 100, 2.4, 0.92, 0.2));

  // Palm
  p.push(...oval(55.5, 51.5, 7.0, 5.2, 280, 0.93, 0.24));

  // Thumb — raised above the hand
  p.push(...tube(60.5, 48.0, 57.0, 44.0, 80, 1.4, 0.85, 0.18));
  p.push(...tube(57.0, 44.0, 55.0, 42.0, 45, 1.2, 0.80, 0.15));

  // Index finger — EXTENDED, pointing toward Adam, brightened
  p.push(...tube(55.5, 49.5, 49.8, 53.5, 130, 1.25, 1.0, 0.32));

  // Middle finger
  p.push(...tube(55.8, 51.8, 51.0, 56.5, 105, 1.15, 0.90, 0.24));

  // Ring finger
  p.push(...tube(56.2, 53.5, 52.0, 58.5, 80, 1.05, 0.83, 0.18));

  // Pinky
  p.push(...tube(57.0, 55.0, 53.5, 60.5, 65, 0.95, 0.78, 0.15));

  // Knuckle ridge
  p.push(...tube(57.0, 49.5, 52.5, 51.5, 60, 0.7, 0.92, 0.28));

  // ══════════════════════════════════════════════
  //  DIVINE SPARK — the near-touching gap
  // ══════════════════════════════════════════════
  for (let i = 0; i < 45; i++) {
    const near = Math.random() < 0.5;
    p.push({
      xPct: 49.6 + (Math.random() - 0.5) * 2.2,
      yPct: 52.6 + (Math.random() - 0.5) * 1.6,
      radius: near ? 2.5 + Math.random() * 3.5 : 1.0 + Math.random() * 1.5,
      speed: Math.random() * 0.9 + 0.55,
      phase: Math.random() * Math.PI * 2,
      glow: true,
      brightness: 1.0,
    });
  }

  return p;
}

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
        const raw = (Math.sin(t * p.speed + p.phase) + 1) / 2;
        const opacity = raw * p.brightness;
        const x = (p.xPct / 100) * w;
        const y = (p.yPct / 100) * h;

        ctx.beginPath();
        ctx.arc(x, y, p.radius, 0, Math.PI * 2);

        if (p.glow) {
          ctx.shadowBlur = 18;
          ctx.shadowColor = `rgba(255,255,255,${opacity * 0.75})`;
        } else {
          ctx.shadowBlur = 0;
        }

        ctx.fillStyle = `rgba(255,255,255,${Math.min(opacity, 1)})`;
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
      style={{ zIndex: 1 }}
      aria-hidden="true"
    />
  );
}
