"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { AlertCircle, ArrowDown, ArrowUp, ChevronLeft, ChevronRight, ChevronsUpDown, Inbox, Loader2, Search, X } from "lucide-react";

/* ------------------------------------------------------------------ */
/* Page header                                                         */
/* ------------------------------------------------------------------ */

export interface Crumb {
  label: string;
  href?: string;
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1 text-xs font-medium text-ink-500">
        {items.map((crumb, i) => (
          <li key={`${crumb.label}-${i}`} className="flex items-center gap-1">
            {i > 0 && <ChevronRight className="h-3.5 w-3.5 text-ink-300" aria-hidden="true" />}
            {crumb.href && i < items.length - 1 ? (
              <Link href={crumb.href} className="rounded hover:text-brand-700 hover:underline">
                {crumb.label}
              </Link>
            ) : (
              <span aria-current={i === items.length - 1 ? "page" : undefined} className="text-ink-700">
                {crumb.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/**
 * Every admin page starts with this: breadcrumb, title, description and the
 * page's primary action(s) on the right.
 */
export function AdminPageHeader({
  title,
  description,
  breadcrumbs,
  actions,
}: {
  title: string;
  description?: ReactNode;
  breadcrumbs?: Crumb[];
  actions?: ReactNode;
}) {
  return (
    <div className="mb-6 space-y-3 sm:mb-8">
      {breadcrumbs && breadcrumbs.length > 0 && <Breadcrumbs items={breadcrumbs} />}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h1 className="font-display text-2xl font-bold tracking-tight text-ink-900">{title}</h1>
          {description && <p className="mt-1 max-w-2xl text-sm text-ink-500">{description}</p>}
        </div>
        {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* List toolbar                                                        */
/* ------------------------------------------------------------------ */

export function ListToolbar({ children, summary }: { children: ReactNode; summary?: ReactNode }) {
  return (
    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">{children}</div>
      {summary && <p className="shrink-0 text-xs text-ink-500">{summary}</p>}
    </div>
  );
}

export function SearchInput({
  value,
  onChange,
  placeholder = "Search…",
  label = "Search",
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
}) {
  return (
    <div className="relative w-full sm:max-w-xs">
      <label className="sr-only" htmlFor="admin-search">
        {label}
      </label>
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" aria-hidden="true" />
      <input
        id="admin-search"
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="input-field py-2 pl-9 pr-8"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-ink-400 hover:text-ink-900"
          aria-label="Clear search"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}

export function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="flex items-center gap-2 text-xs font-medium text-ink-500">
      <span className="shrink-0">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="input-field w-auto py-2 pr-8">
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

/* ------------------------------------------------------------------ */
/* Tables                                                              */
/* ------------------------------------------------------------------ */

export function TableCard({ children }: { children: ReactNode }) {
  return (
    <div className="card overflow-x-auto">
      <table className="w-full text-left text-sm sm:min-w-[600px]">{children}</table>
    </div>
  );
}

export function Th({
  children,
  align = "left",
  sortKey,
  sort,
  onSort,
  className = "",
}: {
  children: ReactNode;
  align?: "left" | "right";
  sortKey?: string;
  sort?: { key: string; dir: "asc" | "desc" };
  onSort?: (key: string) => void;
  className?: string;
}) {
  const active = sortKey && sort?.key === sortKey;
  const ariaSort = active ? (sort!.dir === "asc" ? "ascending" : "descending") : undefined;
  return (
    <th
      scope="col"
      aria-sort={ariaSort}
      className={`px-5 py-3 text-xs font-semibold uppercase tracking-wider text-ink-500 ${
        align === "right" ? "text-right" : ""
      } ${className}`}
    >
      {sortKey && onSort ? (
        <button
          type="button"
          onClick={() => onSort(sortKey)}
          className={`inline-flex items-center gap-1 rounded uppercase tracking-wider hover:text-ink-900 ${
            active ? "text-ink-900" : ""
          }`}
        >
          {children}
          {active ? (
            sort!.dir === "asc" ? (
              <ArrowUp className="h-3 w-3" aria-hidden="true" />
            ) : (
              <ArrowDown className="h-3 w-3" aria-hidden="true" />
            )
          ) : (
            <ChevronsUpDown className="h-3 w-3 opacity-50" aria-hidden="true" />
          )}
        </button>
      ) : (
        children
      )}
    </th>
  );
}

export function TableHead({ children }: { children: ReactNode }) {
  return (
    <thead className="border-b border-ink-200 bg-ink-50/60">
      <tr>{children}</tr>
    </thead>
  );
}

export function Td({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <td className={`px-5 py-3.5 align-middle ${className}`}>{children}</td>;
}

export function LoadingRow({ colSpan }: { colSpan: number }) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-5 py-12 text-center text-ink-400">
        <Loader2 className="mx-auto h-5 w-5 animate-spin" aria-label="Loading" />
      </td>
    </tr>
  );
}

export function EmptyRow({
  colSpan,
  title,
  description,
  action,
}: {
  colSpan: number;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-5 py-14">
        <EmptyState title={title} description={description} action={action} />
      </td>
    </tr>
  );
}

export function RowActions({ children }: { children: ReactNode }) {
  return <div className="flex justify-end gap-2">{children}</div>;
}

/* ------------------------------------------------------------------ */
/* Pagination                                                          */
/* ------------------------------------------------------------------ */

export function Pagination({
  page,
  pageCount,
  onPageChange,
}: {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
}) {
  if (pageCount <= 1) return null;
  return (
    <nav aria-label="Pagination" className="mt-4 flex items-center justify-between gap-4 text-sm">
      <p className="text-xs text-ink-500">
        Page {page} of {pageCount}
      </p>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="btn-icon disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ChevronLeft className="h-3.5 w-3.5" aria-hidden="true" />
          Previous
        </button>
        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= pageCount}
          className="btn-icon disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next
          <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      </div>
    </nav>
  );
}

/* ------------------------------------------------------------------ */
/* Badges and states                                                   */
/* ------------------------------------------------------------------ */

const BADGE_TONES = {
  neutral: "bg-ink-100 text-ink-700 ring-ink-200",
  brand: "bg-brand-50 text-brand-700 ring-brand-200",
  success: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  danger: "bg-crimson-50 text-crimson-800 ring-crimson-200",
  warning: "bg-amber-50 text-amber-800 ring-amber-200",
};

export function StatusBadge({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: keyof typeof BADGE_TONES;
}) {
  return (
    <span
      className={`inline-flex items-center rounded px-2 py-0.5 text-[11px] font-bold uppercase tracking-[0.08em] ring-1 ring-inset ${BADGE_TONES[tone]}`}
    >
      {children}
    </span>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mx-auto flex max-w-sm flex-col items-center text-center">
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-ink-100 text-ink-400">
        <Inbox className="h-5 w-5" aria-hidden="true" />
      </span>
      <p className="mt-3 font-semibold text-ink-900">{title}</p>
      {description && <p className="mt-1 text-sm text-ink-500">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div role="alert" className="alert-error mb-4 items-center justify-between">
      <span className="flex items-start gap-2">
        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        {message}
      </span>
      {onRetry && (
        <button type="button" onClick={onRetry} className="btn-icon shrink-0">
          Try again
        </button>
      )}
    </div>
  );
}

export function LoadingState({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-2 py-16 text-sm text-ink-500">
      <Loader2 className="h-5 w-5 animate-spin text-brand-600" aria-hidden="true" />
      {label}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Forms                                                               */
/* ------------------------------------------------------------------ */

/** A titled panel inside an admin form (Main information, Media, …). */
export function FormSection({
  title,
  description,
  children,
  aside,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <section className="card p-5 sm:p-6">
      <div className="mb-5 flex items-start justify-between gap-4 border-b border-ink-100 pb-4">
        <div>
          <h2 className="text-base font-semibold text-ink-900">{title}</h2>
          {description && <p className="mt-1 text-xs text-ink-500">{description}</p>}
        </div>
        {aside}
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

export function Field({
  label,
  htmlFor,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="form-label">
        {label}
      </label>
      {children}
      {hint && <p className="mt-1.5 text-xs text-ink-500">{hint}</p>}
    </div>
  );
}

/** Sticky footer bar with Cancel + Save for full-page forms. */
export function FormActions({
  cancelHref,
  saving,
  submitLabel,
  extra,
}: {
  cancelHref: string;
  saving: boolean;
  submitLabel: string;
  extra?: ReactNode;
}) {
  return (
    <div className="sticky bottom-0 z-10 -mx-4 mt-6 flex flex-col-reverse gap-2 border-t border-ink-200 bg-white/95 px-4 py-3 backdrop-blur sm:-mx-8 sm:flex-row sm:items-center sm:justify-between sm:px-8">
      <div>{extra}</div>
      <div className="flex flex-col-reverse gap-2 sm:flex-row">
        <Link href={cancelHref} className="btn-secondary btn-sm">
          Cancel
        </Link>
        <button type="submit" disabled={saving} className="btn-primary btn-sm">
          {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />}
          {submitLabel}
        </button>
      </div>
    </div>
  );
}
