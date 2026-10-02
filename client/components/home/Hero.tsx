import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Photo from "@/components/Photo";
import type { SiteContent } from "@/lib/content";
import { EXAM_RESULTS_HREF } from "@/lib/constants";

interface HeroProps {
  image: string;
  content: SiteContent;
}

export default function Hero({ image, content: c }: HeroProps) {
  const facts = c.list("home.hero.facts").map((f) => f.text).filter(Boolean);
  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden bg-white">
      {/* Crest-inspired rings, decorative only */}
      <div
        aria-hidden="true"
        className="crest-rings pointer-events-none absolute -right-48 -top-48 hidden h-[640px] w-[640px] text-brand-600/10 lg:block"
      />

      <div className="container-page relative grid grid-cols-1 items-center gap-12 pb-16 pt-12 sm:pb-20 sm:pt-16 lg:grid-cols-12 lg:gap-10 lg:pb-28 lg:pt-20">
        <div className="lg:col-span-6 xl:col-span-6">
          <div className="flex items-center gap-4">
            <span className="section-index">01</span>
            <p className="eyebrow">{c.text("home.hero.eyebrow")}</p>
          </div>

          <h1 id="hero-title" className="display-1 mt-6 text-ink-900">
            <span className="block uppercase">{c.text("home.hero.headline")}</span>
            <span className="mt-2 block font-bold normal-case tracking-[-0.025em] text-brand-600">
              {c.text("home.hero.headlineAccent")}
            </span>
          </h1>

          <p className="lede mt-7 max-w-xl">{c.text("home.hero.body")}</p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link href="/about-us" className="btn-primary px-6">
              {c.text("home.hero.primaryCta")}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link href="/#achievements" className="btn-secondary px-6">
              {c.text("home.hero.secondaryCta")}
            </Link>
          </div>
          <Link href={EXAM_RESULTS_HREF} className="link-arrow mt-6">
            {c.text("home.hero.resultsLink")}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>

          <ul
            className={`mt-12 grid grid-cols-1 border-t border-ink-200 ${facts.length >= 3 ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}
          >
            {facts.map((fact, i) => (
              <li
                key={i}
                className={`py-4 text-sm font-semibold text-ink-700 sm:py-5 ${
                  i > 0 ? "border-t border-ink-200 sm:border-l sm:border-t-0 sm:pl-5" : "sm:pr-5"
                }`}
              >
                {fact}
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-6 xl:col-span-6">
          <div className="relative">
            {/* Red brand block offset behind the photograph */}
            <div
              aria-hidden="true"
              className="absolute -bottom-4 -left-4 h-2/3 w-2/3 bg-crimson-600 sm:-bottom-6 sm:-left-6"
            />
            <Photo
              src={image}
              alt="Alene students carrying out a laboratory practical in school uniform"
              sizes="(min-width: 1024px) 50vw, 100vw"
              priority
              className="relative aspect-[4/3] w-full rounded-sm lg:aspect-[5/6] xl:aspect-[4/5]"
              imgClassName="object-[35%_center]"
            />
          </div>
          <p className="mt-10 flex items-center justify-end gap-3 text-xs font-medium uppercase tracking-[0.16em] text-ink-500 sm:mt-12">
            <span className="h-2 w-2 rounded-full bg-brand-600" aria-hidden="true" />
            {c.text("home.hero.caption")}
          </p>
        </div>
      </div>
    </section>
  );
}
