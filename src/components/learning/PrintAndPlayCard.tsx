import Image from "next/image";
import type { PublicResource } from "@/domain/public-resource";

export function PrintAndPlayCard({ resource, hideDescriptionOnMobile = false }: { resource: Pick<PublicResource, "assetName" | "description" | "externalUrl" | "thumbnailUrl" | "altText" | "curriculumUnit">; hideDescriptionOnMobile?: boolean }) {
  const unit = resource.curriculumUnit!;
  return <a className={`unit-card${hideDescriptionOnMobile ? " hide-description-on-mobile" : ""}`} href={resource.externalUrl} target="_blank" rel="noopener noreferrer" aria-label={`Xem học liệu ${unit.displayLabel}`}>
    <span className="unit-art"><Image src={resource.thumbnailUrl} alt={resource.altText} fill sizes="(max-width: 980px) 100vw, 42vw" unoptimized /></span>
    <span className="unit-copy"><span className="badge">Tháng {unit.monthNumber}</span><strong>{resource.assetName}</strong><span className="unit-description">{resource.description ?? unit.displayLabel}</span><span className="cta">Play →</span></span>
  </a>;
}
