import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Photo from "@/components/Photo";
import NewsMeta from "@/components/NewsMeta";
import { getNews, getNewsArticle } from "@/lib/news";

export const revalidate = 60;

interface PageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  const articles = await getNews();
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const article = await getNewsArticle(params.slug);
  if (!article) return { title: "News" };
  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: "article",
      publishedTime: article.publishedAt,
      images: article.imageUrl ? [article.imageUrl] : undefined,
    },
  };
}

export default async function NewsArticlePage({ params }: PageProps) {
  const article = await getNewsArticle(params.slug);
  if (!article) notFound();

  const body = (article.content || article.excerpt)
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <article>
      <header className="container-page max-w-4xl pb-10 pt-12 sm:pt-16 lg:pt-20">
        <Link href="/news" className="link-arrow">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          All news
        </Link>
        <NewsMeta article={article} className="mt-10" />
        <h1 className="display-2 mt-5 text-ink-900">{article.title}</h1>
        {article.excerpt && <p className="lede mt-6">{article.excerpt}</p>}
      </header>

      <div className="container-page max-w-5xl">
        <Photo
          src={article.imageUrl}
          alt=""
          sizes="(min-width: 1024px) 1000px, 100vw"
          priority
          className="aspect-[16/9] w-full rounded-sm"
        />
      </div>

      <div className="container-page max-w-3xl pb-16 pt-12 sm:pb-24 lg:pb-32">
        <div className="prose-body text-lg">
          {body.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
        <div className="mt-14 border-t border-ink-200 pt-8">
          <Link href="/news" className="btn-secondary">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to all news
          </Link>
        </div>
      </div>
    </article>
  );
}
