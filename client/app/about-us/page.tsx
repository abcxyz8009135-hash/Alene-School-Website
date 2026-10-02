import type { Metadata } from "next";
import Image from "next/image";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import ExamResultsCTA from "@/components/ExamResultsCTA";
import { getContent } from "@/lib/content";
import { fetchSettings } from "@/lib/settings";

export async function generateMetadata(): Promise<Metadata> {
  const c = await getContent();
  return { title: c.text("seo.about.title"), description: c.text("seo.about.description") };
}

function initials(name: string) {
  return name
    .replace(/^(mr|mrs|ms|dr)\.?\s+/i, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export default async function AboutUsPage() {
  const [settings, c] = await Promise.all([fetchSettings(), getContent()]);

  const coreValues = [
    { title: settings.coreValue1Title, desc: settings.coreValue1Description },
    { title: settings.coreValue2Title, desc: settings.coreValue2Description },
    { title: settings.coreValue3Title, desc: settings.coreValue3Description },
    { title: settings.coreValue4Title, desc: settings.coreValue4Description },
  ].filter((v) => v.title);

  return (
    <>
      <PageHeader
        eyebrow={c.text("about.eyebrow")}
        title={
          <>
            {c.text("about.headline")}
            <span className="block text-brand-600">{c.text("about.headlineAccent")}</span>
          </>
        }
        intro={c.text("about.intro")}
        image={settings.aboutHeroImage}
        imageAlt="Alene students gathered for morning assembly in the school courtyard"
      />

      {/* History */}
      <section aria-labelledby="history-title" className="section-y-sm border-t border-ink-200">
        <div className="container-page grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="eyebrow">{c.text("about.history.eyebrow")}</p>
            <h2 id="history-title" className="section-heading mt-5">
              {c.text("about.history.title")}
            </h2>
          </div>
          <Reveal className="prose-body lg:col-span-7 lg:col-start-6 lg:text-lg">
            <p>{settings.aboutHistoryParagraph1}</p>
            <p>{settings.aboutHistoryParagraph2}</p>
          </Reveal>
        </div>
      </section>

      {/* Mission & vision */}
      <section aria-label="Mission and vision" className="bg-brand-900 text-white">
        <div className="container-page grid grid-cols-1 divide-y divide-white/15 md:grid-cols-2 md:divide-x md:divide-y-0">
          {[
            { label: c.text("about.mission.label"), text: settings.aboutMission },
            { label: c.text("about.vision.label"), text: settings.aboutVision },
          ].map((item, i) => (
            <Reveal key={item.label} delay={i * 100} className={`py-14 sm:py-20 ${i === 0 ? "md:pr-12" : "md:pl-12"}`}>
              <p className="eyebrow eyebrow-light">{item.label}</p>
              <p className="mt-6 font-display text-2xl font-semibold leading-snug sm:text-[1.7rem]">{item.text}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Core values */}
      {coreValues.length > 0 && (
        <section aria-labelledby="values-title" className="section-y-sm">
          <div className="container-page">
            <SectionHeading
              eyebrow={c.text("about.values.eyebrow")}
              title={<span id="values-title">{c.text("about.values.title")}</span>}
            />
            <ol className="mt-12 grid grid-cols-1 gap-y-10 sm:grid-cols-2 sm:gap-x-10 lg:grid-cols-4">
              {coreValues.map((value, i) => (
                <Reveal as="li" key={value.title} delay={i * 80} className="border-t-2 border-crimson-600 pt-6">
                  <span className="font-display text-sm font-semibold tabular-nums text-crimson-600">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-3 font-display text-xl font-bold text-ink-900">{value.title}</h3>
                  <p className="mt-2 leading-relaxed text-ink-600">{value.desc}</p>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>
      )}

      {/* The crest */}
      <section aria-labelledby="crest-title" className="section-y-sm bg-ink-50">
        <div className="container-page grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          <Reveal className="mx-auto w-full max-w-xs lg:col-span-4 lg:max-w-none">
            <div className="relative mx-auto aspect-square w-full max-w-[340px] overflow-hidden rounded-full bg-white p-2 ring-1 ring-ink-200">
              <Image
                src={settings.logoUrl}
                alt="The official crest of Alene High School"
                width={680}
                height={680}
                className="h-full w-full rounded-full object-cover"
              />
            </div>
          </Reveal>
          <div className="lg:col-span-7 lg:col-start-6">
            <p className="eyebrow">{c.text("about.crest.eyebrow")}</p>
            <h2 id="crest-title" className="section-heading mt-5">
              {c.text("about.crest.title")}
            </h2>
            <p className="prose-body mt-6">{c.text("about.crest.body")}</p>
          </div>
        </div>
      </section>

      {/* Principal's message */}
      <section aria-labelledby="principal-title" className="section-y-sm">
        <div className="container-page grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="eyebrow">{c.text("about.principal.eyebrow")}</p>
            <div className="mt-8 flex items-center gap-4">
              <span
                aria-hidden="true"
                className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-crimson-600 font-display text-xl font-extrabold text-white"
              >
                {initials(settings.principalName)}
              </span>
              <div>
                <h2 id="principal-title" className="font-display text-lg font-bold text-ink-900">
                  {settings.principalName}
                </h2>
                <p className="text-sm text-ink-500">{settings.principalTitle}</p>
              </div>
            </div>
          </div>
          <Reveal as="blockquote" className="lg:col-span-8">
            <p className="font-display text-2xl font-semibold leading-[1.45] text-ink-900 sm:text-3xl">
              <span className="text-brand-600" aria-hidden="true">
                &ldquo;
              </span>
              {settings.principalQuote}
              <span className="text-brand-600" aria-hidden="true">
                &rdquo;
              </span>
            </p>
          </Reveal>
        </div>
      </section>

      <ExamResultsCTA />
    </>
  );
}
