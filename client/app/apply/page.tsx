import Link from "next/link";
import { ClipboardCheck, ClipboardX, ExternalLink } from "lucide-react";
import { externalUrl, getContent } from "@/lib/content";

export default async function ApplyPage() {
  const c = await getContent();
  const open = c.bool("apply.isOpen");
  const applyUrl = externalUrl(c.text("apply.open.url"));
  const Icon = open ? ClipboardCheck : ClipboardX;

  return (
    <section className="container-page flex min-h-[60vh] items-center justify-center py-16">
      <div className="flex max-w-md flex-col items-center gap-4 rounded-sm border border-ink-200 border-t-4 border-t-crimson-600 bg-white px-8 py-12 text-center shadow-card">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-brand-600 ring-1 ring-inset ring-brand-200">
          <Icon className="h-6 w-6" aria-hidden="true" />
        </span>
        <h1 className="font-display text-2xl font-bold text-ink-900">
          {open ? c.text("apply.open.title") : c.text("apply.closed.title")}
        </h1>
        <p className="whitespace-pre-line text-sm text-ink-500">
          {open ? c.text("apply.open.body") : c.text("apply.closed.body")}
        </p>
        <div className="mt-2 flex flex-wrap justify-center gap-3">
          {open && applyUrl && (
            <a href={applyUrl} target="_blank" rel="noopener noreferrer" className="btn-primary">
              {c.text("apply.open.button")}
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
            </a>
          )}
          <Link href="/" className={open && applyUrl ? "btn-secondary" : "btn-primary"}>
            {c.text("apply.backButton")}
          </Link>
        </div>
      </div>
    </section>
  );
}
