import type { Metadata } from "next";
import { CategoryCard } from "@/components/learning/CategoryCard";
import { PageHero } from "@/components/learning/PageHero";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { getContentTypePath } from "@/config/learning-routes";
import { listContentTypes } from "@/server/repositories/learning";

export const metadata: Metadata = { title: "Read" };

export default async function ReadPage() {
  const types = await listContentTypes("read");
  return <main className="page-shell"><Breadcrumb items={[{ label: "Home", href: "/learning" }, { label: "Read" }]} /><PageHero eyebrow="Read" title="Lật mở từng trang sách" lead="Đọc, nghe và khám phá những câu chuyện tiếng Anh thú vị cùng con." /><section className="choice-grid">{types.map((item) => <CategoryCard key={item.id} href={getContentTypePath("read", item.slug)} name={item.name} description={item.description} illustrationUrl={item.illustrationUrl} hideDescriptionOnMobile squareMediaOnDesktop />)}</section></main>;
}
