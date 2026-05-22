export type Project = {
  name: string;
  domain: string;
  url: string;
  description: string;
  tags: string[];
  status: "live" | "in-progress";
  logo?: string; // custom logo path in /public, overrides favicon
};

export const projects: Project[] = [
  {
    name: "Ephpha",
    domain: "ephpha.ai",
    url: "https://ephpha.ai",
    logo: "/logos/ephpha.png",
    description:
      "An AI email assistant that helps you write better emails, craft subject lines that get opened, and know exactly when to hit send.",
    tags: ["AI", "Next.js", "TypeScript"],
    status: "live",
  },
  {
    name: "Noxservo",
    domain: "noxservo.com",
    url: "https://noxservo.com",
    logo: "/logos/noxservo.png",
    description:
      "A simple search engine built around saving energy — dark by design, like the nostalgic Blackle, but made for today.",
    tags: ["React", "Vite", "Tailwind"],
    status: "live",
  },
  {
    name: "Pluit",
    domain: "pluit.cloud",
    url: "https://pluit.cloud",
    logo: "/logos/pluit.png",
    description:
      "Cloud storage with a clean, opinionated interface I actually want to use every day.",
    tags: ["Next.js", "Supabase", "Storage"],
    status: "live",
  },
  {
    name: "WhatColor",
    domain: "what-color.com",
    url: "https://what-color.com",
    logo: "/logos/whatcolor.png",
    description:
      "A color identification tool built for the colorblind — point your camera at anything and instantly know what color it is.",
    tags: ["React", "Vite", "AI"],
    status: "live",
  },
  {
    name: "DiaNavHealth",
    domain: "dianavhealth.com",
    url: "https://dianavhealth.com",
    logo: "/logos/dianavhealth.png",
    description:
      "A health-focused platform built to make wellness information accessible and actionable.",
    tags: ["Web", "Health", "React"],
    status: "in-progress",
  },
  {
    name: "Duxy",
    domain: "duxy.tech",
    url: "https://duxy.tech",
    description:
      "A desktop AI companion that follows your cursor, points out things on your screen, and talks to you — less like a chatbot, more like a co-pilot that actually lives on your machine.",
    tags: ["Electron", "TypeScript", "AI", "React"],
    status: "in-progress",
  },
  {
    name: "JotLabs",
    domain: "jotlabs.vercel.app",
    url: "https://jotlabs.vercel.app",
    logo: "/logos/jotlabs.png",
    description:
      "A note-taking tool that builds a living concept graph from your writing using [[phrase]] syntax.",
    tags: ["Next.js", "Supabase", "React Flow", "AI"],
    status: "in-progress",
  },
];
