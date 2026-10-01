import Link from "next/link";
import { Facebook, Instagram, Mail, MapPin, Phone, Youtube } from "lucide-react";
import Logo from "./Logo";
import { FOOTER_LINKS } from "@/lib/constants";
import type { SiteSettings } from "@/lib/settings";

interface FooterProps {
  settings: SiteSettings;
}

export default function Footer({ settings }: FooterProps) {
  const year = new Date().getFullYear();
  const socialLinks = [
    { Icon: Facebook, href: settings.facebookUrl, label: "Facebook" },
    { Icon: Instagram, href: settings.instagramUrl, label: "Instagram" },
    { Icon: Youtube, href: settings.youtubeUrl, label: "YouTube" },
  ].filter((link) => link.href);

  return (
    <footer className="relative overflow-hidden bg-crimson-600 text-white">
      {/* Crest-inspired rings, decorative only */}
      <div
        aria-hidden="true"
        className="crest-rings pointer-events-none absolute -right-40 -top-40 h-[520px] w-[520px] text-white/10"
      />

      <div className="container-page relative pt-16 sm:pt-20">
        <div className="grid grid-cols-1 gap-12 border-b border-white/15 pb-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Logo
              logoUrl={settings.logoUrl}
              schoolName={settings.schoolName}
              tone="light"
              size="lg"
              showLocation
            />
            <blockquote className="mt-8 max-w-md">
              <p className="font-display text-2xl font-bold leading-snug tracking-tight sm:text-[1.7rem]">
                &ldquo;{settings.schoolMotto}&rdquo;
              </p>
              <footer className="mt-3 text-xs font-semibold uppercase tracking-[0.18em] text-white/60">
                School motto
              </footer>
            </blockquote>
          </div>

          <nav aria-label="Footer" className="lg:col-span-3">
            <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-white/60">Explore</h2>
            <ul className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3 lg:grid-cols-1">
              {FOOTER_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm font-medium text-white/85 underline-offset-4 transition hover:text-white hover:underline focus-visible:ring-white focus-visible:ring-offset-crimson-600"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-4">
            <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-white/60">Visit &amp; contact</h2>
            <ul className="mt-5 space-y-4 text-sm text-white/85">
              {settings.contactAddress && (
                <li className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-white/60" aria-hidden="true" />
                  <span>{settings.contactAddress}</span>
                </li>
              )}
              {settings.contactPhone && (
                <li className="flex items-center gap-3">
                  <Phone className="h-4 w-4 shrink-0 text-white/60" aria-hidden="true" />
                  <a
                    href={`tel:${settings.contactPhone.replace(/\s/g, "")}`}
                    className="hover:text-white hover:underline focus-visible:ring-white focus-visible:ring-offset-crimson-600"
                  >
                    {settings.contactPhone}
                  </a>
                </li>
              )}
              {settings.contactEmail && (
                <li className="flex items-center gap-3">
                  <Mail className="h-4 w-4 shrink-0 text-white/60" aria-hidden="true" />
                  <a
                    href={`mailto:${settings.contactEmail}`}
                    className="break-all hover:text-white hover:underline focus-visible:ring-white focus-visible:ring-offset-crimson-600"
                  >
                    {settings.contactEmail}
                  </a>
                </li>
              )}
            </ul>

            {socialLinks.length > 0 && (
              <ul className="mt-6 flex gap-2">
                {socialLinks.map(({ Icon, href, label }) => (
                  <li key={label}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${label} (opens in a new tab)`}
                      className="flex h-10 w-10 items-center justify-center rounded-md border border-white/25 text-white/85 transition hover:border-white hover:text-white focus-visible:ring-white focus-visible:ring-offset-crimson-600"
                    >
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2 py-6 text-xs text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {settings.schoolName}. All rights reserved.
          </p>
          <p>Mekelle Administration Office · Semen Sub-City</p>
        </div>
      </div>
    </footer>
  );
}
