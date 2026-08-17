import type { ResourceFormat } from "@/generated/prisma/client";
import { listResources } from "@/server/repositories/learning";
import { Breadcrumb, type Crumb } from "@/components/ui/Breadcrumb";
import { ResourceListing } from "./ResourceListing.client";

export async function ListingPage({ title, lead, breadcrumbs, categorySlug, contentTypeSlug, formats, detailBasePath }: {
  title: string; lead: string; breadcrumbs: Crumb[]; categorySlug: string; contentTypeSlug?: string; formats: ResourceFormat[]; detailBasePath?: string;
}) {
  const resources = await listResources({ categorySlug, contentTypeSlug, formats });
  return <main className="page-shell"><Breadcrumb items={breadcrumbs} /><header className="page-heading"><h1>{title}</h1><p>{lead}</p></header><ResourceListing resources={resources} detailBasePath={detailBasePath} /></main>;
}

