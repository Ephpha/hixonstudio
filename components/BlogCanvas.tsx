"use client";

import { useEffect, useRef } from "react";

// ─── Constellation skeleton: normalized [x, y] coords (0–1) ────────────────
// God's hand — extends from left, index finger points right
const LEFT: [number, number][][] = [
  // forearm
  [[0.02, 0.54], [0.09, 0.51], [0.18, 0.48], [0.27, 0.45], [0.35, 0.42], [0.40, 0.40]],
  // thumb (up from wrist)
  [[0.39, 0.41], [0.37, 0.37], [0.34, 0.33]],
  // index finger — the reaching finger
  [[0.41, 0.39], [0.43, 0.37], [0.453, 0.355], [0.462, 0.345]],
  // middle
  [[0.41, 0.41], [0.43, 0.395], [0.443, 0.385]],
  // ring
  [[0.40, 0.43], [0.415, 0.425], [0.425, 0.42]],
  // pinky
  [[0.39, 0.45], [0.398, 0.445]],
];

// Adam's hand — extends from right, index finger points left
const RIGHT: [number, number][][] = [
  // forearm
  [[0.98, 0.54], [0.91, 0.51], [0.82, 0.48], [0.73, 0.45], [0.64, 0.43], [0.59, 0.42]],
  // index finger — the reaching finger
  [[0.57, 0.41], [0.555, 0.405], [0.54, 0.395], [0.525, 0.387]],
  // middle
  [[0.575, 0.43], [0.558, 0.42], [0.546, 0.415]],
  // ring
  [[0.585, 0.45], [0.572, 0.445]],
  // pinky
  [[0.595, 0.465], [0.588, 0.462]],
  // thumb (up from wrist)
  [[0.61, 0.41], [0.625, 0.375], [0.62, 0.34]],
];

// Collect every unique node for star placement
function nodes(segs: [number, number][][]): [number, number][] {
  const seen = new Set<string>();
  const out: [number, number][] = [];
  for (const seg of segs)
    for (const pt of seg) {
      const k = pt[0].toFixed(3) + "," + pt[1].toFixed(3);
      if (!seen.has(k)) { seen.add(k); out.push(pt); }
    }
  return out;
}

const LEFT_NODES = nodes(LEFT);
const RIGHT_NODES = nodes(RIGHT);

// Stars that are "brighter" — joints, fingertips, arm start
const BRIGHT_THRESHOLD = new Set([
  // left: wrist, fingertips, elbow
  "0.400,0.400", "0.462,0.345", "0.443,0.385", "0.425,0.420", "0.020,0.540", "0.340,0.330",
  // right: wrist, fingertips, elbow
  "0.590,0.420", "0.525,0.387", "0.546,0.415", "0.980,0.540", "0.620,0.340",
]);

type Star = { x: number; y: number; r: number; phase: number; speed: number; bright: boolean };

export default function BlogCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const stars: Star[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      buildStars();
    };

    function buildStars() {
      stars.length = 0;
      const w = canvas.width;
      const h = canvas.height;
      const allNodes: { pt: [number, number]; bright: boolean }[] = [
        ...LEFT_NODES.map(pt => ({ pt, bright: BRIGHT_THRESHOLD.has(pt[0].toFixed(3) + "," + pt[1].toFixed(3)) })),
        ...RIGHT_NODES.map(pt => ({ pt, bright: BRIGHT_THRESHOLD.has(pt[0].toFixed(3) + "," + pt[1].toFixed(3)) })),
      ];
      for (const { pt, bright } of allNodes) {
        stars.push({
          x: pt[0] * w,
          y: pt[1] * h,
          r: bright ? 3.5 + Math.random() * 2 : 1.8 + Math.random() * 1.4,
          phase: Math.random() * Math.PI * 2,
          speed: 0.6 + Math.random() * 0.8,
          bright,
        });
      }
    }

    resize();
    window.addEventListener("resize", resize);

    function drawSegments(segs: [number, number][][], alpha: number) {
      const w = canvas.width;
      const h = canvas.height;
      ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
      ctx.lineWidth = 0.8;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      for (const seg of segs) {
        ctx.beginPath();
        ctx.moveTo(seg[0][0] * w, seg[0][1] * h);
        for (let i = 1; i < seg.length; i++) ctx.lineTo(seg[i][0] * w, seg[i][1] * h);
        ctx.stroke();
      }
    }

    function drawStar(s: Star, t: number) {
      const pulse = 0.7 + 0.3 * Math.sin(t * s.speed + s.phase);
      const r = s.r * pulse;

      // Outer glow
      const glow = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, r * (s.bright ? 5 : 3.5));
      const baseA = s.bright ? 0.18 : 0.10;
      glow.addColorStop(0, `rgba(255,255,255,${baseA * pulse})`);
      glow.addColorStop(1, "rgba(255,255,255,0)");
      ctx.beginPath();
      ctx.arc(s.x, s.y, r * (s.bright ? 5 : 3.5), 0, Math.PI * 2);
      ctx.fillStyle = glow;
      ctx.fill();

      // Core dot
      const coreA = s.bright ? 0.75 * pulse : 0.5 * pulse;
      ctx.beginPath();
      ctx.arc(s.x, s.y, r * 0.55, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${coreA})`;
      ctx.fill();
    }

    let start: number | null = null;
    const draw = (ts: number) => {
      if (!start) start = ts;
      const t = (ts - start) / 1000;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Constellation lines — very subtle
      drawSegments(LEFT, 0.10);
      drawSegments(RIGHT, 0.10);

      // Stars
      for (const s of stars) drawStar(s, t);

      animId = requestAnimationFrame(draw);
    };

    animId = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 1,
        opacity: 0.55,
      }}
    />
  );
}
