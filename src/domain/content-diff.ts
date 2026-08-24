export type ResourceDiff = { action: "CREATE" | "UPDATE" | "UNCHANGED"; fields: string[] };

export type ResourceDiffSummary = {
  created: number;
  updated: number;
  unchanged: number;
  total: number;
};

export function diffResource(
  current: Record<string, unknown>,
  existing?: Record<string, unknown>,
): ResourceDiff {
  if (!existing) return { action: "CREATE", fields: [] };
  const fields = Object.keys(current).filter((key) => {
    const left = key === "levelCodes" && Array.isArray(current[key]) ? [...current[key]].sort() : current[key];
    const right = key === "levelCodes" && Array.isArray(existing[key]) ? [...existing[key]].sort() : existing[key];
    return JSON.stringify(left) !== JSON.stringify(right);
  });
  return { action: fields.length ? "UPDATE" : "UNCHANGED", fields };
}

export function summarizeResourceDiffs(diffs: Array<Pick<ResourceDiff, "action">>): ResourceDiffSummary {
  const summary = { created: 0, updated: 0, unchanged: 0, total: diffs.length };
  for (const { action } of diffs) {
    if (action === "CREATE") summary.created += 1;
    else if (action === "UPDATE") summary.updated += 1;
    else summary.unchanged += 1;
  }
  return summary;
}

export function formatResourceDiffSummary(summary: ResourceDiffSummary): string {
  return `created=${summary.created}, updated=${summary.updated}, unchanged=${summary.unchanged}, total=${summary.total}`;
}
