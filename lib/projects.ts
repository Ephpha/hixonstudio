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
    name: "Dianavhealth",
    domain: "dianavhealth.com",
    url: "https://dianavhealth.com",
    logo: "/logos/dianavhealth.png",
    description:
      "A health-focused platform built to make wellness information accessible and actionable.",
    tags: ["Web", "Health", "React"],
    status: "live",
  },
  {
    name: "Ephpha",
    domain: "ephpha.ai",
    url: "https://ephpha.ai",
    logo: "/logos/ephpha.png",
    description:
      "AI-powered tools and experiments — a living lab for ideas at the edge of the intelligence space.",
    tags: ["AI", "Next.js", "TypeScript"],
    status: "live",
  },
  {
    name: "Noxservo",
    domain: "noxservo.com",
    url: "https://noxservo.com",
    logo: "/logos/noxservo.png",
    description:
      "My personal dev studio and hub — where the projects, experiments, and tools live.",
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
    status: "in-progress",
  },
  {
    name: "Duxy",
    domain: "duxy.tech",
    url: "https://duxy.tech",
    description:
      "An AI voice companion running as a desktop app — designed to feel less like a chatbot, more like a presence.",
    tags: ["Electron", "TypeScript", "AI", "React"],
    status: "in-progress",
  },
  {
    name: "JotLabs",
    domain: "jotlabs.vercel.app",
    url: "https://jotlabs.vercel.app",
    description:
      "A note-taking tool that builds a living concept graph from your writing using [[phrase]] syntax.",
    tags: ["Next.js", "Supabase", "React Flow", "AI"],
    status: "in-progress",
  },
];
