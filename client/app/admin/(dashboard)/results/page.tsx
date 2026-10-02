"use client";

import { useState } from "react";
import Link from "next/link";
import { Pencil, Plus, Trash2 } from "lucide-react";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { useToast } from "@/components/admin/Toast";
import { EXAM_STATUS_LABEL, EXAM_STATUS_TONE } from "@/components/admin/forms/ResultForm";
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
import { useAdminList } from "@/lib/admin/useAdminList";
import { useListControls } from "@/lib/admin/useListControls";
import type { ExamResult, ExamStatus } from "@/lib/types";

export default function AdminResultsPage() {
  const toast = useToast();
  const { items, setItems, loading, error, reload } = useAdminList<ExamResult>("/admin/results", "results");
  const [toDelete, setToDelete] = useState<ExamResult | null>(null);

  const list = useListControls(items, {
    searchFields: (r) => [r.registrationId, r.studentName],
    filters: {
      status: (r, v) => r.status === v,
      year: (r, v) => String(r.examYear) === v,
    },
    sorters: {
      reg: (r) => r.registrationId,
      name: (r) => r.studentName.toLowerCase(),
      score: (r) => (r.total ? r.score / r.total : 0),
      year: (r) => r.examYear,
    },
    initialSort: { key: "reg", dir: "asc" },
    pageSize: 20,
  });

  const years = Array.from(new Set(items.map((r) => r.examYear))).sort((a, b) => b - a);

  async function handleDelete(result: ExamResult) {
    try {
      await adminFetch(`/admin/results/${result.id}`, { method: "DELETE" });
      setItems((prev) => prev.filter((r) => r.id !== result.id));
      toast.success(`Result ${result.registrationId} deleted.`);
    } catch (err) {
      toast.error(errorMessage(err, "Failed to delete exam result."));
      throw err;
    }
  }

  return (
    <>
      <AdminPageHeader
        breadcrumbs={[{ label: "Dashboard", href: "/admin" }, { label: "Content" }, { label: "Exam Results" }]}
        title="Exam Results"
        description="Entrance exam results that students look up by registration ID on the Exam Results page."
        actions={
          <Link href="/admin/results/new" className="btn-primary btn-sm">
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add result
          </Link>
        }
      />

      {error && <ErrorState message={error} onRetry={reload} />}

      <ListToolbar
        summary={
          !loading &&
          (list.isFiltering
            ? `${list.filteredCount} of ${list.totalCount} results`
            : `${list.totalCount} ${list.totalCount === 1 ? "result" : "results"}`)
        }
      >
        <SearchInput value={list.query} onChange={list.setQuery} placeholder="Registration ID or name…" label="Search results" />
        <FilterSelect
          label="Status"
          value={list.filterValues.status ?? ""}
          onChange={(v) => list.setFilter("status", v)}
          options={[
            { value: "", label: "All" },
            ...(Object.keys(EXAM_STATUS_LABEL) as ExamStatus[]).map((s) => ({ value: s, label: EXAM_STATUS_LABEL[s] })),
          ]}
        />
        {years.length > 1 && (
          <FilterSelect
            label="Year"
            value={list.filterValues.year ?? ""}
            onChange={(v) => list.setFilter("year", v)}
            options={[{ value: "", label: "All" }, ...years.map((y) => ({ value: String(y), label: String(y) }))]}
          />
        )}
      </ListToolbar>

      <TableCard>
        <TableHead>
          <Th sortKey="reg" sort={list.sort} onSort={list.toggleSort}>
            Registration ID
          </Th>
          <Th sortKey="name" sort={list.sort} onSort={list.toggleSort} className="hidden md:table-cell">
            Student
          </Th>
          <Th sortKey="score" sort={list.sort} onSort={list.toggleSort} className="hidden sm:table-cell">
            Score
          </Th>
          <Th className="hidden sm:table-cell">Status</Th>
          <Th sortKey="year" sort={list.sort} onSort={list.toggleSort} className="hidden md:table-cell">
            Year
          </Th>
          <Th align="right">Actions</Th>
        </TableHead>
        <tbody className="divide-y divide-ink-100">
          {loading ? (
            <LoadingRow colSpan={6} />
          ) : list.pageItems.length === 0 ? (
            list.isFiltering ? (
              <EmptyRow
                colSpan={6}
                title="No matching results"
                action={
                  <button type="button" onClick={list.clearFilters} className="btn-icon">
                    Clear filters
                  </button>
                }
              />
            ) : (
              <EmptyRow
                colSpan={6}
                title="No exam results yet"
                description="Results added here become searchable on the public Exam Results page."
                action={
                  <Link href="/admin/results/new" className="btn-primary btn-sm">
                    <Plus className="h-4 w-4" aria-hidden="true" />
                    Add the first result
                  </Link>
                }
              />
            )
          ) : (
            list.pageItems.map((r) => (
              <tr key={r.id} className="hover:bg-ink-50/60">
                <Td>
                  <Link href={`/admin/results/${r.id}`} className="font-mono text-xs font-semibold text-ink-900 hover:text-brand-700">
                    {r.registrationId}
                  </Link>
                  <p className="text-xs text-ink-500 md:hidden">
                    {r.studentName} · {r.score}/{r.total} · {r.examYear}
                  </p>
                  <span className="mt-1.5 inline-block sm:hidden">
                    <StatusBadge tone={EXAM_STATUS_TONE[r.status]}>{EXAM_STATUS_LABEL[r.status]}</StatusBadge>
                  </span>
                </Td>
                <Td className="hidden text-ink-700 md:table-cell">{r.studentName}</Td>
                <Td className="hidden whitespace-nowrap tabular-nums text-ink-600 sm:table-cell">
                  {r.score} / {r.total}
                  <span className="ml-1.5 text-xs text-ink-400">
                    ({r.total ? Math.round((r.score / r.total) * 100) : 0}%)
                  </span>
                </Td>
                <Td className="hidden sm:table-cell">
                  <StatusBadge tone={EXAM_STATUS_TONE[r.status]}>{EXAM_STATUS_LABEL[r.status]}</StatusBadge>
                </Td>
                <Td className="hidden tabular-nums text-ink-600 md:table-cell">{r.examYear}</Td>
                <Td>
                  <RowActions>
                    <Link href={`/admin/results/${r.id}`} className="btn-icon">
                      <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                      <span className="sr-only sm:not-sr-only">Edit</span>
                    </Link>
                    <button type="button" onClick={() => setToDelete(r)} className="btn-danger">
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
        title="Delete exam result?"
        message={
          <>
            The result for <strong className="text-ink-900">{toDelete?.studentName}</strong> (
            <span className="font-mono">{toDelete?.registrationId}</span>) will be deleted and can no longer be looked
            up. This cannot be undone.
          </>
        }
        confirmLabel="Delete result"
        onConfirm={() => handleDelete(toDelete!)}
        onClose={() => setToDelete(null)}
      />
    </>
  );
}
