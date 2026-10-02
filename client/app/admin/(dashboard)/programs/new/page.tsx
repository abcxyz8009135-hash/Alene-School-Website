"use client";

import ProgramForm from "@/components/admin/forms/ProgramForm";
import { AdminPageHeader } from "@/components/admin/ui";

export default function NewProgramPage() {
  return (
    <>
      <AdminPageHeader
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Programs", href: "/admin/programs" },
          { label: "New program" },
        ]}
        title="New program"
        description="Add a STEM program or a community club. It gets its own page on the website."
      />
      <ProgramForm />
    </>
  );
}
