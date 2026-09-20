import type { Metadata } from "next";
import { CategoryCard } from "@/components/learning/CategoryCard";
import { PageHero } from "@/components/learning/PageHero";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { getContentTypePath } from "@/config/learning-routes";
import { listContentTypes } from "@/server/repositories/learning";

export const metadata: Metadata = { title: "Watch" };

export default async function WatchPage() {
  const types = await listContentTypes("watch");
  return <main className="page-shell"><Breadcrumb items={[{ label: "Home", href: "/learning" }, { label: "Watch" }]} /><PageHero eyebrow="Watch" title="Xem và khám phá" lead="Cùng con lắng nghe tiếng Anh qua những câu chuyện và hội thoại sinh động." /><section className="choice-grid">{types.map((item) => <CategoryCard key={item.id} href={getContentTypePath("watch", item.slug)} name={item.name} description={item.description} illustrationUrl={item.illustrationUrl} hideDescriptionOnMobile squareMediaOnDesktop fillMediaOnDesktop={item.slug === "virtual-teacher-guide"} />)}</section></main>;
}
