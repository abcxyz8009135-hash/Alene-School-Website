import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import Photo from "@/components/Photo";
import ProgramCard from "@/components/ProgramCard";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import { getContent } from "@/lib/content";
import { fetchProgramsByCategory } from "@/lib/programs";
import { fetchSettings } from "@/lib/settings";

export async function generateMetadata(): Promise<Metadata> {
  const c = await getContent();
  return { title: c.text("seo.community.title"), description: c.text("seo.community.description") };
}

export default async function CommunityPage() {
  const [programs, settings, c] = await Promise.all([
    fetchProgramsByCategory("hobbies"),
    fetchSettings(),
    getContent(),
  ]);
  const themes = c.list("community.themes");

  return (
    <>
      <PageHeader
        eyebrow={c.text("community.eyebrow")}
        title={c.text("community.headline")}
        intro={c.text("community.intro")}
        image={settings.hobbiesHeroImage}
        imageAlt="Students painting a school building as a community service project"
      />

      {/* Themes */}
      <section aria-label="Community themes" className="border-y border-ink-200 bg-ink-50">
        <ol
          className={`container-page grid grid-cols-1 divide-y divide-ink-200 md:divide-x md:divide-y-0 ${
            themes.length === 1 ? "" : themes.length === 2 || themes.length === 4 ? "md:grid-cols-2" : "md:grid-cols-3"
          }`}
        >
          {themes.map((theme, i) => (
            <Reveal
              as="li"
              key={i}
              delay={i * 80}
              className="py-10 md:px-8 md:first:pl-0 md:last:pr-0"
            >
              <span className="font-display text-sm font-semibold tabular-nums text-crimson-600">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h2 className="mt-3 font-display text-xl font-bold text-ink-900">{theme.title}</h2>
              <p className="mt-2 leading-relaxed text-ink-600">{theme.body}</p>
            </Reveal>
          ))}
        </ol>
      </section>

      {/* Programs */}
      <section aria-labelledby="clubs-title" className="section-y-sm">
        <div className="container-page">
          <SectionHeading
            eyebrow={c.text("community.clubs.eyebrow")}
            title={<span id="clubs-title">{c.text("community.clubs.title")}</span>}
            intro={c.text("community.clubs.intro")}
          />
          <ul className="mt-12 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {programs.map((program, i) => (
              <Reveal as="li" key={program.slug} delay={(i % 4) * 80}>
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

      {/* Photo pair */}
      <section aria-label="Community photographs" className="pb-16 sm:pb-24 lg:pb-32">
        <div className="container-page grid grid-cols-1 gap-4 sm:grid-cols-12">
          <Reveal className="sm:col-span-7">
            <Photo
              src={settings.communityImage1}
              alt="Alene students and staff clearing the school grounds together"
              sizes="(min-width: 640px) 58vw, 100vw"
              className="aspect-[4/3] w-full rounded-sm"
            />
          </Reveal>
          <Reveal delay={100} className="sm:col-span-5 sm:mt-24">
            <Photo
              src={settings.communityImage2}
              alt="Alene students gathered for morning assembly"
              sizes="(min-width: 640px) 42vw, 100vw"
              className="aspect-[4/3] w-full rounded-sm"
            />
          </Reveal>
        </div>
      </section>
    </>
  );
}
