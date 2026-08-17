export function diffResource(
  current: Record<string, unknown>,
  existing?: Record<string, unknown>,
): { action: "CREATE" | "UPDATE" | "UNCHANGED"; fields: string[] } {
  if (!existing) return { action: "CREATE", fields: [] };
  const fields = Object.keys(current).filter((key) => {
    const left = key === "levelCodes" && Array.isArray(current[key]) ? [...current[key]].sort() : current[key];
    const right = key === "levelCodes" && Array.isArray(existing[key]) ? [...existing[key]].sort() : existing[key];
    return JSON.stringify(left) !== JSON.stringify(right);
  });
  return { action: fields.length ? "UPDATE" : "UNCHANGED", fields };
}

