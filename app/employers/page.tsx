import type { Metadata } from "next";
import Image from "next/image";
import { Check } from "lucide-react";
import { EmployerForm } from "@/components/forms/EmployerForm";
import { JsonLd } from "@/components/seo/JsonLd";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { TrustSection } from "@/components/sections/TrustSection";
import { FeatureGrid } from "@/components/templates/FeatureGrid";
import { PageHero } from "@/components/templates/PageHero";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { images } from "@/lib/data/images";
import { breadcrumbJsonLd } from "@/lib/seo/jsonld";
import { buildMetadata } from "@/lib/seo/metadata";
import { getFeatures, getProcessSteps, getStatistics, getTestimonials } from "@/lib/services/api";

export const metadata: Metadata = buildMetadata({
  title: "For Employers – Hire Talent in the UAE",
  description:
    "Recruitment solutions, talent sourcing, executive search, temporary staffing and workforce solutions for employers in Dubai and across the UAE.",
  path: "/employers",
});

export default async function EmployersPage() {
  const [statistics, testimonials, employerBenefits, employerSolutions, processSteps] = await Promise.all([
    getStatistics(),
    getTestimonials(),
    getFeatures("employer_benefits"),
    getFeatures("employer_solutions"),
    getProcessSteps(),
  ]);
  return (
    <>
      <PageHero
        eyebrow="For Employers"
        title="Build the team your business needs"
        description="From a single specialist to a complete project team, we find, assess and deliver talent that fits your business."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "For Employers" }]}
        image={images.cta}
      >
        <ButtonLink href="#enquiry" variant="primary" arrow>
          Hire Talent
        </ButtonLink>
        <ButtonLink href="/services/recruitment-talent-management" variant="outline-light" arrow>
          Our recruitment services
        </ButtonLink>
      </PageHero>

      <FeatureGrid eyebrow="Why partner with TriAxis" title="A recruitment partner that understands your market" items={employerBenefits} />

      <section className="bg-surface-muted py-20 lg:py-24" aria-labelledby="solutions-title">
        <Container className="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
          <div className="reveal">
            <SectionHeading eyebrow="Recruitment solutions" title="Flexible ways to hire" id="solutions-title" />
            <div className="relative mt-10 hidden aspect-[4/5] overflow-hidden rounded-card lg:block">
              <Image src={images.recruitmentFeature.src} alt={images.recruitmentFeature.alt} fill sizes="440px" className="object-cover" />
            </div>
          </div>
          <ul className="divide-y divide-line rounded-card border border-line bg-white">
            {employerSolutions.map((s) => (
              <li key={s.id} id={s.id} className="reveal flex gap-5 p-6 sm:p-8">
                <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-full border border-line text-teal">
                  <Icon name={s.icon} className="size-5" />
                </span>
                <div>
                  <h3 className="font-serif text-xl font-medium text-navy">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{s.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <ProcessSection steps={processSteps} />
      <TrustSection statistics={statistics} testimonial={testimonials[0]} />

      <section id="enquiry" className="scroll-mt-20 py-20 lg:py-28" aria-labelledby="enquiry-title">
        <Container className="grid gap-12 lg:grid-cols-[1fr_1.5fr] lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="Hire Talent"
              title="Tell us about your hiring needs"
              id="enquiry-title"
              description="Share a few details and a consultant will contact you within one business day."
            />
            <ul className="mt-8 space-y-3 text-sm text-ink">
              {["No-obligation consultation", "Salary and market insight", "Shortlists of pre-assessed candidates"].map((t) => (
                <li key={t} className="flex items-center gap-3">
                  <Check aria-hidden className="size-4 text-gold" /> {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-card border border-line bg-white p-6 shadow-[0_24px_48px_-36px_rgba(7,27,54,0.5)] sm:p-10">
            <EmployerForm />
          </div>
        </Container>
      </section>
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "For Employers", path: "/employers" }])} />
    </>
  );
}
