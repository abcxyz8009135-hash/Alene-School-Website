"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/admin/Toast";
import { EmptyState, ErrorState, Field, FormActions, FormSection, LoadingState } from "@/components/admin/ui";
import { adminFetch } from "@/lib/adminApi";
import { errorMessage } from "@/lib/admin/format";
import { PROGRAM_CATEGORY_LABEL } from "@/lib/admin/nav";
import type { AdminProgram } from "@/lib/admin/types";
import { useAdminList } from "@/lib/admin/useAdminList";
import type { ProgramAchievement } from "@/lib/types";

interface AchievementFormProps {
  achievement?: ProgramAchievement;
  defaultProgramSlug?: string;
  extraActions?: React.ReactNode;
}

export default function AchievementForm({ achievement, defaultProgramSlug, extraActions }: AchievementFormProps) {
  const programs = useAdminList<AdminProgram>("/admin/programs", "programs");

  if (programs.loading) return <LoadingState label="Loading programs…" />;
  if (programs.error) return <ErrorState message={programs.error} onRetry={programs.reload} />;
  if (programs.items.length === 0 && !achievement) {
    return (
      <div className="card py-14">
        <EmptyState
          title="Add a program first"
          description="Every achievement belongs to a program. Create one, then come back here."
          action={
            <Link href="/admin/programs/new" className="btn-primary btn-sm">
              New program
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <AchievementFormFields
      achievement={achievement}
      programs={programs.items}
      defaultProgramSlug={defaultProgramSlug}
      extraActions={extraActions}
    />
  );
}

function AchievementFormFields({
  achievement,
  programs,
  defaultProgramSlug,
  extraActions,
}: AchievementFormProps & { programs: AdminProgram[] }) {
  const router = useRouter();
  const toast = useToast();
  const editing = Boolean(achievement);

  const initialProgram =
    programs.find((p) => p.slug === (achievement?.programSlug ?? defaultProgramSlug)) ?? programs[0];

  const [form, setForm] = useState({
    programSlug: achievement?.programSlug ?? initialProgram?.slug ?? "",
    category: achievement?.category ?? initialProgram?.category ?? "stem-center",
    title: achievement?.title ?? "",
    description: achievement?.description ?? "",
    year: achievement?.year ?? new Date().getFullYear(),
    metricLabel: achievement?.metricLabel ?? "",
    metricValue: achievement?.metricValue ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleProgramChange(slug: string) {
    const program = programs.find((p) => p.slug === slug);
    setForm((f) => ({ ...f, programSlug: slug, category: program?.category ?? f.category }));
  }

  // Keep an achievement's existing program selectable even if that program
  // only exists in the website's built-in defaults.
  const options = programs.some((p) => p.slug === form.programSlug)
    ? programs
    : [{ slug: form.programSlug, title: form.programSlug, category: form.category } as AdminProgram, ...programs];

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const payload = { ...form, metricLabel: form.metricLabel || null, metricValue: form.metricValue || null };
    try {
      await adminFetch(editing ? `/admin/achievements/${achievement!.id}` : "/admin/achievements", {
        method: editing ? "PUT" : "POST",
        body: JSON.stringify(payload),
      });
      toast.success(editing ? "Achievement saved." : "Achievement added.");
      router.push("/admin/achievements");
    } catch (err) {
      setError(errorMessage(err, "Failed to save achievement."));
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && <ErrorState message={error} />}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <FormSection title="Main information">
            <Field label="Achievement" htmlFor="ach-title" hint="e.g. “Regional Science Fair — Best Research Award”">
              <input
                id="ach-title"
                required
                minLength={3}
                value={form.title}
                onChange={(e) => set("title", e.target.value)}
                className="input-field"
              />
            </Field>
            <Field label="Description" htmlFor="ach-description">
              <textarea
                id="ach-description"
                required
                minLength={3}
                rows={4}
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                className="input-field resize-y"
              />
            </Field>
          </FormSection>

          <FormSection
            title="Highlight figure"
            description="Optional. Shown as a large number next to the achievement, e.g. “18 schools competed against”."
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Value" htmlFor="ach-metric-value">
                <input
                  id="ach-metric-value"
                  value={form.metricValue}
                  onChange={(e) => set("metricValue", e.target.value)}
                  className="input-field"
                  placeholder="18"
                />
              </Field>
              <Field label="Label" htmlFor="ach-metric-label">
                <input
                  id="ach-metric-label"
                  value={form.metricLabel}
                  onChange={(e) => set("metricLabel", e.target.value)}
                  className="input-field"
                  placeholder="Schools competed against"
                />
              </Field>
            </div>
          </FormSection>
        </div>

        <div className="space-y-6">
          <FormSection title="Settings">
            <Field label="Program" htmlFor="ach-program">
              <select
                id="ach-program"
                value={form.programSlug}
                onChange={(e) => handleProgramChange(e.target.value)}
                className="input-field"
              >
                {options.map((p) => (
                  <option key={p.slug} value={p.slug}>
                    {p.title} ({PROGRAM_CATEGORY_LABEL[p.category]})
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Year" htmlFor="ach-year">
              <input
                id="ach-year"
                required
                type="number"
                min={2000}
                max={2100}
                value={form.year}
                onChange={(e) => set("year", Number(e.target.value))}
                className="input-field"
              />
            </Field>
          </FormSection>
        </div>
      </div>

      <FormActions
        cancelHref="/admin/achievements"
        saving={saving}
        submitLabel={editing ? "Save changes" : "Add achievement"}
        extra={extraActions}
      />
    </form>
  );
}
