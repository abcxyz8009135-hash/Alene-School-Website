import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Photo from "./Photo";
import { CATEGORY_ROUTE } from "@/lib/constants";
import type { ProgramCategory } from "@/lib/types";

interface ProgramCardProps {
  title: string;
  description: string;
  imageSrc: string;
  slug: string;
  category: ProgramCategory;
  index?: number;
}

export default function ProgramCard({
  title,
  description,
  imageSrc,
  slug,
  category,
  index,
}: ProgramCardProps) {
  return (
    <Link href={`${CATEGORY_ROUTE[category]}/${slug}`} className="group flex h-full flex-col rounded-sm">
      <Photo
        src={imageSrc}
        alt=""
        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        className="aspect-[4/3] w-full rounded-sm"
        imgClassName="transition duration-700 group-hover:scale-[1.04]"
      />
      <div className="flex flex-1 flex-col border-b border-ink-200 py-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-baseline gap-3">
            {index !== undefined && (
              <span className="font-display text-sm font-semibold tabular-nums text-brand-600">
                {String(index).padStart(2, "0")}
              </span>
            )}
            <h3 className="font-display text-xl font-bold text-ink-900 transition-colors group-hover:text-brand-700">
              {title}
            </h3>
          </div>
          <ArrowUpRight
            className="mt-1 h-5 w-5 shrink-0 text-ink-400 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-600"
            aria-hidden="true"
          />
        </div>
        <p className="mt-3 leading-relaxed text-ink-600">{description}</p>
      </div>
    </Link>
  );
}
