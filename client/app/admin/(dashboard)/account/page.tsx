"use client";

import { FormEvent, useEffect, useState } from "react";
import { useToast } from "@/components/admin/Toast";
import { AdminPageHeader, ErrorState, Field, FormSection } from "@/components/admin/ui";
import { adminFetch, AdminApiError, getAdminUser, type AdminUser } from "@/lib/adminApi";
import { Loader2 } from "lucide-react";

export default function AdminAccountPage() {
  const toast = useToast();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setUser(getAdminUser());
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (newPassword !== confirmPassword) {
      setError("New password and confirmation do not match.");
      return;
    }

    setSaving(true);
    try {
      const data = await adminFetch("/auth/change-password", {
        method: "POST",
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      toast.success(data?.message || "Password updated.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err instanceof AdminApiError ? err.message : "Failed to change password.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <AdminPageHeader
        breadcrumbs={[{ label: "Dashboard", href: "/admin" }, { label: "System" }, { label: "My account" }]}
        title="My account"
        description="Your administrator profile and password."
      />

      <div className="max-w-2xl space-y-6">
        <FormSection title="Profile">
          <dl className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-3">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wider text-ink-500">Name</dt>
              <dd className="mt-1 text-ink-900">{user?.fullName ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wider text-ink-500">Email</dt>
              <dd className="mt-1 break-all text-ink-900">{user?.email ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wider text-ink-500">Role</dt>
              <dd className="mt-1 capitalize text-ink-900">{user?.role ?? "—"}</dd>
            </div>
          </dl>
        </FormSection>

        <form onSubmit={handleSubmit}>
          <FormSection title="Change password" description="Use at least 6 characters.">
            {error && <ErrorState message={error} />}
            <Field label="Current password" htmlFor="current-password">
              <input
                id="current-password"
                required
                type="password"
                autoComplete="current-password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="input-field"
              />
            </Field>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="New password" htmlFor="new-password">
                <input
                  id="new-password"
                  required
                  minLength={6}
                  type="password"
                  autoComplete="new-password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="input-field"
                />
              </Field>
              <Field label="Confirm new password" htmlFor="confirm-password">
                <input
                  id="confirm-password"
                  required
                  minLength={6}
                  type="password"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="input-field"
                />
              </Field>
            </div>
            <div className="flex justify-end">
              <button type="submit" disabled={saving} className="btn-primary btn-sm">
                {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />}
                Update password
              </button>
            </div>
          </FormSection>
        </form>
      </div>
    </>
  );
}
