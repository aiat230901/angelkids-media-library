import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ResourceFormat } from "@/generated/prisma/client";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { VideoDetail } from "@/components/learning/VideoDetail";
import { getVideoResource } from "@/server/repositories/learning";

const scope = { categorySlug: "songs", formats: [ResourceFormat.LEARNING_SONG_VIDEO, ResourceFormat.SCHOOL_SONG_VIDEO] };
type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resource = await getVideoResource(scope, (await params).slug);
  return { title: resource?.assetName ?? "Không tìm thấy" };
}

export default async function SongDetail({ params }: Props) {
  const resource = await getVideoResource(scope, (await params).slug);
  if (!resource) notFound();
  return <main className="page-shell"><Breadcrumb items={[{ label: "Home", href: "/learning" }, { label: "Songs", href: "/learning/songs" }, { label: resource.assetName }]} /><VideoDetail resource={resource} backHref="/learning/songs" backLabel="Songs" /></main>;
}

