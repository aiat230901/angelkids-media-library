import type { Provider, ResourceFormat } from "./public-resource";

export type ResourceRuleInput = {
  slug: string;
  assetName: string;
  categorySlug: string;
  contentTypeSlug: string | null;
  curriculumUnitKey: string | null;
  provider: Provider;
  resourceFormat: ResourceFormat;
  externalUrl: string;
  thumbnailUrl: string;
  altText: string;
  levelCodes: string[];
  status: "DRAFT" | "ACTIVE" | "ARCHIVED";
  sortOrder: number;
};

type Rule = { category: string; contentType: string | null; provider: Provider; unitOptional?: boolean; levelsOptional?: boolean };

const RULES: Record<ResourceFormat, Rule> = {
  ANIMATED_STORY_VIDEO: { category: "watch", contentType: "stories", provider: "YOUTUBE" },
  ANIMATED_DIALOGUE_VIDEO: { category: "watch", contentType: "dialogues", provider: "YOUTUBE" },
  VIRTUAL_TEACHER_GUIDE_VIDEO: { category: "watch", contentType: "virtual-teacher-guide", provider: "YOUTUBE" },
  LEARNING_SONG_VIDEO: { category: "songs", contentType: null, provider: "YOUTUBE" },
  SCHOOL_SONG_VIDEO: { category: "songs", contentType: null, provider: "YOUTUBE", unitOptional: true },
  DIGITAL_STORYBOOK: { category: "read", contentType: "storybooks", provider: "HEYZINE" },
  DIGITAL_DIALOGUE_BOOK: { category: "read", contentType: "dialogue-books", provider: "HEYZINE" },
  DIGITAL_FLASHCARD_SET: { category: "digital-flashcards", contentType: null, provider: "HEYZINE" },
  PRINT_AND_PLAY_COLLECTION: { category: "print-and-plays", contentType: null, provider: "GOOGLE_DRIVE", levelsOptional: true },
};

export function validateResourceRule(input: ResourceRuleInput): { success: boolean; errors: string[] } {
  const rule = RULES[input.resourceFormat];
  const errors: string[] = [];
  if (input.categorySlug !== rule.category) errors.push("Category không khớp resource format.");
  if (input.contentTypeSlug !== rule.contentType) errors.push("Content Type không khớp resource format.");
  if (input.provider !== rule.provider) errors.push("Provider không khớp resource format.");
  if (!rule.unitOptional && !input.curriculumUnitKey) errors.push("Curriculum Unit là bắt buộc.");
  if (input.status === "ACTIVE" && !rule.levelsOptional && input.levelCodes.length === 0) errors.push("Active resource cần ít nhất một Level.");
  if (input.status === "ACTIVE" && input.provider !== "YOUTUBE" && !input.thumbnailUrl.trim()) errors.push("Active resource cần thumbnail.");
  return { success: errors.length === 0, errors };
}
