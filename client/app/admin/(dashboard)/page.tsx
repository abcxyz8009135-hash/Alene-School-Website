"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  ClipboardList,
  GraduationCap,
  Home,
  Newspaper,
  Plus,
  UserPlus,
  Users,
  type LucideIcon,
} from "lucide-react";
import { AdminPageHeader, EmptyState, ErrorState, StatusBadge } from "@/components/admin/ui";
import { adminFetch, getAdminUser } from "@/lib/adminApi";
import { formatAdminDate } from "@/lib/admin/format";
import type { AccessRequest, AdminProgram } from "@/lib/admin/types";
import type { NewsArticle } from "@/lib/types";

interface DashboardStats {
  newsCount: number;
  resultsCount: number;
  achievementsCount: number;
  usersCount: number;
  passCount: number;
}

interface Overview {
  stats: DashboardStats;
  programCount: number;
  pending: AccessRequest[];
  recentNews: NewsArticle[];
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<Overview | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      const [stats, programs, requests, news] = await Promise.all([
        adminFetch("/admin/stats"),
        adminFetch("/admin/programs"),
        adminFetch("/admin/access-requests"),
        adminFetch("/admin/news"),
      ]);
      setData({
        stats: stats.stats,
        programCount: (programs.programs as AdminProgram[]).length,
        pending: (requests.requests as AccessRequest[]).filter((r) => r.status === "PENDING"),
        recentNews: [...(news.articles as NewsArticle[])]
          .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
          .slice(0, 5),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load the dashboard.");
    }
  }, []);

  useEffect(() => {
    setName(getAdminUser()?.fullName ?? null);
    load();
  }, [load]);

  const s = data?.stats;
  const passRate = s && s.resultsCount > 0 ? Math.round((s.passCount / s.resultsCount) * 100) : null;

  const cards: { label: string; value?: number; href?: string; icon: LucideIcon; note?: string }[] = [
    { label: "News articles", value: s?.newsCount, href: "/admin/news", icon: Newspaper },
    { label: "Programs", value: data?.programCount, href: "/admin/programs", icon: GraduationCap },
    { label: "Achievements", value: s?.achievementsCount, href: "/admin/achievements", icon: Award },
    {
      label: "Exam results",
      value: s?.resultsCount,
      href: "/admin/results",
      icon: ClipboardList,
      note: passRate !== null ? `${s!.passCount} passed (${passRate}%)` : undefined,
    },
    {
      label: "Pending access requests",
      value: data?.pending.length,
      href: "/admin/access-requests",
      icon: UserPlus,
    },
    { label: "Registered users", value: s?.usersCount, icon: Users, note: "Admins, staff and students" },
  ];

  return (
    <>
      <AdminPageHeader
        breadcrumbs={[{ label: "Dashboard" }]}
        title={name ? `Welcome back, ${name.split(" ")[0]}` : "Dashboard"}
        description="An overview of the Alene High School website."
        actions={
          <a href="/" target="_blank" rel="noreferrer" className="btn-secondary btn-sm">
            View website
          </a>
        }
      />

      {error && <ErrorState message={error} onRetry={load} />}

      {/* Overview */}
      <section aria-label="Overview" className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-6">
        {cards.map((card) => {
          const body = (
            <>
              <card.icon className="h-5 w-5 text-brand-600" aria-hidden="true" />
              <p className="mt-3 font-display text-2xl font-bold tabular-nums text-ink-900">
                {card.value ?? <span className="text-ink-300">—</span>}
              </p>
              <p className="mt-0.5 text-xs font-medium text-ink-600">{card.label}</p>
              {card.note && <p className="mt-1 text-[11px] text-ink-400">{card.note}</p>}
            </>
          );
          return card.href ? (
            <Link
              key={card.label}
              href={card.href}
              className={`card block p-4 transition hover:border-brand-300 ${
                card.href === "/admin/access-requests" && (card.value ?? 0) > 0 ? "border-crimson-300" : ""
              }`}
            >
              {body}
            </Link>
          ) : (
            <div key={card.label} className="card p-4">
              {body}
            </div>
          );
        })}
      </section>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent news */}
        <section aria-labelledby="recent-news" className="card lg:col-span-2">
          <div className="flex items-center justify-between border-b border-ink-100 px-5 py-4">
            <h2 id="recent-news" className="text-base font-semibold text-ink-900">
              Recent news
            </h2>
            <Link href="/admin/news" className="link-arrow text-xs">
              All news
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>
          {!data ? (
            <p className="px-5 py-10 text-center text-sm text-ink-400">Loading…</p>
          ) : data.recentNews.length === 0 ? (
            <div className="py-10">
              <EmptyState
                title="No articles yet"
                action={
                  <Link href="/admin/news/new" className="btn-primary btn-sm">
                    Write an article
                  </Link>
                }
              />
            </div>
          ) : (
            <ul className="divide-y divide-ink-100">
              {data.recentNews.map((a) => (
                <li key={a.id}>
                  <Link
                    href={`/admin/news/${a.id}`}
                    className="flex items-center justify-between gap-4 px-5 py-3 hover:bg-ink-50/60"
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium text-ink-900">{a.title}</span>
                      <span className="text-xs text-ink-500">{formatAdminDate(a.publishedAt)}</span>
                    </span>
                    <StatusBadge tone="brand">{a.category}</StatusBadge>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <div className="space-y-6">
          {/* Quick actions */}
          <section aria-labelledby="quick-actions" className="card p-5">
            <h2 id="quick-actions" className="text-base font-semibold text-ink-900">
              Quick actions
            </h2>
            <ul className="mt-3 space-y-1.5">
              {[
                { label: "New article", href: "/admin/news/new", icon: Plus },
                { label: "Add exam result", href: "/admin/results/new", icon: Plus },
                { label: "New achievement", href: "/admin/achievements/new", icon: Plus },
                { label: "Edit home page photos", href: "/admin/content/homepage", icon: Home },
              ].map((action) => (
                <li key={action.href}>
                  <Link
                    href={action.href}
                    className="flex items-center gap-2.5 rounded-md px-2 py-2 text-sm font-medium text-brand-700 hover:bg-brand-50"
                  >
                    <action.icon className="h-4 w-4" aria-hidden="true" />
                    {action.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          {/* Pending requests */}
          <section aria-labelledby="pending-requests" className="card">
            <div className="flex items-center justify-between border-b border-ink-100 px-5 py-4">
              <h2 id="pending-requests" className="text-base font-semibold text-ink-900">
                Waiting for review
              </h2>
              {data && data.pending.length > 0 && <StatusBadge tone="warning">{data.pending.length}</StatusBadge>}
            </div>
            {!data ? (
              <p className="px-5 py-6 text-center text-sm text-ink-400">Loading…</p>
            ) : data.pending.length === 0 ? (
              <p className="px-5 py-6 text-sm text-ink-500">No pending access requests.</p>
            ) : (
              <ul className="divide-y divide-ink-100">
                {data.pending.slice(0, 4).map((r) => (
                  <li key={r.id} className="px-5 py-3">
                    <p className="text-sm font-medium text-ink-900">{r.fullName}</p>
                    <p className="text-xs text-ink-500">
                      {r.role === "teacher" ? "Teacher / Principal" : "Student"} · {formatAdminDate(r.createdAt)}
                    </p>
                  </li>
                ))}
                <li className="px-5 py-3">
                  <Link href="/admin/access-requests" className="link-arrow text-xs">
                    Review requests
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                </li>
              </ul>
            )}
          </section>
        </div>
      </div>
    </>
  );
}
