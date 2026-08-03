import type { MetadataRoute } from "next";

const BASE = "https://www.hixon.studio";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    { url: BASE, lastModified, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/projects`, lastModified, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/about`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/blog`, lastModified, changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE}/contact`, lastModified, changeFrequency: "yearly", priority: 0.5 },
  ];
}
