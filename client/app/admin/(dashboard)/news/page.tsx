"use client";

import { useState } from "react";
import Link from "next/link";
import { ExternalLink, Pencil, Plus, Trash2 } from "lucide-react";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { useToast } from "@/components/admin/Toast";
import {
  AdminPageHeader,
  EmptyRow,
  ErrorState,
  FilterSelect,
  ListToolbar,
  LoadingRow,
  Pagination,
  RowActions,
  SearchInput,
  StatusBadge,
  TableCard,
  TableHead,
  Td,
  Th,
} from "@/components/admin/ui";
import { adminFetch } from "@/lib/adminApi";
import { formatAdminDate, errorMessage } from "@/lib/admin/format";
import { NEWS_CATEGORIES } from "@/lib/admin/nav";
import { useAdminList } from "@/lib/admin/useAdminList";
import { useListControls } from "@/lib/admin/useListControls";
import type { NewsArticle } from "@/lib/types";

export default function AdminNewsPage() {
  const toast = useToast();
  const { items, setItems, loading, error, reload } = useAdminList<NewsArticle>("/admin/news", "articles");
  const [toDelete, setToDelete] = useState<NewsArticle | null>(null);

  const list = useListControls(items, {
    searchFields: (a) => [a.title, a.excerpt, a.slug],
    filters: { category: (a, v) => a.category === v },
    sorters: {
      title: (a) => a.title.toLowerCase(),
      category: (a) => a.category,
      date: (a) => new Date(a.publishedAt).getTime(),
    },
    initialSort: { key: "date", dir: "desc" },
  });

  const categories = Array.from(new Set([...NEWS_CATEGORIES, ...items.map((a) => a.category)]));

  async function handleDelete(article: NewsArticle) {
    try {
      await adminFetch(`/admin/news/${article.id}`, { method: "DELETE" });
      setItems((prev) => prev.filter((a) => a.id !== article.id));
      toast.success(`“${article.title}” deleted.`);
    } catch (err) {
      toast.error(errorMessage(err, "Failed to delete article."));
      throw err;
    }
  }

  return (
    <>
      <AdminPageHeader
        breadcrumbs={[{ label: "Dashboard", href: "/admin" }, { label: "Content" }, { label: "News" }]}
        title="News"
        description="Articles and announcements shown on the News page and the home page."
        actions={
          <Link href="/admin/news/new" className="btn-primary btn-sm">
            <Plus className="h-4 w-4" aria-hidden="true" />
            New article
          </Link>
        }
      />

      {error && <ErrorState message={error} onRetry={reload} />}

      <ListToolbar
        summary={
          !loading &&
          (list.isFiltering
            ? `${list.filteredCount} of ${list.totalCount} articles`
            : `${list.totalCount} ${list.totalCount === 1 ? "article" : "articles"}`)
        }
      >
        <SearchInput value={list.query} onChange={list.setQuery} placeholder="Search title or excerpt…" label="Search articles" />
        <FilterSelect
          label="Category"
          value={list.filterValues.category ?? ""}
          onChange={(v) => list.setFilter("category", v)}
          options={[{ value: "", label: "All" }, ...categories.map((c) => ({ value: c, label: c }))]}
        />
      </ListToolbar>

      <TableCard>
        <TableHead>
          <Th sortKey="title" sort={list.sort} onSort={list.toggleSort}>
            Title
          </Th>
          <Th sortKey="category" sort={list.sort} onSort={list.toggleSort} className="hidden md:table-cell">
            Category
          </Th>
          <Th sortKey="date" sort={list.sort} onSort={list.toggleSort} className="hidden md:table-cell">
            Published
          </Th>
          <Th align="right">Actions</Th>
        </TableHead>
        <tbody className="divide-y divide-ink-100">
          {loading ? (
            <LoadingRow colSpan={4} />
          ) : list.pageItems.length === 0 ? (
            list.isFiltering ? (
              <EmptyRow
                colSpan={4}
                title="No matching articles"
                description="Try a different search or category."
                action={
                  <button type="button" onClick={list.clearFilters} className="btn-icon">
                    Clear filters
                  </button>
                }
              />
            ) : (
              <EmptyRow
                colSpan={4}
                title="No news articles yet"
                description="Published articles appear on the News page and the home page."
                action={
                  <Link href="/admin/news/new" className="btn-primary btn-sm">
                    <Plus className="h-4 w-4" aria-hidden="true" />
                    Write the first article
                  </Link>
                }
              />
            )
          ) : (
            list.pageItems.map((article) => (
              <tr key={article.id} className="hover:bg-ink-50/60">
                <Td className="max-w-[11rem] sm:max-w-md">
                  <Link href={`/admin/news/${article.id}`} className="block truncate font-medium text-ink-900 hover:text-brand-700">
                    {article.title}
                  </Link>
                  <p className="truncate font-mono text-[11px] text-ink-400">/news/{article.slug}</p>
                  <p className="mt-1 text-xs text-ink-500 md:hidden">
                    {article.category} · {formatAdminDate(article.publishedAt)}
                  </p>
                </Td>
                <Td className="hidden md:table-cell">
                  <StatusBadge tone="brand">{article.category}</StatusBadge>
                </Td>
                <Td className="hidden whitespace-nowrap text-ink-600 md:table-cell">{formatAdminDate(article.publishedAt)}</Td>
                <Td>
                  <RowActions>
                    <a
                      href={`/news/${article.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-icon hidden sm:inline-flex"
                      aria-label={`View “${article.title}” on the website`}
                    >
                      <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                    </a>
                    <Link href={`/admin/news/${article.id}`} className="btn-icon">
                      <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                      <span className="sr-only sm:not-sr-only">Edit</span>
                    </Link>
                    <button type="button" onClick={() => setToDelete(article)} className="btn-danger">
                      <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                      <span className="sr-only sm:not-sr-only">Delete</span>
                    </button>
                  </RowActions>
                </Td>
              </tr>
            ))
          )}
        </tbody>
      </TableCard>

      <Pagination page={list.page} pageCount={list.pageCount} onPageChange={list.setPage} />

      <ConfirmDialog
        open={toDelete !== null}
        title="Delete article?"
        message={
          <>
            <strong className="text-ink-900">“{toDelete?.title}”</strong> will be removed from the website. This
            cannot be undone.
          </>
        }
        confirmLabel="Delete article"
        onConfirm={() => handleDelete(toDelete!)}
        onClose={() => setToDelete(null)}
      />
    </>
  );
}
