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
        src="/logo.jpg"
        alt="Alene High School Logo"
        width={40}
        height={40}
        className="h-10 w-10 shrink-0 rounded-full object-cover"
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
