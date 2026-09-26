import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.SITE_URL || "https://gymos.in";
  const now = new Date();
  return [
    { url: base, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/demo`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/blog/whatsapp-renewal-system`, lastModified: now, priority: 0.7 },
    { url: `${base}/blog/register-vs-gym-os`, lastModified: now, priority: 0.7 },
  ];
}
