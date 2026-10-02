"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Pencil, Plus, Trash2 } from "lucide-react";
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
import { errorMessage } from "@/lib/admin/format";
import { PROGRAM_CATEGORY_LABEL } from "@/lib/admin/nav";
import type { AdminProgram } from "@/lib/admin/types";
import { useAdminList } from "@/lib/admin/useAdminList";
import { useListControls } from "@/lib/admin/useListControls";
import type { ProgramAchievement } from "@/lib/types";

export default function AdminAchievementsPage() {
  const toast = useToast();
  const { items, setItems, loading, error, reload } = useAdminList<ProgramAchievement>(
    "/admin/achievements",
    "achievements"
  );
  const programs = useAdminList<AdminProgram>("/admin/programs", "programs");
  const [toDelete, setToDelete] = useState<ProgramAchievement | null>(null);

  const programTitle = (slug: string) => programs.items.find((p) => p.slug === slug)?.title ?? slug;

  const list = useListControls(items, {
    searchFields: (a) => [a.title, a.description, programTitle(a.programSlug)],
    filters: {
      program: (a, v) => a.programSlug === v,
      category: (a, v) => a.category === v,
    },
    sorters: {
      title: (a) => a.title.toLowerCase(),
      program: (a) => programTitle(a.programSlug).toLowerCase(),
      year: (a) => a.year,
    },
    initialSort: { key: "year", dir: "desc" },
  });

  // Support links like /admin/achievements?program=robotics-automation.
  useEffect(() => {
    const slug = new URLSearchParams(window.location.search).get("program");
    if (slug) list.setFilter("program", slug);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const programSlugs = Array.from(new Set([...programs.items.map((p) => p.slug), ...items.map((a) => a.programSlug)]));

  async function handleDelete(achievement: ProgramAchievement) {
    try {
      await adminFetch(`/admin/achievements/${achievement.id}`, { method: "DELETE" });
      setItems((prev) => prev.filter((a) => a.id !== achievement.id));
      toast.success("Achievement deleted.");
    } catch (err) {
      toast.error(errorMessage(err, "Failed to delete achievement."));
      throw err;
    }
  }

  const newHref = list.filterValues.program
    ? `/admin/achievements/new?program=${list.filterValues.program}`
    : "/admin/achievements/new";

  return (
    <>
      <AdminPageHeader
        breadcrumbs={[{ label: "Dashboard", href: "/admin" }, { label: "Content" }, { label: "Achievements" }]}
        title="Achievements"
        description="Student results shown on each program page and on the home page achievement wall."
        actions={
          <Link href={newHref} className="btn-primary btn-sm">
            <Plus className="h-4 w-4" aria-hidden="true" />
            New achievement
          </Link>
        }
      />

      {(error || programs.error) && (
        <ErrorState
          message={error ?? programs.error ?? ""}
          onRetry={() => {
            reload();
            programs.reload();
          }}
        />
      )}

      <ListToolbar
        summary={
          !loading &&
          (list.isFiltering
            ? `${list.filteredCount} of ${list.totalCount} achievements`
            : `${list.totalCount} ${list.totalCount === 1 ? "achievement" : "achievements"}`)
        }
      >
        <SearchInput value={list.query} onChange={list.setQuery} placeholder="Search achievements…" label="Search achievements" />
        <FilterSelect
          label="Program"
          value={list.filterValues.program ?? ""}
          onChange={(v) => list.setFilter("program", v)}
          options={[{ value: "", label: "All" }, ...programSlugs.map((s) => ({ value: s, label: programTitle(s) }))]}
        />
      </ListToolbar>

      <TableCard>
        <TableHead>
          <Th sortKey="title" sort={list.sort} onSort={list.toggleSort}>
            Achievement
          </Th>
          <Th sortKey="program" sort={list.sort} onSort={list.toggleSort} className="hidden md:table-cell">
            Program
          </Th>
          <Th sortKey="year" sort={list.sort} onSort={list.toggleSort} className="hidden md:table-cell">
            Year
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
                title="No matching achievements"
                action={
                  <button type="button" onClick={list.clearFilters} className="btn-icon">
                    Clear filters
                  </button>
                }
              />
            ) : (
              <EmptyRow
                colSpan={4}
                title="No achievements yet"
                description="Until achievements are added here, the website shows its built-in examples."
                action={
                  <Link href="/admin/achievements/new" className="btn-primary btn-sm">
                    <Plus className="h-4 w-4" aria-hidden="true" />
                    Add an achievement
                  </Link>
                }
              />
            )
          ) : (
            list.pageItems.map((a) => (
              <tr key={a.id} className="hover:bg-ink-50/60">
                <Td className="max-w-[11rem] sm:max-w-md">
                  <Link href={`/admin/achievements/${a.id}`} className="block truncate font-medium text-ink-900 hover:text-brand-700">
                    {a.title}
                  </Link>
                  {a.metricValue && a.metricLabel && (
                    <p className="truncate text-xs text-ink-500">
                      {a.metricValue} {a.metricLabel.toLowerCase()}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-ink-500 md:hidden">
                    {programTitle(a.programSlug)} · {a.year}
                  </p>
                </Td>
                <Td className="hidden md:table-cell">
                  <span className="text-ink-700">{programTitle(a.programSlug)}</span>
                  <span className="ml-2">
                    <StatusBadge tone={a.category === "stem-center" ? "brand" : "neutral"}>
                      {PROGRAM_CATEGORY_LABEL[a.category]}
                    </StatusBadge>
                  </span>
                </Td>
                <Td className="hidden tabular-nums text-ink-600 md:table-cell">{a.year}</Td>
                <Td>
                  <RowActions>
                    <Link href={`/admin/achievements/${a.id}`} className="btn-icon">
                      <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                      <span className="sr-only sm:not-sr-only">Edit</span>
                    </Link>
                    <button type="button" onClick={() => setToDelete(a)} className="btn-danger">
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
        title="Delete achievement?"
        message={
          <>
            <strong className="text-ink-900">“{toDelete?.title}”</strong> will be removed from the website. This
            cannot be undone.
          </>
        }
        confirmLabel="Delete achievement"
        onConfirm={() => handleDelete(toDelete!)}
        onClose={() => setToDelete(null)}
      />
    </>
  );
}
