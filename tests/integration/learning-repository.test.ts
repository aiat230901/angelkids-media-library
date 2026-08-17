import { afterAll, beforeAll, describe, expect, test } from "vitest";
import { ResourceFormat, Status } from "@/generated/prisma/client";

const testUrl = process.env.TEST_DATABASE_URL;
const describeDatabase = testUrl ? describe : describe.skip;
const prefix = `integration-${Date.now()}`;

describeDatabase("learning repository with PostgreSQL", () => {
  beforeAll(async () => {
    if (!testUrl) return;
    process.env.DATABASE_URL = testUrl;
    const { getPrisma } = await import("@/server/db");
    const db = getPrisma();
    const category = await db.category.create({ data: { slug: `${prefix}-watch`, name: "Watch", description: "Test", illustrationUrl: "/illustrations/watch.svg" } });
    const contentType = await db.contentType.create({ data: { categoryId: category.id, slug: "stories", name: "Stories", description: "Test", illustrationUrl: "/illustrations/watch.svg" } });
    const level = await db.level.create({ data: { code: `${prefix}-L3`, name: "Level 3" } });
    const unit = await db.curriculumUnit.create({ data: { monthNumber: "09", monthTopic: prefix, displayLabel: `09 - ${prefix}` } });
    for (const [slug, status] of [[`${prefix}-active`, Status.ACTIVE], [`${prefix}-draft`, Status.DRAFT]] as const) {
      await db.learningResource.create({ data: {
        slug, assetName: slug, categoryId: category.id, contentTypeId: contentType.id, curriculumUnitId: unit.id,
        provider: "YOUTUBE", resourceFormat: ResourceFormat.ANIMATED_STORY_VIDEO,
        externalUrl: "https://youtu.be/dQw4w9WgXcQ", thumbnailUrl: "/illustrations/watch.svg", altText: "Test", status,
        levels: { create: { levelId: level.id } },
      } });
    }
  });

  afterAll(async () => {
    if (!testUrl) return;
    const { getPrisma } = await import("@/server/db");
    const db = getPrisma();
    await db.learningResource.deleteMany({ where: { slug: { startsWith: prefix } } });
    await db.contentType.deleteMany({ where: { category: { slug: `${prefix}-watch` } } });
    await db.category.deleteMany({ where: { slug: `${prefix}-watch` } });
    await db.level.deleteMany({ where: { code: `${prefix}-L3` } });
    await db.curriculumUnit.deleteMany({ where: { monthTopic: prefix } });
    await db.$disconnect();
  });

  test("returns active resources and excludes drafts", async () => {
    const { listResources } = await import("@/server/repositories/learning");
    const resources = await listResources({ categorySlug: `${prefix}-watch`, contentTypeSlug: "stories", formats: [ResourceFormat.ANIMATED_STORY_VIDEO] });
    expect(resources.map((item) => item.slug)).toEqual([`${prefix}-active`]);
  });
});

