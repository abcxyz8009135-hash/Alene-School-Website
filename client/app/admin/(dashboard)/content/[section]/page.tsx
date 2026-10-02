"use client";

import { useParams } from "next/navigation";
import RecordNotFound from "@/components/admin/RecordNotFound";
import SiteContentEditor from "@/components/admin/SiteContentEditor";
import { getSiteContentPage } from "@/lib/admin/siteContent";

export default function SiteContentPage() {
  const { section } = useParams<{ section: string }>();
  const page = getSiteContentPage(section);
  if (!page) return <RecordNotFound noun="content section" backHref="/admin/content/homepage" />;
  return <SiteContentEditor key={page.slug} page={page} />;
}
