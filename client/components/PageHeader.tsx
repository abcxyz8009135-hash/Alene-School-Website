import type { ReactNode } from "react";
import Photo from "./Photo";

interface PageHeaderProps {
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  image?: string;
  imageAlt?: string;
  /** Extra content under the intro, e.g. buttons or a back link. */
  children?: ReactNode;
  tone?: "white" | "soft";
}

/**
 * Editorial header used by every inner page: large type on the left, an
 * optional photograph on the right, and a thin red rule tying it to the nav.
 */
export default function PageHeader({
  eyebrow,
  title,
  intro,
  image,
  imageAlt = "",
  children,
  tone = "white",
}: PageHeaderProps) {
  return (
    <header className={`relative overflow-hidden ${tone === "soft" ? "bg-ink-50" : "bg-white"}`}>
      <div
        aria-hidden="true"
        className="crest-rings pointer-events-none absolute -right-56 -top-56 hidden h-[560px] w-[560px] text-brand-600/[0.08] md:block"
      />
      <div
        className={`container-page relative grid grid-cols-1 gap-10 pb-14 pt-12 sm:pb-16 sm:pt-16 lg:pb-20 lg:pt-20 ${
          image ? "lg:grid-cols-12 lg:items-end lg:gap-12" : ""
        }`}
      >
        <div className={image ? "lg:col-span-6" : "max-w-3xl"}>
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="display-2 mt-6 text-ink-900">{title}</h1>
          {intro && <p className="lede mt-6 max-w-2xl">{intro}</p>}
          {children && <div className="mt-8">{children}</div>}
        </div>
        {image && (
          <div className="relative lg:col-span-6">
            <div aria-hidden="true" className="absolute -bottom-3 -right-3 h-1/2 w-1/2 bg-brand-600 sm:-bottom-4 sm:-right-4" />
            <Photo
              src={image}
              alt={imageAlt}
              sizes="(min-width: 1024px) 50vw, 100vw"
              priority
              className="relative aspect-[16/10] w-full rounded-sm"
            />
          </div>
        )}
      </div>
    </header>
  );
}
