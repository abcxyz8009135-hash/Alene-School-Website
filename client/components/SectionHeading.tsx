import type { ReactNode } from "react";

interface SectionHeadingProps {
  /** Narrative index on the home page, e.g. "01". */
  index?: string;
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  align?: "left" | "center";
  tone?: "dark" | "light";
  as?: "h1" | "h2";
  className?: string;
}

export default function SectionHeading({
  index,
  eyebrow,
  title,
  intro,
  align = "left",
  tone = "dark",
  as: Heading = "h2",
  className = "",
}: SectionHeadingProps) {
  const centered = align === "center";
  return (
    <div className={`${centered ? "mx-auto text-center" : ""} max-w-3xl ${className}`}>
      <div className={`flex items-center gap-4 ${centered ? "justify-center" : ""}`}>
        {index && (
          <span className={`section-index ${tone === "light" ? "text-white/50" : ""}`}>{index}</span>
        )}
        <p className={`eyebrow ${tone === "light" ? "eyebrow-light" : ""}`}>{eyebrow}</p>
      </div>
      <Heading
        className={`mt-5 font-display text-3xl font-bold leading-[1.1] tracking-[-0.02em] sm:text-4xl lg:text-5xl ${
          tone === "light" ? "text-white" : "text-ink-900"
        }`}
      >
        {title}
      </Heading>
      {intro && (
        <p
          className={`mt-5 text-base leading-relaxed sm:text-lg ${
            tone === "light" ? "text-white/75" : "text-ink-500"
          } ${centered ? "mx-auto" : ""} max-w-2xl`}
        >
          {intro}
        </p>
      )}
    </div>
  );
}
