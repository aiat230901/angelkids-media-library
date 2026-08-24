import type { PrismaClient, Status } from "@/generated/prisma/client";
import { syncReferenceData, syncResources } from "./sync-catalog";
import type { ParsedCatalog } from "./validation/content-manifest";

export type ManifestStatusSummary = {
  total: number;
  matched: number;
  active: number;
  draft: number;
  archived: number;
  missing: number;
};

export type DraftManifestResult = {
  changed: number;
  before: ManifestStatusSummary;
  after: ManifestStatusSummary;
};

export function getDraftRollbackMode(args: string[]): "APPLY" | "DRY_RUN" {
  return args.includes("--confirm-draft") ? "APPLY" : "DRY_RUN";
}

export function summarizeManifestStatuses(
  total: number,
  records: Array<{ status: Status }>,
): ManifestStatusSummary {
  return {
    total,
    matched: records.length,
    active: records.filter(({ status }) => status === "ACTIVE").length,
    draft: records.filter(({ status }) => status === "DRAFT").length,
    archived: records.filter(({ status }) => status === "ARCHIVED").length,
    missing: total - records.length,
  };
}

export async function applyCatalogTransaction(db: PrismaClient, catalog: ParsedCatalog): Promise<void> {
  try {
    await db.$transaction(async (tx) => {
      await syncReferenceData(tx, catalog);
      await syncResources(tx, catalog);
    });
  } catch (cause) {
    throw new Error(
      "Đồng bộ thất bại: transaction đã rollback; không có dữ liệu catalog nào được import một phần.",
      { cause },
    );
  }
}

export async function draftManifestResources(
  db: PrismaClient,
  slugs: string[],
  reportBefore: (summary: ManifestStatusSummary) => void = () => undefined,
): Promise<DraftManifestResult> {
  try {
    return await db.$transaction(async (tx) => {
      const before = summarizeManifestStatuses(slugs.length, await tx.learningResource.findMany({
        where: { slug: { in: slugs } },
        select: { status: true },
      }));
      reportBefore(before);
      const result = await tx.learningResource.updateMany({
        where: { slug: { in: slugs }, status: "ACTIVE" },
        data: { status: "DRAFT" },
      });
      const after = summarizeManifestStatuses(slugs.length, await tx.learningResource.findMany({
        where: { slug: { in: slugs } },
        select: { status: true },
      }));
      return { changed: result.count, before, after };
    });
  } catch (cause) {
    throw new Error(
      "Rollback-to-DRAFT thất bại: transaction đã rollback; không có thay đổi một phần nào được commit.",
      { cause },
    );
  }
}
