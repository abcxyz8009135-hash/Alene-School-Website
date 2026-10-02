"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import ConfirmDialog from "./ConfirmDialog";
import { useToast } from "./Toast";
import { adminFetch } from "@/lib/adminApi";
import { errorMessage } from "@/lib/admin/format";

interface DeleteRecordButtonProps {
  /** API path, e.g. /admin/news/<id>. */
  endpoint: string;
  /** Where to go after deleting. */
  redirectTo: string;
  /** Shown in the dialog, e.g. the record title. */
  name: string;
  noun: string;
}

/** Delete control for edit pages: confirm → delete → toast → back to the list. */
export default function DeleteRecordButton({ endpoint, redirectTo, name, noun }: DeleteRecordButtonProps) {
  const router = useRouter();
  const toast = useToast();
  const [open, setOpen] = useState(false);

  async function handleDelete() {
    try {
      await adminFetch(endpoint, { method: "DELETE" });
      toast.success(`${noun[0].toUpperCase()}${noun.slice(1)} deleted.`);
      router.push(redirectTo);
    } catch (err) {
      toast.error(errorMessage(err, `Failed to delete ${noun}.`));
      throw err;
    }
  }

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="btn-danger">
        <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
        Delete {noun}
      </button>
      <ConfirmDialog
        open={open}
        title={`Delete ${noun}?`}
        message={
          <>
            <strong className="text-ink-900">{name}</strong> will be permanently deleted. This cannot be undone.
          </>
        }
        confirmLabel={`Delete ${noun}`}
        onConfirm={handleDelete}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
