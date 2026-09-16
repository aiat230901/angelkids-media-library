import Image from "next/image";
import type { PublicResource } from "@/domain/public-resource";

export function PrintAndPlayCard({ resource }: { resource: PublicResource }) {
  const unit = resource.curriculumUnit!;
  return <a className="unit-card" href={resource.externalUrl} target="_blank" rel="noopener noreferrer" aria-label={`Xem học liệu ${unit.displayLabel}`}>
    <span className="unit-art"><Image src={resource.thumbnailUrl} alt={resource.altText} fill sizes="(max-width: 980px) 100vw, 42vw" unoptimized /></span>
    <span className="unit-copy"><span className="badge">Tháng {unit.monthNumber}</span><strong>{resource.assetName}</strong><span>{resource.description ?? unit.displayLabel}</span><span className="cta">Play →</span></span>
  </a>;
}
