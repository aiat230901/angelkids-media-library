import Image from "next/image";
import Link from "next/link";

export function CategoryCard({ href, name, description, illustrationUrl, featured = false }: { href: string; name: string; description: string; illustrationUrl: string; featured?: boolean }) {
  return <Link className={`category-card ${featured ? "featured" : ""}`} href={href}>
    <span className="category-art"><Image src={illustrationUrl} alt="" fill sizes={featured ? "34vw" : "42vw"} /></span>
    <span className="category-copy"><strong>{name}</strong><span>{description}</span><span className="cta">Khám phá <span aria-hidden="true">→</span></span></span>
  </Link>;
}

