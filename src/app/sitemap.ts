import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  return ["/learning", "/learning/watch", "/learning/read", "/learning/songs", "/learning/digital-flashcards", "/learning/print-and-plays"].map((path) => ({ url: `${base}${path}`, changeFrequency: "weekly" as const }));
}

