import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Photo from "@/components/Photo";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import NewsMeta from "@/components/NewsMeta";
import type { NewsArticle } from "@/lib/types";

interface NewsSectionProps {
  articles: NewsArticle[];
}

export default function NewsSection({ articles }: NewsSectionProps) {
  if (articles.length === 0) return null;
  const [featured, ...supporting] = articles;

  return (
    <section aria-labelledby="news-title" className="section-y bg-white">
      <div className="container-page">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            index="07"
            eyebrow="Stay connected"
            title={<span id="news-title">Latest from Alene.</span>}
          />
          <Link href="/news" className="link-arrow shrink-0">
            All news
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-14">
          <Reveal as="article" className="group lg:col-span-7">
            <Link href={`/news/${featured.slug}`} className="block rounded-sm">
              <Photo
                src={featured.imageUrl}
                alt=""
                sizes="(min-width: 1024px) 58vw, 100vw"
                className="aspect-[16/10] w-full rounded-sm"
                imgClassName="transition duration-700 group-hover:scale-[1.03]"
              />
              <NewsMeta article={featured} className="mt-6" />
              <h3 className="mt-3 font-display text-2xl font-bold leading-snug text-ink-900 transition-colors group-hover:text-brand-700 sm:text-3xl">
                {featured.title}
              </h3>
              <p className="mt-3 max-w-2xl leading-relaxed text-ink-600">{featured.excerpt}</p>
            </Link>
          </Reveal>

          <ol className="divide-y divide-ink-200 border-y border-ink-200 lg:col-span-5 lg:self-start">
            {supporting.slice(0, 3).map((article, i) => (
              <Reveal as="li" key={article.id} delay={(i + 1) * 80}>
                <Link
                  href={`/news/${article.slug}`}
                  className="group grid grid-cols-[1fr_7rem] gap-5 py-6 sm:grid-cols-[1fr_9rem]"
                >
                  <div>
                    <NewsMeta article={article} />
                    <h3 className="mt-2 font-display text-lg font-bold leading-snug text-ink-900 transition-colors group-hover:text-brand-700">
                      {article.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink-500">{article.excerpt}</p>
                  </div>
                  <Photo
                    src={article.imageUrl}
                    alt=""
                    sizes="144px"
                    className="aspect-square w-full rounded-sm"
                  />
                </Link>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
