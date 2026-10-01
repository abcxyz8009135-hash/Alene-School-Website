import type { Metadata } from "next";
import NewsExplorer from "@/components/NewsExplorer";
import PageHeader from "@/components/PageHeader";
import { getNews } from "@/lib/news";

// ISR: news list is fetched server-side and revalidated every 60 seconds.
export const revalidate = 60;

export const metadata: Metadata = {
  title: "News",
  description: "News, achievements and announcements from Alene High School, Mekelle.",
};

export default async function NewsPage() {
  const articles = await getNews();

  return (
    <>
      <PageHeader
        eyebrow="News & updates"
        title="Latest from Alene."
        intro="Announcements, achievements and stories from around the school."
      />
      <section className="border-t border-ink-200 pb-16 sm:pb-24 lg:pb-32">
        <div className="container-page">
          <NewsExplorer initialArticles={articles} />
        </div>
      </section>
    </>
  );
}
