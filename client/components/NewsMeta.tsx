import { formatDate } from "@/lib/format";
import type { NewsArticle } from "@/lib/types";

export default function NewsMeta({ article, className = "" }: { article: NewsArticle; className?: string }) {
  return (
    <p className={`flex flex-wrap items-center gap-x-3 gap-y-1 text-xs ${className}`}>
      <span className="font-bold uppercase tracking-[0.14em] text-crimson-600">{article.category}</span>
      <span className="h-1 w-1 rounded-full bg-ink-300" aria-hidden="true" />
      <time dateTime={article.publishedAt} className="font-medium text-ink-500">
        {formatDate(article.publishedAt, "long")}
      </time>
    </p>
  );
}
