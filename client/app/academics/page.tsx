import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import Photo from "@/components/Photo";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import ExamResultsCTA from "@/components/ExamResultsCTA";
import { getContent, lines } from "@/lib/content";
import { fetchSettings } from "@/lib/settings";

export async function generateMetadata(): Promise<Metadata> {
  const c = await getContent();
  return { title: c.text("seo.academics.title"), description: c.text("seo.academics.description") };
}

export default async function AcademicsPage() {
  const [settings, c] = await Promise.all([fetchSettings(), getContent()]);
  const areas = c.list("academics.areas");
  const points = c.list("academics.points");

  return (
    <>
      <PageHeader
        eyebrow={c.text("academics.eyebrow")}
        title={
          <>
            {c.text("academics.headline")}
            <span className="block text-brand-600">{c.text("academics.headlineAccent")}</span>
          </>
        }
        intro={c.text("academics.intro")}
        image={settings.academicsHeroImage}
        imageAlt="Alene students carrying out a laboratory practical"
      >
        <div className="flex flex-wrap gap-3">
          <Link href="/entrance-exam-result" className="btn-primary">
            {c.text("cta.results.button")}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <Link href="/stem-center" className="btn-secondary">
            {c.text("home.stem.eyebrow")}
          </Link>
        </div>
      </PageHeader>

      {/* Subjects */}
      <section aria-labelledby="subjects-title" className="section-y-sm border-t border-ink-200">
        <div className="container-page">
          <SectionHeading
            eyebrow={c.text("academics.subjects.eyebrow")}
            title={<span id="subjects-title">{c.text("academics.subjects.title")}</span>}
            intro={c.text("academics.subjects.intro")}
          />
          <div className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-sm border border-ink-200 bg-ink-200 sm:grid-cols-2 lg:grid-cols-4">
            {areas.map((area, i) => (
              <Reveal key={i} delay={i * 80} className="bg-white p-7">
                <span className="font-display text-sm font-semibold tabular-nums text-brand-600">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 font-display text-xl font-bold text-ink-900">{area.title}</h3>
                <ul className="mt-4 space-y-2">
                  {lines(area.subjects).map((subject, j) => (
                    <li key={`${subject}-${j}`} className="flex items-center gap-2.5 text-ink-600">
                      <span className="h-1.5 w-1.5 rounded-full bg-crimson-600" aria-hidden="true" />
                      {subject}
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Approach */}
      <section aria-labelledby="approach-title" className="section-y-sm bg-brand-50">
        <div className="container-page grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-6">
            <SectionHeading
              eyebrow={c.text("academics.approach.eyebrow")}
              title={<span id="approach-title">{c.text("academics.approach.title")}</span>}
            />
            <ol className="mt-10 divide-y divide-brand-200 border-y border-brand-200">
              {points.map((point, i) => (
                <Reveal as="li" key={i} delay={i * 80} className="grid grid-cols-[3.5rem_1fr] gap-4 py-6">
                  <span className="font-display text-3xl font-extrabold tabular-nums text-brand-600">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-bold text-ink-900">{point.title}</h3>
                    <p className="mt-1.5 leading-relaxed text-ink-600">{point.body}</p>
                  </div>
                </Reveal>
              ))}
            </ol>
          </div>
          <Reveal className="lg:col-span-6">
            <Photo
              src={settings.academicsApproachImage}
              alt="Students examining a sample under a microscope"
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="aspect-[4/3] w-full rounded-sm"
            />
          </Reveal>
        </div>
      </section>

      <div className="pt-16 sm:pt-24 lg:pt-32">
        <ExamResultsCTA />
      </div>
    </>
  );
}
