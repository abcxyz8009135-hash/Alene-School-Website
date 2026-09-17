"use client";

// SSR/CSR hybrid: the shell is server-rendered on first load (Next.js renders
// client components to HTML too), then the search + result card are fully
// interactive/client-driven since the result depends on user-submitted input.

import { FormEvent, useState } from "react";
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
    className: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  },
  FAIL: {
    label: "Not Passed",
    icon: XCircle,
    className: "bg-red-50 text-red-700 ring-red-200",
  },
  PENDING: {
    label: "Pending",
    icon: Clock3,
    className: "bg-amber-50 text-amber-700 ring-amber-200",
  },
};

export default function EntranceExamResultPage() {
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
    <section className="container-page py-16">
      <div className="mx-auto max-w-2xl text-center">
        <span className="tag-pill">Entrance Exam Result</span>
        <h1 className="mt-4 text-4xl font-bold text-ink-900 sm:text-5xl">
          Check Your Exam Result
        </h1>
        <p className="mt-4 text-ink-500">
          Enter your registration ID below to view your entrance exam score.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="card mx-auto mt-10 flex max-w-xl flex-col gap-3 p-4 sm:flex-row sm:p-5"
      >
        <input
          value={registrationId}
          onChange={(e) => setRegistrationId(e.target.value)}
          placeholder="e.g. AHS-2026-0001"
          className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-ink-900 placeholder-ink-400 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
        />
        <button type="submit" disabled={loading} className="btn-primary shrink-0">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          Check Result
        </button>
      </form>

      {error && (
        <p className="mx-auto mt-6 max-w-xl rounded-lg bg-red-50 px-4 py-3 text-center text-sm text-red-600 ring-1 ring-inset ring-red-200">
          {error}
        </p>
      )}

      {result && statusInfo && (
        <div className="card mx-auto mt-8 max-w-xl overflow-hidden">
          <div className="border-b border-slate-200 bg-slate-50 px-6 py-5 sm:px-8">
            <p className="text-xs uppercase tracking-widest text-ink-400">
              Registration ID
            </p>
            <p className="mt-1 font-mono text-lg font-semibold text-ink-900">
              {result.registrationId}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 p-6 sm:grid-cols-2 sm:p-8">
            <div>
              <p className="text-xs uppercase tracking-widest text-ink-400">Student Name</p>
              <p className="mt-1 text-lg font-semibold text-ink-900">{result.studentName}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-ink-400">Exam Year</p>
              <p className="mt-1 text-lg font-semibold text-ink-900">{result.examYear}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-ink-400">Score</p>
              <p className="mt-1 text-lg font-semibold text-ink-900">
                {result.score} / {result.total}{" "}
                <span className="text-sm font-normal text-ink-400">({percentage}%)</span>
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-ink-400">Status</p>
              <span
                className={`mt-1 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold ring-1 ring-inset ${statusInfo.className}`}
              >
                <statusInfo.icon className="h-4 w-4" />
                {statusInfo.label}
              </span>
            </div>
          </div>
          <div className="border-t border-slate-200 bg-slate-50 px-6 py-3 sm:px-8">
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-brand-600 transition-all"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        </div>
      )}

      <p className="mx-auto mt-10 max-w-xl text-center text-xs text-ink-400">
        Try sample IDs: AHS-2026-0001, AHS-2026-0002, AHS-2026-0003, AHS-2026-0004
      </p>
    </section>
  );
}
