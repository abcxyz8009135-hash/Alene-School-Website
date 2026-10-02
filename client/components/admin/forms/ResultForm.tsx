"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/admin/Toast";
import { ErrorState, Field, FormActions, FormSection } from "@/components/admin/ui";
import { adminFetch } from "@/lib/adminApi";
import { errorMessage } from "@/lib/admin/format";
import type { ExamResult, ExamStatus } from "@/lib/types";

export const EXAM_STATUS_LABEL: Record<ExamStatus, string> = {
  PASS: "Passed",
  FAIL: "Not passed",
  PENDING: "Pending",
};

export const EXAM_STATUS_TONE: Record<ExamStatus, "success" | "danger" | "warning"> = {
  PASS: "success",
  FAIL: "danger",
  PENDING: "warning",
};

interface ResultFormProps {
  result?: ExamResult;
  extraActions?: React.ReactNode;
}

export default function ResultForm({ result, extraActions }: ResultFormProps) {
  const router = useRouter();
  const toast = useToast();
  const editing = Boolean(result);

  const [form, setForm] = useState({
    registrationId: result?.registrationId ?? "",
    studentName: result?.studentName ?? "",
    score: result?.score ?? 0,
    total: result?.total ?? 100,
    status: (result?.status ?? "PENDING") as ExamStatus,
    examYear: result?.examYear ?? new Date().getFullYear(),
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  const percentage = form.total > 0 ? Math.round((form.score / form.total) * 100) : 0;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (form.score > form.total) {
      setError("Score can't be higher than the total.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await adminFetch(editing ? `/admin/results/${result!.id}` : "/admin/results", {
        method: editing ? "PUT" : "POST",
        body: JSON.stringify(form),
      });
      toast.success(editing ? "Result saved." : "Result added.");
      router.push("/admin/results");
    } catch (err) {
      setError(errorMessage(err, "Failed to save exam result."));
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl">
      {error && <ErrorState message={error} />}

      <div className="space-y-6">
        <FormSection title="Student">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field
              label="Registration ID"
              htmlFor="result-reg"
              hint="Students type this exactly to look up their result."
            >
              <input
                id="result-reg"
                required
                minLength={3}
                value={form.registrationId}
                onChange={(e) => set("registrationId", e.target.value)}
                className="input-field font-mono"
                placeholder="AHS-2026-0005"
              />
            </Field>
            <Field label="Student name" htmlFor="result-name">
              <input
                id="result-name"
                required
                minLength={2}
                value={form.studentName}
                onChange={(e) => set("studentName", e.target.value)}
                className="input-field"
              />
            </Field>
          </div>
        </FormSection>

        <FormSection
          title="Result"
          aside={
            <p className="text-right text-xs text-ink-500">
              <span className="block font-display text-2xl font-bold tabular-nums text-brand-700">{percentage}%</span>
              of total
            </p>
          }
        >
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Field label="Score" htmlFor="result-score">
              <input
                id="result-score"
                required
                type="number"
                min={0}
                value={form.score}
                onChange={(e) => set("score", Number(e.target.value))}
                className="input-field tabular-nums"
              />
            </Field>
            <Field label="Out of" htmlFor="result-total">
              <input
                id="result-total"
                required
                type="number"
                min={1}
                value={form.total}
                onChange={(e) => set("total", Number(e.target.value))}
                className="input-field tabular-nums"
              />
            </Field>
            <Field label="Status" htmlFor="result-status">
              <select
                id="result-status"
                value={form.status}
                onChange={(e) => set("status", e.target.value as ExamStatus)}
                className="input-field"
              >
                {(Object.keys(EXAM_STATUS_LABEL) as ExamStatus[]).map((s) => (
                  <option key={s} value={s}>
                    {EXAM_STATUS_LABEL[s]}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Exam year" htmlFor="result-year">
              <input
                id="result-year"
                required
                type="number"
                min={2000}
                value={form.examYear}
                onChange={(e) => set("examYear", Number(e.target.value))}
                className="input-field tabular-nums"
              />
            </Field>
          </div>
        </FormSection>
      </div>

      <FormActions
        cancelHref="/admin/results"
        saving={saving}
        submitLabel={editing ? "Save changes" : "Add result"}
        extra={extraActions}
      />
    </form>
  );
}
