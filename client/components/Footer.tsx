import Link from "next/link";
import { Facebook, Instagram, Mail, MapPin, Phone, Youtube } from "lucide-react";
import Logo from "./Logo";
import { CONTACT_INFO, NAV_LINKS, SCHOOL_NAME } from "@/lib/constants";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="container-page grid grid-cols-1 gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-500">
            {SCHOOL_NAME} is committed to nurturing knowledgeable, principled, and
            innovative learners ready to shape the future.
          </p>
          <div className="mt-5 flex gap-3">
            {[Facebook, Instagram, Youtube].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-ink-500 transition hover:border-brand-300 hover:text-brand-600"
                aria-label="Social link"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
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
            <li>Web Development</li>
            <li>Robotics &amp; Automation</li>
            <li>Biotechnology &amp; Applied Sciences</li>
            <li>Arts &amp; Music</li>
            <li>Sports &amp; Athletics</li>
            <li>Leadership &amp; Student Council</li>
            <li>Community Service</li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-ink-900">
            Contact
          </h3>
          <ul className="mt-4 space-y-3 text-sm text-ink-500">
            <li className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
              {CONTACT_INFO.address}
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="h-4 w-4 shrink-0 text-brand-600" />
              {CONTACT_INFO.phone}
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="h-4 w-4 shrink-0 text-brand-600" />
              {CONTACT_INFO.email}
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-200 py-6">
        <p className="container-page text-center text-xs text-ink-400">
          © {year} {SCHOOL_NAME}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
