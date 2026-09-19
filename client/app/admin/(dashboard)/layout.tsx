"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  Award,
  ClipboardList,
  FileText,
  KeyRound,
  LayoutDashboard,
  Loader2,
  LogOut,
  Newspaper,
  Settings,
  UserPlus,
} from "lucide-react";
import { API_BASE_URL } from "@/lib/constants";
import {
  AdminUser,
  clearAdminSession,
  getAdminToken,
  getAdminUser,
  setAdminSession,
} from "@/lib/adminApi";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "News", href: "/admin/news", icon: Newspaper },
  { label: "Exam Results", href: "/admin/results", icon: ClipboardList },
  { label: "Programs", href: "/admin/program-content", icon: FileText },
  { label: "Achievements", href: "/admin/programs", icon: Award },
  { label: "Site Content", href: "/admin/content", icon: Settings },
  { label: "Access Requests", href: "/admin/access-requests", icon: UserPlus },
  { label: "Account", href: "/admin/account", icon: KeyRound },
];

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);
  const [user, setUser] = useState<AdminUser | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function verify() {
      const token = getAdminToken();
      const cachedUser = getAdminUser();

      if (!token || cachedUser?.role !== "admin") {
        router.replace("/admin/login");
        return;
      }

      try {
        const res = await fetch(`${API_BASE_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Session expired");
        const data = await res.json();
        if (data.user?.role !== "admin") throw new Error("Not an admin");

        if (!cancelled) {
          setAdminSession(token, data.user);
          setUser(data.user);
          setChecking(false);
        }
      } catch {
        clearAdminSession();
        if (!cancelled) router.replace("/admin/login");
      }
    }

    verify();
    return () => {
      cancelled = true;
    };
  }, [router]);

  function handleLogout() {
    clearAdminSession();
    router.replace("/admin/login");
  }

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <Loader2 className="h-6 w-6 animate-spin text-brand-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex min-h-screen">
        <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white sm:block">
          <div className="flex h-16 items-center border-b border-slate-200 px-6">
            <span className="font-bold text-ink-900">Admin Panel</span>
          </div>
          <nav className="flex flex-col gap-1 p-4">
            {NAV_ITEMS.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                    active
                      ? "bg-brand-50 text-brand-700"
                      : "text-ink-600 hover:bg-slate-100 hover:text-ink-900"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="mt-auto border-t border-slate-200 p-4">
            <p className="truncate text-xs font-medium text-ink-900">{user?.fullName}</p>
            <p className="truncate text-xs text-ink-400">{user?.email}</p>
            <button
              onClick={handleLogout}
              className="mt-3 flex w-full items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-ink-600 transition hover:bg-slate-100"
            >
              <LogOut className="h-3.5 w-3.5" />
              Log Out
            </button>
          </div>
        </aside>

        <div className="flex-1">
          <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 sm:hidden">
            <span className="font-bold text-ink-900">Admin Panel</span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-xs font-semibold text-ink-600"
            >
              <LogOut className="h-3.5 w-3.5" />
              Log Out
            </button>
          </header>
          <nav className="flex gap-1 overflow-x-auto border-b border-slate-200 bg-white p-2 sm:hidden">
            {NAV_ITEMS.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium ${
                    active ? "bg-brand-50 text-brand-700" : "text-ink-600"
                  }`}
                >
                  <item.icon className="h-3.5 w-3.5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <main className="p-4 sm:p-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
