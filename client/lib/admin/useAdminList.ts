"use client";

import { useCallback, useEffect, useState } from "react";
import { adminFetch } from "@/lib/adminApi";

/**
 * Loads one admin collection, e.g. useAdminList<NewsArticle>("/admin/news", "articles").
 * Returns the list plus loading/error state and a reload function.
 */
export function useAdminList<T>(path: string, key: string) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminFetch(path);
      setItems((data?.[key] as T[]) ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data.");
    } finally {
      setLoading(false);
    }
  }, [path, key]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { items, setItems, loading, error, reload };
}

/** Finds one record by id from its collection (the API has no get-by-id). */
export function useAdminRecord<T extends { id: string }>(path: string, key: string, id: string) {
  const { items, loading, error, reload } = useAdminList<T>(path, key);
  const record = items.find((item) => item.id === id) ?? null;
  return { record, loading, error, reload, notFound: !loading && !error && !record };
}
