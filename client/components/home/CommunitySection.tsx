import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Photo from "@/components/Photo";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import { COMMUNITY_COPY } from "@/lib/content";

interface CommunitySectionProps {
  primaryImage: string;
  secondaryImage: string;
}

export default function CommunitySection({ primaryImage, secondaryImage }: CommunitySectionProps) {
  return (
    <section aria-labelledby="community-title" className="section-y overflow-hidden bg-ink-50">
      <div className="container-page grid grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-5 lg:pt-6">
          <SectionHeading
            index="06"
            eyebrow={COMMUNITY_COPY.eyebrow}
            title={<span id="community-title">{COMMUNITY_COPY.headline}</span>}
            intro={COMMUNITY_COPY.body}
          />

          <ul className="mt-10 space-y-6">
            {COMMUNITY_COPY.themes.map((theme, i) => (
              <Reveal as="li" key={theme.title} delay={i * 80} className="flex gap-4">
                <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-crimson-600" aria-hidden="true" />
                <div>
                  <h3 className="font-display text-lg font-bold text-ink-900">{theme.title}</h3>
                  <p className="mt-1 leading-relaxed text-ink-600">{theme.body}</p>
                </div>
              </Reveal>
            ))}
          </ul>

          <Link href="/community" className="btn-secondary mt-10">
            Clubs &amp; community life
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="relative lg:col-span-7">
          <Reveal>
            <Photo
              src={primaryImage}
              alt="Alene students and staff clearing the school grounds together"
              sizes="(min-width: 1024px) 55vw, 100vw"
              className="aspect-[4/3] w-full rounded-sm lg:ml-auto lg:w-[88%]"
            />
          </Reveal>
          <Reveal delay={120} className="relative -mt-16 w-[62%] sm:-mt-24 lg:-mt-32 lg:w-[52%]">
            <div className="border-[6px] border-ink-50">
              <Photo
                src={secondaryImage}
                alt="Students painting a school building as a community service project"
                sizes="(min-width: 1024px) 30vw, 60vw"
                className="aspect-[4/3] w-full"
              />
            </div>
            <p className="mt-4 text-xs font-medium uppercase tracking-[0.16em] text-ink-500">
              Community service, Alene students
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
