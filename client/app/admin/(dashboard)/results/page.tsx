"use client";

import { FormEvent, useEffect, useState } from "react";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import AdminModal from "@/components/admin/AdminModal";
import { adminFetch } from "@/lib/adminApi";
import type { ExamResult, ExamStatus } from "@/lib/types";

const EMPTY_FORM = {
  registrationId: "",
  studentName: "",
  score: 0,
  total: 100,
  status: "PENDING" as ExamStatus,
  examYear: new Date().getFullYear(),
};

const STATUS_OPTIONS: ExamStatus[] = ["PASS", "FAIL", "PENDING"];

export default function AdminResultsPage() {
  const [results, setResults] = useState<ExamResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  async function loadResults() {
    setLoading(true);
    try {
      const data = await adminFetch("/admin/results");
      setResults(data.results);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load exam results.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadResults();
  }, []);

  function openCreate() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError(null);
    setModalOpen(true);
  }

  function openEdit(result: ExamResult) {
    setEditingId(result.id);
    setForm({
      registrationId: result.registrationId,
      studentName: result.studentName,
      score: result.score,
      total: result.total,
      status: result.status,
      examYear: result.examYear,
    });
    setFormError(null);
    setModalOpen(true);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setFormError(null);

    try {
      if (editingId) {
        await adminFetch(`/admin/results/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(form),
        });
      } else {
        await adminFetch("/admin/results", {
          method: "POST",
          body: JSON.stringify(form),
        });
      }
      setModalOpen(false);
      await loadResults();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Failed to save exam result.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this exam result? This cannot be undone.")) return;
    try {
      await adminFetch(`/admin/results/${id}`, { method: "DELETE" });
      setResults((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete exam result.");
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink-900">Entrance Exam Results</h1>
          <p className="mt-1 text-sm text-ink-500">
            Manage student entrance exam scores looked up by registration ID.
          </p>
        </div>
        <button onClick={openCreate} className="btn-primary">
          <Plus className="h-4 w-4" />
          New Result
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
              <th className="px-5 py-3">Registration ID</th>
              <th className="px-5 py-3">Student</th>
              <th className="px-5 py-3">Score</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading && (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-ink-400">
                  <Loader2 className="mx-auto h-5 w-5 animate-spin" />
                </td>
              </tr>
            )}
            {!loading && results.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-ink-400">
                  No exam results yet.
                </td>
              </tr>
            )}
            {results.map((result) => (
              <tr key={result.id}>
                <td className="px-5 py-3 font-mono text-xs font-medium text-ink-900">
                  {result.registrationId}
                </td>
                <td className="px-5 py-3 text-ink-700">{result.studentName}</td>
                <td className="px-5 py-3 text-ink-500">
                  {result.score} / {result.total}
                </td>
                <td className="px-5 py-3">
                  <span className="tag-pill">{result.status}</span>
                </td>
                <td className="px-5 py-3">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => openEdit(result)} className="btn-icon">
                      <Pencil className="h-3.5 w-3.5" />
                      Edit
                    </button>
                    <button onClick={() => handleDelete(result.id)} className="btn-danger">
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
        title={editingId ? "Edit Exam Result" : "New Exam Result"}
        onClose={() => setModalOpen(false)}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="form-label">Registration ID</label>
            <input
              required
              value={form.registrationId}
              onChange={(e) => setForm((f) => ({ ...f, registrationId: e.target.value }))}
              className="input-field font-mono"
              placeholder="AHS-2026-0005"
            />
          </div>
          <div>
            <label className="form-label">Student Name</label>
            <input
              required
              value={form.studentName}
              onChange={(e) => setForm((f) => ({ ...f, studentName: e.target.value }))}
              className="input-field"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Score</label>
              <input
                required
                type="number"
                min={0}
                value={form.score}
                onChange={(e) => setForm((f) => ({ ...f, score: Number(e.target.value) }))}
                className="input-field"
              />
            </div>
            <div>
              <label className="form-label">Total</label>
              <input
                required
                type="number"
                min={1}
                value={form.total}
                onChange={(e) => setForm((f) => ({ ...f, total: Number(e.target.value) }))}
                className="input-field"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Status</label>
              <select
                value={form.status}
                onChange={(e) =>
                  setForm((f) => ({ ...f, status: e.target.value as ExamStatus }))
                }
                className="input-field"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="form-label">Exam Year</label>
              <input
                required
                type="number"
                value={form.examYear}
                onChange={(e) => setForm((f) => ({ ...f, examYear: Number(e.target.value) }))}
                className="input-field"
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
            {editingId ? "Save Changes" : "Create Result"}
          </button>
        </form>
      </AdminModal>
    </div>
  );
}
