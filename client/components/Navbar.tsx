"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, LogIn, Mail, Menu, Phone, X } from "lucide-react";
import Logo from "./Logo";
import AuthModal from "./AuthModal";
import type { SiteNavigation } from "@/lib/content";
import type { SiteSettings } from "@/lib/settings";

interface NavbarProps {
  settings: SiteSettings;
  nav: SiteNavigation;
}

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Navbar({ settings, nav }: NavbarProps) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);

  const drawerRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the drawer whenever the route changes.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    menuButtonRef.current?.focus();
  }, []);

  // Drawer: lock page scroll, close on Escape, keep focus inside.
  useEffect(() => {
    if (!menuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const drawer = drawerRef.current;
    const focusable = () =>
      Array.from(
        drawer?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])') ?? []
      );
    focusable()[0]?.focus();

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        closeMenu();
        return;
      }
      if (e.key !== "Tab") return;
      const items = focusable();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen, closeMenu]);

  const examActive = isActive(pathname, nav.exam.href);

  return (
    <>
      <header
        className={`sticky top-0 z-40 bg-crimson-600 transition-shadow duration-300 ${
          scrolled ? "shadow-nav" : ""
        }`}
      >
        <nav
          aria-label="Main"
          className={`container-page flex items-center justify-between gap-6 transition-[height] duration-300 ${
            scrolled ? "h-16 lg:h-[68px]" : "h-[72px] lg:h-20"
          }`}
        >
          <Logo logoUrl={settings.logoUrl} schoolName={settings.schoolName} tone="light" />

          <ul className="hidden items-center gap-1 lg:flex">
            {nav.main.map((link) => {
              const active = isActive(pathname, link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={`relative block rounded px-3 py-2 text-sm font-semibold tracking-wide transition-colors focus-visible:ring-white focus-visible:ring-offset-crimson-600 ${
                      active ? "text-white" : "text-white/80 hover:text-white"
                    }`}
                  >
                    {link.label}
                    <span
                      aria-hidden="true"
                      className={`absolute inset-x-3 -bottom-0.5 h-[2px] origin-left bg-white transition-transform duration-300 ${
                        active ? "scale-x-100" : "scale-x-0"
                      }`}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="hidden items-center gap-2 lg:flex">
            <button
              type="button"
              onClick={() => setAuthOpen(true)}
              className="hidden items-center gap-1.5 rounded px-3 py-2 text-sm font-semibold text-white/80 transition-colors hover:text-white focus-visible:ring-white focus-visible:ring-offset-crimson-600 xl:inline-flex"
            >
              <LogIn className="h-4 w-4" aria-hidden="true" />
              {nav.portalLabel}
            </button>
            <Link
              href={nav.exam.href}
              aria-current={examActive ? "page" : undefined}
              className="btn-primary focus-visible:ring-white focus-visible:ring-offset-crimson-600"
            >
              {nav.exam.label}
            </Link>
          </div>

          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setMenuOpen(true)}
            className="-mr-2 inline-flex items-center gap-2 rounded px-2 py-2 text-sm font-semibold uppercase tracking-widest text-white focus-visible:ring-white focus-visible:ring-offset-crimson-600 lg:hidden"
            aria-label="Open menu"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            <span className="hidden sm:inline">Menu</span>
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
        </nav>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 animate-fade-in bg-ink-950/50"
            onClick={closeMenu}
            aria-hidden="true"
          />
          <div
            id="mobile-menu"
            ref={drawerRef}
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            className="absolute inset-y-0 right-0 flex w-full max-w-sm animate-drawer-in flex-col bg-white"
          >
            <div className="flex h-[72px] items-center justify-between bg-crimson-600 px-4 sm:px-6">
              <p className="font-display text-sm font-extrabold uppercase tracking-[0.12em] text-white">
                Menu
              </p>
              <button
                type="button"
                onClick={closeMenu}
                className="-mr-2 rounded p-2 text-white focus-visible:ring-white focus-visible:ring-offset-crimson-600"
                aria-label="Close menu"
              >
                <X className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>

            <ul className="flex-1 overflow-y-auto px-4 py-4 sm:px-6">
              {nav.main.map((link, i) => {
                const active = isActive(pathname, link.href);
                return (
                  <li key={link.href} className="border-b border-ink-100">
                    <Link
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      aria-current={active ? "page" : undefined}
                      className={`flex items-center justify-between py-4 font-display text-2xl font-bold tracking-tight ${
                        active ? "text-crimson-600" : "text-ink-900"
                      }`}
                    >
                      <span className="flex items-baseline gap-4">
                        <span className="w-6 text-xs font-semibold tabular-nums text-ink-400">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        {link.label}
                      </span>
                      {active && <span className="h-2 w-2 rounded-full bg-crimson-600" aria-hidden="true" />}
                    </Link>
                  </li>
                );
              })}
              <li className="border-b border-ink-100">
                <Link
                  href={nav.contact.href}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-baseline gap-4 py-4 font-display text-2xl font-bold tracking-tight text-ink-900"
                >
                  <span className="w-6 text-xs font-semibold tabular-nums text-ink-400">
                    {String(nav.main.length + 1).padStart(2, "0")}
                  </span>
                  {nav.contact.label}
                </Link>
              </li>
            </ul>

            <div className="space-y-3 border-t border-ink-100 bg-ink-50 px-4 py-5 sm:px-6">
              <Link
                href={nav.exam.href}
                onClick={() => setMenuOpen(false)}
                className="btn-primary w-full"
              >
                {nav.exam.label}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  setAuthOpen(true);
                }}
                className="btn-secondary w-full"
              >
                <LogIn className="h-4 w-4" aria-hidden="true" />
                {nav.portalLabel}
              </button>
              <div className="flex flex-col gap-1.5 pt-2 text-sm text-ink-500">
                {settings.contactPhone && (
                  <a href={`tel:${settings.contactPhone.replace(/\s/g, "")}`} className="inline-flex items-center gap-2 hover:text-brand-700">
                    <Phone className="h-4 w-4" aria-hidden="true" />
                    {settings.contactPhone}
                  </a>
                )}
                {settings.contactEmail && (
                  <a href={`mailto:${settings.contactEmail}`} className="inline-flex items-center gap-2 hover:text-brand-700">
                    <Mail className="h-4 w-4" aria-hidden="true" />
                    {settings.contactEmail}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}
