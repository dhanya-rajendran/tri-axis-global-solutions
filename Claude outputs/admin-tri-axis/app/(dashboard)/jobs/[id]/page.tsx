import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { DeleteButton } from "@/components/shared/DeleteButton";
import { PageHeader } from "@/components/shared/PageHeader";
import { JobStatusBadge } from "@/components/shared/StatusBadge";
import { db } from "@/db";
import { jobs } from "@/db/schema";
import { requireUser } from "@/lib/auth/dal";
import { toListField } from "@/lib/validators";
import { deleteJob } from "../actions";
import { JobForm } from "../JobForm";
import { getJobOptions } from "../options";

export const metadata: Metadata = { title: "Edit job" };

export default async function EditJobPage({ params }: PageProps<"/jobs/[id]">) {
  await requireUser();
  const id = Number((await params).id);
  if (!Number.isInteger(id)) notFound();
  const [job] = await db.select().from(jobs).where(eq(jobs.id, id)).limit(1);
  if (!job) notFound();
  const options = await getJobOptions();
  const website = process.env.WEBSITE_URL;

  return (
    <>
      <PageHeader
        title={job.title}
        description={
          <span className="inline-flex items-center gap-2">
            <JobStatusBadge status={job.status} /> {job.reference}
            {website && job.status === "open" && (
              <a className="underline" href={`${website}/jobs/${job.slug}`} target="_blank" rel="noreferrer">
                View on website ↗
              </a>
            )}
          </span>
        }
        back={{ href: "/jobs", label: "Jobs" }}
        actions={<DeleteButton action={deleteJob.bind(null, job.id)} itemLabel={`“${job.title}”`} redirectTo="/jobs" variant="button" />}
      />
      <JobForm
        id={job.id}
        {...options}
        defaults={{
          title: job.title, slug: job.slug, reference: job.reference, company: job.company, confidential: job.confidential,
          locationId: job.locationId ? String(job.locationId) : "none", industryId: job.industryId ? String(job.industryId) : "none",
          country: job.country, employmentType: job.employmentType, experienceLevel: job.experienceLevel, experienceYears: job.experienceYears,
          salaryMin: job.salaryMin?.toString() ?? "", salaryMax: job.salaryMax?.toString() ?? "", salaryCurrency: job.salaryCurrency ?? "AED",
          salaryPeriod: job.salaryPeriod ?? "month", summary: job.summary, description: toListField(job.description),
          responsibilities: toListField(job.responsibilities), requirements: toListField(job.requirements), benefits: toListField(job.benefits),
          postedAt: job.postedAt, closingAt: job.closingAt ?? "", featured: job.featured, status: job.status,
          seoTitle: job.seoTitle ?? "", seoDescription: job.seoDescription ?? "",
        }}
      />
    </>
  );
}
