import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import Photo from "@/components/Photo";
import Reveal from "@/components/Reveal";
import { internalHref, type SiteContent } from "@/lib/content";

interface StemSectionProps {
  image: string;
  insetImage: string;
  content: SiteContent;
}

export default function StemSection({ image, insetImage, content: c }: StemSectionProps) {
  const items = c.list("home.stem.items");
  return (
    <section aria-labelledby="stem-title" className="section-y relative overflow-hidden bg-brand-900 text-white">
      <div
        aria-hidden="true"
        className="crest-rings pointer-events-none absolute -right-72 top-10 h-[820px] w-[820px] text-white/[0.07]"
      />

      <div className="container-page relative">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <div className="flex items-center gap-4">
              <span className="section-index text-white/50">04</span>
              <p className="eyebrow eyebrow-light">{c.text("home.stem.eyebrow")}</p>
            </div>
            <h2 id="stem-title" className="display-2 mt-6">
              <span className="block">{c.text("home.stem.headline")}</span>
              <span className="block text-brand-300">{c.text("home.stem.headlineAccent")}</span>
            </h2>
          </div>
          <div className="lg:col-span-4">
            <p className="text-lg leading-relaxed text-white/75">{c.text("home.stem.body")}</p>
            <Link
              href="/stem-center"
              className="btn mt-6 bg-white text-brand-800 hover:bg-brand-50 focus-visible:ring-white focus-visible:ring-offset-brand-900"
            >
              {c.text("home.stem.button")}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>

        <Reveal className="relative mt-14 lg:mt-20">
          <Photo
            src={image}
            alt="Alene students presenting a fish-farming robot they built for a robotics competition"
            sizes="(min-width: 1280px) 1180px, 100vw"
            className="aspect-[4/3] w-full rounded-sm sm:aspect-[16/9] lg:aspect-[21/9]"
            imgClassName="object-[center_40%]"
          />
          <div className="absolute -bottom-10 right-4 hidden w-56 border-4 border-brand-900 sm:block md:w-72 lg:-bottom-14 lg:right-10 lg:w-80">
            <Photo
              src={insetImage}
              alt="Students examining a sample under a microscope"
              sizes="320px"
              className="aspect-[4/3] w-full"
            />
          </div>
        </Reveal>

        <ol
          className={`mt-16 grid grid-cols-1 gap-y-2 sm:mt-24 md:gap-x-8 ${
            items.length >= 4 ? "md:grid-cols-2 lg:grid-cols-4" : items.length === 2 ? "md:grid-cols-2" : "md:grid-cols-3"
          }`}
        >
          {items.map((item, i) => (
            <Reveal as="li" key={i} delay={i * 100}>
              <Link
                href={internalHref(item.href, "/stem-center")}
                className="group block border-t border-white/20 py-7 transition-colors hover:border-white focus-visible:ring-white focus-visible:ring-offset-brand-900"
              >
                <div className="flex items-start justify-between">
                  <span className="font-display text-5xl font-extrabold tabular-nums text-white/25 transition-colors group-hover:text-brand-300">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <ArrowUpRight
                    className="h-5 w-5 text-white/40 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white"
                    aria-hidden="true"
                  />
                </div>
                <h3 className="mt-5 font-display text-xl font-extrabold uppercase tracking-[0.08em]">
                  {item.title}
                </h3>
                <p className="mt-2 max-w-xs leading-relaxed text-white/70">{item.body}</p>
              </Link>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
