import { describe, expect, test } from "vitest";
import { validateResourceRule } from "@/domain/resource-rules";

const story = {
  slug: "mia-happy-classroom",
  assetName: "Mia's Happy Classroom",
  categorySlug: "watch",
  contentTypeSlug: "stories",
  curriculumUnitKey: "09-school",
  provider: "YOUTUBE" as const,
  resourceFormat: "ANIMATED_STORY_VIDEO" as const,
  externalUrl: "https://youtu.be/dQw4w9WgXcQ",
  thumbnailUrl: "/illustrations/mia.webp",
  altText: "Mia trong lớp học",
  levelCodes: ["L3"],
  status: "ACTIVE" as const,
  sortOrder: 10,
};

describe("resource activation matrix", () => {
  test("accepts a correctly scoped animated story", () => {
    expect(validateResourceRule(story).success).toBe(true);
  });

  test("rejects a story assigned to the wrong content type", () => {
    const result = validateResourceRule({ ...story, contentTypeSlug: "dialogues" });
    expect(result.success).toBe(false);
  });

  test("allows an active printable collection without Levels", () => {
    const result = validateResourceRule({
      ...story,
      slug: "print-09-school",
      categorySlug: "print-and-plays",
      contentTypeSlug: null,
      provider: "GOOGLE_DRIVE",
      resourceFormat: "PRINT_AND_PLAY_COLLECTION",
      externalUrl: "https://drive.google.com/drive/folders/abc",
      levelCodes: [],
    });
    expect(result.success).toBe(true);
  });

  test("requires at least one Level for active resources", () => {
    expect(validateResourceRule({ ...story, levelCodes: [] }).success).toBe(false);
  });

  test("allows YouTube to derive its thumbnail but still requires covers for other providers", () => {
    expect(validateResourceRule({ ...story, thumbnailUrl: "" }).success).toBe(true);
    expect(validateResourceRule({
      ...story,
      categorySlug: "read",
      contentTypeSlug: "storybooks",
      provider: "HEYZINE",
      resourceFormat: "DIGITAL_STORYBOOK",
      externalUrl: "https://heyzine.com/flip-book/abc",
      thumbnailUrl: "",
    }).success).toBe(false);
  });

  test("allows only School Songs to omit Curriculum Unit", () => {
    const schoolSong = {
      ...story,
      categorySlug: "songs",
      contentTypeSlug: null,
      curriculumUnitKey: null,
      resourceFormat: "SCHOOL_SONG_VIDEO" as const,
    };
    expect(validateResourceRule(schoolSong).success).toBe(true);
    expect(validateResourceRule({ ...story, curriculumUnitKey: null }).success).toBe(false);
  });
});
