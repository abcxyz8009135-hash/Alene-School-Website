"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ExternalLink, LogOut } from "lucide-react";
import { ADMIN_NAV, isNavItemActive } from "@/lib/admin/nav";
import type { AdminUser } from "@/lib/adminApi";

interface AdminSidebarProps {
  user: AdminUser | null;
  onLogout: () => void;
  onNavigate?: () => void;
  badges?: Record<string, number>;
}

/** Grouped CMS navigation, shared by the desktop sidebar and the mobile drawer. */
export default function AdminSidebar({ user, onLogout, onNavigate, badges = {} }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-14 shrink-0 items-center border-b border-ink-200 px-5">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-crimson-600">Admin panel</p>
      </div>

      <nav aria-label="Admin" className="flex-1 overflow-y-auto px-3 py-4">
        {ADMIN_NAV.map((group, gi) => (
          <div key={group.label ?? gi} className={gi > 0 ? "mt-5" : ""}>
            {group.label && (
              <p className="mb-1.5 px-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-400">
                {group.label}
              </p>
            )}
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const active = isNavItemActive(pathname, item);
                const badge = badges[item.href];
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onNavigate}
                      aria-current={active ? "page" : undefined}
                      className={`flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition ${
                        active
                          ? "bg-brand-50 text-brand-700"
                          : "text-ink-600 hover:bg-ink-100 hover:text-ink-900"
                      }`}
                    >
                      <item.icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                      <span className="flex-1">{item.label}</span>
                      {badge ? (
                        <span
                          className="rounded-full bg-crimson-600 px-1.5 py-0.5 text-[10px] font-bold leading-none text-white"
                          aria-label={`${badge} pending`}
                        >
                          {badge}
                        </span>
                      ) : null}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="shrink-0 space-y-3 border-t border-ink-200 p-4">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2 text-xs font-semibold text-ink-500 hover:text-brand-700"
        >
          <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          View website
        </Link>
        <div>
          <p className="truncate text-xs font-medium text-ink-900">{user?.fullName}</p>
          <p className="truncate text-xs text-ink-400">{user?.email}</p>
        </div>
        <button
          type="button"
          onClick={onLogout}
          className="flex w-full items-center justify-center gap-2 rounded-md border border-ink-200 px-3 py-2 text-xs font-semibold text-ink-600 transition hover:bg-ink-100"
        >
          <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
          Log out
        </button>
      </div>
    </div>
  );
}
