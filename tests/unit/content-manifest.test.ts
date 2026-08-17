import { describe, expect, test } from "vitest";
import { parseContentManifests } from "@/server/validation/content-manifest";

const navigation = {
  categories: [
    { slug: "watch", name: "Watch", description: "Xem", illustrationUrl: "/illustrations/watch.svg", sortOrder: 10, status: "ACTIVE" },
    { slug: "print-and-plays", name: "Print and Plays", description: "In", illustrationUrl: "/illustrations/print.svg", sortOrder: 20, status: "ACTIVE" },
  ],
  contentTypes: [
    { categorySlug: "watch", slug: "stories", name: "Stories", description: "Truyện", illustrationUrl: "/illustrations/stories.svg", sortOrder: 10, status: "ACTIVE" },
  ],
};

const curriculum = {
  levels: [{ code: "L3", name: "Level 3", ageRange: "3-4 tuổi", sortOrder: 10, status: "ACTIVE" }],
  curriculumUnits: [{ key: "09-school", monthNumber: "09", monthTopic: "Trường học", displayLabel: "09 - Trường học", sortOrder: 10, status: "ACTIVE" }],
};

const resources = {
  resources: [{
    slug: "mia",
    assetName: "Mia",
    description: null,
    categorySlug: "watch",
    contentTypeSlug: "stories",
    curriculumUnitKey: "09-school",
    provider: "YOUTUBE",
    resourceFormat: "ANIMATED_STORY_VIDEO",
    externalUrl: "https://youtu.be/dQw4w9WgXcQ",
    thumbnailUrl: "/illustrations/mia.svg",
    altText: "Mia trong lớp",
    levelCodes: ["L3"],
    status: "ACTIVE",
    sortOrder: 10,
  }],
};

describe("content manifests", () => {
  test("parses a complete cross-referenced catalog", () => {
    expect(parseContentManifests(navigation, curriculum, resources, ["heyzine.com"]).resources).toHaveLength(1);
  });

  test("rejects unknown references", () => {
    const invalid = structuredClone(resources);
    invalid.resources[0].levelCodes = ["L9"];
    expect(() => parseContentManifests(navigation, curriculum, invalid, ["heyzine.com"])).toThrow("Level L9");
  });

  test("rejects an active thumbnail from an unapproved host", () => {
    const invalid = structuredClone(resources);
    invalid.resources[0].thumbnailUrl = "https://evil.test/mia.webp";
    expect(() => parseContentManifests(navigation, curriculum, invalid, ["heyzine.com"], ["cdn.angelkids.edu.vn"])).toThrow("thumbnail");
  });

  test("allows a draft resource to omit its thumbnail", () => {
    const draft = structuredClone(resources);
    draft.resources[0].status = "DRAFT";
    draft.resources[0].thumbnailUrl = "";
    expect(parseContentManifests(navigation, curriculum, draft, ["heyzine.com"]).resources[0].status).toBe("DRAFT");
  });

  test("rejects duplicate active printable collections for one unit", () => {
    const printable = {
      ...resources.resources[0],
      slug: "print-09",
      categorySlug: "print-and-plays",
      contentTypeSlug: null,
      provider: "GOOGLE_DRIVE",
      resourceFormat: "PRINT_AND_PLAY_COLLECTION",
      externalUrl: "https://drive.google.com/drive/folders/abc",
      levelCodes: [],
    };
    const duplicate = { resources: [printable, { ...printable, slug: "print-09-copy" }] };
    expect(() => parseContentManifests(navigation, curriculum, duplicate, ["heyzine.com"])).toThrow("nhiều hơn một active Print and Plays");
  });
});
