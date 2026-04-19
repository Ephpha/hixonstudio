"use client";

import { useEffect, useRef } from "react";

type Star = {
  x: number;
  y: number;
  radius: number;
  speed: number;
  phase: number;
  glow: boolean;
};

export default function StarCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let stars: Star[] = [];

    function resize() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    function initStars() {
      stars = Array.from({ length: 200 }, () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        radius:
          Math.random() < 0.15
            ? Math.random() * 1.5 + 1
            : Math.random() * 0.8 + 0.3,
        speed: Math.random() * 0.4 + 0.15,
        phase: Math.random() * Math.PI * 2,
        glow: Math.random() < 0.12,
      }));
    }

    function draw(t: number) {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const star of stars) {
        const opacity = (Math.sin(t * star.speed + star.phase) + 1) / 2;

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

      animId = requestAnimationFrame((ts) => draw(ts / 1000));
    }

    resize();
    initStars();
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
      style={{ zIndex: 0, opacity: 0.9 }}
      aria-hidden="true"
    />
  );
}
