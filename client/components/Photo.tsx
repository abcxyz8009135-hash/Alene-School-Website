import Image from "next/image";
import { ImageOff } from "lucide-react";

interface PhotoProps {
  src?: string | null;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
  imgClassName?: string;
  /** Short caption shown in the empty slot when no image has been set yet. */
  emptyLabel?: string;
}

/**
 * Image frame used across the public site. Renders a neutral, labelled slot
 * when no image is set, so missing photos never break a layout and are easy
 * to spot and fill in from the admin dashboard.
 */
export default function Photo({
  src,
  alt,
  sizes,
  priority,
  className = "",
  imgClassName = "",
  emptyLabel = "Photo coming soon",
}: PhotoProps) {
  return (
    <div className={`media ${className}`}>
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className={`object-cover ${imgClassName}`}
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-ink-400">
          <ImageOff className="h-6 w-6" aria-hidden="true" />
          <span className="text-xs font-medium uppercase tracking-widest">{emptyLabel}</span>
        </div>
      )}
    </div>
  );
}
