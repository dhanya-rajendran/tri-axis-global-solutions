import type { Metadata } from "next";
import { Compass, Eye, UserRound } from "lucide-react";
import { JsonLd } from "@/components/seo/JsonLd";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { TrustSection } from "@/components/sections/TrustSection";
import { WhyTriAxis } from "@/components/sections/WhyTriAxis";
import { FeatureGrid } from "@/components/templates/FeatureGrid";
import { PageHero } from "@/components/templates/PageHero";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { breadcrumbJsonLd } from "@/lib/seo/jsonld";
import { buildMetadata } from "@/lib/seo/metadata";
import { getFeatures, getMission, getServices, getStatistics, getTeamMembers, getTestimonials } from "@/lib/services/api";

export const metadata: Metadata = buildMetadata({
  title: "About Us",
  description:
    "Learn about TriAxis Global Solutions FZE — a UAE-based recruitment, talent and business solutions company connecting talent, trade and technology.",
  path: "/about",
});

export default async function AboutPage() {
  const [services, statistics, testimonials, mission, companyValues, valuePropositions, teamMembers] = await Promise.all([
    getServices(),
    getStatistics(),
    getTestimonials(),
    getMission(),
    getFeatures("company_values"),
    getFeatures("why_triaxis"),
    getTeamMembers(),
  ]);

  return (
    <>
      <PageHero
        eyebrow="About TriAxis"
        title="Connecting talent, trade & technology"
        description="We connect businesses with the people, expertise and solutions they need to grow."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "About Us" }]}
      />

      <section className="py-20 lg:py-28">
        <Container className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <SectionHeading eyebrow="Who we are" title="A UAE partner for people and business" className="reveal" />
          <div className="reveal space-y-5 text-[16px] leading-relaxed text-ink">
            <p>
              TriAxis Global Solutions FZE is a UAE-based company working across three connected areas: talent, trade and
              technology. We help employers recruit and keep the right people, and we support businesses with procurement,
              general trading and e-commerce.
            </p>
            <p>
              Our clients range from growing local companies to international groups establishing a presence in the region.
              What they share is a need for a partner who understands the UAE market, responds quickly and stays accountable
              for results.
            </p>
            <ul className="grid gap-3 pt-2 sm:grid-cols-2">
              {services.map((s) => (
                <li key={s.id} className="border-l-2 border-gold pl-4 text-sm font-semibold text-navy">
                  {s.title}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      <section id="mission" className="bg-navy py-20 text-white lg:py-24" aria-labelledby="mission-title">
        <Container>
          <h2 id="mission-title" className="sr-only">
            Mission and vision
          </h2>
          <div className="grid gap-px overflow-hidden rounded-card bg-white/10 md:grid-cols-2">
            {[
              { label: "Our Mission", text: mission.mission, Icon: Compass },
              { label: "Our Vision", text: mission.vision, Icon: Eye },
            ].map(({ label, text, Icon }) => (
              <div key={label} className="reveal bg-navy p-8 sm:p-12">
                <Icon aria-hidden className="size-7 text-gold" strokeWidth={1.25} />
                <h3 className="eyebrow mt-6 text-gold">{label}</h3>
                <p className="mt-4 font-serif text-2xl leading-snug text-white sm:text-[1.75rem]">{text}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <FeatureGrid id="values" eyebrow="Our Values" title="What guides our work" items={companyValues} />

      <WhyTriAxis items={valuePropositions} />

      <section id="leadership" className="py-20 lg:py-24" aria-labelledby="leadership-title">
        <Container>
          <SectionHeading eyebrow="Leadership" title="The team behind TriAxis" id="leadership-title" className="reveal" />
          {teamMembers.length ? (
            <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {teamMembers.map((m) => (
                <li key={m.id} className="rounded-card border border-line p-6">
                  <p className="font-semibold text-navy">{m.name}</p>
                  <p className="text-sm text-muted">{m.role}</p>
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="rounded-card border border-dashed border-line p-6 text-center">
                  <span className="mx-auto inline-flex size-20 items-center justify-center rounded-full bg-surface-muted text-muted">
                    <UserRound aria-hidden className="size-8" strokeWidth={1.25} />
                  </span>
                  <p className="mt-4 text-sm font-semibold text-navy">[Leadership profile]</p>
                  <p className="text-xs text-muted">Name, title and photo to be supplied</p>
                </div>
              ))}
            </div>
          )}
          <div className="mt-10">
            <ButtonLink href="/contact" variant="secondary" arrow>
              Talk to our team
            </ButtonLink>
          </div>
        </Container>
      </section>

      <TrustSection statistics={statistics} testimonial={testimonials[0]} />
      <FinalCTA />
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "About Us", path: "/about" }])} />
    </>
  );
}
