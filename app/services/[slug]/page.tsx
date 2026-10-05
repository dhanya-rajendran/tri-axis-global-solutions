import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { ServiceCard } from "@/components/cards/ServiceCard";
import { JsonLd } from "@/components/seo/JsonLd";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { ContentBlocks } from "@/components/templates/ContentBlocks";
import { PageHero } from "@/components/templates/PageHero";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { breadcrumbJsonLd } from "@/lib/seo/jsonld";
import { buildMetadata } from "@/lib/seo/metadata";
import { getServiceBySlug, getServices } from "@/lib/services/api";

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getServices()).map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/services/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) return {};
  return buildMetadata({
    title: service.seoTitle ?? service.title,
    description: service.seoDescription ?? service.summary,
    path: `/services/${service.slug}`,
    image: service.image.src,
  });
}

const slugify = (s: string) => s.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export default async function ServiceDetailPage({ params }: PageProps<"/services/[slug]">) {
  const { slug } = await params;
  const [service, all] = await Promise.all([getServiceBySlug(slug), getServices()]);
  if (!service) notFound();
  const others = all.filter((s) => s.slug !== service.slug);
  const isRecruitment = service.category === "recruitment";

  return (
    <>
      <PageHero
        eyebrow={service.shortTitle}
        title={service.title}
        description={service.intro}
        image={service.image}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Services", href: "/services" }, { label: service.title }]}
      >
        <ButtonLink href={isRecruitment ? "/employers#enquiry" : "/contact"} variant="primary" arrow>
          {isRecruitment ? "Hire Talent" : "Make an Enquiry"}
        </ButtonLink>
        {isRecruitment && (
          <ButtonLink href="/jobs" variant="outline-light" arrow>
            Browse Jobs
          </ButtonLink>
        )}
      </PageHero>

      <section className="py-20 lg:py-24">
        <Container>
          <SectionHeading eyebrow="What we offer" title={`${service.shortTitle} services`} className="reveal" />
          <ul className={`mt-12 grid gap-6 sm:grid-cols-2 ${service.offerings.length % 4 === 0 ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}>
            {service.offerings.map((o) => (
              <li key={o.title} id={slugify(o.title)} className="reveal scroll-mt-28 rounded-card border border-line bg-white p-7">
                <Icon name={o.icon} className="size-7 text-teal" />
                <h3 className="mt-5 font-serif text-xl font-medium text-navy">{o.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{o.description}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="bg-surface-muted py-20 lg:py-24">
        <Container className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-16">
          <div className="reveal">
            <ContentBlocks blocks={service.body} />
            <div className="mt-8">
              <ButtonLink href="/contact" variant="secondary" arrow>
                Speak to a consultant
              </ButtonLink>
            </div>
          </div>
          <div className="reveal relative aspect-[4/3] overflow-hidden rounded-card">
            <Image src={service.image.src} alt={service.image.alt} fill sizes="(min-width: 1024px) 560px, 100vw" className="object-cover" />
          </div>
        </Container>
      </section>

      <section className="py-20 lg:py-24" aria-labelledby="other-services">
        <Container>
          <div className="flex items-end justify-between gap-6">
            <h2 id="other-services" className="font-serif text-h3 font-medium text-navy">
              Other services
            </h2>
            <Link href="/services" className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal-dark hover:text-navy">
              All services <ArrowRight aria-hidden className="size-4" />
            </Link>
          </div>
          <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((s) => (
              <li key={s.id}>
                <ServiceCard service={s} />
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <FinalCTA />
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Services", path: "/services" },
            { name: service.title, path: `/services/${service.slug}` },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "Service",
            name: service.title,
            description: service.seoDescription ?? service.summary,
            provider: { "@type": "Organization", name: "TriAxis Global Solutions" },
            areaServed: "AE",
          },
        ]}
      />
    </>
  );
}
