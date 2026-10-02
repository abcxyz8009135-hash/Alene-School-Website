"use client";

import NewsForm from "@/components/admin/forms/NewsForm";
import { AdminPageHeader } from "@/components/admin/ui";

export default function NewArticlePage() {
  return (
    <>
      <AdminPageHeader
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "News", href: "/admin/news" },
          { label: "New article" },
        ]}
        title="New article"
        description="Write an announcement or story for the News page."
      />
      <NewsForm />
    </>
  );
}
