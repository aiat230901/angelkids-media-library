import Image from "next/image";
import type { PublicResource } from "@/domain/public-resource";

export function PrintAndPlayCard({ resource }: { resource: PublicResource }) {
  const unit = resource.curriculumUnit!;
  return <a className="unit-card" href={resource.externalUrl} target="_blank" rel="noopener noreferrer" aria-label={`Xem học liệu ${unit.displayLabel}`}>
    <span className="unit-art"><Image src={resource.thumbnailUrl} alt={resource.altText} fill sizes="(max-width: 720px) 100vw, 33vw" unoptimized /><strong className="month-mark">{unit.monthNumber}</strong></span>
    <span className="unit-copy"><span className="badge">Tháng {unit.monthNumber}</span><strong>{unit.displayLabel.replace(/^\d{2}\s*-\s*/, "")}</strong>{resource.description && <span>{resource.description}</span>}<span className="cta">Xem học liệu →</span></span>
  </a>;
}

