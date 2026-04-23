import type { MetadataRoute } from "next";
import { templates } from "@/data/templates";

const BASE = process.env.NEXT_PUBLIC_APP_URL || "https://blueprints.wxdigitalstudio.com.br";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes = [
    "",
    "/blueprints",
    "/planos",
    "/como-funciona",
    "/criar-conta",
    "/entrar",
    "/termos",
    "/privacidade",
    "/reembolso",
    "/licenca",
  ].map((path) => ({
    url: `${BASE}${path}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : path === "/planos" || path === "/blueprints" ? 0.9 : 0.6,
  }));

  const blueprintRoutes = templates.map((t) => ({
    url: `${BASE}/blueprints/${t.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...routes, ...blueprintRoutes];
}
