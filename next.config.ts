import type { NextConfig } from "next";

const heyzineHosts = (process.env.HEYZINE_ALLOWED_HOSTS ?? "heyzine.com").split(",").map((host) => `https://${host.trim()}`).join(" ");
const thumbnailHostnames = (process.env.THUMBNAIL_ALLOWED_HOSTS ?? "i.ytimg.com").split(",").map((host) => host.trim()).filter(Boolean);
const thumbnailHosts = thumbnailHostnames.map((host) => `https://${host}`).join(" ");
const scriptSrc = process.env.NODE_ENV === "production" ? "'self' 'unsafe-inline'" : "'self' 'unsafe-inline' 'unsafe-eval'";
const csp = [
  "default-src 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  `frame-src 'self' https://www.youtube-nocookie.com ${heyzineHosts}`,
  `img-src 'self' data: blob: ${thumbnailHosts}`,
  "font-src 'self' data:",
  "style-src 'self' 'unsafe-inline'",
  `script-src ${scriptSrc}`,
  "connect-src 'self'",
  ...(process.env.NODE_ENV === "production" ? ["upgrade-insecure-requests"] : []),
].join("; ");

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1"],
  poweredByHeader: false,
  images: { remotePatterns: thumbnailHostnames.map((hostname) => ({ protocol: "https", hostname })) },
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
