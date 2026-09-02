"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

type Props = {
  className?: string;
  size?: "sm" | "md" | "lg";
};

const sizeMap = { sm: "text-xl", md: "text-4xl", lg: "text-6xl" };

export default function SparkleSymbol({ className = "", size = "md" }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    tweenRef.current = gsap.to(ref.current, {
      rotation: 360,
      duration: 60,
      repeat: -1,
      ease: "none",
    });
    return () => {
      tweenRef.current?.kill();
    };
  }, []);

  return (
    <span
      ref={ref}
      className={`inline-block select-none ${sizeMap[size]} ${className}`}
      style={{ color: "rgba(255,255,255,0.3)", fontFamily: "serif" }}
      onMouseEnter={() => tweenRef.current?.pause()}
      onMouseLeave={() => tweenRef.current?.resume()}
      aria-hidden="true"
    >
      ✦
    </span>
  );
}
