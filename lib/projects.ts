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
    name: "Hackyard",
    domain: "hackyard.tech",
    url: "https://hackyard.tech",
    logo: "/logos/hackyard.png",
    description:
      "A hackathon platform for hosting, joining, and judging events — teams, submissions, and live judging all in one place.",
    tags: ["Next.js", "Supabase", "Vercel"],
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
    status: "in-progress",
  },
  {
    name: "Pluit",
    domain: "pluit.cloud",
    url: "https://pluit.cloud",
    logo: "/logos/pluit.png",
    description:
      "Cloud storage with a clean, opinionated interface I actually want to use every day.",
    tags: ["Next.js", "Supabase", "Storage"],
    status: "in-progress",
  },
  {
    name: "So&So",
    domain: "coming soon",
    url: "#",
    logo: "/logos/soandso.png",
    description:
      "A personal AI chatbot you tune with sliders instead of prompts — dial in its personality, tone, and depth to make it yours.",
    tags: ["Next.js", "Supabase", "Gemini"],
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
