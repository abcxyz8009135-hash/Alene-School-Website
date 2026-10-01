import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { EXAM_RESULTS_LINK } from "@/lib/constants";

export default function ExamResultsCTA() {
  return (
    <section aria-labelledby="results-cta-title" className="bg-white pb-16 sm:pb-24 lg:pb-32">
      <div className="container-page">
        <div className="relative overflow-hidden rounded-sm border-l-4 border-crimson-600 bg-brand-50 px-6 py-10 sm:px-10 sm:py-12 lg:flex lg:items-center lg:justify-between lg:gap-12 lg:px-14">
          <div
            aria-hidden="true"
            className="crest-rings pointer-events-none absolute -right-24 -top-24 h-72 w-72 text-brand-600/15"
          />
          <div className="relative max-w-2xl">
            <p className="eyebrow">Academic results</p>
            <h2
              id="results-cta-title"
              className="mt-4 font-display text-2xl font-bold leading-snug text-ink-900 sm:text-3xl"
            >
              See examination results and academic updates.
            </h2>
            <p className="mt-3 text-ink-600">
              Students can look up their entrance exam result with their registration ID.
            </p>
          </div>
          <Link href={EXAM_RESULTS_LINK.href} className="btn-primary relative mt-8 px-7 py-3.5 uppercase tracking-[0.1em] lg:mt-0 lg:shrink-0">
            Check exam results
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
