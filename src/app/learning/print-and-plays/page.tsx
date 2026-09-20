import type { Metadata } from "next";
import { ResourceFormat } from "@/generated/prisma/client";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { PageHero } from "@/components/learning/PageHero";
import { PrintAndPlayCard } from "@/components/learning/PrintAndPlayCard";
import { listResources } from "@/server/repositories/learning";

export const metadata: Metadata = { title: "Print and Play" };

export default async function PrintAndPlaysPage() {
  const resources = await listResources({ categorySlug: "print-and-plays", formats: [ResourceFormat.PRINT_AND_PLAY_COLLECTION] });
  return <main className="page-shell"><Breadcrumb items={[{ label: "Home", href: "/learning" }, { label: "Print and Play" }]} /><PageHero eyebrow="Print · Play · Learn" title="Print and Plays" lead="Chọn chủ đề để tải, in và cùng con học qua những hoạt động vui." /><div className="section-head"><div><h2>Học liệu theo chủ đề</h2><p>Mỗi bộ gồm những tài liệu phù hợp với Curriculum Unit.</p></div></div>{resources.length ? <section className="unit-grid">{resources.map((resource) => <PrintAndPlayCard key={resource.slug} resource={resource} />)}</section> : <div className="empty-state"><h2>Chưa có học liệu</h2><p>Nhà trường đang chuẩn bị học liệu cho mục này.</p></div>}</main>;
}

