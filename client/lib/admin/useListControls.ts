"use client";

import { useEffect, useMemo, useState } from "react";

export type SortState = { key: string; dir: "asc" | "desc" };

interface Options<T> {
  /** Fields searched by the search box. */
  searchFields: (item: T) => (string | number | null | undefined)[];
  /** Named filters: key → predicate given the selected value ("" = all). */
  filters?: Record<string, (item: T, value: string) => boolean>;
  /** Comparable value per sortable column key. */
  sorters?: Record<string, (item: T) => string | number>;
  initialSort?: SortState;
  pageSize?: number;
}

/**
 * Search, filter, sort and paginate an already-loaded list. The admin API
 * returns full lists, which are small for a single school, so this runs
 * client-side without any API changes.
 */
export function useListControls<T>(items: T[], options: Options<T>) {
  const { searchFields, filters = {}, sorters = {}, initialSort, pageSize = 15 } = options;

  const [query, setQuery] = useState("");
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const [sort, setSort] = useState<SortState | undefined>(initialSort);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = items.filter((item) => {
      if (q && !searchFields(item).some((v) => String(v ?? "").toLowerCase().includes(q))) return false;
      for (const [key, predicate] of Object.entries(filters)) {
        const value = filterValues[key];
        if (value && !predicate(item, value)) return false;
      }
      return true;
    });
    if (sort && sorters[sort.key]) {
      const get = sorters[sort.key];
      list = [...list].sort((a, b) => {
        const av = get(a);
        const bv = get(b);
        const cmp = typeof av === "number" && typeof bv === "number" ? av - bv : String(av).localeCompare(String(bv));
        return sort.dir === "asc" ? cmp : -cmp;
      });
    }
    return list;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, query, filterValues, sort]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));

  // Reset to page 1 whenever the result set changes shape.
  useEffect(() => {
    setPage(1);
  }, [query, filterValues, sort]);

  useEffect(() => {
    if (page > pageCount) setPage(pageCount);
  }, [page, pageCount]);

  const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize);

  function toggleSort(key: string) {
    setSort((s) => (s?.key === key ? { key, dir: s.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" }));
  }

  function setFilter(key: string, value: string) {
    setFilterValues((f) => ({ ...f, [key]: value }));
  }

  const isFiltering = query.trim().length > 0 || Object.values(filterValues).some(Boolean);

  return {
    query,
    setQuery,
    filterValues,
    setFilter,
    sort,
    toggleSort,
    page,
    setPage,
    pageCount,
    pageItems,
    filteredCount: filtered.length,
    totalCount: items.length,
    isFiltering,
    clearFilters: () => {
      setQuery("");
      setFilterValues({});
    },
  };
}
