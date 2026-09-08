import { Provider, ResourceFormat, Status } from "@/generated/prisma/client";
import type { PublicResource } from "@/domain/public-resource";
import { toYouTubeThumbnailUrl, validateProviderUrl } from "@/server/providers/urls";
import { getPrisma } from "@/server/db";

export async function listCategories() {
  if (process.env.NODE_ENV === "development") {
    const catalog = await (await import("../catalog-preview")).loadPreviewCatalog();
    return catalog.navigation.categories.filter((item) => item.status === "ACTIVE")
      .sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name))
      .map((item) => ({ ...item, id: item.slug }));
  }
  return getPrisma().category.findMany({ where: { status: Status.ACTIVE }, orderBy: [{ sortOrder: "asc" }, { name: "asc" }] });
}

export async function listContentTypes(categorySlug: string) {
  if (process.env.NODE_ENV === "development") {
    const catalog = await (await import("../catalog-preview")).loadPreviewCatalog();
    return catalog.navigation.contentTypes.filter((item) => item.categorySlug === categorySlug && item.status === "ACTIVE"
      && catalog.navigation.categories.some((category) => category.slug === categorySlug && category.status === "ACTIVE"))
      .sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name))
      .map((item) => ({ ...item, id: `${categorySlug}/${item.slug}` }));
  }
  return getPrisma().contentType.findMany({
    where: { status: Status.ACTIVE, category: { slug: categorySlug, status: Status.ACTIVE } },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  });
}

export type ResourceScope = { categorySlug: string; contentTypeSlug?: string; formats?: ResourceFormat[] };

export async function listResources(scope: ResourceScope): Promise<PublicResource[]> {
  if (process.env.NODE_ENV === "development") {
    return (await import("../catalog-preview")).loadResourcesPreview(scope);
  }
  const records = await getPrisma().learningResource.findMany({
    where: {
      status: Status.ACTIVE,
      thumbnailUrl: { not: null },
      category: { slug: scope.categorySlug, status: Status.ACTIVE },
      ...(scope.contentTypeSlug ? { contentType: { slug: scope.contentTypeSlug, status: Status.ACTIVE } } : { contentTypeId: null }),
      ...(scope.formats ? { resourceFormat: { in: scope.formats } } : {}),
      OR: [{ curriculumUnitId: null }, { curriculumUnit: { status: Status.ACTIVE } }],
    },
    include: {
      levels: { where: { level: { status: Status.ACTIVE } }, include: { level: true } },
      curriculumUnit: true,
    },
    orderBy: [{ sortOrder: "asc" }, { assetName: "asc" }],
  });

  const heyzineHosts = (process.env.HEYZINE_ALLOWED_HOSTS ?? "heyzine.com,mamnonangelkids.aflip.in").split(",").map((host) => host.trim()).filter(Boolean);
  return records.flatMap((record): PublicResource[] => {
    if (!validateProviderUrl(record.provider, record.externalUrl, heyzineHosts).success) return [];
    if (record.resourceFormat !== ResourceFormat.PRINT_AND_PLAY_COLLECTION && record.levels.length === 0) return [];
    const thumbnailUrl = record.thumbnailUrl || (record.provider === Provider.YOUTUBE ? toYouTubeThumbnailUrl(record.externalUrl) : null);
    if (!thumbnailUrl) return [];
    return [{
      slug: record.slug,
      assetName: record.assetName,
      description: record.description,
      resourceFormat: record.resourceFormat,
      provider: record.provider,
      externalUrl: record.externalUrl,
      thumbnailUrl,
      altText: record.altText,
      levels: record.levels.map(({ level }) => ({ code: level.code, name: level.name, sortOrder: level.sortOrder })).sort((a, b) => a.sortOrder - b.sortOrder),
      curriculumUnit: record.curriculumUnit ? {
        id: record.curriculumUnit.id,
        monthNumber: record.curriculumUnit.monthNumber,
        displayLabel: record.curriculumUnit.displayLabel,
        sortOrder: record.curriculumUnit.sortOrder,
      } : null,
    }];
  });
}

export async function getVideoResource(scope: ResourceScope, slug: string): Promise<PublicResource | null> {
  return (await listResources(scope)).find((resource) => resource.slug === slug && resource.provider === Provider.YOUTUBE) ?? null;
}
