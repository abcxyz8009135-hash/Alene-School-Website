import Image from "next/image";
import { Lightbulb, Microscope, Rocket } from "lucide-react";
import ProgramCard from "@/components/ProgramCard";
import { STEM_GALLERY_IMAGES, STEM_HERO_IMAGE } from "@/lib/constants";
import { getProgramsByCategory } from "@/lib/programs";

const PROGRAM_FEATURES = [
  {
    icon: Microscope,
    title: "Research Projects",
    desc: "Guided independent research projects that build critical scientific thinking.",
  },
  {
    icon: Rocket,
    title: "Innovation Challenges",
    desc: "Termly innovation challenges encouraging creative problem-solving.",
  },
  {
    icon: Lightbulb,
    title: "Mentorship Program",
    desc: "Industry professionals mentor students on real-world STEM applications.",
  },
];

const STEM_PROGRAMS = getProgramsByCategory("stem-center");

export default function StemCenterPage() {
  return (
    <>
      <section className="border-b border-slate-200 bg-slate-50 py-16">
        <div className="container-page">
          <span className="tag-pill">STEM Center</span>
          <h1 className="mt-4 text-4xl font-bold text-ink-900 sm:text-5xl">
            Science &amp; Technology, Reimagined
          </h1>
          <p className="mt-4 max-w-2xl text-ink-500">
            Our state-of-the-art STEM Center equips students with the tools,
            mentorship, and lab space to explore web development, robotics,
            and applied sciences at the highest level.
          </p>
        </div>
      </section>

      {/* Program cards */}
      <section className="container-page py-16">
        <h2 className="section-heading">Explore Our Programs</h2>
        <p className="section-subheading">
          Select a program to see its curriculum and achievements.
        </p>
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {STEM_PROGRAMS.map((program) => (
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

      {/* Program features */}
      <section className="bg-slate-50 py-16">
        <div className="container-page">
          <h2 className="section-heading">Why Our STEM Center</h2>
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {PROGRAM_FEATURES.map((feature) => (
              <div key={feature.title} className="card p-6">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600 ring-1 ring-inset ring-brand-200">
                  <feature.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-semibold text-ink-900">{feature.title}</h3>
                <p className="mt-2 text-sm text-ink-500">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="container-page py-16">
        <h2 className="section-heading">Lab &amp; Robotics Gallery</h2>
        <p className="section-subheading">
          A glimpse into our science, web, and robotics facilities.
        </p>
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {STEM_GALLERY_IMAGES.map((src, i) => (
            <div
              key={src}
              className={`relative overflow-hidden rounded-xl border border-slate-200 ${
                i === 0 ? "col-span-2 row-span-2 aspect-square sm:aspect-auto" : "aspect-square"
              }`}
            >
              <div className="skeleton absolute inset-0" />
              <Image
                src={src}
                alt={`STEM Center gallery image ${i + 1}`}
                fill
                className="object-cover transition duration-500 hover:scale-105"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Hero showcase image */}
      <section className="container-page pb-20">
        <div className="relative h-64 w-full overflow-hidden rounded-2xl border border-slate-200 sm:h-80">
          <div className="skeleton absolute inset-0" />
          <Image src={STEM_HERO_IMAGE} alt="STEM Center facilities" fill className="object-cover" />
        </div>
      </section>
    </>
  );
}
