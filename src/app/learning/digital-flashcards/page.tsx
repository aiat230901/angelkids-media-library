import type { Metadata } from "next";
import { ResourceFormat } from "@/generated/prisma/client";
import { ListingPage } from "@/components/learning/ListingPage";

export const metadata: Metadata = { title: "Digital Flashcards" };

export default function FlashcardsPage() {
  return <ListingPage title="Digital Flashcards" lead="Nhìn hình, nghe từ và cùng con luyện tập." categorySlug="digital-flashcards" formats={[ResourceFormat.DIGITAL_FLASHCARD_SET]} breadcrumbs={[{ label: "Home", href: "/learning" }, { label: "Digital Flashcards" }]} showNameFilter={false} />;
}
