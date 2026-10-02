"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import ImageField from "@/components/admin/ImageField";
import { useToast } from "@/components/admin/Toast";
import { ErrorState, Field, FormActions, FormSection } from "@/components/admin/ui";
import { adminFetch } from "@/lib/adminApi";
import { NEWS_CATEGORIES } from "@/lib/admin/nav";
import { errorMessage, slugify, toDateInput } from "@/lib/admin/format";
import type { NewsArticle } from "@/lib/types";

interface NewsFormProps {
  article?: NewsArticle;
  extraActions?: React.ReactNode;
}

export default function NewsForm({ article, extraActions }: NewsFormProps) {
  const router = useRouter();
  const toast = useToast();
  const editing = Boolean(article);

  const [form, setForm] = useState({
    title: article?.title ?? "",
    slug: article?.slug ?? "",
    category: article?.category ?? NEWS_CATEGORIES[0],
    excerpt: article?.excerpt ?? "",
    content: article?.content ?? "",
    imageUrl: article?.imageUrl ?? "",
    publishedAt: toDateInput(article?.publishedAt) || toDateInput(new Date().toISOString()),
  });
  // On new articles the slug follows the title until it's edited by hand.
  const [slugTouched, setSlugTouched] = useState(editing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const categories = NEWS_CATEGORIES.includes(form.category)
    ? NEWS_CATEGORIES
    : [form.category, ...NEWS_CATEGORIES];

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const payload = { ...form, publishedAt: form.publishedAt || undefined };
    try {
      await adminFetch(editing ? `/admin/news/${article!.id}` : "/admin/news", {
        method: editing ? "PUT" : "POST",
        body: JSON.stringify(payload),
      });
      toast.success(editing ? "Article saved." : "Article published.");
      router.push("/admin/news");
    } catch (err) {
      setError(errorMessage(err, "Failed to save article."));
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && <ErrorState message={error} />}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <FormSection title="Main information">
            <Field label="Title" htmlFor="news-title">
              <input
                id="news-title"
                required
                minLength={3}
                value={form.title}
                onChange={(e) => {
                  const title = e.target.value;
                  setForm((f) => ({ ...f, title, slug: slugTouched ? f.slug : slugify(title) }));
                }}
                className="input-field"
              />
            </Field>
            <Field
              label="URL slug"
              htmlFor="news-slug"
              hint={`Shown at /news/${form.slug || "your-article"}`}
            >
              <input
                id="news-slug"
                required
                pattern={editing ? undefined : "[a-z0-9]+(-[a-z0-9]+)*"}
                title="Lowercase letters, numbers and hyphens"
                value={form.slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  set("slug", e.target.value);
                }}
                className="input-field font-mono text-xs"
              />
            </Field>
          </FormSection>

          <FormSection title="Content">
            <Field label="Excerpt" htmlFor="news-excerpt" hint="One or two sentences shown on news lists.">
              <textarea
                id="news-excerpt"
                required
                minLength={3}
                rows={2}
                value={form.excerpt}
                onChange={(e) => set("excerpt", e.target.value)}
                className="input-field resize-y"
              />
            </Field>
            <Field label="Article body" htmlFor="news-content" hint="Leave a blank line between paragraphs.">
              <textarea
                id="news-content"
                required
                minLength={3}
                rows={10}
                value={form.content}
                onChange={(e) => set("content", e.target.value)}
                className="input-field resize-y"
              />
            </Field>
          </FormSection>
        </div>

        <div className="space-y-6">
          <FormSection title="Publishing">
            <Field label="Category" htmlFor="news-category">
              <select
                id="news-category"
                value={form.category}
                onChange={(e) => set("category", e.target.value)}
                className="input-field"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Publication date" htmlFor="news-date" hint="Articles are listed newest first.">
              <input
                id="news-date"
                type="date"
                value={form.publishedAt}
                onChange={(e) => set("publishedAt", e.target.value)}
                className="input-field"
              />
            </Field>
          </FormSection>

          <FormSection title="Media">
            <ImageField
              id="news-image"
              label="Cover image"
              required
              value={form.imageUrl}
              onChange={(url) => set("imageUrl", url)}
            />
          </FormSection>
        </div>
      </div>

      <FormActions
        cancelHref="/admin/news"
        saving={saving}
        submitLabel={editing ? "Save changes" : "Publish article"}
        extra={extraActions}
      />
    </form>
  );
}
