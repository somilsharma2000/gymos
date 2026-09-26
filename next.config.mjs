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
};

export default nextConfig;
