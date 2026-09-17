"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { HERO_SLIDES } from "@/lib/constants";

export default function HeroCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const next = () => setIndex((i) => (i + 1) % HERO_SLIDES.length);
  const prev = () => setIndex((i) => (i - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);

  return (
    <div className="relative h-[70vh] min-h-[480px] w-full overflow-hidden bg-ink-900">
      {HERO_SLIDES.map((slide, i) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            i === index ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        >
          <div className="skeleton absolute inset-0" />
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            priority={i === 0}
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/60 to-ink-950/20" />
        </div>
      ))}

      <div className="container-page relative flex h-full flex-col items-start justify-end pb-20">
        <span className="tag-pill bg-white/90 ring-white/40">Est. Excellence</span>
        <h1 className="max-w-2xl text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
          {HERO_SLIDES[index].title}
        </h1>
        <p className="mt-4 max-w-xl text-base text-slate-200 sm:text-lg">
          {HERO_SLIDES[index].subtitle}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/entrance-exam-result" className="btn-primary">
            Check Exam Result
          </Link>
          <Link
            href="/about-us"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/30 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
          >
            Learn More
          </Link>
        </div>
      </div>

      <button
        onClick={prev}
        className="absolute left-4 top-1/2 hidden -translate-y-1/2 rounded-full border border-white/30 bg-white/10 p-2 text-white backdrop-blur transition hover:bg-white/20 sm:flex"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 hidden -translate-y-1/2 rounded-full border border-white/30 bg-white/10 p-2 text-white backdrop-blur transition hover:bg-white/20 sm:flex"
        aria-label="Next slide"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
        {HERO_SLIDES.map((slide, i) => (
          <button
            key={slide.id}
            onClick={() => setIndex(i)}
            className={`h-1.5 rounded-full transition-all ${
              i === index ? "w-8 bg-brand-400" : "w-1.5 bg-white/40"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
