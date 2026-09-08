import type { PublicResource } from "@/domain/public-resource";
import { loadCatalog } from "./content";
import { toYouTubeThumbnailUrl } from "./providers/urls";
import type { ResourceScope } from "./repositories/learning";

export async function loadPreviewCatalog() {
  if (process.env.NODE_ENV !== "development") throw new Error("Catalog preview is development-only.");
  return loadCatalog();
}

export async function loadResourcesPreview(scope: ResourceScope): Promise<PublicResource[]> {
  const catalog = await loadPreviewCatalog();
  return catalog.resources
    .filter((resource) => resource.categorySlug === scope.categorySlug && resource.status === "ACTIVE"
      && resource.contentTypeSlug === (scope.contentTypeSlug ?? null)
      && (!scope.formats || scope.formats.includes(resource.resourceFormat))
      && catalog.navigation.categories.some((category) => category.slug === resource.categorySlug && category.status === "ACTIVE")
      && (!resource.contentTypeSlug || catalog.navigation.contentTypes.some((type) => type.categorySlug === resource.categorySlug && type.slug === resource.contentTypeSlug && type.status === "ACTIVE"))
      && (!resource.curriculumUnitKey || catalog.curriculum.curriculumUnits.some((unit) => unit.key === resource.curriculumUnitKey && unit.status === "ACTIVE")))
    .sort((a, b) => a.sortOrder - b.sortOrder || a.assetName.localeCompare(b.assetName))
    .map((resource) => {
      const unit = catalog.curriculum.curriculumUnits.find((item) => item.key === resource.curriculumUnitKey);
      return {
        slug: resource.slug,
        assetName: resource.assetName,
        description: resource.description,
        resourceFormat: resource.resourceFormat,
        provider: resource.provider,
        externalUrl: resource.externalUrl,
        thumbnailUrl: resource.thumbnailUrl || (resource.provider === "YOUTUBE" ? toYouTubeThumbnailUrl(resource.externalUrl) : ""),
        altText: resource.altText,
        levels: catalog.curriculum.levels
          .filter((level) => resource.levelCodes.includes(level.code) && level.status === "ACTIVE")
          .sort((a, b) => a.sortOrder - b.sortOrder)
          .map(({ code, name, sortOrder }) => ({ code, name, sortOrder })),
        curriculumUnit: unit ? { id: unit.key, monthNumber: unit.monthNumber, displayLabel: unit.displayLabel, sortOrder: unit.sortOrder } : null,
      };
    });
}
