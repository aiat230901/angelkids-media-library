const AGE_RANGES: Record<string, string> = {
  L3: "3–4 tuổi",
  L4: "4–5 tuổi",
  L5: "5–6 tuổi",
};

export function getLevelDisplayName(level: { code: string; name: string }) {
  return AGE_RANGES[level.code] ?? level.name;
}
