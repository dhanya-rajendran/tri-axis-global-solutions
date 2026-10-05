import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CandidateForm } from "@/components/forms/CandidateForm";
import { JobSearch } from "@/components/jobs/JobSearch";
import { JsonLd } from "@/components/seo/JsonLd";
import { FeatureGrid } from "@/components/templates/FeatureGrid";
import { PageHero } from "@/components/templates/PageHero";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { candidateReasons, candidateServices } from "@/lib/data/company";
import { images } from "@/lib/data/images";
import { breadcrumbJsonLd } from "@/lib/seo/jsonld";
import { buildMetadata } from "@/lib/seo/metadata";
import { getJobFilterOptions } from "@/lib/services/api";

export const metadata: Metadata = buildMetadata({
  title: "For Candidates – Jobs & Career Support in the UAE",
  description: "Find jobs in the UAE, submit your CV and get career guidance from specialist recruitment consultants.",
  path: "/candidates",
});

export default async function CandidatesPage() {
  const options = await getJobFilterOptions();
  return (
    <>
      <PageHero
        eyebrow="For Candidates"
        title="Find the right opportunity for your future."
        description="Explore roles with leading UAE employers and get honest, practical support at every step."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "For Candidates" }]}
        image={images.hero}
      >
        <ButtonLink href="/jobs" variant="primary" arrow>
          Find Jobs
        </ButtonLink>
        <ButtonLink href="#submit-cv" variant="outline-light" arrow>
          Submit your CV
        </ButtonLink>
      </PageHero>

      <Container className="relative z-10 -mt-8">
        <JobSearch options={options} variant="page" title="Search jobs" className="shadow-[0_24px_48px_-32px_rgba(7,27,54,0.5)]" />
      </Container>

      <section className="py-20 lg:py-24" aria-labelledby="candidate-services">
        <Container>
          <SectionHeading eyebrow="How we help" title="Support for your next career move" id="candidate-services" className="reveal" />
          <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {candidateServices.map((s) => (
              <li key={s.id} className="reveal">
                <Link
                  href={s.href}
                  className="group flex h-full flex-col rounded-card border border-line bg-white p-7 transition-[border-color,box-shadow] hover:border-navy/30 hover:shadow-[0_20px_40px_-26px_rgba(7,27,54,0.45)]"
                >
                  <Icon name={s.icon} className="size-7 text-teal" />
                  <h3 className="mt-5 font-serif text-xl font-medium text-navy">{s.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{s.description}</p>
                  <span className="mt-6 inline-flex items-center gap-1.5 text-[13px] font-semibold text-teal-dark group-hover:text-navy">
                    {s.cta} <ArrowRight aria-hidden className="size-3.5" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <FeatureGrid eyebrow="Why work with TriAxis" title="A recruiter in your corner" items={candidateReasons} muted />

      <section id="submit-cv" className="scroll-mt-20 py-20 lg:py-28" aria-labelledby="cv-title">
        <Container className="grid gap-12 lg:grid-cols-[1fr_1.5fr] lg:gap-16">
          <SectionHeading
            eyebrow="Submit your CV"
            title="Register with TriAxis"
            id="cv-title"
            description={
              <>
                <p>Tell us about yourself and the kind of role you are looking for. We&apos;ll contact you when a suitable opportunity comes up.</p>
                <p className="mt-4 text-sm">Our recruitment services are always free for candidates.</p>
              </>
            }
          />
          <div className="rounded-card border border-line bg-white p-6 shadow-[0_24px_48px_-36px_rgba(7,27,54,0.5)] sm:p-10">
            <CandidateForm industries={options.industries} locations={options.locations} />
          </div>
        </Container>
      </section>
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "For Candidates", path: "/candidates" }])} />
    </>
  );
}
