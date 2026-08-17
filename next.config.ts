import type { NextConfig } from "next";

const heyzineHosts = (process.env.HEYZINE_ALLOWED_HOSTS ?? "heyzine.com").split(",").map((host) => `https://${host.trim()}`).join(" ");
const thumbnailHosts = (process.env.THUMBNAIL_ALLOWED_HOSTS ?? "i.ytimg.com").split(",").map((host) => `https://${host.trim()}`).join(" ");
const csp = [
  "default-src 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  `frame-src 'self' https://www.youtube-nocookie.com ${heyzineHosts}`,
  `img-src 'self' data: blob: ${thumbnailHosts}`,
  "font-src 'self' data:",
  "style-src 'self' 'unsafe-inline'",
  "script-src 'self' 'unsafe-inline'",
  "connect-src 'self'",
  "upgrade-insecure-requests",
].join("; ");

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [{ source: "/(.*)", headers: [
      { key: "Content-Security-Policy", value: csp },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
    ] }];
  },
};

export default nextConfig;

