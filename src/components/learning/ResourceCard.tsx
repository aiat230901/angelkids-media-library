import Image from "next/image";
import Link from "next/link";
import { Play } from "lucide-react";
import type { PublicResource } from "@/domain/public-resource";

const VIDEO_FORMATS = new Set([
  "ANIMATED_STORY_VIDEO", "ANIMATED_DIALOGUE_VIDEO", "LEARNING_SONG_VIDEO", "SCHOOL_SONG_VIDEO",
]);

type Props = { resource: PublicResource; href?: string; onOpen?: () => void };

export function ResourceCard({ resource, href, onOpen }: Props) {
  const isVideo = VIDEO_FORMATS.has(resource.resourceFormat);
  const isPortrait = resource.resourceFormat === "DIGITAL_FLASHCARD_SET";
  const isFlashcard = resource.resourceFormat === "DIGITAL_FLASHCARD_SET";
  const content = (
    <>
      <span className={`resource-thumb ${isPortrait ? "portrait" : "landscape"}`}>
        <Image src={resource.thumbnailUrl} alt={resource.altText} fill sizes={isPortrait ? "(max-width: 720px) 50vw, 25vw" : "(max-width: 720px) 100vw, 25vw"} unoptimized />
        {isVideo && <span className="play-badge" aria-label="Phát video"><Play aria-hidden="true" size={20} fill="currentColor" /></span>}
      </span>
      <span className="resource-copy">
        <span className="meta-row">
          {resource.levels.map((level) => <span className="badge" key={level.code}>{level.name}</span>)}
          {resource.curriculumUnit && <span className="badge unit">Tháng {resource.curriculumUnit.monthNumber}</span>}
        </span>
        <span className="resource-title">{resource.assetName}</span>
        {resource.curriculumUnit && <span className="resource-unit">{resource.curriculumUnit.displayLabel}</span>}
        {isFlashcard && <span className="resource-cta">Mở flashcards</span>}
      </span>
    </>
  );

  if (isVideo && href) return <Link className="resource-card" href={href} aria-label={resource.assetName}>{content}</Link>;
  return <button className="resource-card resource-button" type="button" onClick={onOpen} aria-label={`Mở ${resource.assetName}`}>{content}</button>;
}
