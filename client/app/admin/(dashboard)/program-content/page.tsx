"use client";

import { FormEvent, useEffect, useState } from "react";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import AdminModal from "@/components/admin/AdminModal";
import { adminFetch } from "@/lib/adminApi";

interface Program {
  id: string;
  slug: string;
  category: "stem-center" | "hobbies";
  title: string;
  imageUrl: string;
  summary: string;
  description: string;
  curriculumHighlights: string[];
  establishedYear: number;
}

const EMPTY_FORM = {
  slug: "",
  category: "stem-center" as Program["category"],
  title: "",
  imageUrl: "",
  summary: "",
  description: "",
  curriculumHighlightsText: "",
  establishedYear: new Date().getFullYear(),
};

export default function AdminProgramContentPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  async function loadPrograms() {
    setLoading(true);
    try {
      const data = await adminFetch("/admin/programs");
      setPrograms(data.programs);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load programs.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPrograms();
  }, []);

  function openCreate() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError(null);
    setModalOpen(true);
  }

  function openEdit(program: Program) {
    setEditingId(program.id);
    setForm({
      slug: program.slug,
      category: program.category,
      title: program.title,
      imageUrl: program.imageUrl,
      summary: program.summary,
      description: program.description,
      curriculumHighlightsText: program.curriculumHighlights.join("\n"),
      establishedYear: program.establishedYear,
    });
    setFormError(null);
    setModalOpen(true);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setFormError(null);

    const payload = {
      slug: form.slug,
      category: form.category,
      title: form.title,
      imageUrl: form.imageUrl,
      summary: form.summary,
      description: form.description,
      curriculumHighlights: form.curriculumHighlightsText
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean),
      establishedYear: form.establishedYear,
    };

    try {
      if (editingId) {
        await adminFetch(`/admin/programs/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
      } else {
        await adminFetch("/admin/programs", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }
      setModalOpen(false);
      await loadPrograms();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Failed to save program.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this program? This cannot be undone.")) return;
    try {
      await adminFetch(`/admin/programs/${id}`, { method: "DELETE" });
      setPrograms((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete program.");
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink-900">Programs</h1>
          <p className="mt-1 text-sm text-ink-500">
            Manage the STEM Center &amp; Hobbies program listings shown sitewide.
          </p>
        </div>
        <button onClick={openCreate} className="btn-primary">
          <Plus className="h-4 w-4" />
          New Program
        </button>
      </div>

      {error && (
        <p className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 ring-1 ring-inset ring-red-200">
          {error}
        </p>
      )}

      <div className="card mt-6 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 text-xs uppercase tracking-wider text-ink-400">
            <tr>
              <th className="px-5 py-3">Title</th>
              <th className="px-5 py-3">Category</th>
              <th className="px-5 py-3">Slug</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading && (
              <tr>
                <td colSpan={4} className="px-5 py-8 text-center text-ink-400">
                  <Loader2 className="mx-auto h-5 w-5 animate-spin" />
                </td>
              </tr>
            )}
            {!loading && programs.length === 0 && (
              <tr>
                <td colSpan={4} className="px-5 py-8 text-center text-ink-400">
                  No programs yet.
                </td>
              </tr>
            )}
            {programs.map((program) => (
              <tr key={program.id}>
                <td className="max-w-xs truncate px-5 py-3 font-medium text-ink-900">
                  {program.title}
                </td>
                <td className="px-5 py-3">
                  <span className="tag-pill">
                    {program.category === "stem-center" ? "STEM Center" : "Hobbies"}
                  </span>
                </td>
                <td className="px-5 py-3 text-ink-500">{program.slug}</td>
                <td className="px-5 py-3">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => openEdit(program)} className="btn-icon">
                      <Pencil className="h-3.5 w-3.5" />
                      Edit
                    </button>
                    <button onClick={() => handleDelete(program.id)} className="btn-danger">
                      <Trash2 className="h-3.5 w-3.5" />
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AdminModal
        open={modalOpen}
        title={editingId ? "Edit Program" : "New Program"}
        onClose={() => setModalOpen(false)}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="form-label">Title</label>
            <input
              required
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              className="input-field"
            />
          </div>
          <div>
            <label className="form-label">Slug</label>
            <input
              required
              value={form.slug}
              onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
              className="input-field"
              placeholder="web-development"
            />
          </div>
          <div>
            <label className="form-label">Category</label>
            <select
              value={form.category}
              onChange={(e) =>
                setForm((f) => ({ ...f, category: e.target.value as Program["category"] }))
              }
              className="input-field"
            >
              <option value="stem-center">STEM Center</option>
              <option value="hobbies">Hobbies</option>
            </select>
          </div>
          <div>
            <label className="form-label">Image URL</label>
            <input
              required
              type="url"
              value={form.imageUrl}
              onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))}
              className="input-field"
            />
          </div>
          <div>
            <label className="form-label">Summary</label>
            <textarea
              required
              rows={2}
              value={form.summary}
              onChange={(e) => setForm((f) => ({ ...f, summary: e.target.value }))}
              className="input-field resize-none"
            />
          </div>
          <div>
            <label className="form-label">Description</label>
            <textarea
              required
              rows={4}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              className="input-field resize-none"
            />
          </div>
          <div>
            <label className="form-label">Curriculum Highlights (one per line)</label>
            <textarea
              required
              rows={4}
              value={form.curriculumHighlightsText}
              onChange={(e) =>
                setForm((f) => ({ ...f, curriculumHighlightsText: e.target.value }))
              }
              className="input-field resize-none"
            />
          </div>
          <div>
            <label className="form-label">Established Year</label>
            <input
              required
              type="number"
              value={form.establishedYear}
              onChange={(e) =>
                setForm((f) => ({ ...f, establishedYear: Number(e.target.value) }))
              }
              className="input-field"
            />
          </div>

          {formError && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 ring-1 ring-inset ring-red-200">
              {formError}
            </p>
          )}

          <button type="submit" disabled={saving} className="btn-primary w-full">
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            {editingId ? "Save Changes" : "Create Program"}
          </button>
        </form>
      </AdminModal>
    </div>
  );
}
