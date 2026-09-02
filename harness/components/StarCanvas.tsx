"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/useReducedMotion";

type Star = {
  x: number;
  y: number;
  radius: number;
  speed: number;
  phase: number;
  glow: boolean;
};

const STAR_COUNT = 200;

export default function StarCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number | null = null;
    let stars: Star[] = [];
    const reduced = prefersReducedMotion();

    function sizeCanvas() {
      if (!canvas || !ctx) return;
      const { innerWidth: w, innerHeight: h } = window;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function initStars() {
      const { innerWidth: w, innerHeight: h } = window;
      stars = Array.from({ length: STAR_COUNT }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        radius:
          Math.random() < 0.15
            ? Math.random() * 1.5 + 1
            : Math.random() * 0.8 + 0.3,
        speed: Math.random() * 0.4 + 0.15,
        phase: Math.random() * Math.PI * 2,
        glow: Math.random() < 0.12,
      }));
    }

    function paint(t: number) {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      for (const star of stars) {
        const opacity = reduced
          ? 0.6
          : (Math.sin(t * star.speed + star.phase) + 1) / 2;

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);

        if (star.glow) {
          ctx.shadowBlur = 8;
          ctx.shadowColor = `rgba(255,255,255,${opacity * 0.5})`;
        } else {
          ctx.shadowBlur = 0;
        }

        ctx.fillStyle = `rgba(255,255,255,${opacity * 0.75})`;
        ctx.fill();
      }
    }

    function frame(ts: number) {
      paint(ts / 1000);
      animId = requestAnimationFrame(frame);
    }

    function start() {
      if (animId !== null || reduced) return;
      animId = requestAnimationFrame(frame);
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

    function onResize() {
      sizeCanvas();
      initStars();
      if (reduced) paint(0);
    }

    sizeCanvas();
    initStars();

    if (reduced) {
      paint(0);
    } else {
      start();
    }

    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0, opacity: 0.9 }}
      aria-hidden="true"
    />
  );
}
