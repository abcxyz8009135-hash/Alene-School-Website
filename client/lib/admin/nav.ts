import {
  Award,
  ClipboardList,
  CircleUser,
  GraduationCap,
  Files,
  Home,
  LayoutDashboard,
  Menu,
  Newspaper,
  Search,
  Settings,
  type LucideIcon,
} from "lucide-react";

export interface AdminNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  /** Extra path prefixes that should mark this item active. */
  match?: string[];
}

export interface AdminNavGroup {
  label?: string;
  items: AdminNavItem[];
}

/**
 * Admin information architecture. Every item maps to an existing feature of
 * the Alene API — nothing here is a placeholder.
 */
export const ADMIN_NAV: AdminNavGroup[] = [
  { items: [{ label: "Dashboard", href: "/admin", icon: LayoutDashboard }] },
  {
    label: "Content",
    items: [
      { label: "News", href: "/admin/news", icon: Newspaper },
      { label: "Programs", href: "/admin/programs", icon: GraduationCap },
      { label: "Achievements", href: "/admin/achievements", icon: Award },
      { label: "Exam Results", href: "/admin/results", icon: ClipboardList },
    ],
  },
  {
    label: "Site",
    items: [
      { label: "Homepage", href: "/admin/content/homepage", icon: Home },
      {
        label: "Pages",
        href: "/admin/content/about",
        icon: Files,
        match: ["academics", "stem", "community", "news", "contact", "results", "apply"].map((s) => `/admin/content/${s}`),
      },
      { label: "Navigation & footer", href: "/admin/content/navigation", icon: Menu },
      { label: "SEO", href: "/admin/content/seo", icon: Search },
      { label: "Site settings", href: "/admin/content/settings", icon: Settings },
    ],
  },
  {
    label: "System",
    items: [{ label: "My account", href: "/admin/account", icon: CircleUser }],
  },
];

export function isNavItemActive(pathname: string, item: AdminNavItem) {
  if (item.href === "/admin") return pathname === "/admin";
  const prefixes = [item.href, ...(item.match ?? [])];
  return prefixes.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

export const PROGRAM_CATEGORY_LABEL: Record<"stem-center" | "hobbies", string> = {
  "stem-center": "STEM",
  hobbies: "Community",
};

export const NEWS_CATEGORIES = ["Achievements", "Campus", "Admissions", "Events"];

