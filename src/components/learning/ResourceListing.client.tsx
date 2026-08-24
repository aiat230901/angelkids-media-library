"use client";

import { useRef, useState } from "react";
import type { PublicResource } from "@/domain/public-resource";
import { filterResources, getFilterOptions, type ResourceFilterState } from "@/domain/resource-filters";
import { FlipbookReader } from "./FlipbookReader.client";
import { ResourceCard } from "./ResourceCard";
import { ResourceFilters } from "./ResourceFilters.client";

const EMPTY_FILTERS: ResourceFilterState = { levelCode: "", query: "", curriculumUnitId: "" };

export function ResourceListing({ resources, detailBasePath, showNameFilter = true }: { resources: PublicResource[]; detailBasePath?: string; showNameFilter?: boolean }) {
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [readerResource, setReaderResource] = useState<PublicResource | null>(null);
  const opener = useRef<HTMLElement | null>(null);
  const options = getFilterOptions(resources);
  const visible = filterResources(resources, filters);

  function openReader(resource: PublicResource) {
    opener.current = document.activeElement as HTMLElement;
    setReaderResource(resource);
  }

  function closeReader() {
    setReaderResource(null);
    queueMicrotask(() => opener.current?.focus());
  }

  return (
    <>
      <ResourceFilters value={filters} levels={options.levels} curriculumUnits={options.curriculumUnits} onChange={setFilters} onReset={() => setFilters(EMPTY_FILTERS)} showNameFilter={showNameFilter} />
      <p className="resource-count" aria-live="polite">{visible.length} học liệu</p>
      {visible.length === 0 ? (
        <div className="empty-state"><h2>Không tìm thấy học liệu phù hợp</h2><p>Hãy thử thay đổi hoặc đặt lại bộ lọc.</p><button className="reset-button" type="button" onClick={() => setFilters(EMPTY_FILTERS)}>Đặt lại bộ lọc</button></div>
      ) : (
        <div className={`resource-grid ${visible.some((item) => item.resourceFormat === "DIGITAL_FLASHCARD_SET") ? "portrait-grid" : ""}`}>
          {visible.map((resource) => <ResourceCard key={resource.slug} resource={resource} href={detailBasePath ? `${detailBasePath}/${resource.slug}` : undefined} onOpen={() => openReader(resource)} />)}
        </div>
      )}
      {readerResource && <FlipbookReader title={readerResource.assetName} url={readerResource.externalUrl} open onClose={closeReader} />}
    </>
  );
}
