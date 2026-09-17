"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { CalendarDays, Search } from "lucide-react";
import type { NewsArticle } from "@/lib/types";

const CATEGORIES = ["All", "Achievements", "Campus", "Admissions", "Events"];

interface NewsExplorerProps {
  initialArticles: NewsArticle[];
}

export default function NewsExplorer({ initialArticles }: NewsExplorerProps) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const filtered = useMemo(() => {
    return initialArticles.filter((article) => {
      const matchesCategory = category === "All" || article.category === category;
      const matchesSearch =
        search.trim().length === 0 ||
        article.title.toLowerCase().includes(search.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [initialArticles, search, category]);

  return (
    <>
      <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-sm">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search news..."
            className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm text-ink-900 placeholder-ink-400 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                category === c
                  ? "bg-brand-600 text-white"
                  : "border border-slate-300 text-ink-500 hover:border-slate-400 hover:text-ink-900"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((article) => (
          <article key={article.id} className="card overflow-hidden">
            <div className="relative h-48 w-full">
              <div className="skeleton absolute inset-0" />
              <Image src={article.imageUrl} alt={article.title} fill className="object-cover" />
              <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-brand-700 backdrop-blur">
                {article.category}
              </span>
            </div>
            <div className="p-5">
              <div className="flex items-center gap-1.5 text-xs text-ink-400">
                <CalendarDays className="h-3.5 w-3.5" />
                {new Date(article.publishedAt).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </div>
              <h3 className="mt-2 font-semibold text-ink-900">{article.title}</h3>
              <p className="mt-2 line-clamp-2 text-sm text-ink-500">{article.excerpt}</p>
            </div>
          </article>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="mt-16 text-center text-sm text-ink-400">
          No news articles match your search.
        </div>
      )}
    </>
  );
}
