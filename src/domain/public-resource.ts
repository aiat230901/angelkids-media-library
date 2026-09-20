export type Provider = "YOUTUBE" | "HEYZINE" | "GOOGLE_DRIVE";

export type ResourceFormat =
  | "ANIMATED_STORY_VIDEO"
  | "ANIMATED_DIALOGUE_VIDEO"
  | "VIRTUAL_TEACHER_GUIDE_VIDEO"
  | "LEARNING_SONG_VIDEO"
  | "SCHOOL_SONG_VIDEO"
  | "DIGITAL_STORYBOOK"
  | "DIGITAL_DIALOGUE_BOOK"
  | "DIGITAL_FLASHCARD_SET"
  | "PRINT_AND_PLAY_COLLECTION";

export type PublicLevel = { code: string; name: string; sortOrder: number };
export type PublicCurriculumUnit = {
  id: string;
  monthNumber: string;
  displayLabel: string;
  sortOrder: number;
};

export type PublicResource = {
  slug: string;
  assetName: string;
  description: string | null;
  resourceFormat: ResourceFormat;
  provider: Provider;
  externalUrl: string;
  thumbnailUrl: string;
  altText: string;
  levels: PublicLevel[];
  curriculumUnit: PublicCurriculumUnit | null;
};

