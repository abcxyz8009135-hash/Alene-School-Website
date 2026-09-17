import Image from "next/image";
import Link from "next/link";
import { SCHOOL_NAME, SCHOOL_SHORT_NAME } from "@/lib/constants";

interface LogoProps {
  compact?: boolean;
}

export default function Logo({ compact = false }: LogoProps) {
  return (
    <Link href="/" className="group flex items-center gap-2.5">
      <Image
        src="/logo.png"
        alt="Alene High School Logo"
        width={compact ? 40 : 160}
        height={compact ? 40 : 40}
        className={compact ? "h-10 w-10 shrink-0" : "h-10 w-10 shrink-0 sm:h-10 sm:w-auto"}
        priority
      />
      {!compact && (
        <span className="flex flex-col leading-tight">
          <span className="text-sm font-bold tracking-wide text-ink-900 sm:text-base">
            {SCHOOL_NAME}
          </span>
          <span className="text-[10px] font-medium uppercase tracking-widest text-brand-600">
            {SCHOOL_SHORT_NAME}
          </span>
        </span>
      )}
    </Link>
  );
}
