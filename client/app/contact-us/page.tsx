import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import ContactForm from "@/components/ContactForm";
import PageHeader from "@/components/PageHeader";
import { fetchSettings } from "@/lib/settings";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Alene High School in Semen Sub-City, Mekelle, Ethiopia.",
};

export default async function ContactUsPage() {
  const settings = await fetchSettings();

  const details = [
    { icon: MapPin, label: "Address", value: settings.contactAddress },
    {
      icon: Phone,
      label: "Phone",
      value: settings.contactPhone,
      href: `tel:${settings.contactPhone.replace(/\s/g, "")}`,
    },
    { icon: Mail, label: "Email", value: settings.contactEmail, href: `mailto:${settings.contactEmail}` },
    { icon: Clock, label: "Office hours", value: settings.contactHours },
  ].filter((d) => d.value);

  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Get in touch."
        intro="Questions about admissions, academics or school life? Send us a message or reach the registrar directly."
      />

      <section className="border-t border-ink-200 pb-16 sm:pb-24 lg:pb-32">
        <div className="container-page grid grid-cols-1 gap-14 pt-12 lg:grid-cols-12 lg:gap-16 lg:pt-16">
          <div className="lg:col-span-7">
            <h2 className="font-display text-2xl font-bold text-ink-900">Send a message</h2>
            <div className="mt-8">
              <ContactForm />
            </div>
          </div>

          <aside className="lg:col-span-5" aria-labelledby="contact-details-title">
            <div className="border-t-4 border-crimson-600 bg-ink-50 p-6 sm:p-8">
              <h2 id="contact-details-title" className="font-display text-2xl font-bold text-ink-900">
                {settings.schoolName}
              </h2>
              <dl className="mt-6 divide-y divide-ink-200">
                {details.map(({ icon: Icon, label, value, href }) => (
                  <div key={label} className="flex items-start gap-4 py-5">
                    <Icon className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" aria-hidden="true" />
                    <div>
                      <dt className="text-xs font-bold uppercase tracking-[0.14em] text-ink-500">{label}</dt>
                      <dd className="mt-1 text-ink-900">
                        {href ? (
                          <a href={href} className="break-all font-medium hover:text-brand-700 hover:underline">
                            {value}
                          </a>
                        ) : (
                          value
                        )}
                      </dd>
                    </div>
                  </div>
                ))}
              </dl>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
