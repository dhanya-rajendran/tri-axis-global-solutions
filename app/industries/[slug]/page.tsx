import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check } from "lucide-react";
import { IndustryCard } from "@/components/cards/IndustryCard";
import { JobCard } from "@/components/cards/JobCard";
import { JsonLd } from "@/components/seo/JsonLd";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { PageHero } from "@/components/templates/PageHero";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { breadcrumbJsonLd } from "@/lib/seo/jsonld";
import { buildMetadata } from "@/lib/seo/metadata";
import { getIndustries, getIndustryBySlug, getJobFilterOptions, getJobsByIndustry } from "@/lib/services/api";

export async function generateStaticParams() {
  return (await getIndustries()).map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: PageProps<"/industries/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const industry = await getIndustryBySlug(slug);
  if (!industry) return {};
  return buildMetadata({
    title: industry.seoTitle ?? industry.name,
    description: industry.seoDescription ?? industry.summary,
    path: `/industries/${industry.slug}`,
  });
}

export default async function IndustryDetailPage({ params }: PageProps<"/industries/[slug]">) {
  const { slug } = await params;
  const industry = await getIndustryBySlug(slug);
  if (!industry) notFound();
  const [jobs, all, options] = await Promise.all([getJobsByIndustry(industry.slug), getIndustries(), getJobFilterOptions()]);
  const typeLabel = Object.fromEntries(options.types.map((t) => [t.value, t.label]));
  const related = all.filter((i) => i.slug !== industry.slug).slice(0, 6);

  return (
    <>
      <PageHero
        eyebrow="Industry Expertise"
        title={`${industry.name} recruitment`}
        description={industry.summary}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Industries", href: "/industries" }, { label: industry.name }]}
      >
        <ButtonLink href="/employers#enquiry" variant="primary" arrow>
          Hire {industry.shortName ?? industry.name} Talent
        </ButtonLink>
        <ButtonLink href={`/jobs?industry=${industry.slug}#results`} variant="outline-light" arrow>
          View Jobs
        </ButtonLink>
      </PageHero>

      <section className="py-20 lg:py-24">
        <Container className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="reveal">
            <SectionHeading eyebrow="Overview" title={`How we support ${industry.name.toLowerCase()} employers`} />
            <p className="mt-6 text-[16px] leading-relaxed text-ink">{industry.description}</p>
          </div>
          <div className="reveal rounded-card bg-surface-muted p-8 sm:p-10">
            <h2 className="eyebrow text-teal-dark">Roles we recruit</h2>
            <ul className="mt-6 space-y-3.5">
              {industry.roles.map((r) => (
                <li key={r} className="flex items-center gap-3 border-b border-line pb-3.5 text-[15px] font-medium text-navy last:border-0 last:pb-0">
                  <Check aria-hidden className="size-4 text-gold" /> {r}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      <section className="border-t border-line py-20 lg:py-24" aria-labelledby="industry-jobs">
        <Container>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <h2 id="industry-jobs" className="font-serif text-h3 font-medium text-navy">
              Current {industry.name} opportunities
            </h2>
            <Link href={`/jobs?industry=${industry.slug}#results`} className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal-dark hover:text-navy">
              View all <ArrowRight aria-hidden className="size-4" />
            </Link>
          </div>
          {jobs.length ? (
            <ul className="mt-8 space-y-4">
              {jobs.map((job) => (
                <li key={job.id}>
                  <JobCard job={job} industryName={industry.name} typeLabel={typeLabel[job.employmentType]} />
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-8 rounded-card border border-dashed border-line p-8 text-center">
              <p className="text-ink">There are no open roles in this sector right now.</p>
              <p className="mt-1 text-sm text-muted">Register your CV and we&apos;ll contact you when a suitable role comes up.</p>
              <ButtonLink href="/candidates#submit-cv" variant="secondary" size="sm" arrow className="mt-5">
                Submit your CV
              </ButtonLink>
            </div>
          )}
        </Container>
      </section>

      <section className="bg-surface-muted py-20" aria-labelledby="other-industries">
        <Container>
          <h2 id="other-industries" className="font-serif text-h3 font-medium text-navy">
            Other industries
          </h2>
          <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {related.map((i) => (
              <li key={i.id}>
                <IndustryCard industry={i} />
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <FinalCTA />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Industries", path: "/industries" },
          { name: industry.name, path: `/industries/${industry.slug}` },
        ])}
      />
    </>
  );
}
