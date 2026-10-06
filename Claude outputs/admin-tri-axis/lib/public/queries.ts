import "server-only";
import { and, asc, desc, eq, like, or, type SQL } from "drizzle-orm";
import { db } from "@/db";
import { industries, insightCategories, insights, jobs, locations } from "@/db/schema";
import { employmentTypes, experienceLevels } from "@/lib/constants";

export const jobSelect = {
  job: jobs,
  locationSlug: locations.slug,
  locationLabel: locations.label,
  industrySlug: industries.slug,
};

export function jobsQuery() {
  return db.select(jobSelect).from(jobs).leftJoin(locations, eq(jobs.locationId, locations.id)).leftJoin(industries, eq(jobs.industryId, industries.id));
}

export const flattenJob = (r: { job: typeof jobs.$inferSelect; locationSlug: string | null; locationLabel: string | null; industrySlug: string | null }) => ({
  ...r.job,
  locationSlug: r.locationSlug,
  locationLabel: r.locationLabel,
  industrySlug: r.industrySlug,
});

export function jobFilterConditions(sp: URLSearchParams): SQL[] {
  const conds: SQL[] = [eq(jobs.status, "open")];
  const keyword = sp.get("keyword")?.trim().slice(0, 100);
  if (keyword) {
    for (const term of keyword.split(/\s+/).slice(0, 5)) {
      const t = `%${term}%`;
      conds.push(or(like(jobs.title, t), like(jobs.company, t), like(jobs.summary, t), like(jobs.reference, t), like(industries.name, t), like(locations.label, t))!);
    }
  }
  const location = sp.get("location");
  if (location) conds.push(eq(locations.slug, location));
  const industry = sp.get("industry");
  if (industry) conds.push(eq(industries.slug, industry));
  const type = sp.get("type");
  if (type && (employmentTypes as readonly string[]).includes(type)) conds.push(eq(jobs.employmentType, type as (typeof employmentTypes)[number]));
  const exp = sp.get("experience");
  if (exp && (experienceLevels as readonly string[]).includes(exp)) conds.push(eq(jobs.experienceLevel, exp as (typeof experienceLevels)[number]));
  return conds;
}

export async function findJobs(sp: URLSearchParams) {
  const limit = Math.min(Number(sp.get("limit")) || 200, 500);
  const rows = await jobsQuery()
    .where(and(...jobFilterConditions(sp)))
    .orderBy(desc(jobs.featured), desc(jobs.postedAt), desc(jobs.id))
    .limit(limit);
  return rows.map(flattenJob);
}

export const insightSelect = { insight: insights, categorySlug: insightCategories.slug, categoryName: insightCategories.name };

export function insightsQuery() {
  return db.select(insightSelect).from(insights).leftJoin(insightCategories, eq(insights.categoryId, insightCategories.id));
}

export const flattenInsight = (r: { insight: typeof insights.$inferSelect; categorySlug: string | null; categoryName: string | null }) => ({
  ...r.insight,
  categorySlug: r.categorySlug,
  categoryName: r.categoryName,
});

export { asc, desc, eq, and };
