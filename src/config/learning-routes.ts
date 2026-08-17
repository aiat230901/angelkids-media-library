import { ResourceFormat } from "@/generated/prisma/client";

export const CATEGORY_PATHS: Record<string, string> = {
  watch: "/learning/watch",
  read: "/learning/read",
  songs: "/learning/songs",
  "digital-flashcards": "/learning/digital-flashcards",
  "print-and-plays": "/learning/print-and-plays",
};

export const CONTENT_TYPE_PATHS: Record<string, string> = {
  "watch/stories": "/learning/watch/stories",
  "watch/dialogues": "/learning/watch/dialogues",
  "read/storybooks": "/learning/read/storybooks",
  "read/dialogue-books": "/learning/read/dialogue-books",
};

export function getCategoryPath(slug: string): string {
  const path = CATEGORY_PATHS[slug];
  if (!path) throw new Error(`Category chưa có route: ${slug}`);
  return path;
}

export function getContentTypePath(categorySlug: string, contentTypeSlug: string): string {
  const path = CONTENT_TYPE_PATHS[`${categorySlug}/${contentTypeSlug}`];
  if (!path) throw new Error(`Content Type chưa có route: ${categorySlug}/${contentTypeSlug}`);
  return path;
}

export const WATCH_LISTINGS = {
  stories: { title: "Animated Stories", lead: "Chọn một câu chuyện để cùng xem và lắng nghe.", format: ResourceFormat.ANIMATED_STORY_VIDEO },
  dialogues: { title: "Animated Dialogues", lead: "Chọn một hội thoại để con nghe và làm quen với mẫu câu.", format: ResourceFormat.ANIMATED_DIALOGUE_VIDEO },
} as const;

export const READ_LISTINGS = {
  storybooks: { title: "Digital Storybooks", lead: "Chọn một truyện để lật mở, nghe và đọc theo từng trang.", format: ResourceFormat.DIGITAL_STORYBOOK },
  "dialogue-books": { title: "Digital Dialogue Books", lead: "Chọn một sách hội thoại để nghe và đọc theo các nhân vật.", format: ResourceFormat.DIGITAL_DIALOGUE_BOOK },
} as const;
