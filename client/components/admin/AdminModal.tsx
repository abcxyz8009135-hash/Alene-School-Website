"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";

interface AdminModalProps {
  open: boolean;
  title: string;
  description?: string;
  onClose: () => void;
  children: React.ReactNode;
  size?: "sm" | "md";
}

/** Accessible dialog: focus moves in, Tab stays inside, Escape closes. */
export default function AdminModal({
  open,
  title,
  description,
  onClose,
  children,
  size = "md",
}: AdminModalProps) {
  const ref = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const focusable = () =>
      Array.from(
        ref.current?.querySelectorAll<HTMLElement>(
          "button:not([disabled]), input:not([disabled]), select, textarea, a[href]"
        ) ?? []
      );
    (ref.current?.querySelector<HTMLElement>("[data-autofocus]") ?? focusable()[1] ?? focusable()[0])?.focus();

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onCloseRef.current();
        return;
      }
      if (e.key !== "Tab") return;
      const items = focusable();
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      previouslyFocused?.focus();
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto px-4 py-16">
      <div className="fixed inset-0 animate-fade-in bg-ink-950/50" onClick={onClose} aria-hidden="true" />
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-modal-title"
        className={`relative w-full animate-fade-in rounded-lg border border-ink-200 bg-white p-6 shadow-card ${
          size === "sm" ? "max-w-md" : "max-w-lg"
        }`}
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 id="admin-modal-title" className="text-lg font-bold text-ink-900">
              {title}
            </h2>
            {description && <p className="mt-1 text-sm text-ink-500">{description}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1.5 text-ink-400 transition hover:bg-ink-100 hover:text-ink-900"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
