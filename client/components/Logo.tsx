import Image from "next/image";
import Link from "next/link";
import { SCHOOL_NAME } from "@/lib/constants";

interface LogoProps {
  logoUrl?: string;
  schoolName?: string;
  /** "light" for use on the red navbar / footer, "dark" on white. */
  tone?: "light" | "dark";
  size?: "md" | "lg";
  /** Show "Semen Sub-City · Mekelle" under the name. */
  showLocation?: boolean;
  className?: string;
}

/**
 * The official Alene crest, shown unaltered inside a white disc so its blue
 * line-work stays legible on the red brand surfaces.
 */
export default function Logo({
  logoUrl = "/logo.jpg",
  schoolName = SCHOOL_NAME,
  tone = "light",
  size = "md",
  showLocation = false,
  className = "",
}: LogoProps) {
  const crest = size === "lg" ? "h-20 w-20" : "h-12 w-12 lg:h-[52px] lg:w-[52px]";
  const nameColor = tone === "light" ? "text-white" : "text-ink-900";
  const subColor = tone === "light" ? "text-white/70" : "text-ink-500";

  return (
    <Link
      href="/"
      className={`group inline-flex items-center gap-3 rounded-md ${className}`}
      aria-label={`${schoolName} — home`}
    >
      <span
        className={`relative shrink-0 overflow-hidden rounded-full bg-white p-[3px] ring-1 ring-black/5 ${crest}`}
      >
        <Image
          src={logoUrl}
          alt=""
          width={160}
          height={160}
          className="h-full w-full rounded-full object-cover"
          priority
        />
      </span>
      <span className="flex flex-col leading-none">
        <span
          className={`font-display text-[15px] font-extrabold uppercase tracking-[0.08em] sm:text-base ${nameColor}`}
        >
          {schoolName}
        </span>
        {showLocation && (
          <span className={`mt-1.5 text-[11px] font-medium tracking-wide ${subColor}`}>
            Semen Sub-City · Mekelle
          </span>
        )}
      </span>
    </Link>
  );
}
