import NewsExplorer from "@/components/NewsExplorer";
import { API_BASE_URL } from "@/lib/constants";
import type { NewsArticle } from "@/lib/types";

// ISR: news list is fetched server-side and revalidated every 60 seconds.
export const revalidate = 60;

const MOCK_NEWS: NewsArticle[] = [
  {
    id: "1",
    title: "Alene High School Robotics Team Wins Regional Championship",
    slug: "robotics-team-wins-regional-championship",
    excerpt:
      "Our S&T Robotics Club took first place at the regional robotics competition, showcasing months of hard work and innovation.",
    content: "",
    category: "Achievements",
    imageUrl:
      "https://images.unsplash.com/photo-1581091870621-1e9b6b3f5c8b?auto=format&fit=crop&w=800&q=80",
    publishedAt: "2026-08-20",
  },
  {
    id: "2",
    title: "New STEM Center Officially Opens Its Doors",
    slug: "new-stem-center-opens",
    excerpt:
      "The newly built STEM Center features modern science labs, a robotics workshop, and a dedicated innovation hub for students.",
    content: "",
    category: "Campus",
    imageUrl:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
    publishedAt: "2026-08-05",
  },
  {
    id: "3",
    title: "Entrance Exam Results for 2026 Now Available",
    slug: "entrance-exam-results-2026",
    excerpt:
      "Prospective students can now check their entrance exam results online using their registration ID.",
    content: "",
    category: "Admissions",
    imageUrl:
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
    publishedAt: "2026-07-28",
  },
  {
    id: "4",
    title: "Annual Sports Day Brings Students Together",
    slug: "annual-sports-day",
    excerpt:
      "Students competed in track and field, football, and basketball events during our vibrant annual Sports Day.",
    content: "",
    category: "Events",
    imageUrl:
      "https://images.unsplash.com/photo-1526378722484-bd91ca387e72?auto=format&fit=crop&w=800&q=80",
    publishedAt: "2026-06-15",
  },
];

async function getNews(): Promise<NewsArticle[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/news`, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error("News request failed");
    const data = await res.json();
    if (Array.isArray(data.articles) && data.articles.length > 0) {
      return data.articles;
    }
    return MOCK_NEWS;
  } catch {
    return MOCK_NEWS;
  }
}

export default async function NewsPage() {
  const articles = await getNews();

  return (
    <section className="container-page py-16">
      <h1 className="mt-4 text-4xl font-bold text-ink-900 sm:text-5xl">
        What&apos;s Happening at Alene High School
      </h1>
      <p className="mt-4 max-w-2xl text-ink-500">
        Announcements, achievements, and campus stories from around the school.
      </p>

      <NewsExplorer initialArticles={articles} />
    </section>
  );
}
