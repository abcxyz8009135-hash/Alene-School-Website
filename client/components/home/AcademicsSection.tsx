import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Photo from "@/components/Photo";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import { lines, type SiteContent } from "@/lib/content";

interface AcademicsSectionProps {
  image: string;
  content: SiteContent;
}

export default function AcademicsSection({ image, content: c }: AcademicsSectionProps) {
  const areas = c.list("academics.areas");
  const points = c.list("academics.points");
  return (
    <section aria-labelledby="academics-title" className="section-y bg-white">
      <div className="container-page grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-16">
        <div className="order-2 lg:order-1 lg:col-span-5">
          <Reveal className="lg:sticky lg:top-28">
            <Photo
              src={image}
              alt="Alene students gathered for morning assembly in the school courtyard"
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="aspect-[4/3] w-full rounded-sm lg:aspect-[4/5]"
            />
            <div className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-sm border border-ink-200 bg-ink-200">
              {areas.map((area, i) => (
                <div key={i} className="bg-white p-4">
                  <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-crimson-600">
                    {area.title}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-ink-600">{lines(area.subjects).join(" · ")}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        <div className="order-1 lg:order-2 lg:col-span-7">
          <SectionHeading
            index="03"
            eyebrow={c.text("home.academics.eyebrow")}
            title={<span id="academics-title">{c.text("home.academics.title")}</span>}
            intro={c.text("home.academics.intro")}
          />

          <ol className="mt-12 divide-y divide-ink-200 border-y border-ink-200">
            {points.map((point, i) => (
              <Reveal as="li" key={i} delay={i * 80} className="grid grid-cols-[3rem_1fr] gap-4 py-7 sm:grid-cols-[4.5rem_1fr]">
                <span className="font-display text-3xl font-extrabold tabular-nums text-brand-600 sm:text-4xl">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="font-display text-xl font-bold text-ink-900">{point.title}</h3>
                  <p className="mt-2 leading-relaxed text-ink-600">{point.body}</p>
                </div>
              </Reveal>
            ))}
          </ol>

          <div className="mt-10 flex flex-wrap items-center gap-6">
            <Link href="/academics" className="btn-primary">
              {c.text("home.academics.button")}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link href="/entrance-exam-result" className="link-arrow">
              {c.text("cta.results.button")}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
