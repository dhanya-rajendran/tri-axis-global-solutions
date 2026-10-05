import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { footerNavigation, legalNavigation } from "@/lib/data/navigation";
import { getSiteSettings } from "@/lib/services/api";

export async function Footer() {
  const site = await getSiteSettings();
  const { contact } = site;
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-navy text-white/75" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <Container className="pt-16 pb-10 lg:pt-20">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,3.6fr)] lg:gap-12">
          <div className="max-w-xs">
            <Logo tone="light" />
            <p className="mt-5 text-sm leading-relaxed">{site.tagline}</p>
            <ul className="mt-6 flex gap-2.5" aria-label="Social media">
              {site.social.map((s) => (
                <li key={s.platform}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${site.name} on ${s.label} (opens in a new tab)`}
                    className="inline-flex size-9 items-center justify-center rounded-control border border-white/15 text-white/80 transition-colors hover:border-gold hover:bg-gold hover:text-navy"
                  >
                    <SocialIcon platform={s.platform} className="size-4" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 xl:grid-cols-[repeat(5,minmax(0,1fr))_minmax(0,1.35fr)]">
            {footerNavigation.map((col) => (
              <nav key={col.title} aria-label={col.title}>
                <h3 className="text-[13px] font-semibold tracking-wide text-white">{col.title}</h3>
                <ul className="mt-4 space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="text-[13px] transition-colors hover:text-gold-light">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
            <div className="col-span-2 sm:col-span-3 xl:col-span-1">
              <h3 className="text-[13px] font-semibold tracking-wide text-white">Contact</h3>
              <address className="mt-4 space-y-3 text-[13px] not-italic">
                <p className="flex gap-2">
                  <MapPin aria-hidden className="mt-0.5 size-3.5 shrink-0 text-gold" strokeWidth={1.5} />
                  <span>
                    {contact.address.line1}, {contact.address.country === "United Arab Emirates" ? "UAE" : contact.address.country}
                  </span>
                </p>
                <p className="flex gap-2">
                  <Phone aria-hidden className="mt-0.5 size-3.5 shrink-0 text-gold" strokeWidth={1.5} />
                  {contact.phoneHref ? (
                    <a href={contact.phoneHref} className="hover:text-gold-light">
                      {contact.phone}
                    </a>
                  ) : (
                    <span>{contact.phone}</span>
                  )}
                </p>
                <p className="flex gap-2">
                  <Mail aria-hidden className="mt-0.5 size-3.5 shrink-0 text-gold" strokeWidth={1.5} />
                  <a href={`mailto:${contact.email}`} className="break-words hover:text-gold-light">
                    {contact.email}
                  </a>
                </p>
              </address>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-6 text-xs text-white/55 md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {site.legalName}. All rights reserved.
          </p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {legalNavigation.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-gold-light">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </footer>
  );
}
