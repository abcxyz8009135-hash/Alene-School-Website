"use client";

import { FormEvent, useState } from "react";
import { KeyRound, Loader2 } from "lucide-react";
import { adminFetch, AdminApiError, getAdminUser } from "@/lib/adminApi";

export default function AdminAccountPage() {
  const user = getAdminUser();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

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
      setSuccess(data.message || "Password updated successfully.");
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
    <div>
      <div>
        <h1 className="text-2xl font-bold text-ink-900">Account</h1>
        <p className="mt-1 text-sm text-ink-500">Manage your admin login credentials.</p>
      </div>

      <div className="card mt-6 max-w-md p-6">
        <p className="text-sm font-medium text-ink-900">{user?.fullName}</p>
        <p className="text-xs text-ink-400">{user?.email}</p>
      </div>

      <form onSubmit={handleSubmit} className="card mt-6 max-w-md space-y-4 p-6">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-ink-900">
          <KeyRound className="h-4.5 w-4.5" />
          Change Password
        </h2>

        <div>
          <label className="form-label">Current Password</label>
          <input
            required
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="input-field"
          />
        </div>
        <div>
          <label className="form-label">New Password</label>
          <input
            required
            minLength={6}
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="input-field"
          />
        </div>
        <div>
          <label className="form-label">Confirm New Password</label>
          <input
            required
            minLength={6}
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="input-field"
          />
        </div>

        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 ring-1 ring-inset ring-red-200">
            {error}
          </p>
        )}
        {success && (
          <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-600 ring-1 ring-inset ring-emerald-200">
            {success}
          </p>
        )}

        <button type="submit" disabled={saving} className="btn-primary w-full">
          {saving && <Loader2 className="h-4 w-4 animate-spin" />}
          Update Password
        </button>
      </form>
    </div>
  );
}
