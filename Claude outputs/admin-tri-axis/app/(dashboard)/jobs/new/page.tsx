import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/PageHeader";
import { requireUser } from "@/lib/auth/dal";
import { JobForm } from "../JobForm";
import { getJobOptions } from "../options";

export const metadata: Metadata = { title: "New job" };

export default async function NewJobPage() {
  await requireUser();
  const options = await getJobOptions();
  const today = new Date().toISOString().slice(0, 10);
  return (
    <>
      <PageHeader title="New job" back={{ href: "/jobs", label: "Jobs" }} />
      <JobForm
        id={null}
        {...options}
        defaults={{
          title: "", slug: "", reference: "", company: "", confidential: true, locationId: "none", industryId: "none", country: "AE",
          employmentType: "full-time", experienceLevel: "mid", experienceYears: "", salaryMin: "", salaryMax: "", salaryCurrency: "AED",
          salaryPeriod: "month", summary: "", description: [{ value: "" }], responsibilities: [{ value: "" }], requirements: [{ value: "" }],
          benefits: [], postedAt: today, closingAt: "", featured: false, status: "draft", seoTitle: "", seoDescription: "",
        }}
      />
    </>
  );
}
