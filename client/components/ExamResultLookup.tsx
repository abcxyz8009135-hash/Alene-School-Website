"use client";

// The exam result lookup. The page around it (app/entrance-exam-result) is a
// server component that passes in the admin-editable copy; the search itself
// runs in the browser because the result depends on what the student types.

import { FormEvent, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Clock3, Loader2, Search, XCircle } from "lucide-react";
import { API_BASE_URL } from "@/lib/constants";
import type { ExamResult } from "@/lib/types";

const STATUS_CONFIG: Record<
  ExamResult["status"],
  { label: string; icon: typeof CheckCircle2; className: string }
> = {
  PASS: {
    label: "Passed",
    icon: CheckCircle2,
    className: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  },
  FAIL: {
    label: "Not Passed",
    icon: XCircle,
    className: "bg-crimson-50 text-crimson-800 ring-crimson-200",
  },
  PENDING: {
    label: "Pending",
    icon: Clock3,
    className: "bg-amber-50 text-amber-800 ring-amber-200",
  },
};

export interface ExamCopy {
  eyebrow: string;
  headline: string;
  intro: string;
  hint: string;
  help: string;
  helpLink: string;
}

export default function ExamResultLookup({ copy }: { copy: ExamCopy }) {
  const [registrationId, setRegistrationId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ExamResult | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);

    if (!registrationId.trim()) {
      setError("Please enter your registration ID.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `${API_BASE_URL}/results/${encodeURIComponent(registrationId.trim())}`
      );
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "No result found for this registration ID.");
      }

      setResult(data.result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  const statusInfo = result ? STATUS_CONFIG[result.status] : null;
  const percentage = result ? Math.round((result.score / result.total) * 100) : 0;

  return (
    <>
      <header className="relative overflow-hidden bg-brand-900 text-white">
        <div
          aria-hidden="true"
          className="crest-rings pointer-events-none absolute -right-48 -top-48 h-[560px] w-[560px] text-white/[0.07]"
        />
        <div className="container-page relative pb-28 pt-14 sm:pb-32 sm:pt-20">
          <p className="eyebrow eyebrow-light">{copy.eyebrow}</p>
          <h1 className="display-2 mt-6 max-w-3xl">{copy.headline}</h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/75">
            {copy.intro}
          </p>
        </div>
      </header>

      <section className="pb-16 sm:pb-24 lg:pb-32">
        <div className="container-page">
          <form
            onSubmit={handleSubmit}
            className="relative -mt-16 max-w-2xl rounded-sm border-t-4 border-crimson-600 bg-white p-5 shadow-card sm:p-8"
            noValidate
          >
            <label htmlFor="registration-id" className="form-label">
              Registration ID
            </label>
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                id="registration-id"
                value={registrationId}
                onChange={(e) => setRegistrationId(e.target.value)}
                placeholder="e.g. AHS-2026-0001"
                autoComplete="off"
                spellCheck={false}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? "registration-error" : "registration-hint"}
                className="input-field flex-1 py-3 font-mono text-base tracking-wide sm:text-sm"
              />
              <button type="submit" disabled={loading} className="btn-primary shrink-0 px-6">
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                ) : (
                  <Search className="h-4 w-4" aria-hidden="true" />
                )}
                {loading ? "Checking…" : "Check result"}
              </button>
            </div>
            <p id="registration-hint" className="mt-3 text-xs text-ink-500">
              {copy.hint}
            </p>

            {error && (
              <p id="registration-error" role="alert" className="alert-error mt-5">
                <XCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                {error}
              </p>
            )}
          </form>

          {result && statusInfo && (
            <div className="mt-10 max-w-2xl" aria-live="polite">
              <div className="rounded-sm border border-ink-200">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-ink-200 bg-ink-50 px-6 py-5 sm:px-8">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-ink-500">Registration ID</p>
                    <p className="mt-1 font-mono text-lg font-semibold text-ink-900">{result.registrationId}</p>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1.5 rounded px-3 py-1.5 text-sm font-semibold ring-1 ring-inset ${statusInfo.className}`}
                  >
                    <statusInfo.icon className="h-4 w-4" aria-hidden="true" />
                    {statusInfo.label}
                  </span>
                </div>
                <dl className="grid grid-cols-1 gap-6 px-6 py-7 sm:grid-cols-3 sm:px-8">
                  <div className="sm:col-span-3">
                    <dt className="text-xs font-bold uppercase tracking-[0.14em] text-ink-500">Student name</dt>
                    <dd className="mt-1 font-display text-2xl font-bold text-ink-900">{result.studentName}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-bold uppercase tracking-[0.14em] text-ink-500">Score</dt>
                    <dd className="mt-1 font-display text-3xl font-extrabold tabular-nums text-brand-700">
                      {result.score}
                      <span className="text-lg font-semibold text-ink-400"> / {result.total}</span>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-bold uppercase tracking-[0.14em] text-ink-500">Percentage</dt>
                    <dd className="mt-1 font-display text-3xl font-extrabold tabular-nums text-ink-900">
                      {percentage}%
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-bold uppercase tracking-[0.14em] text-ink-500">Exam year</dt>
                    <dd className="mt-1 font-display text-3xl font-extrabold tabular-nums text-ink-900">
                      {result.examYear}
                    </dd>
                  </div>
                </dl>
                <div className="px-6 pb-7 sm:px-8">
                  <div
                    className="h-2 w-full overflow-hidden rounded-full bg-ink-100"
                    role="progressbar"
                    aria-label="Score"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={percentage}
                  >
                    <div className="h-full rounded-full bg-brand-600 transition-all duration-700" style={{ width: `${percentage}%` }} />
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="mt-14 max-w-2xl border-t border-ink-200 pt-8 text-sm leading-relaxed text-ink-500">
            {copy.help}{" "}
            <Link href="/contact-us" className="font-semibold text-brand-700 underline-offset-4 hover:underline">
              {copy.helpLink}
            </Link>
            .
          </div>
        </div>
      </section>
    </>
  );
}
