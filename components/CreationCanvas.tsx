"use client";

import { useEffect, useRef } from "react";

// Particle stored in pixel coordinates — built fresh each resize
type P = {
  x: number;
  y: number;
  r: number;
  speed: number;
  phase: number;
  glow: boolean;
  bright: number;
};

// Tube: fills a cylindrical limb between two points, perpendicular computed in pixel space
function tube(
  x1: number, y1: number,
  x2: number, y2: number,
  n: number,
  hw: number,        // half-width in pixels
  bright: number,
  glowChance = 0.18
): P[] {
  const dx = x2 - x1, dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy) || 1;
  // Perpendicular unit vector — correct in pixel space
  const nx = -dy / len, ny = dx / len;

  return Array.from({ length: n }, () => {
    const t = Math.random();
    // Flat cross-section distribution (not gaussian, not edge-heavy)
    const rr = (Math.random() * 2 - 1) * hw;
    return {
      x: x1 + dx * t + nx * rr,
      y: y1 + dy * t + ny * rr,
      r: 1.6 + Math.random() * 2.4,
      speed: 0.1 + Math.random() * 0.28,
      phase: Math.random() * Math.PI * 2,
      glow: Math.random() < glowChance,
      bright: bright * (0.72 + Math.random() * 0.28),
    };
  });
}

// Filled oval (palm, knuckle pads)
function oval(
  cx: number, cy: number,
  rx: number, ry: number,
  n: number,
  bright: number,
  glowChance = 0.24
): P[] {
  return Array.from({ length: n }, () => {
    const a = Math.random() * Math.PI * 2;
    const rr = Math.sqrt(Math.random());
    return {
      x: cx + Math.cos(a) * rx * rr,
      y: cy + Math.sin(a) * ry * rr,
      r: 1.8 + Math.random() * 2.8,
      speed: 0.1 + Math.random() * 0.28,
      phase: Math.random() * Math.PI * 2,
      glow: Math.random() < glowChance,
      bright: bright * (0.75 + Math.random() * 0.25),
    };
  });
}

// ─────────────────────────────────────────────────────────
//  Design reference: 1440 × 810 px viewport (16:9)
//  All coordinates defined at this size, then scaled.
//
//  COMPOSITION:
//   • Adam's arm  enters lower-left  (0, 750)  → fingertip ~(692, 452)
//   • God's arm   enters upper-right (1440,195) → fingertip ~(718, 453)
//   • 26 px gap between fingertips, centred at (705, 452)
// ─────────────────────────────────────────────────────────
function build(w: number, h: number): P[] {
  const pts: P[] = [];

  // Scale from 1440×810 reference to actual canvas
  const sx = w / 1440;
  const sy = h / 810;
  // Use minimum scale for limb widths so they don't look bloated on wide screens
  const ss = Math.min(sx, sy);

  const X = (v: number) => v * sx;
  const Y = (v: number) => v * sy;
  const S = (v: number) => v * ss;

  // ╔══════════════════════════════════════════╗
  // ║  ADAM'S HAND  (bottom-left → centre)    ║
  // ╚══════════════════════════════════════════╝

  // Forearm — thick, rises ~22° from horizontal
  pts.push(...tube(X(0), Y(752), X(455), Y(546), 300, S(28), 0.87, 0.12));

  // Wrist — tapers slightly
  pts.push(...tube(X(455), Y(546), X(506), Y(522), 88, S(20), 0.92, 0.19));

  // Palm — dense filled oval
  pts.push(...oval(X(541), Y(505), S(64), S(48), 270, 0.93, 0.23));

  // Thumb — curves downward from the radial side of the palm
  pts.push(...tube(X(514), Y(523), X(494), Y(551), 72, S(12), 0.83, 0.16));
  pts.push(...tube(X(494), Y(551), X(480), Y(571), 46, S(10), 0.77, 0.14));

  // ── Fingers (two segments each for natural curve) ──

  // Index — FULLY EXTENDED, the reaching finger, slightly brightest
  pts.push(...tube(X(536), Y(483), X(614), Y(468), 86, S(10),  0.97, 0.30));
  pts.push(...tube(X(614), Y(468), X(692), Y(452), 86, S(9.5), 1.00, 0.32));

  // Middle — nearly as long as index
  pts.push(...tube(X(546), Y(487), X(618), Y(474), 74, S(9.5), 0.90, 0.24));
  pts.push(...tube(X(618), Y(474), X(687), Y(465), 74, S(9.0), 0.88, 0.22));

  // Ring — shorter, slight downward curve
  pts.push(...tube(X(554), Y(492), X(619), Y(481), 60, S(9.0), 0.83, 0.18));
  pts.push(...tube(X(619), Y(481), X(668), Y(477), 60, S(8.5), 0.81, 0.16));

  // Pinky — shortest, most curled
  pts.push(...tube(X(559), Y(501), X(613), Y(493), 50, S(8.5), 0.77, 0.15));
  pts.push(...tube(X(613), Y(493), X(650), Y(493), 50, S(8.0), 0.75, 0.14));

  // Knuckle pads — small bright ovals at each knuckle
  pts.push(...oval(X(540), Y(483), S(8), S(5.5), 24, 0.96, 0.36));
  pts.push(...oval(X(550), Y(487), S(7), S(5.0), 20, 0.92, 0.32));
  pts.push(...oval(X(557), Y(492), S(6), S(4.5), 17, 0.88, 0.28));
  pts.push(...oval(X(562), Y(500), S(5.5), S(4), 14, 0.84, 0.24));

  // ╔══════════════════════════════════════════╗
  // ║  GOD'S HAND  (upper-right → centre)     ║
  // ╚══════════════════════════════════════════╝

  // Forearm — thick, descends ~25° below horizontal going right-to-left
  pts.push(...tube(X(1440), Y(196), X(986), Y(408), 300, S(28), 0.87, 0.12));

  // Wrist
  pts.push(...tube(X(986), Y(408), X(938), Y(428), 88, S(20), 0.92, 0.19));

  // Palm
  pts.push(...oval(X(902), Y(447), S(64), S(48), 270, 0.93, 0.23));

  // Thumb — extends upward-outward (God's hand is above, thumb raised)
  pts.push(...tube(X(924), Y(433), X(942), Y(408), 72, S(12), 0.83, 0.16));
  pts.push(...tube(X(942), Y(408), X(950), Y(390), 46, S(10), 0.77, 0.14));

  // ── Fingers ──

  // Index — pointing directly at Adam's fingertip
  pts.push(...tube(X(885), Y(431), X(804), Y(442), 86, S(10),  0.97, 0.30));
  pts.push(...tube(X(804), Y(442), X(718), Y(453), 86, S(9.5), 1.00, 0.32));

  // Middle
  pts.push(...tube(X(887), Y(443), X(807), Y(457), 74, S(9.5), 0.90, 0.24));
  pts.push(...tube(X(807), Y(457), X(727), Y(470), 74, S(9.0), 0.88, 0.22));

  // Ring
  pts.push(...tube(X(889), Y(455), X(814), Y(471), 60, S(9.0), 0.83, 0.18));
  pts.push(...tube(X(814), Y(471), X(739), Y(484), 60, S(8.5), 0.81, 0.16));

  // Pinky
  pts.push(...tube(X(891), Y(465), X(819), Y(483), 50, S(8.5), 0.77, 0.15));
  pts.push(...tube(X(819), Y(483), X(751), Y(498), 50, S(8.0), 0.75, 0.14));

  // Knuckle pads
  pts.push(...oval(X(882), Y(431), S(8), S(5.5), 24, 0.96, 0.36));
  pts.push(...oval(X(883), Y(443), S(7), S(5.0), 20, 0.92, 0.32));
  pts.push(...oval(X(886), Y(455), S(6), S(4.5), 17, 0.88, 0.28));
  pts.push(...oval(X(889), Y(464), S(5.5), S(4),  14, 0.84, 0.24));

  // ╔══════════════════════════════════════════╗
  // ║  DIVINE SPARK  (gap between fingertips) ║
  // ╚══════════════════════════════════════════╝
  // Adam tip: X(692), Y(452)   God tip: X(718), Y(453)
  const spX = (X(692) + X(718)) / 2;   // ≈ X(705)
  const spY = (Y(452) + Y(453)) / 2;   // ≈ Y(452)
  for (let i = 0; i < 60; i++) {
    const angle = Math.random() * Math.PI * 2;
    const dist = Math.sqrt(Math.random()) * S(20);
    pts.push({
      x: spX + Math.cos(angle) * dist,
      y: spY + Math.sin(angle) * dist,
      r: S(1.6) + Math.random() * S(4.2),
      speed: 0.5 + Math.random() * 1.1,
      phase: Math.random() * Math.PI * 2,
      glow: true,
      bright: 1.0,
    });
  }

  return pts;
}

export default function CreationCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let pts: P[] = [];
    let w = 0, h = 0;

    function init() {
      if (!canvas) return;
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w;
      canvas.height = h;
      pts = build(w, h);
    }

    function draw(t: number) {
      if (!ctx) return;
      ctx.clearRect(0, 0, w, h);

      for (const p of pts) {
        const raw = (Math.sin(t * p.speed + p.phase) + 1) / 2;
        const opacity = Math.min(raw * p.bright, 1);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);

        if (p.glow) {
          ctx.shadowBlur = 16;
          ctx.shadowColor = `rgba(255,255,255,${opacity * 0.7})`;
        } else {
          ctx.shadowBlur = 0;
        }

        ctx.fillStyle = `rgba(255,255,255,${opacity})`;
        ctx.fill();
      }

      animId = requestAnimationFrame((ts) => draw(ts / 1000));
    }

    init();
    animId = requestAnimationFrame((ts) => draw(ts / 1000));

    let resizeTimer: ReturnType<typeof setTimeout>;
    function onResize() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(init, 250);
    }
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
      clearTimeout(resizeTimer);
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
