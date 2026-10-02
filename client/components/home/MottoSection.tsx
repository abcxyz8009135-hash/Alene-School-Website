import Reveal from "@/components/Reveal";
import type { SiteContent } from "@/lib/content";

export default function MottoSection({ content: c }: { content: SiteContent }) {
  const pillars = c.list("home.pillars");
  return (
    <section aria-labelledby="motto-title" className="section-y relative overflow-hidden bg-brand-50">
      <div
        aria-hidden="true"
        className="crest-rings pointer-events-none absolute -bottom-64 -left-64 h-[720px] w-[720px] text-brand-600/10"
      />

      <div className="container-page relative">
        <div className="flex items-center gap-4">
          <span className="section-index">02</span>
          <p className="eyebrow">{c.text("home.motto.eyebrow")}</p>
        </div>

        <Reveal>
          <h2 id="motto-title" className="mt-8 max-w-5xl font-display">
            <span className="block text-[2.4rem] font-extrabold uppercase leading-[0.98] tracking-[-0.03em] text-ink-900 sm:text-6xl lg:text-[5.25rem]">
              {c.text("home.motto.line1")}
            </span>
            <span className="mt-3 block text-3xl font-bold leading-tight tracking-[-0.02em] text-brand-600 sm:text-5xl lg:text-6xl">
              {c.text("home.motto.line2")}
            </span>
          </h2>
        </Reveal>

        <Reveal delay={80}>
          <p className="lede mt-10 max-w-2xl">{c.text("home.motto.body")}</p>
        </Reveal>

        <ol
          className={`mt-16 grid grid-cols-1 gap-y-10 md:gap-x-10 lg:mt-20 ${
            pillars.length >= 4 ? "md:grid-cols-2 lg:grid-cols-4" : pillars.length === 2 ? "md:grid-cols-2" : "md:grid-cols-3"
          }`}
        >
          {pillars.map((pillar, i) => (
            <Reveal as="li" key={i} delay={i * 100} className="border-t-2 border-brand-600 pt-6">
              <span className="font-display text-sm font-semibold tabular-nums text-brand-600">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-3 font-display text-2xl font-extrabold uppercase tracking-[0.04em] text-ink-900">
                {pillar.title}
              </h3>
              <p className="mt-3 max-w-sm leading-relaxed text-ink-600">{pillar.body}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
