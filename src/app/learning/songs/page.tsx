import type { Metadata } from "next";
import { ResourceFormat } from "@/generated/prisma/client";
import { ListingPage } from "@/components/learning/ListingPage";

export const metadata: Metadata = { title: "Songs & Poems" };

export default function SongsPage() {
  return <ListingPage title="Songs & Poems" lead="Cùng hát, vận động và học tiếng Anh qua những giai điệu vui." categorySlug="songs" formats={[ResourceFormat.LEARNING_SONG_VIDEO, ResourceFormat.SCHOOL_SONG_VIDEO]} detailBasePath="/learning/songs" breadcrumbs={[{ label: "Home", href: "/learning" }, { label: "Songs & Poems" }]} />;
}
