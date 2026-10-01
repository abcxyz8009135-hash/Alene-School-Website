import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import Photo from "@/components/Photo";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import ExamResultsCTA from "@/components/ExamResultsCTA";
import { ACADEMIC_AREAS, ACADEMIC_POINTS } from "@/lib/content";
import { fetchSettings } from "@/lib/settings";

export const metadata: Metadata = {
  title: "Academics",
  description:
    "Academics at Alene High School, Mekelle: the national curriculum with a strong emphasis on science, practical laboratory learning and examination support.",
};

export default async function AcademicsPage() {
  const settings = await fetchSettings();

  return (
    <>
      <PageHeader
        eyebrow="Academics"
        title={
          <>
            Learning with purpose.
            <span className="block text-brand-600">Science at the centre.</span>
          </>
        }
        intro="Alene follows the national curriculum, with a deliberate lean towards the sciences and a habit of learning by doing."
        image={settings.homeHeroImage}
        imageAlt="Alene students carrying out a laboratory practical"
      >
        <div className="flex flex-wrap gap-3">
          <Link href="/entrance-exam-result" className="btn-primary">
            Check exam results
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <Link href="/stem-center" className="btn-secondary">
            STEM at Alene
          </Link>
        </div>
      </PageHeader>

      {/* Subjects */}
      <section aria-labelledby="subjects-title" className="section-y-sm border-t border-ink-200">
        <div className="container-page">
          <SectionHeading
            eyebrow="Subjects"
            title={<span id="subjects-title">What students study.</span>}
            intro="Subjects are grouped into four areas. Every student builds a strong foundation in mathematics and the natural sciences."
          />
          <div className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-sm border border-ink-200 bg-ink-200 sm:grid-cols-2 lg:grid-cols-4">
            {ACADEMIC_AREAS.map((area, i) => (
              <Reveal key={area.title} delay={i * 80} className="bg-white p-7">
                <span className="font-display text-sm font-semibold tabular-nums text-brand-600">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 font-display text-xl font-bold text-ink-900">{area.title}</h3>
                <ul className="mt-4 space-y-2">
                  {area.subjects.map((subject) => (
                    <li key={subject} className="flex items-center gap-2.5 text-ink-600">
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
              eyebrow="How we teach"
              title={<span id="approach-title">Understanding over memorising.</span>}
            />
            <ol className="mt-10 divide-y divide-brand-200 border-y border-brand-200">
              {ACADEMIC_POINTS.map((point, i) => (
                <Reveal as="li" key={point.title} delay={i * 80} className="grid grid-cols-[3.5rem_1fr] gap-4 py-6">
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
              src={settings.stemHeroImage}
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
