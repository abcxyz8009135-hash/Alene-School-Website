import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import PageHeader from "./PageHeader";
import Reveal from "./Reveal";
import { CATEGORY_LABEL, CATEGORY_ROUTE } from "@/lib/constants";
import type { Program, ProgramAchievement } from "@/lib/types";

interface ProgramDetailProps {
  program: Program;
  achievements: ProgramAchievement[];
}

export default function ProgramDetail({ program, achievements }: ProgramDetailProps) {
  return (
    <>
      <PageHeader
        eyebrow={CATEGORY_LABEL[program.category]}
        title={program.title}
        intro={program.summary}
        image={program.imageSrc}
        imageAlt={program.title}
      >
        <Link href={CATEGORY_ROUTE[program.category]} className="link-arrow">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to {CATEGORY_LABEL[program.category]}
        </Link>
      </PageHeader>

      <section className="section-y-sm border-t border-ink-200">
        <div className="container-page grid grid-cols-1 gap-14 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="eyebrow">Overview</p>
            <h2 className="section-heading mt-5">About the program</h2>
            <p className="prose-body mt-6 lg:text-lg">{program.description}</p>

            {program.curriculumHighlights.length > 0 && (
              <>
                <h3 className="mt-14 font-display text-xl font-bold text-ink-900">What students do</h3>
                <ol className="mt-6 divide-y divide-ink-200 border-y border-ink-200">
                  {program.curriculumHighlights.map((item, i) => (
                    <li key={item} className="grid grid-cols-[3rem_1fr] gap-3 py-4">
                      <span className="font-display font-semibold tabular-nums text-brand-600">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="text-ink-700">{item}</span>
                    </li>
                  ))}
                </ol>
              </>
            )}
            {program.establishedYear ? (
              <p className="mt-8 text-sm text-ink-500">Established {program.establishedYear}</p>
            ) : null}
          </div>

          <aside aria-labelledby="program-achievements" className="lg:col-span-5">
            <div className="border-t-4 border-crimson-600 bg-ink-50 p-6 sm:p-8">
              <p className="eyebrow">Achievements</p>
              <h2 id="program-achievements" className="mt-4 font-display text-2xl font-bold text-ink-900">
                Student results
              </h2>

              {achievements.length === 0 ? (
                <p className="mt-6 text-ink-500">Achievements for this program will be published here.</p>
              ) : (
                <ol className="mt-6 space-y-7">
                  {achievements.map((a, i) => (
                    <Reveal as="li" key={a.id} delay={i * 60} className="border-l-2 border-brand-600 pl-5">
                      <p className="text-xs font-bold tabular-nums tracking-[0.14em] text-crimson-600">{a.year}</p>
                      <h3 className="mt-1.5 font-display font-bold leading-snug text-ink-900">{a.title}</h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-ink-600">{a.description}</p>
                      {a.metricLabel && a.metricValue && (
                        <p className="mt-3 text-sm text-ink-500">
                          <span className="font-display text-xl font-extrabold text-brand-700">{a.metricValue}</span>{" "}
                          {a.metricLabel.toLowerCase()}
                        </p>
                      )}
                    </Reveal>
                  ))}
                </ol>
              )}
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
