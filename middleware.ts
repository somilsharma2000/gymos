export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/dashboard/:path*", "/members/:path*", "/leads/:path*", "/payments/:path*", "/classes/:path*"],
};
