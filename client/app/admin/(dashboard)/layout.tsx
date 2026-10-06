"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Loader2, Menu, X } from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { ToastProvider } from "@/components/admin/Toast";
import { API_BASE_URL } from "@/lib/constants";
import { ADMIN_NAV, isNavItemActive } from "@/lib/admin/nav";
import {
  AdminUser,
  clearAdminSession,
  getAdminToken,
  getAdminUser,
  setAdminSession,
} from "@/lib/adminApi";

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);
  const [user, setUser] = useState<AdminUser | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  // Session check (unchanged): the token must belong to an admin according to
  // the API. The API itself enforces admin auth on every /api/admin route.
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

  // Close the drawer on navigation.
  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  const closeDrawer = useCallback(() => {
    setDrawerOpen(false);
    menuButtonRef.current?.focus();
  }, []);

  // Drawer: Escape closes, focus stays inside, page doesn't scroll behind it.
  useEffect(() => {
    if (!drawerOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusable = () =>
      Array.from(drawerRef.current?.querySelectorAll<HTMLElement>("a[href], button") ?? []);
    focusable()[0]?.focus();

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") return closeDrawer();
      if (e.key !== "Tab") return;
      const items = focusable();
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [drawerOpen, closeDrawer]);

  function handleLogout() {
    clearAdminSession();
    router.replace("/admin/login");
  }

  if (checking) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-ink-50">
        <Loader2 className="h-6 w-6 animate-spin text-brand-600" aria-label="Checking your session" />
      </div>
    );
  }

  const currentItem = ADMIN_NAV.flatMap((g) => g.items).find((item) => isNavItemActive(pathname, item));

  return (
    <ToastProvider>
      <div className="min-h-[calc(100vh-72px)] bg-ink-50 lg:flex">
        {/* Desktop sidebar */}
        <aside className="hidden w-64 shrink-0 border-r border-ink-200 bg-white lg:block">
          <div className="sticky top-[68px] h-[calc(100vh-68px)]">
            <AdminSidebar user={user} onLogout={handleLogout} />
          </div>
        </aside>

        {/* Mobile / tablet top bar */}
        <div className="sticky top-16 z-30 flex h-12 items-center gap-3 border-b border-ink-200 bg-white px-4 lg:hidden">
          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="-ml-1 inline-flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-semibold text-ink-700 hover:bg-ink-100"
            aria-expanded={drawerOpen}
            aria-controls="admin-drawer"
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
            Admin menu
          </button>
          {currentItem && (
            <span className="truncate border-l border-ink-200 pl-3 text-sm text-ink-500">{currentItem.label}</span>
          )}
        </div>

        {drawerOpen && (
          <div className="fixed inset-0 z-[55] lg:hidden">
            <div className="absolute inset-0 animate-fade-in bg-ink-950/50" onClick={closeDrawer} aria-hidden="true" />
            <div
              id="admin-drawer"
              ref={drawerRef}
              role="dialog"
              aria-modal="true"
              aria-label="Admin menu"
              className="absolute inset-y-0 left-0 w-72 max-w-[85vw] animate-fade-in bg-white shadow-card"
            >
              <button
                type="button"
                onClick={closeDrawer}
                className="absolute right-3 top-3 z-10 rounded-md p-1.5 text-ink-500 hover:bg-ink-100 hover:text-ink-900"
                aria-label="Close admin menu"
              >
                <X className="h-5 w-5" />
              </button>
              <AdminSidebar user={user} onLogout={handleLogout} onNavigate={() => setDrawerOpen(false)} />
            </div>
          </div>
        )}

        <main id="admin-main" className="min-w-0 flex-1 px-4 pb-10 pt-6 sm:px-8 sm:pt-8">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>
    </ToastProvider>
  );
}
