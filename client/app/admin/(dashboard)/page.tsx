"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Award, ClipboardList, Newspaper, Users } from "lucide-react";
import { adminFetch } from "@/lib/adminApi";

interface DashboardStats {
  newsCount: number;
  resultsCount: number;
  achievementsCount: number;
  usersCount: number;
  passCount: number;
}

const CARDS = [
  { key: "newsCount", label: "News Articles", icon: Newspaper, href: "/admin/news" },
  { key: "resultsCount", label: "Exam Results", icon: ClipboardList, href: "/admin/results" },
  { key: "achievementsCount", label: "Program Achievements", icon: Award, href: "/admin/programs" },
  { key: "usersCount", label: "Registered Users", icon: Users, href: null },
] as const;

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    adminFetch("/admin/stats")
      .then((data) => setStats(data.stats))
      .catch((err) => setError(err.message));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-ink-900">Dashboard</h1>
      <p className="mt-1 text-sm text-ink-500">
        Overview of Alene High School website content.
      </p>

      {error && (
        <p className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 ring-1 ring-inset ring-red-200">
          {error}
        </p>
      )}

      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {CARDS.map((card) => {
          const value = stats ? stats[card.key] : null;
          const content = (
            <div className="card p-6 transition hover:-translate-y-0.5 hover:shadow-lg">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600 ring-1 ring-inset ring-brand-200">
                <card.icon className="h-5 w-5" />
              </span>
              <p className="mt-4 text-2xl font-bold text-ink-900">
                {value === null ? "—" : value}
              </p>
              <p className="mt-1 text-sm text-ink-500">{card.label}</p>
            </div>
          );

          return card.href ? (
            <Link key={card.key} href={card.href}>
              {content}
            </Link>
          ) : (
            <div key={card.key}>{content}</div>
          );
        })}
      </div>

      {stats && (
        <div className="card mt-8 p-6">
          <h2 className="text-sm font-semibold text-ink-900">Entrance Exam Pass Rate</h2>
          <p className="mt-1 text-xs text-ink-400">
            {stats.passCount} of {stats.resultsCount} results marked as passed
          </p>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-brand-600"
              style={{
                width: `${
                  stats.resultsCount === 0
                    ? 0
                    : Math.round((stats.passCount / stats.resultsCount) * 100)
                }%`,
              }}
            />
          </div>
        </div>
      )}

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Link href="/admin/news" className="btn-secondary justify-start">
          Manage News →
        </Link>
        <Link href="/admin/results" className="btn-secondary justify-start">
          Manage Exam Results →
        </Link>
        <Link href="/admin/programs" className="btn-secondary justify-start">
          Manage Achievements →
        </Link>
      </div>
    </div>
  );
}
