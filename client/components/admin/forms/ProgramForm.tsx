"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import ImageField from "@/components/admin/ImageField";
import { useToast } from "@/components/admin/Toast";
import { ErrorState, Field, FormActions, FormSection } from "@/components/admin/ui";
import { adminFetch } from "@/lib/adminApi";
import { errorMessage, slugify } from "@/lib/admin/format";
import type { AdminProgram } from "@/lib/admin/types";
import type { ProgramCategory } from "@/lib/types";

interface ProgramFormProps {
  program?: AdminProgram;
  extraActions?: React.ReactNode;
}

export default function ProgramForm({ program, extraActions }: ProgramFormProps) {
  const router = useRouter();
  const toast = useToast();
  const editing = Boolean(program);

  const [form, setForm] = useState({
    title: program?.title ?? "",
    slug: program?.slug ?? "",
    category: (program?.category ?? "stem-center") as ProgramCategory,
    summary: program?.summary ?? "",
    description: program?.description ?? "",
    highlights: program?.curriculumHighlights.join("\n") ?? "",
    imageUrl: program?.imageUrl ?? "",
    establishedYear: program?.establishedYear ?? new Date().getFullYear(),
  });
  const [slugTouched, setSlugTouched] = useState(editing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const payload = {
      slug: form.slug,
      category: form.category,
      title: form.title,
      imageUrl: form.imageUrl,
      summary: form.summary,
      description: form.description,
      curriculumHighlights: form.highlights
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean),
      establishedYear: form.establishedYear,
    };
    try {
      await adminFetch(editing ? `/admin/programs/${program!.id}` : "/admin/programs", {
        method: editing ? "PUT" : "POST",
        body: JSON.stringify(payload),
      });
      toast.success(editing ? "Program saved." : "Program created.");
      router.push("/admin/programs");
    } catch (err) {
      setError(errorMessage(err, "Failed to save program."));
      setSaving(false);
    }
  }

  const publicPath = `${form.category === "stem-center" ? "/stem-center" : "/community"}/${form.slug || "program"}`;

  return (
    <form onSubmit={handleSubmit}>
      {error && <ErrorState message={error} />}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <FormSection title="Main information">
            <Field label="Program name" htmlFor="program-title">
              <input
                id="program-title"
                required
                minLength={2}
                value={form.title}
                onChange={(e) => {
                  const title = e.target.value;
                  setForm((f) => ({ ...f, title, slug: slugTouched ? f.slug : slugify(title) }));
                }}
                className="input-field"
              />
            </Field>
            <Field label="URL slug" htmlFor="program-slug" hint={`Shown at ${publicPath}`}>
              <input
                id="program-slug"
                required
                value={form.slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  set("slug", e.target.value);
                }}
                className="input-field font-mono text-xs"
              />
            </Field>
            <Field label="Summary" htmlFor="program-summary" hint="One sentence shown on program cards.">
              <textarea
                id="program-summary"
                required
                minLength={3}
                rows={2}
                value={form.summary}
                onChange={(e) => set("summary", e.target.value)}
                className="input-field resize-y"
              />
            </Field>
          </FormSection>

          <FormSection title="Content">
            <Field label="Description" htmlFor="program-description">
              <textarea
                id="program-description"
                required
                minLength={3}
                rows={6}
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                className="input-field resize-y"
              />
            </Field>
            <Field
              label="What students do"
              htmlFor="program-highlights"
              hint="One item per line. Shown as a numbered list on the program page."
            >
              <textarea
                id="program-highlights"
                required
                rows={5}
                value={form.highlights}
                onChange={(e) => set("highlights", e.target.value)}
                className="input-field resize-y"
              />
            </Field>
          </FormSection>
        </div>

        <div className="space-y-6">
          <FormSection title="Settings">
            <Field label="Section" htmlFor="program-category" hint="Which public page lists this program.">
              <select
                id="program-category"
                value={form.category}
                onChange={(e) => set("category", e.target.value as ProgramCategory)}
                className="input-field"
              >
                <option value="stem-center">STEM</option>
                <option value="hobbies">Community &amp; clubs</option>
              </select>
            </Field>
            <Field label="Year established" htmlFor="program-year">
              <input
                id="program-year"
                required
                type="number"
                min={1900}
                max={2100}
                value={form.establishedYear}
                onChange={(e) => set("establishedYear", Number(e.target.value))}
                className="input-field"
              />
            </Field>
          </FormSection>

          <FormSection title="Media">
            <ImageField
              id="program-image"
              label="Program photo"
              required
              value={form.imageUrl}
              onChange={(url) => set("imageUrl", url)}
            />
          </FormSection>
        </div>
      </div>

      <FormActions
        cancelHref="/admin/programs"
        saving={saving}
        submitLabel={editing ? "Save changes" : "Create program"}
        extra={extraActions}
      />
    </form>
  );
}
