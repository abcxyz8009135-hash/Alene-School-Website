import { API_BASE_URL, PHOTOS } from "./constants";
import type { NewsArticle } from "./types";

// Shown only when the news API is unreachable or has no articles yet.
// PLACEHOLDER stories — replace them by publishing real articles in the admin.
const FALLBACK_NEWS: NewsArticle[] = [
  {
    id: "1",
    title: "Alene High School Robotics Team Wins Regional Championship",
    slug: "robotics-team-wins-regional-championship",
    excerpt:
      "Our S&T Robotics Club took first place at the regional robotics competition, showcasing months of hard work and innovation.",
    content:
      "Our S&T Robotics Club took first place at the regional robotics competition, showcasing months of hard work and innovation. Students designed, built and programmed their robot as a team, testing and refining it through the term before competing.",
    category: "Achievements",
    imageUrl: PHOTOS.roboticsAward,
    publishedAt: "2026-08-20",
  },
  {
    id: "2",
    title: "New STEM Center Officially Opens Its Doors",
    slug: "new-stem-center-opens",
    excerpt:
      "The newly built STEM Center features modern science labs, a robotics workshop, and a dedicated innovation hub for students.",
    content:
      "The newly built STEM Center features modern science labs, a robotics workshop, and a dedicated innovation hub for students.",
    category: "Campus",
    imageUrl: PHOTOS.microscope,
    publishedAt: "2026-08-05",
  },
  {
    id: "3",
    title: "Entrance Exam Results for 2026 Now Available",
    slug: "entrance-exam-results-2026",
    excerpt:
      "Prospective students can now check their entrance exam results online using their registration ID.",
    content:
      "Prospective students can now check their entrance exam results online using their registration ID on the Exam Results page.",
    category: "Admissions",
    imageUrl: PHOTOS.assembly,
    publishedAt: "2026-07-28",
  },
  {
    id: "4",
    title: "Students Lead a Campus Clean-Up Day",
    slug: "campus-clean-up-day",
    excerpt:
      "Students and staff worked side by side to clear and tidy the school grounds.",
    content:
      "Students and staff worked side by side to clear and tidy the school grounds — collective effort in practice.",
    category: "Events",
    imageUrl: PHOTOS.cleanup,
    publishedAt: "2026-06-15",
  },
];

const LOCAL_IMAGE_BY_SLUG: Record<string, string> = Object.fromEntries(
  FALLBACK_NEWS.map((a) => [a.slug, a.imageUrl])
);

/** Replace seeded stock photos with real Alene photos (or an empty slot). */
function withLocalImage(article: NewsArticle): NewsArticle {
  const url = article.imageUrl?.trim() ?? "";
  if (url.startsWith("https://images.unsplash.com/")) {
    // Seeded stock photo: use a real Alene photo if we have one, else an empty slot.
    return { ...article, imageUrl: LOCAL_IMAGE_BY_SLUG[article.slug] ?? "" };
  }
  // A bare host with no image path can't load; show the empty photo slot instead.
  if (/^https?:\/\/[^/]+\/?$/.test(url)) return { ...article, imageUrl: "" };
  return article;
}

export async function getNews(): Promise<NewsArticle[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/news`, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error("News request failed");
    const data = await res.json();
    if (Array.isArray(data.articles) && data.articles.length > 0) {
      return (data.articles as NewsArticle[]).map(withLocalImage);
    }
    return FALLBACK_NEWS;
  } catch {
    return FALLBACK_NEWS;
  }
}

export async function getNewsArticle(slug: string): Promise<NewsArticle | undefined> {
  try {
    const res = await fetch(`${API_BASE_URL}/news/${encodeURIComponent(slug)}`, {
      next: { revalidate: 60 },
    });
    if (res.ok) {
      const data = await res.json();
      if (data.article) return withLocalImage(data.article as NewsArticle);
    }
    if (res.status === 404) return FALLBACK_NEWS.find((a) => a.slug === slug);
    throw new Error("News article request failed");
  } catch {
    return FALLBACK_NEWS.find((a) => a.slug === slug);
  }
}
