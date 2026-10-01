import Photo from "@/components/Photo";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import type { ProgramAchievement } from "@/lib/types";

export interface AchievementSlot {
  label: string;
  achievement?: ProgramAchievement;
}

interface AchievementSectionProps {
  image: string;
  slots: AchievementSlot[];
}

export default function AchievementSection({ image, slots }: AchievementSectionProps) {
  const [featured, ...rest] = slots;

  return (
    <section id="achievements" aria-labelledby="achievements-title" className="section-y scroll-mt-20 bg-white">
      <div className="container-page">
        <SectionHeading
          index="05"
          eyebrow="Student achievements"
          title={<span id="achievements-title">What our students achieve.</span>}
          intro="Results earned through practice, teamwork and persistence — in competitions, in the classroom and in the community."
        />

        <div className="mt-14 grid grid-cols-1 gap-px overflow-hidden border border-ink-200 bg-ink-200 lg:mt-16 lg:grid-cols-12">
          {/* Featured achievement with photograph */}
          {featured && (
            <Reveal as="article" className="relative bg-white lg:col-span-7">
              <Photo
                src={image}
                alt="Alene robotics students receiving an award on stage"
                sizes="(min-width: 1024px) 58vw, 100vw"
                className="aspect-[4/3] w-full sm:aspect-[16/10]"
              />
              <div className="p-6 sm:p-8 lg:p-10">
                <AchievementBody index={1} slot={featured} large />
              </div>
            </Reveal>
          )}

          <div className="grid grid-cols-1 gap-px bg-ink-200 lg:col-span-5">
            {rest.map((slot, i) => (
              <Reveal as="article" key={slot.label} delay={(i + 1) * 100} className="bg-white p-6 sm:p-8 lg:p-10">
                <AchievementBody index={i + 2} slot={slot} />
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function AchievementBody({
  index,
  slot,
  large = false,
}: {
  index: number;
  slot: AchievementSlot;
  large?: boolean;
}) {
  const a = slot.achievement;

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-baseline gap-4">
        <span
          className={`font-display font-extrabold tabular-nums leading-none text-brand-600 ${
            large ? "text-6xl sm:text-7xl" : "text-5xl"
          }`}
        >
          {String(index).padStart(2, "0")}
        </span>
        <span className="text-xs font-bold uppercase tracking-[0.18em] text-crimson-600">{slot.label}</span>
      </div>

      {a ? (
        <>
          <h3
            className={`mt-5 font-display font-bold leading-snug text-ink-900 ${
              large ? "text-2xl sm:text-3xl" : "text-xl"
            }`}
          >
            {a.title}
          </h3>
          <p className="mt-3 leading-relaxed text-ink-600">{a.description}</p>
          <div className="mt-auto flex flex-wrap items-center gap-x-6 gap-y-2 pt-6 text-sm">
            <span className="font-semibold tabular-nums text-ink-900">{a.year}</span>
            {a.metricLabel && a.metricValue && (
              <span className="text-ink-500">
                <span className="font-display text-lg font-bold text-brand-700">{a.metricValue}</span>{" "}
                {a.metricLabel.toLowerCase()}
              </span>
            )}
          </div>
        </>
      ) : (
        <p className="mt-5 text-ink-500">Achievements for this area will be published here.</p>
      )}
    </div>
  );
}
