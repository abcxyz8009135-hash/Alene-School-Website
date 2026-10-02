"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Check, ExternalLink, Loader2, RotateCcw } from "lucide-react";
import ImageField from "./ImageField";
import ListEditor, { type ProgramOption } from "./ListEditor";
import { useToast } from "./Toast";
import { AdminPageHeader, ErrorState, FormSection, LoadingState, StatusBadge, type Crumb } from "./ui";
import { adminFetch } from "@/lib/adminApi";
import { errorMessage } from "@/lib/admin/format";
import {
  SITE_CONTENT_PAGES,
  type SettingField,
  type SettingGroup,
  type SiteContentPage,
} from "@/lib/admin/siteContent";

const ALL_FIELDS = SITE_CONTENT_PAGES.flatMap((p) => p.groups.flatMap((g) => g.fields));

/** Stored map → editing values: registry fields show their default when unset. */
function toEditValues(stored: Record<string, string>) {
  const values: Record<string, string> = { ...stored };
  for (const f of ALL_FIELDS) {
    if (f.defaultValue !== undefined && !stored[f.key]?.trim()) values[f.key] = f.defaultValue;
  }
  return values;
}

/** Editing value → stored value: unchanged defaults are stored as "" so future default updates apply. */
function toStored(field: SettingField, value: string) {
  if (field.defaultValue !== undefined && value === field.defaultValue) return "";
  return value;
}

function SectionTabs({ page }: { page: SiteContentPage }) {
  const siblings = SITE_CONTENT_PAGES.filter((p) => p.section === page.section);
  if (siblings.length < 2) return null;
  return (
    <nav aria-label="Pages" className="-mx-4 mb-6 overflow-x-auto border-b border-ink-200 px-4 sm:mx-0 sm:px-0">
      <ul className="flex gap-1">
        {siblings.map((p) => {
          const active = p.slug === page.slug;
          return (
            <li key={p.slug}>
              <Link
                href={`/admin/content/${p.slug}`}
                aria-current={active ? "page" : undefined}
                className={`relative block whitespace-nowrap px-3 py-2.5 text-sm font-medium transition ${
                  active ? "text-brand-700" : "text-ink-500 hover:text-ink-900"
                }`}
              >
                {p.title}
                {active && <span className="absolute inset-x-3 -bottom-px h-0.5 bg-brand-600" aria-hidden="true" />}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default function SiteContentEditor({ page }: { page: SiteContentPage }) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [programs, setPrograms] = useState<ProgramOption[]>([]);

  const needsPrograms = useMemo(
    () => page.groups.some((g) => g.fields.some((f) => f.list?.item.some((i) => i.kind === "program"))),
    [page]
  );

  async function load() {
    setLoading(true);
    setLoadError(null);
    try {
      const data = await adminFetch("/settings");
      const edit = toEditValues(data.settings || {});
      setValues(edit);
      setSaved(edit);
      if (needsPrograms) {
        const p = await adminFetch("/admin/programs").catch(() => ({ programs: [] }));
        setPrograms((p.programs ?? []).map((x: ProgramOption) => ({ slug: x.slug, title: x.title })));
      }
    } catch (err) {
      setLoadError(errorMessage(err, "Failed to load site content."));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page.slug]);

  const crumbs: Crumb[] = [{ label: "Dashboard", href: "/admin" }, { label: "Site" }];
  if (page.section === "pages") crumbs.push({ label: "Pages", href: "/admin/content/about" });
  crumbs.push({ label: page.title });

  return (
    <>
      <AdminPageHeader
        breadcrumbs={crumbs}
        title={page.title}
        description={page.description}
        actions={
          page.preview && (
            <a href={page.preview.href} target="_blank" rel="noreferrer" className="btn-secondary btn-sm">
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
              {page.preview.label}
            </a>
          )
        }
      />
      <SectionTabs page={page} />

      {loading ? (
        <LoadingState />
      ) : loadError ? (
        <ErrorState message={loadError} onRetry={load} />
      ) : (
        <div className="max-w-3xl space-y-6">
          <p className="text-xs text-ink-500">
            Each panel saves on its own. Changes appear on the website within about a minute.
          </p>
          {page.groups.map((group) => (
            <SettingGroupForm
              key={group.id}
              group={group}
              values={values}
              saved={saved}
              programs={programs}
              onChange={(key, value) => setValues((v) => ({ ...v, [key]: value }))}
              onSaved={(keys) =>
                setSaved((s) => ({ ...s, ...Object.fromEntries(keys.map((k) => [k, values[k] ?? ""])) }))
              }
            />
          ))}
        </div>
      )}
    </>
  );
}

function SettingGroupForm({
  group,
  values,
  saved,
  programs,
  onChange,
  onSaved,
}: {
  group: SettingGroup;
  values: Record<string, string>;
  saved: Record<string, string>;
  programs: ProgramOption[];
  onChange: (key: string, value: string) => void;
  onSaved: (keys: string[]) => void;
}) {
  const toast = useToast();
  const [saving, setSaving] = useState(false);
  const dirty = group.fields.some((f) => (values[f.key] ?? "") !== (saved[f.key] ?? ""));

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    const payload: Record<string, string> = {};
    for (const field of group.fields) payload[field.key] = toStored(field, values[field.key] ?? "");
    try {
      await adminFetch("/admin/settings", { method: "PUT", body: JSON.stringify(payload) });
      onSaved(group.fields.map((f) => f.key));
      toast.success(`${group.title} saved. The website updates within a minute.`);
    } catch (err) {
      toast.error(errorMessage(err, `Failed to save ${group.title}.`));
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <FormSection
        title={group.title}
        description={group.description}
        aside={
          <div className="flex shrink-0 items-center gap-3">
            {dirty && <span className="text-xs font-medium text-amber-700">Unsaved changes</span>}
            <button type="submit" disabled={saving} className="btn-primary btn-sm">
              {saving ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
              ) : (
                <Check className="h-3.5 w-3.5" aria-hidden="true" />
              )}
              Save
            </button>
          </div>
        }
      >
        {group.fields.map((field) => (
          <FieldEditor
            key={field.key}
            field={field}
            value={values[field.key] ?? ""}
            programs={programs}
            onChange={(v) => onChange(field.key, v)}
          />
        ))}
      </FormSection>
    </form>
  );
}

function FieldEditor({
  field,
  value,
  programs,
  onChange,
}: {
  field: SettingField;
  value: string;
  programs: ProgramOption[];
  onChange: (value: string) => void;
}) {
  const id = `setting-${field.key.replace(/\./g, "-")}`;
  const customised = field.defaultValue !== undefined && value !== field.defaultValue;

  const resetControl = customised ? (
    <span className="ml-2 inline-flex items-center gap-2 align-middle">
      <StatusBadge tone="brand">Edited</StatusBadge>
      <button
        type="button"
        onClick={() => onChange(field.defaultValue!)}
        className="inline-flex items-center gap-1 text-xs font-medium text-ink-500 underline-offset-2 hover:text-brand-700 hover:underline"
      >
        <RotateCcw className="h-3 w-3" aria-hidden="true" />
        Reset to default
      </button>
    </span>
  ) : null;

  if (field.type === "image") {
    return <ImageField id={id} label={field.label} value={value} onChange={onChange} hint={field.hint || undefined} />;
  }

  if (field.type === "list" && field.list) {
    return (
      <div>
        <ListEditor id={id} field={{ ...field, list: field.list }} value={value} onChange={onChange} programs={programs} />
        {resetControl && <div className="mt-2">{resetControl}</div>}
      </div>
    );
  }

  if (field.type === "toggle") {
    const on = value === "true";
    return (
      <div className="flex items-start justify-between gap-4 rounded-md border border-ink-200 p-4">
        <div>
          <p id={`${id}-label`} className="text-sm font-medium text-ink-900">
            {field.label}
            {resetControl}
          </p>
          {field.hint && <p className="mt-1 text-xs text-ink-500">{field.hint}</p>}
        </div>
        <button
          id={id}
          type="button"
          role="switch"
          aria-checked={on}
          aria-labelledby={`${id}-label`}
          onClick={() => onChange(on ? "false" : "true")}
          className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${on ? "bg-brand-600" : "bg-ink-300"}`}
        >
          <span
            className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
              on ? "translate-x-[22px]" : "translate-x-0.5"
            }`}
          />
        </button>
      </div>
    );
  }

  const input =
    field.type === "textarea" ? (
      <textarea
        id={id}
        rows={3}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="input-field resize-y"
        placeholder={field.placeholder}
      />
    ) : (
      <input
        id={id}
        type={field.type === "url" ? "url" : "text"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="input-field"
        placeholder={field.placeholder}
      />
    );

  return (
    <div>
      <div className="mb-1.5 flex flex-wrap items-center">
        <label htmlFor={id} className="text-sm font-medium text-ink-700">
          {field.label}
        </label>
        {resetControl}
      </div>
      {input}
      {field.hint && <p className="mt-1.5 text-xs text-ink-500">{field.hint}</p>}
    </div>
  );
}

