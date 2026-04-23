import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "firebasestorage.googleapis.com" },
      { protocol: "https", hostname: "storage.googleapis.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "image.mux.com" },
    ],
  },
  async redirects() {
    return [
      { source: "/templates", destination: "/blueprints", permanent: true },
      { source: "/templates/:slug", destination: "/blueprints/:slug", permanent: true },
      { source: "/pricing", destination: "/planos", permanent: true },
      { source: "/how-it-works", destination: "/como-funciona", permanent: true },
      { source: "/dashboard", destination: "/painel", permanent: true },
      { source: "/login", destination: "/entrar", permanent: true },
      { source: "/signup", destination: "/criar-conta", permanent: true },
    ];
  },
  async headers() {
    const common = [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "X-Frame-Options", value: "SAMEORIGIN" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
      { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
    ];
    return [{ source: "/:path*", headers: common }];
  },
};

export default nextConfig;
