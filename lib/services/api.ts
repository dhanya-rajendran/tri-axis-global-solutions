/**
 * CONTENT SERVICE LAYER
 * ---------------------------------------------------------------------------
 * The single entry point the UI uses to read content.
 *
 * When ADMIN_API_URL is set, content is fetched from the TriAxis admin API
 * (separate repository) and cached with the "content" tag — the admin calls
 * /api/revalidate after every change. If the variable is missing, or the API
 * is unreachable, the bundled local data in lib/data is used as a fallback so
 * the site never renders empty.
 */
import { siteConfig } from "@/config/site";
import {
  candidateReasons,
  candidateServices,
  companyValues,
  employerBenefits,
  employerSolutions,
  mission as localMission,
  processSteps as localProcessSteps,
  teamMembers as localTeam,
  valuePropositions,
} from "@/lib/data/company";
import { industries } from "@/lib/data/industries";
import { insightCategories, insights } from "@/lib/data/insights";
import { employmentTypes, experienceLevels, jobs, locations } from "@/lib/data/jobs";
import { legalDocuments } from "@/lib/data/legal";
import { services } from "@/lib/data/services";
import { statistics } from "@/lib/data/statistics";
import { testimonials } from "@/lib/data/testimonials";
import { filterJobs } from "@/lib/services/job-search";
import type { Feature, LegalDocument, ProcessStep, TeamMember } from "@/types/content";
import type { Industry } from "@/types/industry";
import type { Insight, InsightCategory } from "@/types/insight";
import type { Job, JobFilterOptions, JobFilters } from "@/types/job";
import type { Service } from "@/types/service";
import type { SiteSettings } from "@/types/site";
import type { Statistic } from "@/types/statistic";
import type { Testimonial } from "@/types/testimonial";

export const CONTENT_TAG = "content";
const API = process.env.ADMIN_API_URL?.replace(/\/$/, "");
const REVALIDATE_SECONDS = Number(process.env.CONTENT_REVALIDATE_SECONDS ?? 300);

/**
 * GET a JSON resource from the admin API. Returns `undefined` when the API is
 * not configured or the request fails (callers then use local data), and
 * `null` for a 404 (the record does not exist).
 */
async function apiGet<T>(path: string): Promise<T | null | undefined> {
  if (!API) return undefined;
  try {
    const res = await fetch(`${API}${path}`, {
      headers: process.env.ADMIN_API_KEY ? { "x-api-key": process.env.ADMIN_API_KEY } : undefined,
      next: { revalidate: REVALIDATE_SECONDS, tags: [CONTENT_TAG] },
    });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    return (await res.json()) as T;
  } catch (err) {
    console.error(`[content] ${path} failed — using local fallback:`, (err as Error).message);
    return undefined;
  }
}

const qs = (params: Record<string, string | number | undefined>) => {
  const q = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) if (v !== undefined && v !== "") q.set(k, String(v));
  const s = q.toString();
  return s ? `?${s}` : "";
};

const byOrder = <T extends { order: number }>(a: T, b: T) => a.order - b.order;

/* ------------------------------ Site settings ----------------------------- */
type RemoteSettings = SiteSettings & { mission?: string | null; vision?: string | null };

export async function getSiteSettings(): Promise<SiteSettings> {
  const remote = await apiGet<RemoteSettings>("/settings");
  if (!remote) return siteConfig;
  // Canonical URL and locale stay controlled by this deployment.
  return { ...siteConfig, ...remote, url: siteConfig.url, locale: siteConfig.locale };
}

export async function getMission(): Promise<{ mission: string; vision: string }> {
  const remote = await apiGet<RemoteSettings>("/settings");
  return {
    mission: remote?.mission || localMission.mission,
    vision: remote?.vision || localMission.vision,
  };
}

/* ---------------------------------- Jobs ---------------------------------- */
export async function getJobs(filters: JobFilters = {}): Promise<Job[]> {
  const remote = await apiGet<Job[]>(`/jobs${qs({ ...filters })}`);
  return remote ?? filterJobs(jobs, filters);
}

export async function getFeaturedJobs(limit = 4): Promise<Job[]> {
  return (await getJobs()).filter((j) => j.featured).slice(0, limit);
}

export async function getJobBySlug(slug: string): Promise<Job | null> {
  const remote = await apiGet<Job>(`/jobs/${encodeURIComponent(slug)}`);
  if (remote !== undefined) return remote;
  return jobs.find((j) => j.slug === slug && j.status !== "draft") ?? null;
}

export async function getJobsByIndustry(industrySlug: string, limit = 3): Promise<Job[]> {
  return (await getJobs({ industry: industrySlug })).slice(0, limit);
}

export async function getJobFilterOptions(): Promise<JobFilterOptions> {
  const remote = await apiGet<JobFilterOptions>("/job-filters");
  return (
    remote ?? {
      locations,
      industries: [...industries].sort(byOrder).map((i) => ({ value: i.slug, label: i.name })),
      types: employmentTypes,
      experience: experienceLevels,
    }
  );
}

/* -------------------------------- Services -------------------------------- */
export async function getServices(): Promise<Service[]> {
  return (await apiGet<Service[]>("/services")) ?? [...services].sort(byOrder);
}

export async function getServiceBySlug(slug: string): Promise<Service | null> {
  const remote = await apiGet<Service>(`/services/${encodeURIComponent(slug)}`);
  if (remote !== undefined) return remote;
  return services.find((s) => s.slug === slug) ?? null;
}

/* ------------------------------- Industries ------------------------------- */
export async function getIndustries(): Promise<Industry[]> {
  return (await apiGet<Industry[]>("/industries")) ?? [...industries].sort(byOrder);
}

export async function getIndustryBySlug(slug: string): Promise<Industry | null> {
  const remote = await apiGet<Industry>(`/industries/${encodeURIComponent(slug)}`);
  if (remote !== undefined) return remote;
  return industries.find((i) => i.slug === slug) ?? null;
}

/* -------------------------------- Insights -------------------------------- */
export async function getInsights(opts: { category?: string; limit?: number } = {}): Promise<Insight[]> {
  const remote = await apiGet<Insight[]>(`/insights${qs({ category: opts.category, limit: opts.limit })}`);
  if (remote) return remote;
  const list = insights
    .filter((i) => !opts.category || i.category.slug === opts.category)
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  return opts.limit ? list.slice(0, opts.limit) : list;
}

export async function getInsightBySlug(slug: string): Promise<Insight | null> {
  const remote = await apiGet<Insight>(`/insights/${encodeURIComponent(slug)}`);
  if (remote !== undefined) return remote;
  return insights.find((i) => i.slug === slug) ?? null;
}

export async function getInsightCategories(): Promise<InsightCategory[]> {
  return (await apiGet<InsightCategory[]>("/insight-categories")) ?? insightCategories;
}

/* --------------------------- Statistics & social -------------------------- */
export async function getStatistics(): Promise<Statistic[]> {
  return (await apiGet<Statistic[]>("/statistics")) ?? [...statistics].sort(byOrder);
}

export async function getTestimonials(): Promise<Testimonial[]> {
  return (await apiGet<Testimonial[]>("/testimonials")) ?? [...testimonials].sort(byOrder);
}

/* ------------------------- Company content lists -------------------------- */
export type FeatureGroup =
  | "why_triaxis"
  | "company_values"
  | "employer_benefits"
  | "employer_solutions"
  | "candidate_services"
  | "candidate_reasons";

export type LinkedFeature = Feature & { href?: string; cta?: string };

const localFeatures: Record<FeatureGroup, LinkedFeature[]> = {
  why_triaxis: valuePropositions,
  company_values: companyValues,
  employer_benefits: employerBenefits,
  employer_solutions: employerSolutions,
  candidate_services: candidateServices,
  candidate_reasons: candidateReasons,
};

export async function getFeatures(group: FeatureGroup): Promise<LinkedFeature[]> {
  return (await apiGet<LinkedFeature[]>(`/features?group=${group}`)) ?? localFeatures[group];
}

export async function getProcessSteps(): Promise<ProcessStep[]> {
  return (await apiGet<ProcessStep[]>("/process-steps")) ?? localProcessSteps;
}

export async function getTeamMembers(): Promise<TeamMember[]> {
  return (await apiGet<TeamMember[]>("/team")) ?? localTeam;
}

/* -------------------------------- Legal ----------------------------------- */
const legalBySlug: Record<string, LegalDocument> = Object.fromEntries(Object.values(legalDocuments).map((d) => [d.slug, d]));

export async function getLegalPage(slug: string): Promise<(LegalDocument & { isDraft?: boolean }) | null> {
  const remote = await apiGet<LegalDocument & { isDraft: boolean }>(`/legal/${encodeURIComponent(slug)}`);
  if (remote !== undefined) return remote;
  return legalBySlug[slug] ? { ...legalBySlug[slug], isDraft: true } : null;
}
