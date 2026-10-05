/**
 * CONTENT SERVICE LAYER
 * ---------------------------------------------------------------------------
 * The single entry point the UI uses to read content. Every function is async
 * and returns typed data, so in Phase 2 each implementation can be swapped for
 * a request to the admin API, e.g.
 *
 *   export async function getJobs(filters) {
 *     return apiGet<Job[]>(`/jobs?${new URLSearchParams(filters)}`, { tags: ["jobs"] });
 *   }
 *
 * without changing any page or component.
 */
import { siteConfig } from "@/config/site";
import { industries } from "@/lib/data/industries";
import { insightCategories, insights } from "@/lib/data/insights";
import { employmentTypes, experienceLevels, jobs, locations } from "@/lib/data/jobs";
import { services } from "@/lib/data/services";
import { statistics } from "@/lib/data/statistics";
import { testimonials } from "@/lib/data/testimonials";
import { filterJobs } from "@/lib/services/job-search";
import type { Industry } from "@/types/industry";
import type { Insight, InsightCategory } from "@/types/insight";
import type { Job, JobFilterOptions, JobFilters } from "@/types/job";
import type { Service } from "@/types/service";
import type { SiteSettings } from "@/types/site";
import type { Statistic } from "@/types/statistic";
import type { Testimonial } from "@/types/testimonial";

const byOrder = <T extends { order: number }>(a: T, b: T) => a.order - b.order;

/* ------------------------------ Site settings ----------------------------- */
export async function getSiteSettings(): Promise<SiteSettings> {
  return siteConfig;
}

/* ---------------------------------- Jobs ---------------------------------- */
export async function getJobs(filters: JobFilters = {}): Promise<Job[]> {
  return filterJobs(jobs, filters);
}

export async function getFeaturedJobs(limit = 4): Promise<Job[]> {
  return (await getJobs()).filter((j) => j.featured).slice(0, limit);
}

export async function getJobBySlug(slug: string): Promise<Job | null> {
  return jobs.find((j) => j.slug === slug && j.status !== "draft") ?? null;
}

export async function getJobsByIndustry(industrySlug: string, limit = 3): Promise<Job[]> {
  return (await getJobs({ industry: industrySlug })).slice(0, limit);
}

export async function getJobFilterOptions(): Promise<JobFilterOptions> {
  return {
    locations,
    industries: [...industries].sort(byOrder).map((i) => ({ value: i.slug, label: i.name })),
    types: employmentTypes,
    experience: experienceLevels,
  };
}

/* -------------------------------- Services -------------------------------- */
export async function getServices(): Promise<Service[]> {
  return [...services].sort(byOrder);
}

export async function getServiceBySlug(slug: string): Promise<Service | null> {
  return services.find((s) => s.slug === slug) ?? null;
}

/* ------------------------------- Industries ------------------------------- */
export async function getIndustries(): Promise<Industry[]> {
  return [...industries].sort(byOrder);
}

export async function getIndustryBySlug(slug: string): Promise<Industry | null> {
  return industries.find((i) => i.slug === slug) ?? null;
}

/* -------------------------------- Insights -------------------------------- */
export async function getInsights(opts: { category?: string; limit?: number } = {}): Promise<Insight[]> {
  const list = insights
    .filter((i) => !opts.category || i.category.slug === opts.category)
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  return opts.limit ? list.slice(0, opts.limit) : list;
}

export async function getInsightBySlug(slug: string): Promise<Insight | null> {
  return insights.find((i) => i.slug === slug) ?? null;
}

export async function getInsightCategories(): Promise<InsightCategory[]> {
  return insightCategories;
}

/* --------------------------- Statistics & social -------------------------- */
export async function getStatistics(): Promise<Statistic[]> {
  return [...statistics].sort(byOrder);
}

export async function getTestimonials(): Promise<Testimonial[]> {
  return [...testimonials].sort(byOrder);
}
