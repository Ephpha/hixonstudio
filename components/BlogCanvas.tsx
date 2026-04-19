"use client";

import { useEffect, useRef } from "react";

type Mote = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  opacityTarget: number;
  life: number;
  maxLife: number;
};

export default function BlogCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const motes: Mote[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const spawn = (): Mote => ({
      x: Math.random() * canvas.width,
      y: canvas.height + 10,
      vx: (Math.random() - 0.5) * 0.3,
      vy: -(0.15 + Math.random() * 0.35),
      size: 0.8 + Math.random() * 1.6,
      opacity: 0,
      opacityTarget: 0.05 + Math.random() * 0.18,
      life: 0,
      maxLife: 220 + Math.random() * 300,
    });

    // Seed initial motes spread across the screen
    for (let i = 0; i < 55; i++) {
      const m = spawn();
      m.y = Math.random() * canvas.height;
      m.life = Math.random() * m.maxLife;
      m.opacity = m.opacityTarget * (m.life / m.maxLife < 0.1 ? m.life / (m.maxLife * 0.1) : m.life / m.maxLife > 0.8 ? 1 - (m.life / m.maxLife - 0.8) / 0.2 : 1);
      motes.push(m);
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Spawn new motes
      if (motes.length < 80 && Math.random() < 0.4) {
        motes.push(spawn());
      }

      for (let i = motes.length - 1; i >= 0; i--) {
        const m = motes[i];
        m.life++;
        m.x += m.vx;
        m.y += m.vy;

        // Gentle horizontal drift
        m.vx += (Math.random() - 0.5) * 0.02;
        m.vx *= 0.98;

        const t = m.life / m.maxLife;
        // Fade in first 10%, full opacity until 80%, fade out last 20%
        const fade = t < 0.1 ? t / 0.1 : t > 0.8 ? 1 - (t - 0.8) / 0.2 : 1;
        m.opacity = m.opacityTarget * fade;

        if (m.life >= m.maxLife || m.y < -10) {
          motes.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(m.x, m.y, m.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${m.opacity})`;
        ctx.fill();
      }

      animId = requestAnimationFrame(draw);
    };

    draw();
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
      }}
    />
  );
}
