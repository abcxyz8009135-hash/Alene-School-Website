import { CONTENT, parseList, type ListItem, type ListKey, type TextKey, type ToggleKey } from "./contentRegistry";
import { fetchSettingsMap, fetchSettings } from "./settings";
import { CONTACT_HREF, EXAM_RESULTS_HREF, NAV_ITEMS } from "./constants";

/**
 * Website copy with admin edits applied. Anything not edited (or stored in an
 * unreadable form) falls back to the registry default.
 */
export interface SiteContent {
  text(key: TextKey): string;
  list(key: ListKey): ListItem[];
  bool(key: ToggleKey): boolean;
}

export function makeContent(raw: Record<string, string>, vars: Record<string, string> = {}): SiteContent {
  const fill = (s: string) => s.replace(/\{(\w+)\}/g, (m, name) => vars[name] ?? m);
  return {
    text(key) {
      const field = CONTENT[key];
      const value = raw[key]?.trim();
      return fill(value ? raw[key] : field.default);
    },
    list(key) {
      const field = CONTENT[key];
      return parseList(raw[key], field) ?? field.default.map((item) => ({ ...item }));
    },
    bool(key) {
      const value = raw[key];
      if (value === "true") return true;
      if (value === "false") return false;
      return CONTENT[key].default;
    },
  };
}

/** Loads the website copy (one de-duplicated settings request per render). */
export async function getContent(): Promise<SiteContent> {
  const [raw, settings] = await Promise.all([fetchSettingsMap(), fetchSettings()]);
  return makeContent(raw, { school: settings.schoolName, motto: settings.schoolMotto });
}

/** Splits a multi-line list field ("one per line") into trimmed entries. */
export function lines(value: string | undefined) {
  return (value ?? "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}

export interface NavLink {
  label: string;
  href: string;
}

export interface SiteNavigation {
  main: NavLink[];
  exam: NavLink;
  contact: NavLink;
  portalLabel: string;
  footer: NavLink[];
}

/** Navigation with admin-edited labels (plain data, safe for client components). */
export function buildNavigation(c: SiteContent): SiteNavigation {
  const main = NAV_ITEMS.map((item) => ({ label: c.text(item.key), href: item.href }));
  const exam = { label: c.text("nav.examResults"), href: EXAM_RESULTS_HREF };
  const contact = { label: c.text("nav.contact"), href: CONTACT_HREF };
  return {
    main,
    exam,
    contact,
    portalLabel: c.text("nav.portal"),
    footer: [...main.filter((l) => l.href !== "/"), exam, contact],
  };
}

/** Only allow links to pages on this site ("/…"), never "//host" or "javascript:". */
export function internalHref(value: string | undefined, fallback: string) {
  const v = (value ?? "").trim();
  return v.startsWith("/") && !v.startsWith("//") ? v : fallback;
}

/** Only allow absolute http(s) URLs for admin-entered external links. */
export function externalUrl(value: string | undefined) {
  const v = (value ?? "").trim();
  return /^https?:\/\//i.test(v) ? v : "";
}
