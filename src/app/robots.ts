// SEO: index the public marketing surfaces, NEVER the admin/owner internals.
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = process.env.SITE_URL || "https://gymos.in";
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/demo", "/blog"],
        disallow: ["/admin", "/login", "/api", "/*/members", "/*/leads", "/*/payments", "/*/classes", "/*/dashboard"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
