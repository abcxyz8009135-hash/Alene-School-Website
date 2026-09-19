import Image from "next/image";
import { BookOpen, Compass, HeartHandshake, ShieldCheck, Sparkles, Target } from "lucide-react";
import { fetchSettings } from "@/lib/settings";

const CORE_VALUE_ICONS = [BookOpen, ShieldCheck, HeartHandshake, Sparkles];

export default async function AboutUsPage() {
  const settings = await fetchSettings();

  const coreValues = [
    { title: settings.coreValue1Title, desc: settings.coreValue1Description },
    { title: settings.coreValue2Title, desc: settings.coreValue2Description },
    { title: settings.coreValue3Title, desc: settings.coreValue3Description },
    { title: settings.coreValue4Title, desc: settings.coreValue4Description },
  ];

  return (
    <>
      <section className="relative flex h-[38vh] min-h-[280px] items-end overflow-hidden">
        <div className="skeleton absolute inset-0" />
        <Image
          src={settings.aboutHeroImage}
          alt="Alene High School campus"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-ink-950/40 to-ink-950/10" />
        <div className="container-page relative pb-10">
          <h1 className="mt-3 text-4xl font-bold text-white sm:text-5xl">
            Our Story, Our Purpose
          </h1>
        </div>
      </section>

      {/* History */}
      <section className="container-page py-16">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <h2 className="section-heading">Our History</h2>
          </div>
          <div className="lg:col-span-2 space-y-4 text-ink-500 leading-relaxed">
            <p>{settings.aboutHistoryParagraph1}</p>
            <p>{settings.aboutHistoryParagraph2}</p>
          </div>
        </div>
      </section>

      {/* Mission / Vision */}
      <section className="bg-slate-50 py-16">
        <div className="container-page grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="card p-8">
            <Target className="h-8 w-8 text-brand-600" />
            <h3 className="mt-4 text-xl font-bold text-ink-900">Mission</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-500">{settings.aboutMission}</p>
          </div>
          <div className="card p-8">
            <Compass className="h-8 w-8 text-brand-600" />
            <h3 className="mt-4 text-xl font-bold text-ink-900">Vision</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-500">{settings.aboutVision}</p>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="container-page py-16">
        <h2 className="section-heading">Core Values</h2>
        <p className="section-subheading">The principles that guide everything we do.</p>
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {coreValues.map((value, i) => {
            const Icon = CORE_VALUE_ICONS[i];
            return (
              <div key={value.title} className="card p-6">
                <Icon className="h-7 w-7 text-brand-600" />
                <h4 className="mt-4 font-semibold text-ink-900">{value.title}</h4>
                <p className="mt-2 text-sm text-ink-500">{value.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Principal's Message */}
      <section className="container-page pb-20">
        <div className="card grid grid-cols-1 gap-8 bg-slate-50 p-8 sm:grid-cols-[auto_1fr] sm:p-10">
          <div className="mx-auto h-28 w-28 shrink-0 rounded-full bg-gradient-to-br from-brand-500 to-brand-800 ring-4 ring-white sm:mx-0" />
          <div>
            <span className="tag-pill">Principal&apos;s Message</span>
            <p className="mt-4 italic leading-relaxed text-ink-700">
              &ldquo;{settings.principalQuote}&rdquo;
            </p>
            <p className="mt-4 text-sm font-semibold text-ink-900">{settings.principalName}</p>
            <p className="text-xs text-ink-400">{settings.principalTitle}</p>
          </div>
        </div>
      </section>
    </>
  );
}
