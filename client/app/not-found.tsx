import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getContent } from "@/lib/content";

export default async function NotFound() {
  const c = await getContent();
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="crest-rings pointer-events-none absolute -right-40 top-0 h-[520px] w-[520px] text-brand-600/10"
      />
      <div className="container-page relative py-24 sm:py-32">
        <p className="eyebrow">{c.text("notFound.eyebrow")}</p>
        <h1 className="display-2 mt-6 max-w-2xl text-ink-900">
          {c.text("notFound.title")}
        </h1>
        <p className="lede mt-6 max-w-xl">
          {c.text("notFound.body")}
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/" className="btn-primary">
            Back to home
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <Link href="/news" className="btn-secondary">
            {c.text("nav.news")}
          </Link>
        </div>
      </div>
    </section>
  );
}
