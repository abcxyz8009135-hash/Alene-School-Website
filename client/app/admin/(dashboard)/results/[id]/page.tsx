"use client";

import { useParams } from "next/navigation";
import DeleteRecordButton from "@/components/admin/DeleteRecordButton";
import RecordNotFound from "@/components/admin/RecordNotFound";
import ResultForm from "@/components/admin/forms/ResultForm";
import { AdminPageHeader, ErrorState, LoadingState } from "@/components/admin/ui";
import { useAdminRecord } from "@/lib/admin/useAdminList";
import type { ExamResult } from "@/lib/types";

export default function EditResultPage() {
  const { id } = useParams<{ id: string }>();
  const { record, loading, error, reload, notFound } = useAdminRecord<ExamResult & { id: string }>(
    "/admin/results",
    "results",
    id
  );

  return (
    <>
      <AdminPageHeader
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Exam Results", href: "/admin/results" },
          { label: record?.registrationId ?? "Edit result" },
        ]}
        title="Edit exam result"
      />
      {error && <ErrorState message={error} onRetry={reload} />}
      {loading && <LoadingState />}
      {notFound && <RecordNotFound noun="result" backHref="/admin/results" />}
      {record && (
        <ResultForm
          key={record.id}
          result={record}
          extraActions={
            <DeleteRecordButton
              endpoint={`/admin/results/${record.id}`}
              redirectTo="/admin/results"
              name={`${record.studentName} (${record.registrationId})`}
              noun="result"
            />
          }
        />
      )}
    </>
  );
}
