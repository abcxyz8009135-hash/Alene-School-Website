import Image from "next/image";
import { BookOpen, Compass, HeartHandshake, ShieldCheck, Sparkles, Target } from "lucide-react";
import { ABOUT_HERO_IMAGE } from "@/lib/constants";

// Static SSG: no dynamic data, so this page is fully pre-rendered at build time.

const CORE_VALUES = [
  { icon: BookOpen, title: "Academic Excellence", desc: "We hold high standards for learning and continuous improvement." },
  { icon: ShieldCheck, title: "Integrity", desc: "We act honestly and take responsibility for our actions." },
  { icon: HeartHandshake, title: "Respect", desc: "We value every individual's dignity, background, and perspective." },
  { icon: Sparkles, title: "Innovation", desc: "We embrace creativity and forward-thinking solutions." },
];

export default function AboutUsPage() {
  return (
    <>
      <section className="relative flex h-[38vh] min-h-[280px] items-end overflow-hidden">
        <div className="skeleton absolute inset-0" />
        <Image src={ABOUT_HERO_IMAGE} alt="Alene High School campus" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-ink-950/40 to-ink-950/10" />
        <div className="container-page relative pb-10">
          <span className="tag-pill bg-white/90">About Us</span>
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
            <p>
              Alene High School was founded with a singular purpose: to provide
              accessible, high-quality education that prepares students for the
              challenges of a rapidly changing world. Since our founding, we have
              grown from a small campus into a vibrant learning community serving
              hundreds of students.
            </p>
            <p>
              Over the years, we have expanded our academic offerings, built a
              dedicated STEM Center, and cultivated a culture of excellence in
              academics, arts, and athletics. Today, Alene High School stands as
              a trusted institution known for producing well-rounded, capable
              graduates.
            </p>
          </div>
        </div>
      </section>

      {/* Mission / Vision */}
      <section className="bg-slate-50 py-16">
        <div className="container-page grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="card p-8">
            <Target className="h-8 w-8 text-brand-600" />
            <h3 className="mt-4 text-xl font-bold text-ink-900">Mission</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-500">
              To provide a nurturing and rigorous learning environment that
              empowers students with the knowledge, skills, and character needed
              to excel academically and contribute meaningfully to society.
            </p>
          </div>
          <div className="card p-8">
            <Compass className="h-8 w-8 text-brand-600" />
            <h3 className="mt-4 text-xl font-bold text-ink-900">Vision</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-500">
              To be a leading institution recognized for academic excellence,
              innovation in science and technology, and the holistic development
              of every student we serve.
            </p>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="container-page py-16">
        <h2 className="section-heading">Core Values</h2>
        <p className="section-subheading">The principles that guide everything we do.</p>
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {CORE_VALUES.map((value) => (
            <div key={value.title} className="card p-6">
              <value.icon className="h-7 w-7 text-brand-600" />
              <h4 className="mt-4 font-semibold text-ink-900">{value.title}</h4>
              <p className="mt-2 text-sm text-ink-500">{value.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Principal's Message */}
      <section className="container-page pb-20">
        <div className="card grid grid-cols-1 gap-8 bg-slate-50 p-8 sm:grid-cols-[auto_1fr] sm:p-10">
          <div className="mx-auto h-28 w-28 shrink-0 rounded-full bg-gradient-to-br from-brand-500 to-brand-800 ring-4 ring-white sm:mx-0" />
          <div>
            <span className="tag-pill">Principal&apos;s Message</span>
            <p className="mt-4 italic leading-relaxed text-ink-700">
              &ldquo;At Alene High School, we believe every student holds
              untapped potential. Our role is to provide the guidance,
              resources, and environment necessary for that potential to
              flourish — academically, socially, and personally. We are proud
              of our students, our dedicated staff, and the community that
              supports us every step of the way.&rdquo;
            </p>
            <p className="mt-4 text-sm font-semibold text-ink-900">Dr. Meseret Alemu</p>
            <p className="text-xs text-ink-400">Principal, Alene High School</p>
          </div>
        </div>
      </section>
    </>
  );
}
