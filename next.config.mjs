/** @type {import('next').NextConfig} */
const isPages = !!process.env.PAGES_EXPORT;

const nextConfig = {
  reactStrictMode: true,
  ...(isPages ? { output: "export", basePath: "/gymos", trailingSlash: true, images: { unoptimized: true } } : {}),
  // Marketing landing (public/landing.html) is the home page of the merged
  // one-site system: marketing + owner app + API in this single Next.js app.
  async rewrites() {
    if (isPages) return [];
    return [{ source: "/", destination: "/landing.html" }];
  },
  // Copy protection: nobody embeds our product in their site, nobody re-types
  // content sniffing, and referer leakage is closed.
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(self), microphone=(), geolocation=()" },
        ],
      },
      {
        source: "/admin/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
};

export default nextConfig;
