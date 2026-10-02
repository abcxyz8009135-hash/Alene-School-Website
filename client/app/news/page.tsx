import type { Metadata } from "next";
import NewsExplorer from "@/components/NewsExplorer";
import PageHeader from "@/components/PageHeader";
import { getContent } from "@/lib/content";
import { getNews } from "@/lib/news";

// ISR: news list is fetched server-side and revalidated every 60 seconds.
export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const c = await getContent();
  return { title: c.text("seo.news.title"), description: c.text("seo.news.description") };
}

export default async function NewsPage() {
  const [articles, c] = await Promise.all([getNews(), getContent()]);

  return (
    <>
      <PageHeader
        eyebrow={c.text("news.eyebrow")}
        title={c.text("news.headline")}
        intro={c.text("news.intro")}
      />
      <section className="border-t border-ink-200 pb-16 sm:pb-24 lg:pb-32">
        <div className="container-page">
          <NewsExplorer initialArticles={articles} />
        </div>
      </section>
    </>
  );
}
