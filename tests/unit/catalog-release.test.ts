import { describe, expect, test, vi } from "vitest";
import type { PrismaClient } from "@/generated/prisma/client";
import type { ParsedCatalog } from "@/server/validation/content-manifest";
import {
  applyCatalogTransaction,
  draftManifestResources,
  getDraftRollbackMode,
  summarizeManifestStatuses,
} from "@/server/catalog-release";

describe("catalog release transactions", () => {
  test("reports that a failed catalog sync transaction rolled back without partial import", async () => {
    const db = {
      $transaction: vi.fn().mockRejectedValue(new Error("database write failed")),
    } as unknown as PrismaClient;

    await expect(applyCatalogTransaction(db, {} as ParsedCatalog)).rejects.toThrow(
      "Đồng bộ thất bại: transaction đã rollback; không có dữ liệu catalog nào được import một phần.",
    );
  });

  test("reports before, drafts the manifest scope, then returns the after summary in one transaction", async () => {
    const events: string[] = [];
    const beforeRecords = [{ status: "ACTIVE" }, { status: "DRAFT" }] as const;
    const afterRecords = [{ status: "DRAFT" }, { status: "DRAFT" }] as const;
    const findMany = vi.fn()
      .mockImplementationOnce(async () => {
        events.push("read-before");
        return beforeRecords;
      })
      .mockImplementationOnce(async () => {
        events.push("read-after");
        return afterRecords;
      });
    const updateMany = vi.fn().mockImplementation(async () => {
      events.push("write");
      return { count: 1 };
    });
    const db = {
      $transaction: vi.fn(async (operation) => operation({ learningResource: { findMany, updateMany } })),
    } as unknown as PrismaClient;
    const beforeReports: unknown[] = [];

    await expect(draftManifestResources(
      db,
      ["release-one", "release-two", "missing"],
      (summary) => {
        events.push("report-before");
        beforeReports.push(summary);
      },
    )).resolves.toEqual({
      changed: 1,
      before: { total: 3, matched: 2, active: 1, draft: 1, archived: 0, missing: 1 },
      after: { total: 3, matched: 2, active: 0, draft: 2, archived: 0, missing: 1 },
    });
    expect(events).toEqual(["read-before", "report-before", "write", "read-after"]);
    expect(beforeReports).toEqual([
      { total: 3, matched: 2, active: 1, draft: 1, archived: 0, missing: 1 },
    ]);
    expect(updateMany).toHaveBeenCalledWith({
      where: { slug: { in: ["release-one", "release-two", "missing"] }, status: "ACTIVE" },
      data: { status: "DRAFT" },
    });
  });

  test("reports that a failed draft rollback transaction committed no partial change", async () => {
    const db = {
      $transaction: vi.fn().mockRejectedValue(new Error("database write failed")),
    } as unknown as PrismaClient;

    await expect(draftManifestResources(db, ["release-one"])).rejects.toThrow(
      "Rollback-to-DRAFT thất bại: transaction đã rollback; không có thay đổi một phần nào được commit.",
    );
  });

  test("requires the exact draft confirmation flag before applying rollback", () => {
    expect(getDraftRollbackMode([])).toBe("DRY_RUN");
    expect(getDraftRollbackMode(["--apply", "--confirm-active"])).toBe("DRY_RUN");
    expect(getDraftRollbackMode(["--confirm-draft"])).toBe("APPLY");
  });

  test("summarizes manifest status scope including missing database records", () => {
    expect(summarizeManifestStatuses(5, [
      { status: "ACTIVE" },
      { status: "ACTIVE" },
      { status: "DRAFT" },
      { status: "ARCHIVED" },
    ])).toEqual({ total: 5, matched: 4, active: 2, draft: 1, archived: 1, missing: 1 });
  });
});
