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
import { errorMessage } from "@/lib/admin/format";
import { PROGRAM_CATEGORY_LABEL } from "@/lib/admin/nav";
import type { AdminProgram } from "@/lib/admin/types";
import { useAdminList } from "@/lib/admin/useAdminList";
import { useListControls } from "@/lib/admin/useListControls";
import { CATEGORY_ROUTE } from "@/lib/constants";

export default function AdminProgramsPage() {
  const toast = useToast();
  const { items, setItems, loading, error, reload } = useAdminList<AdminProgram>("/admin/programs", "programs");
  const [toDelete, setToDelete] = useState<AdminProgram | null>(null);

  const list = useListControls(items, {
    searchFields: (p) => [p.title, p.summary, p.slug],
    filters: { category: (p, v) => p.category === v },
    sorters: {
      title: (p) => p.title.toLowerCase(),
      category: (p) => p.category,
      year: (p) => p.establishedYear,
    },
    initialSort: { key: "title", dir: "asc" },
  });

  async function handleDelete(program: AdminProgram) {
    try {
      await adminFetch(`/admin/programs/${program.id}`, { method: "DELETE" });
      setItems((prev) => prev.filter((p) => p.id !== program.id));
      toast.success(`“${program.title}” deleted.`);
    } catch (err) {
      toast.error(errorMessage(err, "Failed to delete program."));
      throw err;
    }
  }

  return (
    <>
      <AdminPageHeader
        breadcrumbs={[{ label: "Dashboard", href: "/admin" }, { label: "Content" }, { label: "Programs" }]}
        title="Programs"
        description="STEM programs and community clubs, each with its own page on the website."
        actions={
          <Link href="/admin/programs/new" className="btn-primary btn-sm">
            <Plus className="h-4 w-4" aria-hidden="true" />
            New program
          </Link>
        }
      />

      {error && <ErrorState message={error} onRetry={reload} />}

      <ListToolbar
        summary={
          !loading &&
          (list.isFiltering
            ? `${list.filteredCount} of ${list.totalCount} programs`
            : `${list.totalCount} ${list.totalCount === 1 ? "program" : "programs"}`)
        }
      >
        <SearchInput value={list.query} onChange={list.setQuery} placeholder="Search programs…" label="Search programs" />
        <FilterSelect
          label="Section"
          value={list.filterValues.category ?? ""}
          onChange={(v) => list.setFilter("category", v)}
          options={[
            { value: "", label: "All" },
            { value: "stem-center", label: "STEM" },
            { value: "hobbies", label: "Community" },
          ]}
        />
      </ListToolbar>

      <TableCard>
        <TableHead>
          <Th sortKey="title" sort={list.sort} onSort={list.toggleSort}>
            Program
          </Th>
          <Th sortKey="category" sort={list.sort} onSort={list.toggleSort} className="hidden md:table-cell">
            Section
          </Th>
          <Th sortKey="year" sort={list.sort} onSort={list.toggleSort} className="hidden md:table-cell">
            Established
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
                title="No matching programs"
                action={
                  <button type="button" onClick={list.clearFilters} className="btn-icon">
                    Clear filters
                  </button>
                }
              />
            ) : (
              <EmptyRow
                colSpan={4}
                title="No programs yet"
                description="Until programs are added here, the website shows its built-in defaults."
                action={
                  <Link href="/admin/programs/new" className="btn-primary btn-sm">
                    <Plus className="h-4 w-4" aria-hidden="true" />
                    Add a program
                  </Link>
                }
              />
            )
          ) : (
            list.pageItems.map((program) => {
              const publicHref = `${CATEGORY_ROUTE[program.category]}/${program.slug}`;
              return (
                <tr key={program.id} className="hover:bg-ink-50/60">
                  <Td className="max-w-[11rem] sm:max-w-md">
                    <Link
                      href={`/admin/programs/${program.id}`}
                      className="block truncate font-medium text-ink-900 hover:text-brand-700"
                    >
                      {program.title}
                    </Link>
                    <p className="truncate text-xs text-ink-500">{program.summary}</p>
                    <p className="mt-1 text-xs text-ink-500 md:hidden">
                      {PROGRAM_CATEGORY_LABEL[program.category]} · Est. {program.establishedYear}
                    </p>
                  </Td>
                  <Td className="hidden md:table-cell">
                    <StatusBadge tone={program.category === "stem-center" ? "brand" : "neutral"}>
                      {PROGRAM_CATEGORY_LABEL[program.category]}
                    </StatusBadge>
                  </Td>
                  <Td className="hidden tabular-nums text-ink-600 md:table-cell">{program.establishedYear}</Td>
                  <Td>
                    <RowActions>
                      <a
                        href={publicHref}
                        target="_blank"
                        rel="noreferrer"
                        className="btn-icon hidden sm:inline-flex"
                        aria-label={`View “${program.title}” on the website`}
                      >
                        <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                      </a>
                      <Link href={`/admin/programs/${program.id}`} className="btn-icon">
                        <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                        <span className="sr-only sm:not-sr-only">Edit</span>
                      </Link>
                      <button type="button" onClick={() => setToDelete(program)} className="btn-danger">
                        <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                        <span className="sr-only sm:not-sr-only">Delete</span>
                      </button>
                    </RowActions>
                  </Td>
                </tr>
              );
            })
          )}
        </tbody>
      </TableCard>

      <Pagination page={list.page} pageCount={list.pageCount} onPageChange={list.setPage} />

      <ConfirmDialog
        open={toDelete !== null}
        title="Delete program?"
        message={
          <>
            <strong className="text-ink-900">“{toDelete?.title}”</strong> and its page will be removed from the
            website. Its achievements are kept but will no longer be linked to a program. This cannot be undone.
          </>
        }
        confirmLabel="Delete program"
        onConfirm={() => handleDelete(toDelete!)}
        onClose={() => setToDelete(null)}
      />
    </>
  );
}
