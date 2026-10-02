import type { Metadata } from "next";
import ProgramCard from "@/components/ProgramCard";
import PageHeader from "@/components/PageHeader";
import Photo from "@/components/Photo";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import { getContent } from "@/lib/content";
import { fetchProgramsByCategory } from "@/lib/programs";
import { fetchSettings } from "@/lib/settings";

export async function generateMetadata(): Promise<Metadata> {
  const c = await getContent();
  return { title: c.text("seo.stem.title"), description: c.text("seo.stem.description") };
}

export default async function StemCenterPage() {
  const [programs, settings, c] = await Promise.all([
    fetchProgramsByCategory("stem-center"),
    fetchSettings(),
    getContent(),
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
        eyebrow={c.text("stem.eyebrow")}
        title={
          <>
            {c.text("stem.headline")}
            <span className="block text-brand-600">{c.text("stem.headlineAccent")}</span>
          </>
        }
        intro={c.text("stem.intro")}
        image={settings.stemPageImage}
        imageAlt="Alene students presenting a fish-farming robot they built"
      />

      {/* Programs */}
      <section aria-labelledby="programs-title" className="section-y-sm border-t border-ink-200">
        <div className="container-page">
          <SectionHeading
            eyebrow={c.text("stem.programs.eyebrow")}
            title={<span id="programs-title">{c.text("stem.programs.title")}</span>}
            intro={c.text("stem.programs.intro")}
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
            eyebrow={c.text("stem.approach.eyebrow")}
            title={<span id="approach-title">{c.text("stem.approach.title")}</span>}
          />
          <ol className="mt-12 grid grid-cols-1 gap-y-2 md:grid-cols-3 md:gap-x-8">
            {c.list("stem.approach.steps").map((item, i) => (
              <Reveal as="li" key={i} delay={i * 100} className="border-t border-white/20 py-7">
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
            <SectionHeading
              eyebrow={c.text("stem.gallery.eyebrow")}
              title={<span id="gallery-title">{c.text("stem.gallery.title")}</span>}
            />
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
