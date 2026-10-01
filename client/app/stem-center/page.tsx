import type { Metadata } from "next";
import ProgramCard from "@/components/ProgramCard";
import PageHeader from "@/components/PageHeader";
import Photo from "@/components/Photo";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import { STEM_COPY } from "@/lib/content";
import { fetchProgramsByCategory } from "@/lib/programs";
import { fetchSettings } from "@/lib/settings";

export const metadata: Metadata = {
  title: "STEM",
  description:
    "STEM at Alene High School, Mekelle: robotics, practical laboratory science and technology, learned by building, testing and presenting.",
};

const APPROACH = [
  {
    title: "Research projects",
    body: "Guided projects that build careful, critical scientific thinking.",
  },
  {
    title: "Build and test",
    body: "Students design something, try it, see where it fails and improve it.",
  },
  {
    title: "Present the work",
    body: "Projects are explained to judges, teachers and peers — at school and at competitions.",
  },
];

export default async function StemCenterPage() {
  const [programs, settings] = await Promise.all([
    fetchProgramsByCategory("stem-center"),
    fetchSettings(),
  ]);

  const galleryImages = [
    settings.stemGalleryImage1,
    settings.stemGalleryImage2,
    settings.stemGalleryImage3,
    settings.stemGalleryImage4,
    settings.stemGalleryImage5,
    settings.stemGalleryImage6,
  ].filter(Boolean);

  return (
    <>
      <PageHeader
        eyebrow={STEM_COPY.eyebrow}
        title={
          <>
            {STEM_COPY.headline}
            <span className="block text-brand-600">{STEM_COPY.headlineAccent}</span>
          </>
        }
        intro={STEM_COPY.body}
        image={settings.homeStemImage}
        imageAlt="Alene students presenting a fish-farming robot they built"
      />

      {/* Programs */}
      <section aria-labelledby="programs-title" className="section-y-sm border-t border-ink-200">
        <div className="container-page">
          <SectionHeading
            eyebrow="Programs"
            title={<span id="programs-title">Where students explore.</span>}
            intro="Choose a program to see what students do and what they have achieved."
          />
          <ul className="mt-12 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {programs.map((program, i) => (
              <Reveal as="li" key={program.slug} delay={i * 80}>
                <ProgramCard
                  index={i + 1}
                  title={program.title}
                  description={program.summary}
                  imageSrc={program.imageSrc}
                  slug={program.slug}
                  category={program.category}
                />
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* Approach */}
      <section aria-labelledby="approach-title" className="section-y-sm bg-brand-900 text-white">
        <div className="container-page">
          <SectionHeading
            tone="light"
            eyebrow="How STEM works here"
            title={<span id="approach-title">Curiosity, then evidence.</span>}
          />
          <ol className="mt-12 grid grid-cols-1 gap-y-2 md:grid-cols-3 md:gap-x-8">
            {APPROACH.map((item, i) => (
              <Reveal as="li" key={item.title} delay={i * 100} className="border-t border-white/20 py-7">
                <span className="font-display text-5xl font-extrabold tabular-nums text-white/25">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-5 font-display text-xl font-extrabold uppercase tracking-[0.08em]">
                  {item.title}
                </h3>
                <p className="mt-2 max-w-xs leading-relaxed text-white/70">{item.body}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Gallery */}
      {galleryImages.length > 0 && (
        <section aria-labelledby="gallery-title" className="section-y-sm">
          <div className="container-page">
            <SectionHeading eyebrow="Gallery" title={<span id="gallery-title">In the lab and the workshop.</span>} />
            <div className="mt-12 grid auto-rows-[150px] grid-cols-2 gap-3 sm:auto-rows-[220px] sm:gap-4 lg:grid-cols-4">
              {galleryImages.map((src, i) => (
                <Reveal
                  key={`${src}-${i}`}
                  delay={(i % 4) * 60}
                  className={i === 0 ? "col-span-2 row-span-2 h-full" : "h-full"}
                >
                  <Photo
                    src={src}
                    alt={`STEM at Alene, photo ${i + 1}`}
                    sizes={i === 0 ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 25vw, 50vw"}
                    className="h-full w-full rounded-sm"
                  />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
