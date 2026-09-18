import Image from "next/image";
import Link from "next/link";
import { Compass, Target, Cpu, Bot, FlaskConical, ArrowRight, CalendarDays } from "lucide-react";
import HeroCarousel from "@/components/HeroCarousel";
import { API_BASE_URL, HERO_IMG_1 } from "@/lib/constants";
import { MOCK_ACHIEVEMENTS } from "@/lib/programs";
import type { NewsArticle } from "@/lib/types";

// ISR: home page content (news preview) is revalidated every 60 seconds.
export const revalidate = 60;

const FALLBACK_NEWS: Pick<NewsArticle, "title" | "publishedAt" | "category" | "imageUrl">[] = [
  {
    title: "Robotics Team Wins Regional Championship",
    publishedAt: "2026-08-20",
    category: "Achievements",
    imageUrl:
      "https://images.unsplash.com/photo-1581091870621-1e9b6b3f5c8b?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "New STEM Center Officially Opens Its Doors",
    publishedAt: "2026-08-05",
    category: "Campus",
    imageUrl:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Entrance Exam Results for 2026 Now Available",
    publishedAt: "2026-07-28",
    category: "Admissions",
    imageUrl:
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
  },
];

async function getNewsPreview() {
  try {
    const res = await fetch(`${API_BASE_URL}/news`, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error("News request failed");
    const data = await res.json();
    if (Array.isArray(data.articles) && data.articles.length > 0) {
      return data.articles.slice(0, 3) as NewsArticle[];
    }
    return FALLBACK_NEWS;
  } catch {
    return FALLBACK_NEWS;
  }
}

export default async function HomePage() {
  const newsPreview = await getNewsPreview();
  const featuredAchievement = MOCK_ACHIEVEMENTS.find(
    (a) => a.programSlug === "robotics-automation"
  );

  return (
    <>
      <HeroCarousel />

      {/* Mission / Vision */}
      <section className="container-page py-20">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="card flex flex-col gap-4 p-8">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600 ring-1 ring-inset ring-brand-200">
              <Target className="h-6 w-6" />
            </span>
            <h3 className="text-xl font-bold text-ink-900">Our Mission</h3>
            <p className="text-sm leading-relaxed text-ink-500">
              To provide a nurturing and rigorous learning environment that empowers
              students with the knowledge, skills, and character needed to excel
              academically and contribute meaningfully to society.
            </p>
          </div>
          <div className="card flex flex-col gap-4 p-8">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600 ring-1 ring-inset ring-brand-200">
              <Compass className="h-6 w-6" />
            </span>
            <h3 className="text-xl font-bold text-ink-900">Our Vision</h3>
            <p className="text-sm leading-relaxed text-ink-500">
              To be a leading institution recognized for academic excellence,
              innovation in science and technology, and the holistic development
              of every student we serve.
            </p>
          </div>
        </div>
      </section>

      {/* S&T / Robotics feature */}
      <section className="bg-slate-50 py-20">
        <div className="container-page grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div>
            <span className="tag-pill">S&amp;T · Robotics</span>
            <h2 className="section-heading mt-4">
              Building Innovators Through Science &amp; Technology
            </h2>
            <p className="section-subheading">
              Our STEM Center gives students hands-on access to robotics kits,
              science labs, and web development tools — turning curiosity into
              real-world engineering skills.
            </p>
            {featuredAchievement && (
              <p className="mt-3 text-sm font-medium text-brand-700">
                Latest win: {featuredAchievement.title} ({featuredAchievement.year})
              </p>
            )}
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="card flex items-start gap-3 p-5">
                <Bot className="h-5 w-5 shrink-0 text-brand-600" />
                <div>
                  <h4 className="font-semibold text-ink-900">Robotics Lab</h4>
                  <p className="mt-1 text-sm text-ink-500">
                    Build and program autonomous robots.
                  </p>
                </div>
              </div>
              <div className="card flex items-start gap-3 p-5">
                <FlaskConical className="h-5 w-5 shrink-0 text-brand-600" />
                <div>
                  <h4 className="font-semibold text-ink-900">Science Lab</h4>
                  <p className="mt-1 text-sm text-ink-500">
                    Fully equipped physics, chemistry &amp; biology labs.
                  </p>
                </div>
              </div>
              <div className="card flex items-start gap-3 p-5 sm:col-span-2">
                <Cpu className="h-5 w-5 shrink-0 text-brand-600" />
                <div>
                  <h4 className="font-semibold text-ink-900">Web Development</h4>
                  <p className="mt-1 text-sm text-ink-500">
                    Full-stack coding curriculum for all grade levels.
                  </p>
                </div>
              </div>
            </div>
            <Link href="/stem-center" className="btn-primary mt-8 w-fit">
              Explore STEM Center
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-slate-200">
            <div className="skeleton absolute inset-0" />
            <Image src={HERO_IMG_1} alt="Students working in STEM lab" fill className="object-cover" />
          </div>
        </div>
      </section>

      {/* Latest news preview */}
      <section className="container-page py-20">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h2 className="section-heading">Latest News</h2>
            <p className="section-subheading">
              Stay updated with the latest happenings at Alene High School.
            </p>
          </div>
          <Link href="/news" className="btn-secondary">
            View All News
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {newsPreview.map((item) => (
            <article key={item.title} className="card overflow-hidden">
              <div className="relative h-48 w-full">
                <div className="skeleton absolute inset-0" />
                <Image src={item.imageUrl} alt={item.title} fill className="object-cover" />
                <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-brand-700 backdrop-blur">
                  {item.category}
                </span>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-1.5 text-xs text-ink-400">
                  <CalendarDays className="h-3.5 w-3.5" />
                  {new Date(item.publishedAt).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </div>
                <h3 className="mt-2 font-semibold text-ink-900">{item.title}</h3>
                <Link
                  href="/news"
                  className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700"
                >
                  Read More <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container-page pb-20">
        <div className="card flex flex-col items-center gap-4 bg-slate-50 px-8 py-14 text-center">
          <h2 className="text-2xl font-bold text-ink-900 sm:text-3xl">
            Ready to Join Alene High School?
          </h2>
          <p className="max-w-xl text-sm text-ink-500">
            Check your entrance exam result or get in touch with our admissions
            team to learn more about enrollment.
          </p>
          <div className="mt-2 flex flex-wrap justify-center gap-3">
            <Link href="/entrance-exam-result" className="btn-primary">
              Check Exam Result
            </Link>
            <Link href="/contact-us" className="btn-secondary">
              Contact Admissions
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
