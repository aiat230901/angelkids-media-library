import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { VideoDetail } from "@/components/learning/VideoDetail";
import { WATCH_LISTINGS } from "@/config/learning-routes";
import { getVideoResource } from "@/server/repositories/learning";

type Props = { params: Promise<{ contentType: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { contentType, slug } = await params;
  const listing = WATCH_LISTINGS[contentType as keyof typeof WATCH_LISTINGS];
  if (!listing) return { title: "Không tìm thấy" };
  const resource = await getVideoResource({ categorySlug: "watch", contentTypeSlug: contentType, formats: [listing.format] }, slug);
  return { title: resource?.assetName ?? "Không tìm thấy" };
}

export default async function WatchVideoDetail({ params }: Props) {
  const { contentType, slug } = await params;
  const listing = WATCH_LISTINGS[contentType as keyof typeof WATCH_LISTINGS];
  if (!listing) notFound();
  const resource = await getVideoResource({ categorySlug: "watch", contentTypeSlug: contentType, formats: [listing.format] }, slug);
  if (!resource) notFound();
  const backHref = `/learning/watch/${contentType}`;
  return <main className="page-shell"><Breadcrumb items={[{ label: "Home", href: "/learning" }, { label: "Watch", href: "/learning/watch" }, { label: listing.title, href: backHref }, { label: resource.assetName }]} /><VideoDetail resource={resource} backHref={backHref} backLabel={listing.title} /></main>;
}

