"use client";

import { FormEvent, useEffect, useState } from "react";
import { Check, Loader2, RefreshCw, X } from "lucide-react";
import AdminModal from "@/components/admin/AdminModal";
import { adminFetch, AdminApiError } from "@/lib/adminApi";

const AUTO_REFRESH_INTERVAL_MS = 15000;

interface AccessRequest {
  id: string;
  fullName: string;
  email: string;
  role: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
}

const ROLE_LABELS: Record<string, string> = {
  student: "Student",
  teacher: "Teacher / Principal",
};

export default function AdminAccessRequestsPage() {
  const [requests, setRequests] = useState<AccessRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [tempPassword, setTempPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  async function loadRequests(options: { silent?: boolean } = {}) {
    if (options.silent) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    try {
      const data = await adminFetch("/admin/access-requests");
      setRequests(data.requests);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      // Background polls fail silently in the UI (no disruptive error banner)
      // — the last successfully loaded list just stays on screen.
      if (!options.silent) {
        setError(err instanceof Error ? err.message : "Failed to load access requests.");
      }
    } finally {
      if (options.silent) {
        setRefreshing(false);
      } else {
        setLoading(false);
      }
    }
  }

  useEffect(() => {
    loadRequests();
  }, []);

  useEffect(() => {
    if (!autoRefresh) return;
    const timer = setInterval(() => loadRequests({ silent: true }), AUTO_REFRESH_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [autoRefresh]);

  function openApprove(id: string) {
    setApprovingId(id);
    setTempPassword("");
    setFormError(null);
  }

  async function handleApprove(e: FormEvent) {
    e.preventDefault();
    if (!approvingId) return;
    setSaving(true);
    setFormError(null);

    try {
      await adminFetch(`/admin/access-requests/${approvingId}/approve`, {
        method: "POST",
        body: JSON.stringify({ temporaryPassword: tempPassword }),
      });
      setApprovingId(null);
      await loadRequests();
    } catch (err) {
      setFormError(err instanceof AdminApiError ? err.message : "Failed to approve request.");
    } finally {
      setSaving(false);
    }
  }

  async function handleReject(id: string) {
    if (!confirm("Reject this access request?")) return;
    try {
      await adminFetch(`/admin/access-requests/${id}/reject`, { method: "POST" });
      await loadRequests();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to reject request.");
    }
  }

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink-900">Access Requests</h1>
          <p className="mt-1 text-sm text-ink-500">
            Review and approve portal access requests from students and staff.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {lastUpdated && (
            <span className="text-xs text-ink-400">
              Updated {lastUpdated.toLocaleTimeString()}
            </span>
          )}
          <button
            onClick={() => loadRequests({ silent: true })}
            disabled={refreshing}
            className="btn-icon"
            aria-label="Refresh now"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <button
            onClick={() => setAutoRefresh((v) => !v)}
            role="switch"
            aria-checked={autoRefresh}
            className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold transition ${
              autoRefresh
                ? "border-brand-600 bg-brand-50 text-brand-700"
                : "border-slate-200 text-ink-600 hover:bg-slate-50"
            }`}
          >
            <span
              className={`relative h-4 w-7 shrink-0 rounded-full transition-colors ${
                autoRefresh ? "bg-brand-600" : "bg-slate-300"
              }`}
            >
              <span
                className={`absolute top-0.5 h-3 w-3 rounded-full bg-white transition-transform ${
                  autoRefresh ? "translate-x-3.5" : "translate-x-0.5"
                }`}
              />
            </span>
            Auto-refresh
          </button>
        </div>
      </div>

      {error && (
        <p className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 ring-1 ring-inset ring-red-200">
          {error}
        </p>
      )}

      <div className="card mt-6 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 text-xs uppercase tracking-wider text-ink-400">
            <tr>
              <th className="px-5 py-3">Name</th>
              <th className="px-5 py-3">Email</th>
              <th className="px-5 py-3">Role</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading && (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-ink-400">
                  <Loader2 className="mx-auto h-5 w-5 animate-spin" />
                </td>
              </tr>
            )}
            {!loading && requests.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-ink-400">
                  No access requests yet.
                </td>
              </tr>
            )}
            {requests.map((request) => (
              <tr key={request.id}>
                <td className="px-5 py-3 font-medium text-ink-900">{request.fullName}</td>
                <td className="px-5 py-3 text-ink-500">{request.email}</td>
                <td className="px-5 py-3">
                  <span className="tag-pill">{ROLE_LABELS[request.role] ?? request.role}</span>
                </td>
                <td className="px-5 py-3 text-ink-500">{request.status}</td>
                <td className="px-5 py-3">
                  {request.status === "PENDING" && (
                    <div className="flex justify-end gap-2">
                      <button onClick={() => openApprove(request.id)} className="btn-icon">
                        <Check className="h-3.5 w-3.5" />
                        Approve
                      </button>
                      <button onClick={() => handleReject(request.id)} className="btn-danger">
                        <X className="h-3.5 w-3.5" />
                        Reject
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AdminModal
        open={approvingId !== null}
        title="Approve Access Request"
        onClose={() => setApprovingId(null)}
      >
        <form onSubmit={handleApprove} className="space-y-4">
          <p className="text-sm text-ink-500">
            Set a temporary password for this account. Share it with the requester through a
            secure channel — they should change it after first login.
          </p>
          <div>
            <label className="form-label">Temporary Password</label>
            <input
              required
              minLength={6}
              type="text"
              value={tempPassword}
              onChange={(e) => setTempPassword(e.target.value)}
              className="input-field"
            />
          </div>

          {formError && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 ring-1 ring-inset ring-red-200">
              {formError}
            </p>
          )}

          <button type="submit" disabled={saving} className="btn-primary w-full">
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            Create Account
          </button>
        </form>
      </AdminModal>
    </div>
  );
}
