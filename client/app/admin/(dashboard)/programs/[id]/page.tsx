"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Award, ExternalLink } from "lucide-react";
import DeleteRecordButton from "@/components/admin/DeleteRecordButton";
import RecordNotFound from "@/components/admin/RecordNotFound";
import ProgramForm from "@/components/admin/forms/ProgramForm";
import { AdminPageHeader, ErrorState, LoadingState } from "@/components/admin/ui";
import type { AdminProgram } from "@/lib/admin/types";
import { useAdminRecord } from "@/lib/admin/useAdminList";
import { CATEGORY_ROUTE } from "@/lib/constants";

export default function EditProgramPage() {
  const { id } = useParams<{ id: string }>();
  const { record, loading, error, reload, notFound } = useAdminRecord<AdminProgram>("/admin/programs", "programs", id);

  return (
    <>
      <AdminPageHeader
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Programs", href: "/admin/programs" },
          { label: record?.title ?? "Edit program" },
        ]}
        title="Edit program"
        actions={
          record && (
            <>
              <Link href={`/admin/achievements?program=${record.slug}`} className="btn-secondary btn-sm">
                <Award className="h-4 w-4" aria-hidden="true" />
                Achievements
              </Link>
              <a
                href={`${CATEGORY_ROUTE[record.category]}/${record.slug}`}
                target="_blank"
                rel="noreferrer"
                className="btn-secondary btn-sm"
              >
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
                View on website
              </a>
            </>
          )
        }
      />
      {error && <ErrorState message={error} onRetry={reload} />}
      {loading && <LoadingState />}
      {notFound && <RecordNotFound noun="program" backHref="/admin/programs" />}
      {record && (
        <ProgramForm
          key={record.id}
          program={record}
          extraActions={
            <DeleteRecordButton
              endpoint={`/admin/programs/${record.id}`}
              redirectTo="/admin/programs"
              name={`“${record.title}”`}
              noun="program"
            />
          }
        />
      )}
    </>
  );
}
