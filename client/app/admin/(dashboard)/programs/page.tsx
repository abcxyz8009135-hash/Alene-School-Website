"use client";

import { FormEvent, useEffect, useState } from "react";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import AdminModal from "@/components/admin/AdminModal";
import { adminFetch } from "@/lib/adminApi";
import type { ProgramAchievement, ProgramCategory } from "@/lib/types";

interface ProgramOption {
  slug: string;
  title: string;
  category: ProgramCategory;
}

const EMPTY_FORM = {
  programSlug: "",
  category: "stem-center" as ProgramCategory,
  title: "",
  description: "",
  year: new Date().getFullYear(),
  metricLabel: "",
  metricValue: "",
};

export default function AdminProgramsPage() {
  const [achievements, setAchievements] = useState<ProgramAchievement[]>([]);
  const [programs, setPrograms] = useState<ProgramOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  async function loadAchievements() {
    setLoading(true);
    try {
      const [achievementsData, programsData] = await Promise.all([
        adminFetch("/admin/achievements"),
        adminFetch("/admin/programs"),
      ]);
      setAchievements(achievementsData.achievements);
      setPrograms(programsData.programs);
      if (programsData.programs[0]) {
        setForm((f) => ({
          ...f,
          programSlug: f.programSlug || programsData.programs[0].slug,
          category: f.programSlug ? f.category : programsData.programs[0].category,
        }));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load achievements.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAchievements();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function openCreate() {
    setEditingId(null);
    setForm({
      ...EMPTY_FORM,
      programSlug: programs[0]?.slug ?? "",
      category: programs[0]?.category ?? "stem-center",
    });
    setFormError(null);
    setModalOpen(true);
  }

  function openEdit(achievement: ProgramAchievement) {
    setEditingId(achievement.id);
    setForm({
      programSlug: achievement.programSlug,
      category: achievement.category,
      title: achievement.title,
      description: achievement.description,
      year: achievement.year,
      metricLabel: achievement.metricLabel || "",
      metricValue: achievement.metricValue || "",
    });
    setFormError(null);
    setModalOpen(true);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setFormError(null);

    const payload = {
      ...form,
      metricLabel: form.metricLabel || null,
      metricValue: form.metricValue || null,
    };

    try {
      if (editingId) {
        await adminFetch(`/admin/achievements/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
      } else {
        await adminFetch("/admin/achievements", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }
      setModalOpen(false);
      await loadAchievements();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Failed to save achievement.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this achievement? This cannot be undone.")) return;
    try {
      await adminFetch(`/admin/achievements/${id}`, { method: "DELETE" });
      setAchievements((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete achievement.");
    }
  }

  function handleProgramChange(slug: string) {
    const program = programs.find((p) => p.slug === slug);
    setForm((f) => ({
      ...f,
      programSlug: slug,
      category: program?.category ?? f.category,
    }));
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink-900">Program Achievements</h1>
          <p className="mt-1 text-sm text-ink-500">
            Manage achievement records shown on STEM Center &amp; Hobbies program pages.
          </p>
        </div>
        <button onClick={openCreate} className="btn-primary">
          <Plus className="h-4 w-4" />
          New Achievement
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
              <th className="px-5 py-3">Program</th>
              <th className="px-5 py-3">Title</th>
              <th className="px-5 py-3">Year</th>
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
            {!loading && achievements.length === 0 && (
              <tr>
                <td colSpan={4} className="px-5 py-8 text-center text-ink-400">
                  No achievements yet.
                </td>
              </tr>
            )}
            {achievements.map((achievement) => (
              <tr key={achievement.id}>
                <td className="px-5 py-3 text-ink-700">
                  {programs.find((p) => p.slug === achievement.programSlug)?.title ??
                    achievement.programSlug}
                </td>
                <td className="max-w-xs truncate px-5 py-3 font-medium text-ink-900">
                  {achievement.title}
                </td>
                <td className="px-5 py-3 text-ink-500">{achievement.year}</td>
                <td className="px-5 py-3">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => openEdit(achievement)} className="btn-icon">
                      <Pencil className="h-3.5 w-3.5" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(achievement.id)}
                      className="btn-danger"
                    >
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
        title={editingId ? "Edit Achievement" : "New Achievement"}
        onClose={() => setModalOpen(false)}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="form-label">Program</label>
            <select
              value={form.programSlug}
              onChange={(e) => handleProgramChange(e.target.value)}
              className="input-field"
            >
              {programs.map((p) => (
                <option key={p.slug} value={p.slug}>
                  {p.title} ({p.category === "stem-center" ? "STEM Center" : "Hobbies"})
                </option>
              ))}
            </select>
          </div>
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
            <label className="form-label">Description</label>
            <textarea
              required
              rows={3}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              className="input-field resize-none"
            />
          </div>
          <div>
            <label className="form-label">Year</label>
            <input
              required
              type="number"
              value={form.year}
              onChange={(e) => setForm((f) => ({ ...f, year: Number(e.target.value) }))}
              className="input-field"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Metric Label (optional)</label>
              <input
                value={form.metricLabel}
                onChange={(e) => setForm((f) => ({ ...f, metricLabel: e.target.value }))}
                className="input-field"
                placeholder="e.g. Schools competed"
              />
            </div>
            <div>
              <label className="form-label">Metric Value (optional)</label>
              <input
                value={form.metricValue}
                onChange={(e) => setForm((f) => ({ ...f, metricValue: e.target.value }))}
                className="input-field"
                placeholder="e.g. 18"
              />
            </div>
          </div>

          {formError && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 ring-1 ring-inset ring-red-200">
              {formError}
            </p>
          )}

          <button type="submit" disabled={saving} className="btn-primary w-full">
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            {editingId ? "Save Changes" : "Create Achievement"}
          </button>
        </form>
      </AdminModal>
    </div>
  );
}
