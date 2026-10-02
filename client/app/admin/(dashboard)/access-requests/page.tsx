"use client";

import { FormEvent, useEffect, useState } from "react";
import { Check, Loader2, RefreshCw, X } from "lucide-react";
import AdminModal from "@/components/admin/AdminModal";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { useToast } from "@/components/admin/Toast";
import {
  AdminPageHeader,
  EmptyRow,
  ErrorState,
  Field,
  FilterSelect,
  ListToolbar,
  LoadingRow,
  Pagination,
  RowActions,
  SearchInput,
  StatusBadge,
  TableCard,
  TableHead,
  Td,
  Th,
} from "@/components/admin/ui";
import { adminFetch } from "@/lib/adminApi";
import { errorMessage, formatAdminDate } from "@/lib/admin/format";
import type { AccessRequest } from "@/lib/admin/types";
import { useListControls } from "@/lib/admin/useListControls";

const AUTO_REFRESH_INTERVAL_MS = 15000;

const ROLE_LABELS: Record<string, string> = {
  student: "Student",
  teacher: "Teacher / Principal",
};

const STATUS_TONE = { PENDING: "warning", APPROVED: "success", REJECTED: "danger" } as const;
const STATUS_LABEL = { PENDING: "Pending", APPROVED: "Approved", REJECTED: "Rejected" } as const;

export default function AdminAccessRequestsPage() {
  const toast = useToast();
  const [requests, setRequests] = useState<AccessRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const [approving, setApproving] = useState<AccessRequest | null>(null);
  const [rejecting, setRejecting] = useState<AccessRequest | null>(null);
  const [tempPassword, setTempPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  async function loadRequests(options: { silent?: boolean } = {}) {
    if (options.silent) setRefreshing(true);
    else setLoading(true);
    try {
      const data = await adminFetch("/admin/access-requests");
      setRequests(data.requests);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      // Background polls fail quietly; the last loaded list stays on screen.
      if (!options.silent) setError(errorMessage(err, "Failed to load access requests."));
    } finally {
      if (options.silent) setRefreshing(false);
      else setLoading(false);
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

  const list = useListControls(requests, {
    searchFields: (r) => [r.fullName, r.email],
    filters: {
      status: (r, v) => r.status === v,
      role: (r, v) => r.role === v,
    },
    sorters: {
      name: (r) => r.fullName.toLowerCase(),
      date: (r) => new Date(r.createdAt).getTime(),
    },
    initialSort: { key: "date", dir: "desc" },
  });

  const pendingCount = requests.filter((r) => r.status === "PENDING").length;

  function openApprove(request: AccessRequest) {
    setApproving(request);
    setTempPassword("");
    setFormError(null);
  }

  async function handleApprove(e: FormEvent) {
    e.preventDefault();
    if (!approving) return;
    setSaving(true);
    setFormError(null);
    try {
      await adminFetch(`/admin/access-requests/${approving.id}/approve`, {
        method: "POST",
        body: JSON.stringify({ temporaryPassword: tempPassword }),
      });
      toast.success(`Account created for ${approving.fullName}.`);
      setApproving(null);
      await loadRequests({ silent: true });
    } catch (err) {
      setFormError(errorMessage(err, "Failed to approve request."));
    } finally {
      setSaving(false);
    }
  }

  async function handleReject(request: AccessRequest) {
    try {
      await adminFetch(`/admin/access-requests/${request.id}/reject`, { method: "POST" });
      toast.success(`Request from ${request.fullName} rejected.`);
      await loadRequests({ silent: true });
    } catch (err) {
      toast.error(errorMessage(err, "Failed to reject request."));
      throw err;
    }
  }

  return (
    <>
      <AdminPageHeader
        breadcrumbs={[{ label: "Dashboard", href: "/admin" }, { label: "Communication" }, { label: "Access Requests" }]}
        title="Access Requests"
        description="Students and staff asking for a portal account. Approving creates the account with a temporary password."
        actions={
          <>
            {lastUpdated && (
              <span className="text-xs text-ink-500">Updated {lastUpdated.toLocaleTimeString()}</span>
            )}
            <button
              type="button"
              onClick={() => loadRequests({ silent: true })}
              disabled={refreshing}
              className="btn-icon"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} aria-hidden="true" />
              Refresh
            </button>
            <button
              type="button"
              onClick={() => setAutoRefresh((v) => !v)}
              role="switch"
              aria-checked={autoRefresh}
              className={`flex items-center gap-2 rounded-md border px-3 py-1.5 text-xs font-semibold transition ${
                autoRefresh ? "border-brand-600 bg-brand-50 text-brand-700" : "border-ink-200 text-ink-600 hover:bg-ink-50"
              }`}
            >
              <span
                className={`relative h-4 w-7 shrink-0 rounded-full transition-colors ${
                  autoRefresh ? "bg-brand-600" : "bg-ink-300"
                }`}
                aria-hidden="true"
              >
                <span
                  className={`absolute top-0.5 h-3 w-3 rounded-full bg-white transition-transform ${
                    autoRefresh ? "translate-x-3.5" : "translate-x-0.5"
                  }`}
                />
              </span>
              Auto-refresh
            </button>
          </>
        }
      />

      {error && <ErrorState message={error} onRetry={() => loadRequests()} />}

      <ListToolbar summary={!loading && `${pendingCount} pending · ${requests.length} total`}>
        <SearchInput value={list.query} onChange={list.setQuery} placeholder="Search name or email…" label="Search requests" />
        <FilterSelect
          label="Status"
          value={list.filterValues.status ?? ""}
          onChange={(v) => list.setFilter("status", v)}
          options={[
            { value: "", label: "All" },
            { value: "PENDING", label: "Pending" },
            { value: "APPROVED", label: "Approved" },
            { value: "REJECTED", label: "Rejected" },
          ]}
        />
        <FilterSelect
          label="Role"
          value={list.filterValues.role ?? ""}
          onChange={(v) => list.setFilter("role", v)}
          options={[{ value: "", label: "All" }, ...Object.entries(ROLE_LABELS).map(([value, label]) => ({ value, label }))]}
        />
      </ListToolbar>

      <TableCard>
        <TableHead>
          <Th sortKey="name" sort={list.sort} onSort={list.toggleSort}>
            Name
          </Th>
          <Th className="hidden md:table-cell">Role</Th>
          <Th sortKey="date" sort={list.sort} onSort={list.toggleSort} className="hidden md:table-cell">
            Requested
          </Th>
          <Th>Status</Th>
          <Th align="right">Actions</Th>
        </TableHead>
        <tbody className="divide-y divide-ink-100">
          {loading ? (
            <LoadingRow colSpan={5} />
          ) : list.pageItems.length === 0 ? (
            <EmptyRow
              colSpan={5}
              title={list.isFiltering ? "No matching requests" : "No access requests yet"}
              description={
                list.isFiltering ? undefined : "Requests made from the Portal login on the website appear here."
              }
              action={
                list.isFiltering ? (
                  <button type="button" onClick={list.clearFilters} className="btn-icon">
                    Clear filters
                  </button>
                ) : undefined
              }
            />
          ) : (
            list.pageItems.map((r) => (
              <tr key={r.id} className="hover:bg-ink-50/60">
                <Td>
                  <p className="font-medium text-ink-900">{r.fullName}</p>
                  <p className="break-all text-xs text-ink-500">{r.email}</p>
                  <p className="mt-1 text-xs text-ink-500 md:hidden">
                    {ROLE_LABELS[r.role] ?? r.role} · {formatAdminDate(r.createdAt)}
                  </p>
                </Td>
                <Td className="hidden text-ink-700 md:table-cell">{ROLE_LABELS[r.role] ?? r.role}</Td>
                <Td className="hidden whitespace-nowrap text-ink-600 md:table-cell">{formatAdminDate(r.createdAt)}</Td>
                <Td>
                  <StatusBadge tone={STATUS_TONE[r.status]}>{STATUS_LABEL[r.status]}</StatusBadge>
                </Td>
                <Td>
                  {r.status === "PENDING" ? (
                    <RowActions>
                      <button type="button" onClick={() => openApprove(r)} className="btn-icon">
                        <Check className="h-3.5 w-3.5" aria-hidden="true" />
                        <span className="sr-only sm:not-sr-only">Approve</span>
                      </button>
                      <button type="button" onClick={() => setRejecting(r)} className="btn-danger">
                        <X className="h-3.5 w-3.5" aria-hidden="true" />
                        <span className="sr-only sm:not-sr-only">Reject</span>
                      </button>
                    </RowActions>
                  ) : (
                    <p className="text-right text-xs text-ink-400">No action needed</p>
                  )}
                </Td>
              </tr>
            ))
          )}
        </tbody>
      </TableCard>

      <Pagination page={list.page} pageCount={list.pageCount} onPageChange={list.setPage} />

      <AdminModal
        open={approving !== null}
        title="Approve access request"
        description={approving ? `${approving.fullName} · ${approving.email}` : undefined}
        onClose={() => setApproving(null)}
      >
        <form onSubmit={handleApprove} className="space-y-4">
          <p className="text-sm text-ink-600">
            Set a temporary password for this account. Share it with the requester through a secure channel — they
            should change it after their first login.
          </p>
          <Field label="Temporary password" htmlFor="temp-password" hint="At least 6 characters.">
            <input
              id="temp-password"
              data-autofocus
              required
              minLength={6}
              type="text"
              autoComplete="off"
              value={tempPassword}
              onChange={(e) => setTempPassword(e.target.value)}
              className="input-field font-mono"
            />
          </Field>
          {formError && <ErrorState message={formError} />}
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button type="button" onClick={() => setApproving(null)} className="btn-secondary btn-sm">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn-primary btn-sm">
              {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />}
              Create account
            </button>
          </div>
        </form>
      </AdminModal>

      <ConfirmDialog
        open={rejecting !== null}
        title="Reject access request?"
        message={
          <>
            <strong className="text-ink-900">{rejecting?.fullName}</strong> ({rejecting?.email}) will not get a portal
            account. They can submit a new request later.
          </>
        }
        confirmLabel="Reject request"
        onConfirm={() => handleReject(rejecting!)}
        onClose={() => setRejecting(null)}
      />
    </>
  );
}
