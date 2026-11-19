import type { MetadataRoute } from "next";

const base = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const pages = [
    { path: "/", priority: 1, changeFrequency: "weekly" as const },
    { path: "/rules", priority: 0.9, changeFrequency: "monthly" as const },
    { path: "/submit", priority: 0.9, changeFrequency: "monthly" as const },
    { path: "/gallery", priority: 0.7, changeFrequency: "daily" as const },
    { path: "/track", priority: 0.6, changeFrequency: "monthly" as const },
    { path: "/results", priority: 0.8, changeFrequency: "weekly" as const },
  ];
  return pages.map(({ path, ...rest }) => ({ url: `${base}${path}`, lastModified: now, ...rest }));
}
