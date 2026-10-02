"use client";

import { useParams } from "next/navigation";
import DeleteRecordButton from "@/components/admin/DeleteRecordButton";
import RecordNotFound from "@/components/admin/RecordNotFound";
import AchievementForm from "@/components/admin/forms/AchievementForm";
import { AdminPageHeader, ErrorState, LoadingState } from "@/components/admin/ui";
import { useAdminRecord } from "@/lib/admin/useAdminList";
import type { ProgramAchievement } from "@/lib/types";

export default function EditAchievementPage() {
  const { id } = useParams<{ id: string }>();
  const { record, loading, error, reload, notFound } = useAdminRecord<ProgramAchievement>(
    "/admin/achievements",
    "achievements",
    id
  );

  return (
    <>
      <AdminPageHeader
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Achievements", href: "/admin/achievements" },
          { label: record?.title ?? "Edit achievement" },
        ]}
        title="Edit achievement"
      />
      {error && <ErrorState message={error} onRetry={reload} />}
      {loading && <LoadingState />}
      {notFound && <RecordNotFound noun="achievement" backHref="/admin/achievements" />}
      {record && (
        <AchievementForm
          key={record.id}
          achievement={record}
          extraActions={
            <DeleteRecordButton
              endpoint={`/admin/achievements/${record.id}`}
              redirectTo="/admin/achievements"
              name={`“${record.title}”`}
              noun="achievement"
            />
          }
        />
      )}
    </>
  );
}
