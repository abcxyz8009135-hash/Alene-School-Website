"use client";

import ResultForm from "@/components/admin/forms/ResultForm";
import { AdminPageHeader } from "@/components/admin/ui";

export default function NewResultPage() {
  return (
    <>
      <AdminPageHeader
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Exam Results", href: "/admin/results" },
          { label: "Add result" },
        ]}
        title="Add exam result"
        description="The student can look this up immediately on the Exam Results page."
      />
      <ResultForm />
    </>
  );
}
