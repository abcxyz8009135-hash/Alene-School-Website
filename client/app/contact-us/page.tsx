import { Clock, Mail, MapPin, Phone } from "lucide-react";
import ContactForm from "@/components/ContactForm";
import { CONTACT_INFO } from "@/lib/constants";

// Hybrid rendering: this shell (contact details, layout) is static SSG;
// the interactive form is isolated in the client-rendered <ContactForm />.

export default function ContactUsPage() {
  return (
    <section className="container-page py-16">
      <h1 className="mt-4 text-4xl font-bold text-ink-900 sm:text-5xl">
        Get in Touch
      </h1>
      <p className="mt-4 max-w-2xl text-ink-500">
        Have a question about admissions, academics, or campus life? We&apos;d
        love to hear from you.
      </p>

      <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-5">
        {/* Contact form (client component) */}
        <div className="card p-6 lg:col-span-3 sm:p-8">
          <ContactForm />
        </div>

        {/* Contact info + map (static) */}
        <div className="space-y-6 lg:col-span-2">
          <div className="card space-y-5 p-6 sm:p-8">
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" />
              <div>
                <h4 className="text-sm font-semibold text-ink-900">Address</h4>
                <p className="text-sm text-ink-500">{CONTACT_INFO.address}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" />
              <div>
                <h4 className="text-sm font-semibold text-ink-900">Phone</h4>
                <p className="text-sm text-ink-500">{CONTACT_INFO.phone}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Mail className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" />
              <div>
                <h4 className="text-sm font-semibold text-ink-900">Email</h4>
                <p className="text-sm text-ink-500">{CONTACT_INFO.email}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" />
              <div>
                <h4 className="text-sm font-semibold text-ink-900">Office Hours</h4>
                <p className="text-sm text-ink-500">{CONTACT_INFO.hours}</p>
              </div>
            </div>
          </div>

          {/* Map placeholder */}
          <div className="card relative flex h-56 items-center justify-center overflow-hidden bg-slate-50">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.08),transparent_70%)]" />
            <div className="relative flex flex-col items-center gap-2 text-center">
              <MapPin className="h-8 w-8 text-brand-500" />
              <p className="text-sm text-ink-500">Map preview unavailable</p>
              <p className="text-xs text-ink-400">{CONTACT_INFO.address}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
