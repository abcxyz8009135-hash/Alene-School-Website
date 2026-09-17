import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Award, CalendarClock, CheckCircle2, TrendingUp } from "lucide-react";
import type { Program, ProgramAchievement } from "@/lib/types";

const CATEGORY_LABEL: Record<Program["category"], string> = {
  "stem-center": "STEM Center",
  hobbies: "Hobbies & Co-Curriculars",
};

interface ProgramDetailProps {
  program: Program;
  achievements: ProgramAchievement[];
}

export default function ProgramDetail({ program, achievements }: ProgramDetailProps) {
  const categoryHref = `/${program.category}`;

  return (
    <>
      <section className="relative flex h-[34vh] min-h-[260px] items-end overflow-hidden">
        <div className="skeleton absolute inset-0" />
        <Image src={program.imageSrc} alt={program.title} fill priority className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-ink-950/40 to-ink-950/10" />
        <div className="container-page relative pb-10">
          <Link
            href={categoryHref}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-white/80 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to {CATEGORY_LABEL[program.category]}
          </Link>
          <h1 className="mt-4 text-4xl font-bold text-white sm:text-5xl">{program.title}</h1>
          <p className="mt-2 text-sm text-white/80">
            Established {program.establishedYear} · {CATEGORY_LABEL[program.category]}
          </p>
        </div>
      </section>

      <section className="container-page py-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-ink-900">Program Overview</h2>
            <p className="mt-4 leading-relaxed text-ink-500">{program.description}</p>

            <h3 className="mt-10 text-lg font-semibold text-ink-900">Curriculum Highlights</h3>
            <ul className="mt-4 space-y-3">
              {program.curriculumHighlights.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-ink-600">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="card p-6">
              <div className="flex items-center gap-2.5">
                <Award className="h-5 w-5 text-brand-600" />
                <h3 className="font-semibold text-ink-900">Key Achievements</h3>
              </div>
              <p className="mt-1 text-xs text-ink-400">
                Since establishment in {program.establishedYear}
              </p>

              <div className="mt-5 space-y-5">
                {achievements.length === 0 && (
                  <p className="text-sm text-ink-500">
                    Achievement records for this program are being compiled.
                  </p>
                )}
                {achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className="border-l-2 border-brand-200 pl-4"
                  >
                    <div className="flex items-center gap-1.5 text-xs font-medium text-ink-400">
                      <CalendarClock className="h-3.5 w-3.5" />
                      {achievement.year}
                    </div>
                    <h4 className="mt-1 text-sm font-semibold text-ink-900">
                      {achievement.title}
                    </h4>
                    <p className="mt-1 text-xs leading-relaxed text-ink-500">
                      {achievement.description}
                    </p>
                    {achievement.metricLabel && achievement.metricValue && (
                      <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-2.5 py-1 text-[11px] font-semibold text-brand-700 ring-1 ring-inset ring-brand-200">
                        <TrendingUp className="h-3 w-3" />
                        {achievement.metricLabel}: {achievement.metricValue}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
