import type { Metadata } from "next";
import { ResourceFormat } from "@/generated/prisma/client";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { PageHero } from "@/components/learning/PageHero";
import { PrintAndPlayCard } from "@/components/learning/PrintAndPlayCard";
import { listResources } from "@/server/repositories/learning";

export const metadata: Metadata = { title: "Print and Play" };

export default async function PrintAndPlaysPage() {
  const resources = await listResources({ categorySlug: "print-and-plays", formats: [ResourceFormat.PRINT_AND_PLAY_COLLECTION] });
  return <main className="page-shell">
    <Breadcrumb items={[{ label: "Home", href: "/learning" }, { label: "Print and Play" }]} />
    <PageHero eyebrow="Print · Play · Learn" title="Print and Plays" lead="Chọn chủ đề để tải, in và cùng con học qua những hoạt động vui." />
    <div className="section-head"><div><h2>Học liệu theo chủ đề</h2><p>Mỗi bộ gồm những tài liệu phù hợp với Curriculum Unit.</p></div></div>
    <section className="unit-grid">
      {resources.map((resource) => <PrintAndPlayCard key={resource.slug} resource={resource} />)}
      <PrintAndPlayCard hideDescriptionOnMobile resource={{
        assetName: "Print and Play",
        description: "10 - Bản thân | Tôi khác biệt",
        externalUrl: "https://drive.google.com/drive/folders/1pJlinV0vYOMjNNYH5DUkkbR7AhdHLmRt?usp=sharing",
        thumbnailUrl: "/print-and-plays/10.png",
        altText: "Minh họa Print and Play tháng 10: Bản thân | Tôi khác biệt",
        curriculumUnit: { id: "10-ban-than", monthNumber: "10", displayLabel: "10 - Bản thân | Tôi khác biệt", sortOrder: 20 },
      }} />
    </section>
  </main>;
}

