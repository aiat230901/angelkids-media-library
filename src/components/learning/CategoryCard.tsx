import Image from "next/image";
import Link from "next/link";

export function CategoryCard({ href, name, description, illustrationUrl, featured = false, hideDescriptionOnMobile = false, fillMediaOnDesktop = false, squareMediaOnDesktop = false }: { href: string; name: string; description: string; illustrationUrl: string; featured?: boolean; hideDescriptionOnMobile?: boolean; fillMediaOnDesktop?: boolean; squareMediaOnDesktop?: boolean }) {
  return <Link className={`category-card ${featured ? "featured" : ""} ${hideDescriptionOnMobile ? "watch-natural-media watch-stack-on-tablet" : ""} ${fillMediaOnDesktop ? "fill-media-on-desktop" : ""} ${squareMediaOnDesktop ? "square-media-on-desktop" : ""}`} href={href}>
    <span className="category-art"><Image src={illustrationUrl} alt="" fill sizes={featured ? "34vw" : "42vw"} /></span>
    <span className="category-copy"><strong>{name}</strong><span className="category-description">{description}</span><span className="cta">Khám phá <span aria-hidden="true">→</span></span></span>
  </Link>;
}
