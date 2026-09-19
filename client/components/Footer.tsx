import Link from "next/link";
import { Facebook, Instagram, Mail, MapPin, Phone, Youtube } from "lucide-react";
import Logo from "./Logo";
import { NAV_LINKS } from "@/lib/constants";
import type { SiteSettings } from "@/lib/settings";
import { fetchProgramsByCategory } from "@/lib/programs";

interface FooterProps {
  settings: SiteSettings;
}

const SOCIAL_LINKS = (settings: SiteSettings) =>
  [
    { Icon: Facebook, href: settings.facebookUrl, label: "Facebook" },
    { Icon: Instagram, href: settings.instagramUrl, label: "Instagram" },
    { Icon: Youtube, href: settings.youtubeUrl, label: "YouTube" },
  ].filter((link) => link.href);

export default async function Footer({ settings }: FooterProps) {
  const year = new Date().getFullYear();
  const [stemPrograms, hobbyPrograms] = await Promise.all([
    fetchProgramsByCategory("stem-center"),
    fetchProgramsByCategory("hobbies"),
  ]);
  const programs = [...stemPrograms, ...hobbyPrograms];
  const socialLinks = SOCIAL_LINKS(settings);

  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="container-page grid grid-cols-1 gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo
            logoUrl={settings.logoUrl}
            schoolName={settings.schoolName}
            schoolShortName={settings.schoolShortName}
          />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-500">
            {settings.schoolName} is committed to nurturing knowledgeable, principled, and
            innovative learners ready to shape the future.
          </p>
          {socialLinks.length > 0 && (
            <div className="mt-5 flex gap-3">
              {socialLinks.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-ink-500 transition hover:border-brand-300 hover:text-brand-600"
                  aria-label={label}
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          )}
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-ink-900">
            Quick Links
          </h3>
          <ul className="mt-4 space-y-2.5">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-ink-500 transition hover:text-brand-600"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-ink-900">
            Programs
          </h3>
          <ul className="mt-4 space-y-2.5 text-sm text-ink-500">
            {programs.map((program) => (
              <li key={program.slug}>{program.title}</li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-ink-900">
            Contact
          </h3>
          <ul className="mt-4 space-y-3 text-sm text-ink-500">
            <li className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
              {settings.contactAddress}
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="h-4 w-4 shrink-0 text-brand-600" />
              {settings.contactPhone}
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="h-4 w-4 shrink-0 text-brand-600" />
              {settings.contactEmail}
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-200 py-6">
        <p className="container-page text-center text-xs text-ink-400">
          © {year} {settings.schoolName}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
