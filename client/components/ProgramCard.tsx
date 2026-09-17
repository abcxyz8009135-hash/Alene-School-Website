import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ProgramCategory } from "@/lib/types";

interface ProgramCardProps {
  title: string;
  description: string;
  imageSrc: string;
  slug: string;
  category: ProgramCategory;
}

export default function ProgramCard({
  title,
  description,
  imageSrc,
  slug,
  category,
}: ProgramCardProps) {
  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg">
      <div className="relative h-44 w-full overflow-hidden">
        <div className="skeleton absolute inset-0" />
        <Image
          src={imageSrc}
          alt={title}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-lg font-semibold text-ink-900">{title}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-500">{description}</p>
        <Link
          href={`/${category}/${slug}`}
          className="mt-5 inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-brand-600 transition group-hover:gap-2.5 hover:text-brand-700"
        >
          View Program
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
