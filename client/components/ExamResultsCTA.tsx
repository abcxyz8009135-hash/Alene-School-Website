import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { EXAM_RESULTS_HREF } from "@/lib/constants";
import { getContent } from "@/lib/content";

export default async function ExamResultsCTA() {
  const c = await getContent();
  return (
    <section aria-labelledby="results-cta-title" className="bg-white pb-16 sm:pb-24 lg:pb-32">
      <div className="container-page">
        <div className="relative overflow-hidden rounded-sm border-l-4 border-crimson-600 bg-brand-50 px-6 py-10 sm:px-10 sm:py-12 lg:flex lg:items-center lg:justify-between lg:gap-12 lg:px-14">
          <div
            aria-hidden="true"
            className="crest-rings pointer-events-none absolute -right-24 -top-24 h-72 w-72 text-brand-600/15"
          />
          <div className="relative max-w-2xl">
            <p className="eyebrow">{c.text("cta.results.eyebrow")}</p>
            <h2
              id="results-cta-title"
              className="mt-4 font-display text-2xl font-bold leading-snug text-ink-900 sm:text-3xl"
            >
              {c.text("cta.results.title")}
            </h2>
            <p className="mt-3 text-ink-600">
              {c.text("cta.results.body")}
            </p>
          </div>
          <Link href={EXAM_RESULTS_HREF} className="btn-primary relative mt-8 px-7 py-3.5 uppercase tracking-[0.1em] lg:mt-0 lg:shrink-0">
            {c.text("cta.results.button")}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
