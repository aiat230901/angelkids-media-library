import type { PublicCurriculumUnit, PublicLevel, PublicResource } from "./public-resource";

export type ResourceFilterState = { levelCode: string; query: string; curriculumUnitId: string };

export function filterResources(resources: PublicResource[], filters: ResourceFilterState): PublicResource[] {
  const query = filters.query.trim().toLocaleLowerCase("vi");
  return resources.filter((resource) =>
    (!filters.levelCode || resource.levels.some((level) => level.code === filters.levelCode))
    && (!query || resource.assetName.toLocaleLowerCase("vi").includes(query))
    && (!filters.curriculumUnitId || resource.curriculumUnit?.id === filters.curriculumUnitId),
  );
}

export function getFilterOptions(resources: PublicResource[]): { levels: PublicLevel[]; curriculumUnits: PublicCurriculumUnit[] } {
  const levels = new Map<string, PublicLevel>();
  const units = new Map<string, PublicCurriculumUnit>();
  for (const resource of resources) {
    for (const level of resource.levels) levels.set(level.code, level);
    if (resource.curriculumUnit) units.set(resource.curriculumUnit.id, resource.curriculumUnit);
  }
  return {
    levels: [...levels.values()].sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name)),
    curriculumUnits: [...units.values()].sort((a, b) => a.sortOrder - b.sortOrder || a.displayLabel.localeCompare(b.displayLabel)),
  };
}

