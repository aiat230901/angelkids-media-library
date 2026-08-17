import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ListingPage } from "@/components/learning/ListingPage";
import { READ_LISTINGS } from "@/config/learning-routes";

type Props = { params: Promise<{ contentType: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { contentType } = await params;
  return { title: READ_LISTINGS[contentType as keyof typeof READ_LISTINGS]?.title ?? "Không tìm thấy" };
}

export default async function ReadListing({ params }: Props) {
  const { contentType } = await params;
  const listing = READ_LISTINGS[contentType as keyof typeof READ_LISTINGS];
  if (!listing) notFound();
  return <ListingPage title={listing.title} lead={listing.lead} categorySlug="read" contentTypeSlug={contentType} formats={[listing.format]} breadcrumbs={[{ label: "Home", href: "/learning" }, { label: "Read", href: "/learning/read" }, { label: listing.title }]} />;
}

