import type { Metadata } from "next";
import { SearchX } from "lucide-react";
import { JobCard } from "@/components/cards/JobCard";
import { JobSearch } from "@/components/jobs/JobSearch";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageHero } from "@/components/templates/PageHero";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { breadcrumbJsonLd } from "@/lib/seo/jsonld";
import { buildMetadata } from "@/lib/seo/metadata";
import { getJobFilterOptions, getJobs } from "@/lib/services/api";
import { firstParam } from "@/lib/utils";
import type { JobFilters } from "@/types/job";

export const metadata: Metadata = buildMetadata({
  title: "Jobs in the UAE",
  description:
    "Search current job vacancies in Dubai, Abu Dhabi and across the UAE in technology, engineering, healthcare, finance, oil & gas and more.",
  path: "/jobs",
});

export default async function JobsPage({ searchParams }: PageProps<"/jobs">) {
  const sp = await searchParams;
  const options = await getJobFilterOptions();
  const pick = (key: string, allowed: { value: string }[]) => {
    const v = firstParam(sp[key]);
    return allowed.some((o) => o.value === v) ? v : "";
  };
  const filters: JobFilters = {
    keyword: firstParam(sp.keyword).slice(0, 100),
    location: pick("location", options.locations),
    industry: pick("industry", options.industries),
    type: pick("type", options.types) as JobFilters["type"],
    experience: pick("experience", options.experience) as JobFilters["experience"],
  };
  const jobs = await getJobs(filters);
  const industryName = Object.fromEntries(options.industries.map((i) => [i.value, i.label]));
  const typeLabel = Object.fromEntries(options.types.map((t) => [t.value, t.label]));
  const active = Object.values(filters).some(Boolean);

  return (
    <>
      <PageHero
        eyebrow="Jobs"
        title="Find your next opportunity"
        description="Explore current vacancies with leading employers across the UAE."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Jobs" }]}
      />

      <Container className="relative z-10 -mt-8">
        <JobSearch
          key={JSON.stringify(filters)}
          options={options}
          initial={filters}
          variant="page"
          showExperience
          title="Search jobs"
          className="shadow-[0_24px_48px_-32px_rgba(7,27,54,0.5)]"
        />
      </Container>

      <section id="results" className="scroll-mt-24 py-14 lg:py-20" aria-labelledby="results-title">
        <Container className="grid gap-10 lg:grid-cols-[1fr_320px]">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 id="results-title" className="font-serif text-2xl font-medium text-navy" aria-live="polite">
                {jobs.length} {jobs.length === 1 ? "job" : "jobs"} {active ? "found" : "available"}
              </h2>
              {active && (
                <ButtonLink href="/jobs#results" variant="text">
                  Clear filters
                </ButtonLink>
              )}
            </div>

            {jobs.length ? (
              <ul className="mt-6 space-y-4">
                {jobs.map((job) => (
                  <li key={job.id}>
                    <JobCard job={job} industryName={industryName[job.industry]} typeLabel={typeLabel[job.employmentType]} />
                  </li>
                ))}
              </ul>
            ) : (
              <div className="mt-6 rounded-card border border-dashed border-line px-6 py-14 text-center">
                <SearchX aria-hidden className="mx-auto size-10 text-muted" strokeWidth={1.25} />
                <p className="mt-4 font-semibold text-navy">No jobs match your search</p>
                <p className="mt-1 text-sm text-muted">Try fewer filters, or register your CV so we can contact you about new roles.</p>
                <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                  <ButtonLink href="/jobs#results" variant="outline" size="sm">
                    View all jobs
                  </ButtonLink>
                  <ButtonLink href="/candidates#submit-cv" variant="secondary" size="sm" arrow>
                    Submit your CV
                  </ButtonLink>
                </div>
              </div>
            )}
          </div>

          <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start" aria-label="Candidate support">
            <div className="rounded-card bg-navy p-7 text-white">
              <p className="eyebrow text-gold">Submit your CV</p>
              <p className="mt-3 font-serif text-2xl leading-snug">Can&apos;t find the right role?</p>
              <p className="mt-3 text-sm text-white/75">Many of our vacancies are filled before they are advertised. Register your CV and we&apos;ll be in touch.</p>
              <ButtonLink href="/candidates#submit-cv" variant="primary" size="sm" arrow className="mt-6">
                Submit CV
              </ButtonLink>
            </div>
            <div className="rounded-card border border-line p-7">
              <p className="eyebrow text-teal-dark">Hiring?</p>
              <p className="mt-3 font-serif text-xl text-navy">Find the right talent for your team.</p>
              <ButtonLink href="/employers#enquiry" variant="text" arrow className="mt-4">
                Hire Talent
              </ButtonLink>
            </div>
          </aside>
        </Container>
      </section>
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Jobs", path: "/jobs" }])} />
    </>
  );
}
