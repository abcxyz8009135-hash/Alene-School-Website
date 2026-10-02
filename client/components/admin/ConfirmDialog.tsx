"use client";

import { useState } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
import AdminModal from "./AdminModal";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  /** What will happen, in plain words. */
  message: React.ReactNode;
  confirmLabel?: string;
  tone?: "danger" | "default";
  onConfirm: () => Promise<void> | void;
  onClose: () => void;
}

/**
 * Required step before any destructive action. The confirm button shows a
 * spinner while the action runs and the dialog closes only on success.
 */
export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Delete",
  tone = "danger",
  onConfirm,
  onClose,
}: ConfirmDialogProps) {
  const [busy, setBusy] = useState(false);

  async function handleConfirm() {
    setBusy(true);
    try {
      await onConfirm();
      onClose();
    } catch {
      // The caller reports the failure (toast); keep the dialog open to retry.
    } finally {
      setBusy(false);
    }
  }

  return (
    <AdminModal open={open} title={title} onClose={busy ? () => undefined : onClose} size="sm">
      <div className="flex gap-3">
        {tone === "danger" && (
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-crimson-50 text-crimson-600">
            <AlertTriangle className="h-4 w-4" aria-hidden="true" />
          </span>
        )}
        <div className="text-sm leading-relaxed text-ink-600">{message}</div>
      </div>
      <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <button type="button" onClick={onClose} disabled={busy} className="btn-secondary btn-sm">
          Cancel
        </button>
        <button
          type="button"
          data-autofocus
          onClick={handleConfirm}
          disabled={busy}
          className={
            tone === "danger"
              ? "btn btn-sm bg-crimson-600 text-white hover:bg-crimson-700"
              : "btn-primary btn-sm"
          }
        >
          {busy && <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />}
          {confirmLabel}
        </button>
      </div>
    </AdminModal>
  );
}
