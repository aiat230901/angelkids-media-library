import "dotenv/config";
import { getPrisma } from "../src/server/db";
import { loadCatalog } from "../src/server/content";
import { syncReferenceData, syncResources } from "../src/server/sync-catalog";
import { diffResource } from "../src/domain/content-diff";

const args = new Set(process.argv.slice(2));
const apply = args.has("--apply");
const validateOnly = args.has("--validate");
const catalog = await loadCatalog();
console.log(`Manifest hợp lệ: ${catalog.navigation.categories.length} category, ${catalog.resources.length} resource.`);

if (validateOnly) process.exit(0);

const prisma = getPrisma();
const unitKeys = new Map(catalog.curriculum.curriculumUnits.map((unit) => [`${unit.monthNumber}/${unit.monthTopic}`, unit.key]));
const existing = new Map((await prisma.learningResource.findMany({
  include: { category: true, contentType: true, curriculumUnit: true, levels: { include: { level: true } } },
})).map((item) => [item.slug, {
  slug: item.slug,
  assetName: item.assetName,
  description: item.description,
  categorySlug: item.category.slug,
  contentTypeSlug: item.contentType?.slug ?? null,
  curriculumUnitKey: item.curriculumUnit ? unitKeys.get(`${item.curriculumUnit.monthNumber}/${item.curriculumUnit.monthTopic}`) ?? null : null,
  provider: item.provider,
  resourceFormat: item.resourceFormat,
  externalUrl: item.externalUrl,
  thumbnailUrl: item.thumbnailUrl ?? "",
  altText: item.altText,
  levelCodes: item.levels.map(({ level }) => level.code),
  status: item.status,
  sortOrder: item.sortOrder,
}]));
const changes = catalog.resources.map((item) => ({ item, diff: diffResource(item, existing.get(item.slug)) })).filter(({ diff }) => diff.action !== "UNCHANGED");
for (const { item, diff } of changes) console.log(`${diff.action} ${item.slug}${diff.fields.length ? `: ${diff.fields.join(", ")}` : ""}`);
console.log(`${changes.length} resource thay đổi/tạo mới; không xóa record ngoài manifest.`);

if (!apply) {
  console.log("Dry run hoàn tất. Dùng --apply để ghi dữ liệu.");
  await prisma.$disconnect();
  process.exit(0);
}
if (changes.some(({ item }) => item.status === "ACTIVE") && !args.has("--confirm-active")) {
  await prisma.$disconnect();
  throw new Error("Có resource chuyển sang ACTIVE; chạy lại với --confirm-active sau khi review.");
}
await prisma.$transaction(async (tx) => {
  await syncReferenceData(tx, catalog);
  await syncResources(tx, catalog);
});
await prisma.$disconnect();
console.log("Đồng bộ nội dung hoàn tất.");
