"use client";

import { FormEvent, useEffect, useState } from "react";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import AdminModal from "@/components/admin/AdminModal";
import { adminFetch } from "@/lib/adminApi";
import type { NewsArticle } from "@/lib/types";

const EMPTY_FORM = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  category: "Achievements",
  imageUrl: "",
};

const CATEGORIES = ["Achievements", "Campus", "Admissions", "Events"];

export default function AdminNewsPage() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  async function loadArticles() {
    setLoading(true);
    try {
      const data = await adminFetch("/admin/news");
      setArticles(data.articles);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load news.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadArticles();
  }, []);

  function openCreate() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError(null);
    setModalOpen(true);
  }

  function openEdit(article: NewsArticle) {
    setEditingId(article.id);
    setForm({
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt,
      content: article.content,
      category: article.category,
      imageUrl: article.imageUrl,
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
        await adminFetch(`/admin/news/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(form),
        });
      } else {
        await adminFetch("/admin/news", {
          method: "POST",
          body: JSON.stringify(form),
        });
      }
      setModalOpen(false);
      await loadArticles();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Failed to save article.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this article? This cannot be undone.")) return;
    try {
      await adminFetch(`/admin/news/${id}`, { method: "DELETE" });
      setArticles((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete article.");
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink-900">News Articles</h1>
          <p className="mt-1 text-sm text-ink-500">Create, edit, and remove news posts.</p>
        </div>
        <button onClick={openCreate} className="btn-primary">
          <Plus className="h-4 w-4" />
          New Article
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
              <th className="px-5 py-3">Published</th>
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
            {!loading && articles.length === 0 && (
              <tr>
                <td colSpan={4} className="px-5 py-8 text-center text-ink-400">
                  No news articles yet.
                </td>
              </tr>
            )}
            {articles.map((article) => (
              <tr key={article.id}>
                <td className="max-w-xs truncate px-5 py-3 font-medium text-ink-900">
                  {article.title}
                </td>
                <td className="px-5 py-3">
                  <span className="tag-pill">{article.category}</span>
                </td>
                <td className="px-5 py-3 text-ink-500">
                  {new Date(article.publishedAt).toLocaleDateString()}
                </td>
                <td className="px-5 py-3">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => openEdit(article)} className="btn-icon">
                      <Pencil className="h-3.5 w-3.5" />
                      Edit
                    </button>
                    <button onClick={() => handleDelete(article.id)} className="btn-danger">
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
        title={editingId ? "Edit Article" : "New Article"}
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
              placeholder="example-article-slug"
            />
          </div>
          <div>
            <label className="form-label">Category</label>
            <select
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              className="input-field"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
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
              placeholder="https://images.unsplash.com/..."
            />
          </div>
          <div>
            <label className="form-label">Excerpt</label>
            <textarea
              required
              rows={2}
              value={form.excerpt}
              onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
              className="input-field resize-none"
            />
          </div>
          <div>
            <label className="form-label">Content</label>
            <textarea
              required
              rows={4}
              value={form.content}
              onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
              className="input-field resize-none"
            />
          </div>

          {formError && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 ring-1 ring-inset ring-red-200">
              {formError}
            </p>
          )}

          <button type="submit" disabled={saving} className="btn-primary w-full">
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            {editingId ? "Save Changes" : "Create Article"}
          </button>
        </form>
      </AdminModal>
    </div>
  );
}
