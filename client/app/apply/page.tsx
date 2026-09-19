import Link from "next/link";
import { ClipboardX } from "lucide-react";

export default function ApplyPage() {
  return (
    <section className="container-page flex min-h-[60vh] items-center justify-center py-16">
      <div className="card flex max-w-md flex-col items-center gap-4 px-8 py-12 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600 ring-1 ring-inset ring-brand-200">
          <ClipboardX className="h-6 w-6" />
        </span>
        <h1 className="text-2xl font-bold text-ink-900">Applications Are Currently Closed</h1>
        <p className="text-sm text-ink-500">
          Applications are currently closed. Please check our website for future updates.
        </p>
        <Link href="/" className="btn-primary mt-2">
          Back to Home
        </Link>
      </div>
    </section>
  );
}
