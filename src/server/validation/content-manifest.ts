import { z } from "zod";
import { validateResourceRule } from "@/domain/resource-rules";
import { validateProviderUrl } from "@/server/providers/urls";

const status = z.enum(["DRAFT", "ACTIVE", "ARCHIVED"]);
const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

const navigationSchema = z.object({
  categories: z.array(z.object({
    slug,
    name: z.string().min(1).max(100),
    description: z.string().min(1).max(280),
    illustrationUrl: z.string().min(1),
    sortOrder: z.number().int(),
    status,
  })),
  contentTypes: z.array(z.object({
    categorySlug: slug,
    slug,
    name: z.string().min(1).max(100),
    description: z.string().min(1).max(280),
    illustrationUrl: z.string().min(1),
    sortOrder: z.number().int(),
    status,
  })),
});

const curriculumSchema = z.object({
  levels: z.array(z.object({
    code: z.string().min(1).max(30),
    name: z.string().min(1).max(80),
    ageRange: z.string().max(80).nullable(),
    sortOrder: z.number().int(),
    status,
  })),
  curriculumUnits: z.array(z.object({
    key: slug,
    monthNumber: z.string().regex(/^(0[1-9]|1[0-2])$/),
    monthTopic: z.string().min(1).max(220),
    displayLabel: z.string().min(1).max(260),
    sortOrder: z.number().int(),
    status,
  })),
});

const resourceSchema = z.object({
  slug,
  assetName: z.string().min(1).max(200),
  description: z.string().max(500).nullable(),
  categorySlug: slug,
  contentTypeSlug: slug.nullable(),
  curriculumUnitKey: slug.nullable(),
  provider: z.enum(["YOUTUBE", "HEYZINE", "GOOGLE_DRIVE"]),
  resourceFormat: z.enum([
    "ANIMATED_STORY_VIDEO", "ANIMATED_DIALOGUE_VIDEO", "LEARNING_SONG_VIDEO", "SCHOOL_SONG_VIDEO",
    "DIGITAL_STORYBOOK", "DIGITAL_DIALOGUE_BOOK", "DIGITAL_FLASHCARD_SET", "PRINT_AND_PLAY_COLLECTION",
  ]),
  externalUrl: z.string().min(1),
  thumbnailUrl: z.string(),
  altText: z.string().min(1).max(250),
  levelCodes: z.array(z.string()),
  status,
  sortOrder: z.number().int(),
});

const resourcesSchema = z.object({ resources: z.array(resourceSchema) });

export type ParsedCatalog = {
  navigation: z.infer<typeof navigationSchema>;
  curriculum: z.infer<typeof curriculumSchema>;
  resources: z.infer<typeof resourceSchema>[];
};

function assertUnique(values: string[], label: string): void {
  if (new Set(values).size !== values.length) throw new Error(`${label} bị trùng.`);
}

export function parseContentManifests(
  rawNavigation: unknown,
  rawCurriculum: unknown,
  rawResources: unknown,
  heyzineHosts: string[],
  thumbnailHosts: string[] = [],
): ParsedCatalog {
  const navigation = navigationSchema.parse(rawNavigation);
  const curriculum = curriculumSchema.parse(rawCurriculum);
  const { resources } = resourcesSchema.parse(rawResources);
  assertUnique(navigation.categories.map((item) => item.slug), "Category slug");
  assertUnique(navigation.contentTypes.map((item) => `${item.categorySlug}/${item.slug}`), "Content Type");
  assertUnique(curriculum.levels.map((item) => item.code), "Level code");
  assertUnique(curriculum.curriculumUnits.map((item) => item.key), "Curriculum Unit key");
  assertUnique(resources.map((item) => item.slug), "Resource slug");

  const categories = new Map(navigation.categories.map((item) => [item.slug, item]));
  const contentTypes = new Map(navigation.contentTypes.map((item) => [`${item.categorySlug}/${item.slug}`, item]));
  const levels = new Map(curriculum.levels.map((item) => [item.code, item]));
  const units = new Map(curriculum.curriculumUnits.map((item) => [item.key, item]));
  const activePrintUnits = new Set<string>();

  for (const resource of resources) {
    const category = categories.get(resource.categorySlug);
    if (!category) throw new Error(`Không tìm thấy Category ${resource.categorySlug}.`);
    if (resource.contentTypeSlug && !contentTypes.has(`${resource.categorySlug}/${resource.contentTypeSlug}`)) {
      throw new Error(`Không tìm thấy Content Type ${resource.categorySlug}/${resource.contentTypeSlug}.`);
    }
    for (const code of resource.levelCodes) {
      if (!levels.has(code)) throw new Error(`Không tìm thấy Level ${code}.`);
    }
    if (resource.curriculumUnitKey && !units.has(resource.curriculumUnitKey)) {
      throw new Error(`Không tìm thấy Curriculum Unit ${resource.curriculumUnitKey}.`);
    }
    const rule = validateResourceRule(resource);
    if (!rule.success) throw new Error(`${resource.slug}: ${rule.errors.join(" ")}`);
    const provider = validateProviderUrl(resource.provider, resource.externalUrl, heyzineHosts);
    if (!provider.success) throw new Error(`${resource.slug}: ${provider.error}`);
    if (!resource.thumbnailUrl && resource.status !== "ACTIVE") {
      // Draft metadata may be prepared before its approved cover is available.
    } else if (resource.thumbnailUrl.startsWith("/")) {
      if (resource.thumbnailUrl.startsWith("//") || resource.thumbnailUrl.includes("..") || resource.thumbnailUrl.includes("\\")) {
        throw new Error(`${resource.slug}: thumbnail local không hợp lệ.`);
      }
    } else {
      let thumbnail: URL;
      try { thumbnail = new URL(resource.thumbnailUrl); } catch { throw new Error(`${resource.slug}: thumbnail không hợp lệ.`); }
      if (thumbnail.protocol !== "https:" || !thumbnailHosts.includes(thumbnail.hostname)) {
        throw new Error(`${resource.slug}: thumbnail host chưa được cho phép.`);
      }
    }

    if (resource.status === "ACTIVE") {
      if (category.status !== "ACTIVE") throw new Error(`${resource.slug}: Category không active.`);
      if (resource.contentTypeSlug && contentTypes.get(`${resource.categorySlug}/${resource.contentTypeSlug}`)?.status !== "ACTIVE") {
        throw new Error(`${resource.slug}: Content Type không active.`);
      }
      if (resource.levelCodes.some((code) => levels.get(code)?.status !== "ACTIVE")) throw new Error(`${resource.slug}: Level không active.`);
      if (resource.curriculumUnitKey && units.get(resource.curriculumUnitKey)?.status !== "ACTIVE") throw new Error(`${resource.slug}: Curriculum Unit không active.`);
      if (resource.resourceFormat === "PRINT_AND_PLAY_COLLECTION" && resource.curriculumUnitKey) {
        if (activePrintUnits.has(resource.curriculumUnitKey)) throw new Error(`${resource.curriculumUnitKey} có nhiều hơn một active Print and Plays collection.`);
        activePrintUnits.add(resource.curriculumUnitKey);
      }
    }
  }
  return { navigation, curriculum, resources };
}
