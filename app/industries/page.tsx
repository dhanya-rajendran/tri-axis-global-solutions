import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { JsonLd } from "@/components/seo/JsonLd";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { PageHero } from "@/components/templates/PageHero";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { breadcrumbJsonLd } from "@/lib/seo/jsonld";
import { buildMetadata } from "@/lib/seo/metadata";
import { getIndustries } from "@/lib/services/api";

export const metadata: Metadata = buildMetadata({
  title: "Industries",
  description:
    "Specialist recruitment across technology, engineering, oil & gas, healthcare, banking, FMCG, retail, hospitality, manufacturing, logistics and more in the UAE.",
  path: "/industries",
});

export default async function IndustriesPage() {
  const industries = await getIndustries();
  return (
    <>
      <PageHero
        eyebrow="Industry Expertise"
        title="Specialist knowledge across key sectors"
        description="Our consultants focus on specific industries, so they understand the skills, certifications and market conditions that matter to you."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Industries" }]}
      />
      <section className="py-20 lg:py-24" aria-label="Industries">
        <Container>
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {industries.map((ind) => (
              <li key={ind.id} className="reveal">
                <Link
                  href={`/industries/${ind.slug}`}
                  className="group flex h-full flex-col rounded-card border border-line bg-white p-7 transition-[border-color,box-shadow] duration-300 hover:border-navy/30 hover:shadow-[0_20px_40px_-26px_rgba(7,27,54,0.45)]"
                >
                  <span className="inline-flex size-12 items-center justify-center rounded-full bg-surface-muted text-navy transition-colors group-hover:bg-navy group-hover:text-gold">
                    <Icon name={ind.icon} className="size-6" />
                  </span>
                  <h2 className="mt-5 font-serif text-xl font-medium text-navy">{ind.name}</h2>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{ind.summary}</p>
                  <span className="mt-6 inline-flex items-center gap-1.5 text-[13px] font-semibold text-teal-dark group-hover:text-navy">
                    Explore {ind.shortName ?? ind.name} <ArrowRight aria-hidden className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>
      <FinalCTA />
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Industries", path: "/industries" }])} />
    </>
  );
}
