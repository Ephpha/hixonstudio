"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/useReducedMotion";

type Star = {
  x: number;  // -1..1 normalized screen offset from center
  y: number;
  z: number;  // depth, 0 = at camera, 1 = far
  pz: number; // previous z for streak length
};

const STAR_COUNT = 260;
const SPEED = 0.0018;          // how fast z decreases per frame — lower = slower warp
const MAX_OPACITY = 0.55;      // cap so bright stars don't overpower text
const TRAIL_MULT = 1.0;        // streak length multiplier

function spawn(s: Star, fresh = false) {
  s.x = (Math.random() - 0.5) * 2;
  s.y = (Math.random() - 0.5) * 2;
  s.z = fresh ? Math.random() : 1;
  s.pz = s.z;
}

export default function CreationCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number | null = null;
    let w = 0, h = 0, cx = 0, cy = 0;
    const reduced = prefersReducedMotion();
    const stars: Star[] = Array.from({ length: STAR_COUNT }, () => {
      const s: Star = { x: 0, y: 0, z: 1, pz: 1 };
      spawn(s, true);
      return s;
    });

    function resize() {
      if (!canvas) return;
      w = window.innerWidth;
      h = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      cx = w / 2;
      cy = h / 2;
    }

    function project(s: Star, z: number) {
      // perspective: closer z → larger offset from center
      const k = 1 / z;
      return {
        sx: cx + s.x * k * cx,
        sy: cy + s.y * k * cy,
      };
    }

    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, w, h);
      ctx.lineCap = "round";

      for (const s of stars) {
        s.pz = s.z;
        s.z -= SPEED;

        if (s.z <= 0.02) {
          spawn(s);
          continue;
        }

        const curr = project(s, s.z);
        const prev = project(s, s.pz + (s.pz - s.z) * (TRAIL_MULT - 1));

        // Off-screen? respawn
        if (
          curr.sx < -20 || curr.sx > w + 20 ||
          curr.sy < -20 || curr.sy > h + 20
        ) {
          spawn(s);
          continue;
        }

        // Brightness & thickness scale as star gets closer (z → 0)
        const closeness = 1 - s.z;                 // 0 far → 1 near
        const opacity = Math.min(closeness * MAX_OPACITY, MAX_OPACITY);
        const width = 0.4 + closeness * 1.4;

        ctx.strokeStyle = `rgba(255,255,255,${opacity})`;
        ctx.lineWidth = width;
        ctx.beginPath();
        ctx.moveTo(prev.sx, prev.sy);
        ctx.lineTo(curr.sx, curr.sy);
        ctx.stroke();
      }

      animId = requestAnimationFrame(draw);
    }

    /**
     * Reduced motion: the warp effect is motion by definition, so swap it for a
     * still starfield — same visual texture behind the text, no travel.
     */
    function drawStatic() {
      if (!ctx) return;
      ctx.clearRect(0, 0, w, h);
      for (const s of stars) {
        const { sx, sy } = project(s, s.z);
        if (sx < 0 || sx > w || sy < 0 || sy > h) continue;
        const closeness = 1 - s.z;
        ctx.fillStyle = `rgba(255,255,255,${Math.min(closeness * MAX_OPACITY, MAX_OPACITY)})`;
        ctx.beginPath();
        ctx.arc(sx, sy, 0.4 + closeness * 0.9, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function start() {
      if (animId !== null || reduced) return;
      animId = requestAnimationFrame(draw);
    }

    function stop() {
      if (animId === null) return;
      cancelAnimationFrame(animId);
      animId = null;
    }

    function onVisibility() {
      if (document.hidden) stop();
      else start();
    }

    resize();
    if (reduced) drawStatic();
    else start();

    let resizeTimer: ReturnType<typeof setTimeout>;
    function onResize() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        resize();
        if (reduced) drawStatic();
      }, 150);
    }
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      clearTimeout(resizeTimer);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    />
  );
}
