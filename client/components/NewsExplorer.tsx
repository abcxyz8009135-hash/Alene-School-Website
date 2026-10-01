"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import Photo from "./Photo";
import NewsMeta from "./NewsMeta";
import type { NewsArticle } from "@/lib/types";

interface NewsExplorerProps {
  initialArticles: NewsArticle[];
}

export default function NewsExplorer({ initialArticles }: NewsExplorerProps) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  // Build the filter list from the categories actually in use.
  const categories = useMemo(
    () => ["All", ...Array.from(new Set(initialArticles.map((a) => a.category).filter(Boolean)))],
    [initialArticles]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return initialArticles.filter((article) => {
      const matchesCategory = category === "All" || article.category === category;
      const matchesSearch =
        q.length === 0 ||
        article.title.toLowerCase().includes(q) ||
        article.excerpt.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [initialArticles, search, category]);

  const filtering = search.trim().length > 0 || category !== "All";
  const [featured, ...rest] = filtered;

  return (
    <>
      <div className="flex flex-col gap-5 border-b border-ink-200 py-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              aria-pressed={category === c}
              className={`rounded px-3 py-1.5 text-xs font-bold uppercase tracking-[0.12em] transition-colors ${
                category === c
                  ? "bg-brand-600 text-white"
                  : "text-ink-500 ring-1 ring-inset ring-ink-200 hover:text-ink-900 hover:ring-ink-300"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="relative w-full lg:max-w-xs">
          <label htmlFor="news-search" className="sr-only">
            Search news
          </label>
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" aria-hidden="true" />
          <input
            id="news-search"
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search news…"
            className="input-field pl-10"
          />
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        {filtered.length} {filtered.length === 1 ? "article" : "articles"} shown
      </p>

      {filtered.length === 0 ? (
        <p className="py-20 text-center text-ink-500">No news articles match your search.</p>
      ) : (
        <>
          {/* Featured story (hidden while filtering so results stay uniform) */}
          {!filtering && featured && (
            <article className="group border-b border-ink-200 py-10">
              <Link href={`/news/${featured.slug}`} className="grid grid-cols-1 gap-8 rounded-sm lg:grid-cols-12 lg:items-center">
                <Photo
                  src={featured.imageUrl}
                  alt=""
                  sizes="(min-width: 1024px) 58vw, 100vw"
                  priority
                  className="aspect-[16/10] w-full rounded-sm lg:col-span-7"
                  imgClassName="transition duration-700 group-hover:scale-[1.03]"
                />
                <div className="lg:col-span-5">
                  <NewsMeta article={featured} />
                  <h2 className="mt-4 font-display text-2xl font-bold leading-snug text-ink-900 transition-colors group-hover:text-brand-700 sm:text-3xl">
                    {featured.title}
                  </h2>
                  <p className="mt-4 leading-relaxed text-ink-600">{featured.excerpt}</p>
                  <span className="link-arrow mt-6">Read story</span>
                </div>
              </Link>
            </article>
          )}

          <ul className="grid grid-cols-1 gap-x-8 gap-y-12 pt-10 sm:grid-cols-2 lg:grid-cols-3">
            {(filtering ? filtered : rest).map((article) => (
              <li key={article.id}>
                <article className="group">
                  <Link href={`/news/${article.slug}`} className="block rounded-sm">
                    <Photo
                      src={article.imageUrl}
                      alt=""
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="aspect-[16/10] w-full rounded-sm"
                      imgClassName="transition duration-700 group-hover:scale-[1.03]"
                    />
                    <NewsMeta article={article} className="mt-5" />
                    <h3 className="mt-3 font-display text-lg font-bold leading-snug text-ink-900 transition-colors group-hover:text-brand-700">
                      {article.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink-500">{article.excerpt}</p>
                  </Link>
                </article>
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );
}
