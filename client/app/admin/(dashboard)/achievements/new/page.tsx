"use client";

import { useEffect, useState } from "react";
import AchievementForm from "@/components/admin/forms/AchievementForm";
import { AdminPageHeader } from "@/components/admin/ui";

export default function NewAchievementPage() {
  // Pre-select a program when arriving from a program's page (?program=slug).
  const [programSlug, setProgramSlug] = useState<string | undefined>();
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setProgramSlug(new URLSearchParams(window.location.search).get("program") ?? undefined);
    setReady(true);
  }, []);

  return (
    <>
      <AdminPageHeader
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Achievements", href: "/admin/achievements" },
          { label: "New achievement" },
        ]}
        title="New achievement"
        description="Record a student result for one of the programs."
      />
      {ready && <AchievementForm defaultProgramSlug={programSlug} />}
    </>
  );
}
