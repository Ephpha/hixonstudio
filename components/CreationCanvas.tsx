"use client";

import { useEffect, useRef } from "react";

type P = {
  x: number;
  y: number;
  r: number;
  speed: number;
  phase: number;
  glow: boolean;
  bright: number;
};

// Scatter particles along a polyline (the outline of a shape)
function polyline(
  pts2d: [number, number][],
  n: number,
  bright: number,
  glowChance = 0.22,
  jitter = 1.2
): P[] {
  const segLens: number[] = [];
  let total = 0;
  for (let i = 0; i < pts2d.length - 1; i++) {
    const dx = pts2d[i + 1][0] - pts2d[i][0];
    const dy = pts2d[i + 1][1] - pts2d[i][1];
    const L = Math.sqrt(dx * dx + dy * dy);
    segLens.push(L);
    total += L;
  }

  return Array.from({ length: n }, () => {
    let d = Math.random() * total;
    let i = 0;
    while (i < segLens.length - 1 && d > segLens[i]) {
      d -= segLens[i];
      i++;
    }
    const t = segLens[i] > 0 ? d / segLens[i] : 0;
    const [x1, y1] = pts2d[i];
    const [x2, y2] = pts2d[i + 1];
    const jx = (Math.random() - 0.5) * jitter;
    const jy = (Math.random() - 0.5) * jitter;
    return {
      x: x1 + (x2 - x1) * t + jx,
      y: y1 + (y2 - y1) * t + jy,
      r: 1.4 + Math.random() * 2.2,
      speed: 0.1 + Math.random() * 0.28,
      phase: Math.random() * Math.PI * 2,
      glow: Math.random() < glowChance,
      bright: bright * (0.75 + Math.random() * 0.25),
    };
  });
}

// Point-in-polygon (ray casting)
function pip(x: number, y: number, poly: [number, number][]): boolean {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i];
    const [xj, yj] = poly[j];
    const intersect =
      yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi + 1e-9) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

// Fill particles sparsely inside a polygon
function fill(
  poly: [number, number][],
  n: number,
  bright: number,
  glowChance = 0.08
): P[] {
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  for (const [x, y] of poly) {
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  }
  const pts: P[] = [];
  let tries = 0;
  while (pts.length < n && tries < n * 20) {
    tries++;
    const x = minX + Math.random() * (maxX - minX);
    const y = minY + Math.random() * (maxY - minY);
    if (!pip(x, y, poly)) continue;
    pts.push({
      x,
      y,
      r: 1.2 + Math.random() * 1.8,
      speed: 0.08 + Math.random() * 0.22,
      phase: Math.random() * Math.PI * 2,
      glow: Math.random() < glowChance,
      bright: bright * (0.55 + Math.random() * 0.3),
    });
  }
  return pts;
}

// ─────────────────────────────────────────────────────────
//  Design reference: 1440 × 810 px viewport
//  Pose matches Sistine Creation of Adam:
//   • Adam's hand (left):  limp, fingers drooping, index barely raised
//   • God's hand  (right): index finger actively pointing left
//   • Fingertips meet near (720, 410) with ~25px gap
// ─────────────────────────────────────────────────────────
function build(w: number, h: number): P[] {
  const pts: P[] = [];
  const sx = w / 1440;
  const sy = h / 810;
  const X = (v: number) => v * sx;
  const Y = (v: number) => v * sy;
  const T = (p: [number, number]): [number, number] => [X(p[0]), Y(p[1])];

  // ╔══════════════════════════════════════╗
  // ║  ADAM'S HAND — limp, fingers droop   ║
  // ╚══════════════════════════════════════╝
  // Closed polygon outline, clockwise from forearm top-edge at left border
  const adam: [number, number][] = [
    [0, 280],      // forearm top edge at left
    [120, 278],
    [260, 282],
    [380, 298],
    [460, 320],    // upper wrist
    [520, 340],
    [570, 358],    // back of hand ridge
    [612, 378],    // knuckle of index
    [645, 392],    // index finger base
    [678, 398],    // index joint
    [708, 402],    // INDEX TIP (meets God's)
    [702, 414],    // under index
    [672, 418],
    [650, 428],    // middle knuckle
    [662, 458],    // middle finger down
    [668, 492],    // middle tip (curled down)
    [655, 498],
    [640, 475],
    [628, 448],    // ring knuckle
    [630, 478],
    [628, 508],    // ring tip
    [615, 510],
    [604, 482],
    [598, 460],    // pinky knuckle
    [595, 488],
    [588, 512],    // pinky tip
    [575, 510],
    [568, 482],
    [555, 452],    // palm-pinky edge
    [535, 440],    // palm underside
    [505, 445],    // thumb tip
    [485, 430],
    [470, 410],    // thumb base
    [452, 392],    // wrist underside
    [400, 378],
    [280, 372],
    [140, 370],
    [0, 368],      // forearm bottom at left
    [0, 280],      // close
  ];

  // ╔══════════════════════════════════════╗
  // ║  GOD'S HAND — index finger pointing  ║
  // ╚══════════════════════════════════════╝
  // Closed polygon outline, clockwise from forearm top-edge at right border
  const god: [number, number][] = [
    [1440, 180],   // forearm top edge at right
    [1280, 205],
    [1140, 238],
    [1020, 275],
    [960, 300],    // upper wrist
    [920, 315],
    [895, 310],    // thumb side of wrist
    [878, 298],    // thumb base
    [868, 282],
    [862, 268],    // thumb tip (raised)
    [854, 272],
    [850, 292],
    [845, 318],    // back of index base
    [820, 340],
    [788, 358],    // index knuckle area
    [758, 380],    // index joint
    [730, 400],    // index nearing tip
    [718, 412],    // INDEX TIP (meets Adam's)
    [735, 420],    // under index
    [760, 420],
    [795, 412],
    [830, 405],
    [858, 408],    // middle finger knuckle (curled under)
    [872, 428],
    [878, 452],    // middle tip curled
    [890, 448],
    [898, 422],
    [905, 410],    // ring knuckle
    [918, 430],
    [924, 450],    // ring tip curled
    [934, 444],
    [940, 422],
    [946, 410],    // pinky knuckle
    [956, 428],
    [960, 448],    // pinky tip
    [970, 442],
    [972, 420],
    [968, 398],    // palm edge
    [982, 388],    // palm underside
    [1010, 380],
    [1060, 368],
    [1180, 328],
    [1300, 278],
    [1440, 220],   // forearm bottom at right
    [1440, 180],   // close
  ];

  const adamScaled = adam.map(T);
  const godScaled = god.map(T);

  // Outline strokes — crisp silhouette
  pts.push(...polyline(adamScaled, 1100, 0.95, 0.24, 1.4));
  pts.push(...polyline(godScaled,  1100, 0.95, 0.24, 1.4));

  // Sparse interior fill — gives hands mass without flooding
  pts.push(...fill(adamScaled, 380, 0.45, 0.05));
  pts.push(...fill(godScaled,  380, 0.45, 0.05));

  // ╔══════════════════════════════════════╗
  // ║  DIVINE SPARK  (gap between tips)    ║
  // ╚══════════════════════════════════════╝
  // Adam tip (708,402), God tip (718,412)
  const spX = (X(708) + X(718)) / 2;
  const spY = (Y(402) + Y(412)) / 2;
  const ss = Math.min(sx, sy);
  for (let i = 0; i < 50; i++) {
    const angle = Math.random() * Math.PI * 2;
    const dist = Math.sqrt(Math.random()) * 18 * ss;
    pts.push({
      x: spX + Math.cos(angle) * dist,
      y: spY + Math.sin(angle) * dist,
      r: 1.6 * ss + Math.random() * 3.6 * ss,
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
