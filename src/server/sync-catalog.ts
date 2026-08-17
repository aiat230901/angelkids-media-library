import type { Prisma } from "@/generated/prisma/client";
import type { ParsedCatalog } from "./validation/content-manifest";

export async function syncReferenceData(db: Prisma.TransactionClient, catalog: ParsedCatalog): Promise<void> {
  for (const category of catalog.navigation.categories) {
    await db.category.upsert({
      where: { slug: category.slug },
      create: category,
      update: category,
    });
  }
  const categories = new Map((await db.category.findMany()).map((item) => [item.slug, item.id]));
  for (const contentType of catalog.navigation.contentTypes) {
    const categoryId = categories.get(contentType.categorySlug);
    if (!categoryId) throw new Error(`Không tìm thấy Category ${contentType.categorySlug}.`);
    const data = {
      categoryId,
      slug: contentType.slug,
      name: contentType.name,
      description: contentType.description,
      illustrationUrl: contentType.illustrationUrl,
      sortOrder: contentType.sortOrder,
      status: contentType.status,
    };
    await db.contentType.upsert({
      where: { categoryId_slug: { categoryId, slug: contentType.slug } },
      create: data,
      update: data,
    });
  }
  for (const level of catalog.curriculum.levels) {
    await db.level.upsert({ where: { code: level.code }, create: level, update: level });
  }
  for (const unit of catalog.curriculum.curriculumUnits) {
    const data = {
      monthNumber: unit.monthNumber,
      monthTopic: unit.monthTopic,
      displayLabel: unit.displayLabel,
      sortOrder: unit.sortOrder,
      status: unit.status,
    };
    await db.curriculumUnit.upsert({
      where: { monthNumber_monthTopic: { monthNumber: unit.monthNumber, monthTopic: unit.monthTopic } },
      create: data,
      update: data,
    });
  }
}

export async function syncResources(db: Prisma.TransactionClient, catalog: ParsedCatalog): Promise<void> {
  const categories = new Map((await db.category.findMany()).map((item) => [item.slug, item.id]));
  const contentTypes = new Map((await db.contentType.findMany({ include: { category: true } })).map((item) => [`${item.category.slug}/${item.slug}`, item.id]));
  const levels = new Map((await db.level.findMany()).map((item) => [item.code, item.id]));
  const unitManifest = new Map(catalog.curriculum.curriculumUnits.map((item) => [item.key, `${item.monthNumber}/${item.monthTopic}`]));
  const units = new Map((await db.curriculumUnit.findMany()).map((item) => [`${item.monthNumber}/${item.monthTopic}`, item.id]));

  for (const resource of catalog.resources) {
    const categoryId = categories.get(resource.categorySlug);
    const contentTypeId = resource.contentTypeSlug ? contentTypes.get(`${resource.categorySlug}/${resource.contentTypeSlug}`) : null;
    const unitKey = resource.curriculumUnitKey ? unitManifest.get(resource.curriculumUnitKey) : null;
    const curriculumUnitId = unitKey ? units.get(unitKey) : null;
    if (!categoryId || (resource.contentTypeSlug && !contentTypeId) || (resource.curriculumUnitKey && !curriculumUnitId)) {
      throw new Error(`${resource.slug}: không resolve được foreign key.`);
    }
    const fields = {
      slug: resource.slug,
      assetName: resource.assetName,
      description: resource.description,
      provider: resource.provider,
      resourceFormat: resource.resourceFormat,
      externalUrl: resource.externalUrl,
      thumbnailUrl: resource.thumbnailUrl,
      altText: resource.altText,
      status: resource.status,
      sortOrder: resource.sortOrder,
    };
    const record = await db.learningResource.upsert({
      where: { slug: resource.slug },
      create: { ...fields, categoryId, contentTypeId, curriculumUnitId },
      update: { ...fields, categoryId, contentTypeId, curriculumUnitId },
    });
    await db.resourceLevel.deleteMany({ where: { resourceId: record.id } });
    if (resource.levelCodes.length > 0) {
      await db.resourceLevel.createMany({ data: resource.levelCodes.map((code) => ({ resourceId: record.id, levelId: levels.get(code)! })) });
    }
  }
}
