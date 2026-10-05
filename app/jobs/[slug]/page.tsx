import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Banknote, Briefcase, CalendarDays, Gauge, Hash, Layers, MapPin } from "lucide-react";
import { JobCard } from "@/components/cards/JobCard";
import { JobApplicationForm } from "@/components/forms/JobApplicationForm";
import { JsonLd } from "@/components/seo/JsonLd";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { breadcrumbJsonLd, jobPostingJsonLd } from "@/lib/seo/jsonld";
import { buildMetadata } from "@/lib/seo/metadata";
import { getJobBySlug, getJobFilterOptions, getJobs, getJobsByIndustry } from "@/lib/services/api";
import { formatDate, formatSalary } from "@/lib/utils";

export async function generateStaticParams() {
  return (await getJobs()).map((j) => ({ slug: j.slug }));
}

export async function generateMetadata({ params }: PageProps<"/jobs/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const job = await getJobBySlug(slug);
  if (!job) return {};
  return buildMetadata({
    title: job.seoTitle ?? `${job.title} – ${job.location}`,
    description: job.seoDescription ?? `${job.summary} Apply through TriAxis Global Solutions.`,
    path: `/jobs/${job.slug}`,
    noIndex: job.status !== "open",
  });
}

function Section({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="mt-10">
      <h2 className="font-serif text-2xl font-medium text-navy">{title}</h2>
      <ul className="mt-4 space-y-2.5">
        {items.map((item) => (
          <li key={item} className="flex gap-3 text-[15px] leading-relaxed text-ink">
            <span aria-hidden className="mt-[0.65em] size-1.5 shrink-0 rounded-full bg-gold" />
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}

export default async function JobDetailPage({ params }: PageProps<"/jobs/[slug]">) {
  const { slug } = await params;
  const job = await getJobBySlug(slug);
  if (!job) notFound();
  const [options, similar] = await Promise.all([getJobFilterOptions(), getJobsByIndustry(job.industry, 4)]);
  const industryName = options.industries.find((i) => i.value === job.industry)?.label ?? job.industry;
  const typeLabel = Object.fromEntries(options.types.map((t) => [t.value, t.label]));
  const expLabel = options.experience.find((e) => e.value === job.experienceLevel)?.label;
  const others = similar.filter((j) => j.id !== job.id).slice(0, 3);

  const facts = [
    { label: "Location", value: `${job.location}, UAE`, Icon: MapPin },
    { label: "Job type", value: typeLabel[job.employmentType], Icon: Briefcase },
    { label: "Industry", value: industryName, Icon: Layers },
    { label: "Experience", value: `${job.experienceYears}${expLabel ? ` · ${expLabel.split(" (")[0]}` : ""}`, Icon: Gauge },
    ...(job.salary ? [{ label: "Salary", value: formatSalary(job.salary), Icon: Banknote }] : []),
    { label: "Posted", value: formatDate(job.postedAt), Icon: CalendarDays },
    { label: "Reference", value: job.reference, Icon: Hash },
  ];

  return (
    <>
      <section className="bg-navy text-white">
        <Container className="py-12 lg:py-16">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Jobs", href: "/jobs" }, { label: job.title }]} />
          <p className="eyebrow mt-8 text-gold">{industryName}</p>
          <h1 className="mt-3 font-serif text-[clamp(2rem,1.5rem+2vw,3.25rem)] leading-tight font-medium text-white">{job.title}</h1>
          <p className="mt-3 text-white/75">
            {job.company} · {job.location}, UAE
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="#apply" variant="primary" arrow>
              Apply Now
            </ButtonLink>
            <ButtonLink href="/jobs" variant="outline-light">
              <ArrowLeft aria-hidden className="size-4" /> All jobs
            </ButtonLink>
          </div>
        </Container>
      </section>

      <Container className="grid gap-12 py-14 lg:grid-cols-[1fr_380px] lg:gap-16 lg:py-20">
        <article>
          <dl className="grid gap-px overflow-hidden rounded-card border border-line bg-line sm:grid-cols-2 sm:[&>*:last-child:nth-child(odd)]:col-span-2">
            {facts.map(({ label, value, Icon }) => (
              <div key={label} className="flex items-start gap-3 bg-white p-4">
                <Icon aria-hidden className="mt-0.5 size-4 text-teal" strokeWidth={1.5} />
                <div>
                  <dt className="text-xs text-muted">{label}</dt>
                  <dd className="text-sm font-semibold text-navy">{value}</dd>
                </div>
              </div>
            ))}
          </dl>

          <section className="mt-10">
            <h2 className="font-serif text-2xl font-medium text-navy">Job description</h2>
            <p className="mt-4 text-[16px] leading-relaxed font-medium text-navy">{job.summary}</p>
            {job.description.map((p) => (
              <p key={p} className="mt-3 text-[15px] leading-relaxed text-ink">
                {p}
              </p>
            ))}
          </section>
          <Section title="Responsibilities" items={job.responsibilities} />
          <Section title="Requirements" items={job.requirements} />
          <Section title="Benefits" items={job.benefits} />
          {job.closingAt && (
            <p className="mt-10 text-sm text-muted">
              Applications close on <time dateTime={job.closingAt}>{formatDate(job.closingAt)}</time>.
            </p>
          )}
        </article>

        <aside id="apply" className="scroll-mt-24 lg:sticky lg:top-24 lg:self-start" aria-labelledby="apply-title">
          <div className="rounded-card border border-line bg-white p-6 shadow-[0_24px_48px_-36px_rgba(7,27,54,0.5)] sm:p-7">
            <h2 id="apply-title" className="font-serif text-2xl font-medium text-navy">
              Apply for this role
            </h2>
            <p className="mt-1 mb-5 text-sm text-muted">Ref: {job.reference}</p>
            <JobApplicationForm jobReference={job.reference} jobTitle={job.title} />
          </div>
        </aside>
      </Container>

      {others.length > 0 && (
        <section className="border-t border-line bg-surface-muted py-16" aria-labelledby="similar-jobs">
          <Container>
            <div className="flex items-end justify-between">
              <h2 id="similar-jobs" className="font-serif text-h3 font-medium text-navy">
                Similar jobs
              </h2>
              <Link href={`/jobs?industry=${job.industry}#results`} className="text-sm font-semibold text-teal-dark hover:text-navy">
                View all
              </Link>
            </div>
            <ul className="mt-8 space-y-4">
              {others.map((j) => (
                <li key={j.id}>
                  <JobCard job={j} industryName={industryName} typeLabel={typeLabel[j.employmentType]} />
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}

      <JsonLd
        data={[
          jobPostingJsonLd(job),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Jobs", path: "/jobs" },
            { name: job.title, path: `/jobs/${job.slug}` },
          ]),
        ]}
      />
    </>
  );
}
