import Link from "next/link";
import { getLevelDisplayName } from "@/domain/level-display";
import type { PublicResource } from "@/domain/public-resource";
import { toYouTubeEmbedUrl } from "@/server/providers/urls";

export function VideoDetail({ resource, backHref, backLabel }: { resource: PublicResource; backHref: string; backLabel: string }) {
  return <section className="video-layout">
    <div className="video-frame"><iframe src={toYouTubeEmbedUrl(resource.externalUrl)} title={resource.assetName} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen /></div>
    <aside className="detail-panel"><p className="eyebrow">Video học tập</p><h1>{resource.assetName}</h1><div className="detail-list">
      <div className="detail-item"><small>Độ tuổi</small><strong>{resource.levels.map(getLevelDisplayName).join(", ")}</strong></div>
      {resource.curriculumUnit && <div className="detail-item"><small>Curriculum Unit</small><strong>{resource.curriculumUnit.displayLabel}</strong></div>}
    </div><div className="detail-actions"><Link className="back-link" href={backHref}>← Quay lại {backLabel}</Link></div></aside>
  </section>;
}
