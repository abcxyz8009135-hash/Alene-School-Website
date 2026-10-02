"use client";

import { useParams } from "next/navigation";
import { ExternalLink } from "lucide-react";
import DeleteRecordButton from "@/components/admin/DeleteRecordButton";
import RecordNotFound from "@/components/admin/RecordNotFound";
import NewsForm from "@/components/admin/forms/NewsForm";
import { AdminPageHeader, ErrorState, LoadingState } from "@/components/admin/ui";
import { useAdminRecord } from "@/lib/admin/useAdminList";
import type { NewsArticle } from "@/lib/types";

export default function EditArticlePage() {
  const { id } = useParams<{ id: string }>();
  const { record, loading, error, reload, notFound } = useAdminRecord<NewsArticle>("/admin/news", "articles", id);

  return (
    <>
      <AdminPageHeader
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "News", href: "/admin/news" },
          { label: record?.title ?? "Edit article" },
        ]}
        title="Edit article"
        description={record ? `Last saved version of “${record.title}”.` : undefined}
        actions={
          record && (
            <a href={`/news/${record.slug}`} target="_blank" rel="noreferrer" className="btn-secondary btn-sm">
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
              View on website
            </a>
          )
        }
      />
      {error && <ErrorState message={error} onRetry={reload} />}
      {loading && <LoadingState />}
      {notFound && <RecordNotFound noun="article" backHref="/admin/news" />}
      {record && (
        <NewsForm
          key={record.id}
          article={record}
          extraActions={
            <DeleteRecordButton
              endpoint={`/admin/news/${record.id}`}
              redirectTo="/admin/news"
              name={`“${record.title}”`}
              noun="article"
            />
          }
        />
      )}
    </>
  );
}
