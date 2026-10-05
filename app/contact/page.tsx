import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { ContactForm } from "@/components/forms/ContactForm";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageHero } from "@/components/templates/PageHero";
import { Container } from "@/components/ui/Container";
import { breadcrumbJsonLd } from "@/lib/seo/jsonld";
import { buildMetadata } from "@/lib/seo/metadata";
import { getSiteSettings } from "@/lib/services/api";

export const metadata: Metadata = buildMetadata({
  title: "Contact Us",
  description: "Contact TriAxis Global Solutions for recruitment, talent and business solutions in the UAE.",
  path: "/contact",
});

export default async function ContactPage() {
  const { contact, name } = await getSiteSettings();
  const addr = contact.address;

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Let's talk"
        description="Whether you're hiring, job seeking or exploring our business solutions, our team is here to help."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Contact" }]}
      />

      <Container className="grid gap-12 py-16 lg:grid-cols-[380px_1fr] lg:gap-16 lg:py-24">
        <aside aria-labelledby="contact-details" className="space-y-6">
          <div className="rounded-card bg-navy p-8 text-white">
            <h2 id="contact-details" className="font-serif text-2xl font-medium text-white">
              Contact details
            </h2>
            <dl className="mt-6 space-y-5 text-sm">
              <div className="flex gap-3">
                <MapPin aria-hidden className="mt-0.5 size-4 shrink-0 text-gold" strokeWidth={1.5} />
                <div>
                  <dt className="text-white/60">Office</dt>
                  <dd className="mt-0.5 text-white">
                    <address className="not-italic">
                      {name}
                      <br />
                      {addr.line1}
                      <br />
                      {addr.city}, {addr.emirate}
                      <br />
                      {addr.country}
                    </address>
                  </dd>
                </div>
              </div>
              <div className="flex gap-3">
                <Phone aria-hidden className="mt-0.5 size-4 shrink-0 text-gold" strokeWidth={1.5} />
                <div>
                  <dt className="text-white/60">Phone</dt>
                  <dd className="mt-0.5 text-white">{contact.phoneHref ? <a href={contact.phoneHref}>{contact.phone}</a> : contact.phone}</dd>
                </div>
              </div>
              <div className="flex gap-3">
                <Mail aria-hidden className="mt-0.5 size-4 shrink-0 text-gold" strokeWidth={1.5} />
                <div>
                  <dt className="text-white/60">Email</dt>
                  <dd className="mt-0.5 space-y-1">
                    <a href={`mailto:${contact.email}`} className="block text-white hover:text-gold-light">
                      {contact.email}
                    </a>
                    <a href={`mailto:${contact.careersEmail}`} className="block text-white/80 hover:text-gold-light">
                      {contact.careersEmail} <span className="text-white/50">(careers)</span>
                    </a>
                  </dd>
                </div>
              </div>
              <div className="flex gap-3">
                <Clock aria-hidden className="mt-0.5 size-4 shrink-0 text-gold" strokeWidth={1.5} />
                <div>
                  <dt className="text-white/60">Working hours</dt>
                  {contact.workingHours.map((w) => (
                    <dd key={w.days} className="mt-0.5 text-white">
                      {w.days}: {w.hours}
                    </dd>
                  ))}
                </div>
              </div>
            </dl>
          </div>

          {/* Map: renders an embed once siteConfig.contact.mapEmbedUrl is set. */}
          <div className="relative aspect-[4/3] overflow-hidden rounded-card border border-line bg-surface-muted">
            {contact.mapEmbedUrl ? (
              <iframe
                src={contact.mapEmbedUrl}
                title={`Map showing the ${name} office`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 size-full border-0"
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                <div
                  aria-hidden
                  className="absolute inset-0 opacity-60 [background-image:linear-gradient(var(--color-line)_1px,transparent_1px),linear-gradient(90deg,var(--color-line)_1px,transparent_1px)] [background-size:28px_28px]"
                />
                <MapPin aria-hidden className="relative size-8 text-gold" strokeWidth={1.5} />
                <p className="relative mt-3 text-sm font-semibold text-navy">Office map</p>
                <p className="relative text-xs text-muted">Map will appear once the office location is confirmed.</p>
              </div>
            )}
          </div>
        </aside>

        <section aria-labelledby="contact-form-title">
          <h2 id="contact-form-title" className="font-serif text-h3 font-medium text-navy">
            Send us a message
          </h2>
          <p className="mt-2 mb-8 text-muted">We aim to reply within one business day.</p>
          <ContactForm />
        </section>
      </Container>
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Contact", path: "/contact" }])} />
    </>
  );
}
