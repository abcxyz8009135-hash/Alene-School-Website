"use client";

import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import type { ListItem } from "@/lib/contentRegistry";
import type { SettingField } from "@/lib/admin/siteContent";

export interface ProgramOption {
  slug: string;
  title: string;
}

interface ListEditorProps {
  id: string;
  field: SettingField & { list: NonNullable<SettingField["list"]> };
  value: string;
  onChange: (value: string) => void;
  programs: ProgramOption[];
}

function parse(value: string, keys: string[]): ListItem[] {
  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];
    return parsed.map((v) => Object.fromEntries(keys.map((k) => [k, typeof v?.[k] === "string" ? v[k] : ""])));
  } catch {
    return [];
  }
}

/** Editor for repeating content (pillars, subject areas, steps, …). */
export default function ListEditor({ id, field, value, onChange, programs }: ListEditorProps) {
  const { itemLabel, item: itemFields, min = 0, max = 20 } = field.list;
  const keys = itemFields.map((f) => f.key);
  const items = parse(value, keys);

  function commit(next: ListItem[]) {
    onChange(JSON.stringify(next));
  }

  function update(index: number, key: string, v: string) {
    commit(items.map((item, i) => (i === index ? { ...item, [key]: v } : item)));
  }

  function move(index: number, delta: number) {
    const next = [...items];
    const [moved] = next.splice(index, 1);
    next.splice(index + delta, 0, moved);
    commit(next);
  }

  function remove(index: number) {
    commit(items.filter((_, i) => i !== index));
  }

  function add() {
    commit([...items, Object.fromEntries(keys.map((k) => [k, ""]))]);
  }

  return (
    <fieldset id={id} className="space-y-3">
      <legend className="form-label">{field.label}</legend>
      {field.hint && <p className="-mt-1 text-xs text-ink-500">{field.hint}</p>}

      <ol className="space-y-3">
        {items.map((item, index) => (
          <li key={index} className="rounded-md border border-ink-200 bg-ink-50/60 p-4">
            <div className="mb-3 flex items-center justify-between gap-2">
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-ink-500">
                {itemLabel} {index + 1}
              </p>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => move(index, -1)}
                  disabled={index === 0}
                  className="btn-icon px-2 disabled:opacity-40"
                  aria-label={`Move ${itemLabel.toLowerCase()} ${index + 1} up`}
                >
                  <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => move(index, 1)}
                  disabled={index === items.length - 1}
                  className="btn-icon px-2 disabled:opacity-40"
                  aria-label={`Move ${itemLabel.toLowerCase()} ${index + 1} down`}
                >
                  <ArrowDown className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => remove(index)}
                  disabled={items.length <= min}
                  className="btn-danger px-2 disabled:opacity-40"
                  aria-label={`Remove ${itemLabel.toLowerCase()} ${index + 1}`}
                >
                  <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </div>
            </div>

            <div className={`grid gap-3 ${itemFields.length > 1 && itemFields.every((f) => f.kind === "text" || f.kind === "program") ? "sm:grid-cols-2" : ""}`}>
              {itemFields.map((f) => {
                const inputId = `${id}-${index}-${f.key}`;
                const v = item[f.key] ?? "";
                return (
                  <div key={f.key}>
                    <label htmlFor={inputId} className="mb-1 block text-xs font-medium text-ink-600">
                      {f.label}
                    </label>
                    {f.kind === "program" ? (
                      <select id={inputId} value={v} onChange={(e) => update(index, f.key, e.target.value)} className="input-field">
                        {!programs.some((p) => p.slug === v) && <option value={v}>{v || "Choose a program"}</option>}
                        {programs.map((p) => (
                          <option key={p.slug} value={p.slug}>
                            {p.title}
                          </option>
                        ))}
                      </select>
                    ) : f.kind === "text" ? (
                      <input id={inputId} value={v} onChange={(e) => update(index, f.key, e.target.value)} className="input-field" />
                    ) : (
                      <textarea
                        id={inputId}
                        rows={f.kind === "lines" ? 4 : 2}
                        value={v}
                        onChange={(e) => update(index, f.key, e.target.value)}
                        className="input-field resize-y"
                      />
                    )}
                    {f.hint && <p className="mt-1 text-xs text-ink-500">{f.hint}</p>}
                  </div>
                );
              })}
            </div>
          </li>
        ))}
      </ol>

      {items.length < max && (
        <button type="button" onClick={add} className="btn-icon">
          <Plus className="h-3.5 w-3.5" aria-hidden="true" />
          Add {itemLabel.toLowerCase()}
        </button>
      )}
    </fieldset>
  );
}
