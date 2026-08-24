import "dotenv/config";
import { getPrisma } from "../src/server/db";
import { loadCatalog } from "../src/server/content";
import {
  draftManifestResources,
  getDraftRollbackMode,
  summarizeManifestStatuses,
} from "../src/server/catalog-release";

const catalog = await loadCatalog();
const slugs = catalog.resources.map(({ slug }) => slug);
const mode = getDraftRollbackMode(process.argv.slice(2));
const prisma = getPrisma();

try {
  const reportBefore = (before: ReturnType<typeof summarizeManifestStatuses>) => {
    console.log(
      `Rollback scope before: total=${before.total}, matched=${before.matched}, active=${before.active}, draft=${before.draft}, archived=${before.archived}, missing=${before.missing}`,
    );
    console.log("Chỉ resource ACTIVE có slug trong manifest hiện tại mới được chuyển sang DRAFT.");
  };

  if (mode === "DRY_RUN") {
    const beforeRecords = await prisma.learningResource.findMany({
      where: { slug: { in: slugs } },
      select: { status: true },
    });
    reportBefore(summarizeManifestStatuses(slugs.length, beforeRecords));
    console.log("Dry run hoàn tất. Dùng --confirm-draft để thực hiện rollback-to-DRAFT.");
  } else {
    const { changed, after } = await draftManifestResources(prisma, slugs, reportBefore);
    console.log(
      `Rollback result: changed=${changed}, total=${after.total}, matched=${after.matched}, active=${after.active}, draft=${after.draft}, archived=${after.archived}, missing=${after.missing}`,
    );
  }
} finally {
  await prisma.$disconnect();
}
