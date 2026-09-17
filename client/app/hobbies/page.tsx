import Image from "next/image";
import ProgramCard from "@/components/ProgramCard";
import { HOBBIES_HERO_IMAGE } from "@/lib/constants";
import { getProgramsByCategory } from "@/lib/programs";

const HOBBIES_PROGRAMS = getProgramsByCategory("hobbies");

export default function HobbiesPage() {
  return (
    <>
      <section className="relative flex h-[36vh] min-h-[260px] items-end overflow-hidden">
        <div className="skeleton absolute inset-0" />
        <Image
          src={HOBBIES_HERO_IMAGE}
          alt="Students in extracurricular activities"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-ink-950/40 to-ink-950/10" />
        <div className="container-page relative pb-10">
          <span className="tag-pill bg-white/90">Hobbies &amp; Co-Curriculars</span>
          <h1 className="mt-3 text-4xl font-bold text-white sm:text-5xl">
            Clubs, Sports &amp; Student Life
          </h1>
        </div>
      </section>

      <section className="container-page py-16">
        <p className="max-w-2xl text-ink-500">
          Beyond the classroom, Alene High School students thrive in arts,
          athletics, leadership, and community service — building teamwork,
          confidence, and lifelong passions.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {HOBBIES_PROGRAMS.map((program) => (
            <ProgramCard
              key={program.slug}
              title={program.title}
              description={program.summary}
              imageSrc={program.imageSrc}
              slug={program.slug}
              category={program.category}
            />
          ))}
        </div>
      </section>
    </>
  );
}
