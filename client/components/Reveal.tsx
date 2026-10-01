"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  /** Stagger delay in milliseconds. */
  delay?: number;
}

// One observer shared by every Reveal on the page.
let sharedObserver: IntersectionObserver | null = null;

function show(el: Element) {
  (el as HTMLElement).dataset.visible = "true";
  sharedObserver?.unobserve(el);
}

function getObserver() {
  if (!sharedObserver) {
    sharedObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) show(entry.target);
        }
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0.05 }
    );
  }
  return sharedObserver;
}

/**
 * Fades content up once when it scrolls into view. The hidden state is only
 * applied when JS is running and the user hasn't asked for reduced motion
 * (see `.reveal` in globals.css), so content is never lost without JS.
 */
export default function Reveal({ children, as: Tag = "div", className = "", delay = 0 }: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (!("IntersectionObserver" in window)) {
      el.dataset.visible = "true";
      return;
    }

    // Anything already on screen at mount is shown straight away.
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      el.dataset.visible = "true";
      return;
    }

    const observer = getObserver();
    observer.observe(el);
    return () => observer.unobserve(el);
  }, []);

  return (
    <Tag
      ref={ref}
      className={`reveal ${className}`}
      style={delay ? ({ "--reveal-delay": `${delay}ms` } as React.CSSProperties) : undefined}
    >
      {children}
    </Tag>
  );
}
