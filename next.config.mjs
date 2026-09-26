/** @type {import('next').NextConfig} */
const isPages = !!process.env.PAGES_EXPORT;
const nextConfig = {
  reactStrictMode: true,
  ...(isPages ? { output: "export", basePath: "/gymos", trailingSlash: true, images: { unoptimized: true } } : {}),
};
export default nextConfig;
