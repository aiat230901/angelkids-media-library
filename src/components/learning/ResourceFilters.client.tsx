"use client";

import type { PublicCurriculumUnit, PublicLevel } from "@/domain/public-resource";
import type { ResourceFilterState } from "@/domain/resource-filters";

type Props = {
  value: ResourceFilterState;
  levels: PublicLevel[];
  curriculumUnits: PublicCurriculumUnit[];
  onChange: (value: ResourceFilterState) => void;
  onReset: () => void;
  showNameFilter?: boolean;
};

export function ResourceFilters({ value, levels, curriculumUnits, onChange, onReset, showNameFilter = true }: Props) {
  return (
    <div className={`filters${showNameFilter ? "" : " compact"}`} role="search" aria-label="Bộ lọc học liệu">
      {levels.length > 0 && <label className="field">Level
        <select value={value.levelCode} onChange={(event) => onChange({ ...value, levelCode: event.target.value })}>
          <option value="">Tất cả Level</option>
          {levels.map((level) => <option key={level.code} value={level.code}>{level.name}</option>)}
        </select>
      </label>}
      {showNameFilter && <label className="field">Tên học liệu
        <input type="search" value={value.query} placeholder="Tìm tên học liệu..." onChange={(event) => onChange({ ...value, query: event.target.value })} />
      </label>}
      {curriculumUnits.length > 0 && <label className="field">Curriculum Unit
        <select value={value.curriculumUnitId} onChange={(event) => onChange({ ...value, curriculumUnitId: event.target.value })}>
          <option value="">Tất cả Curriculum Unit</option>
          {curriculumUnits.map((unit) => <option key={unit.id} value={unit.id}>{unit.displayLabel}</option>)}
        </select>
      </label>}
      <button className="reset-button" type="button" onClick={onReset}>Đặt lại bộ lọc</button>
    </div>
  );
}
