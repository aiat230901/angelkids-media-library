import type { Metadata } from "next";
import { CategoryCard } from "@/components/learning/CategoryCard";
import { PageHero } from "@/components/learning/PageHero";
import { getCategoryPath } from "@/config/learning-routes";
import { listCategories } from "@/server/repositories/learning";

export const metadata: Metadata = { title: "Learning Hub", description: "Chọn hoạt động học tập tại Angel Kids." };

export default async function LearningPage() {
  const categories = await listCategories();
  return <main className="page-shell"><PageHero eyebrow="Angel Kids Learning Hub" title="Hôm nay con muốn khám phá gì?" lead="Một không gian học liệu vui tươi để con xem, đọc, nghe và ôn tập mỗi ngày." />
    <div className="section-head"><div><h2>Góc học tập của con</h2><p>Chọn một hoạt động để bắt đầu.</p></div></div>
    <section className="category-grid" aria-label="Danh mục học liệu">{categories.map((category) => <CategoryCard key={category.id} href={getCategoryPath(category.slug)} name={category.name} description={category.description} illustrationUrl={category.illustrationUrl} featured={category.slug === "print-and-plays"} />)}</section>
  </main>;
}
