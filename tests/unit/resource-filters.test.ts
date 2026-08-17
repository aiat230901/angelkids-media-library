import { describe, expect, test } from "vitest";
import { filterResources, getFilterOptions } from "@/domain/resource-filters";
import type { PublicResource } from "@/domain/public-resource";

const resources: PublicResource[] = [
  {
    slug: "mia",
    assetName: "Mia's Happy Classroom",
    description: null,
    resourceFormat: "ANIMATED_STORY_VIDEO",
    provider: "YOUTUBE",
    externalUrl: "https://youtu.be/dQw4w9WgXcQ",
    thumbnailUrl: "/mia.webp",
    altText: "Mia",
    levels: [{ code: "L3", name: "Level 3", sortOrder: 10 }],
    curriculumUnit: { id: "u09", monthNumber: "09", displayLabel: "09 - Trường học", sortOrder: 10 },
  },
  {
    slug: "family",
    assetName: "My Loving Family",
    description: null,
    resourceFormat: "SCHOOL_SONG_VIDEO",
    provider: "YOUTUBE",
    externalUrl: "https://youtu.be/aaaaaaaaaaa",
    thumbnailUrl: "/family.webp",
    altText: "Family",
    levels: [{ code: "L4", name: "Level 4", sortOrder: 20 }],
    curriculumUnit: null,
  },
];

describe("resource filters", () => {
  test("combines Level, name and Curriculum Unit with AND logic", () => {
    expect(filterResources(resources, { levelCode: "L3", query: "happy", curriculumUnitId: "u09" }).map((item) => item.slug)).toEqual(["mia"]);
    expect(filterResources(resources, { levelCode: "L4", query: "happy", curriculumUnitId: "u09" })).toEqual([]);
  });

  test("matches Asset Name case-insensitively and keeps unitless resources in All", () => {
    expect(filterResources(resources, { levelCode: "", query: "LOVING", curriculumUnitId: "" }).map((item) => item.slug)).toEqual(["family"]);
    expect(filterResources(resources, { levelCode: "", query: "", curriculumUnitId: "u09" }).map((item) => item.slug)).toEqual(["mia"]);
  });

  test("derives sorted unique options only from current active resources", () => {
    expect(getFilterOptions(resources)).toEqual({
      levels: [
        { code: "L3", name: "Level 3", sortOrder: 10 },
        { code: "L4", name: "Level 4", sortOrder: 20 },
      ],
      curriculumUnits: [{ id: "u09", monthNumber: "09", displayLabel: "09 - Trường học", sortOrder: 10 }],
    });
  });
});

