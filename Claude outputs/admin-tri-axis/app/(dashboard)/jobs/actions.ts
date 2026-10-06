"use server";

import { eq } from "drizzle-orm";
import { db } from "@/db";
import { jobs } from "@/db/schema";
import { type ActionResult, dbError, fail, nullIfEmpty, revalidateContent, toId, zodFieldErrors } from "@/lib/actions";
import { requireUser } from "@/lib/auth/dal";
import { jobSchema } from "@/lib/validators";

export async function saveJob(id: number | null, input: unknown): Promise<ActionResult<{ id: number }>> {
  await requireUser();
  const parsed = jobSchema.safeParse(input);
  if (!parsed.success) return fail("Please fix the highlighted fields.", zodFieldErrors(parsed.error));
  const v = parsed.data;
  const row = {
    title: v.title,
    slug: v.slug,
    reference: v.reference.toUpperCase(),
    company: v.company,
    confidential: v.confidential,
    locationId: toId(v.locationId),
    industryId: toId(v.industryId),
    country: v.country.toUpperCase(),
    employmentType: v.employmentType,
    experienceLevel: v.experienceLevel,
    experienceYears: v.experienceYears,
    salaryMin: v.salaryMin ? Number(v.salaryMin) : null,
    salaryMax: v.salaryMax ? Number(v.salaryMax) : null,
    salaryCurrency: v.salaryCurrency,
    salaryPeriod: v.salaryPeriod,
    summary: v.summary,
    description: v.description,
    responsibilities: v.responsibilities,
    requirements: v.requirements,
    benefits: v.benefits,
    postedAt: v.postedAt,
    closingAt: v.closingAt || null,
    featured: v.featured,
    status: v.status,
    seoTitle: nullIfEmpty(v.seoTitle),
    seoDescription: nullIfEmpty(v.seoDescription),
  };
  try {
    let savedId = id;
    if (id) await db.update(jobs).set(row).where(eq(jobs.id, id));
    else {
      const [res] = await db.insert(jobs).values(row).$returningId();
      savedId = res.id;
    }
    revalidateContent("/jobs", "/");
    return { ok: true, message: id ? "Job updated" : "Job created", data: { id: savedId! } };
  } catch (err) {
    return dbError(err, { slug: "slug", reference: "reference" });
  }
}

export async function deleteJob(id: number): Promise<ActionResult> {
  await requireUser();
  try {
    await db.delete(jobs).where(eq(jobs.id, id));
    revalidateContent("/jobs", "/");
    return { ok: true, message: "Job deleted" };
  } catch (err) {
    return dbError(err);
  }
}

export async function setJobStatus(id: number, status: "open" | "closed" | "draft"): Promise<ActionResult> {
  await requireUser();
  await db.update(jobs).set({ status }).where(eq(jobs.id, id));
  revalidateContent("/jobs", "/");
  return { ok: true, message: `Job marked ${status}` };
}
