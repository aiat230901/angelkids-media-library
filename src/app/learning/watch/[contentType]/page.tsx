import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ListingPage } from "@/components/learning/ListingPage";
import { WATCH_LISTINGS } from "@/config/learning-routes";

type Props = { params: Promise<{ contentType: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { contentType } = await params;
  return { title: WATCH_LISTINGS[contentType as keyof typeof WATCH_LISTINGS]?.title ?? "Không tìm thấy" };
}

export default async function WatchListing({ params }: Props) {
  const { contentType } = await params;
  const listing = WATCH_LISTINGS[contentType as keyof typeof WATCH_LISTINGS];
  if (!listing) notFound();
  const basePath = `/learning/watch/${contentType}`;
  return <ListingPage title={listing.title} lead={listing.lead} categorySlug="watch" contentTypeSlug={contentType} formats={[listing.format]} detailBasePath={basePath} breadcrumbs={[{ label: "Home", href: "/learning" }, { label: "Watch", href: "/learning/watch" }, { label: listing.title }]} />;
}

