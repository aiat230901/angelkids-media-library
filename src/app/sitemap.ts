import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  return [
    "/learning", "/learning/watch", "/learning/watch/stories", "/learning/watch/dialogues",
    "/learning/read", "/learning/read/storybooks", "/learning/read/dialogue-books",
    "/learning/songs", "/learning/digital-flashcards", "/learning/print-and-plays",
  ].map((path) => ({ url: `${base}${path}`, changeFrequency: "weekly" as const }));
}
