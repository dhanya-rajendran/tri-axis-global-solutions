import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { getIndustries, getInsights, getJobs, getServices } from "@/lib/services/api";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url;
  const [services, industries, jobs, insights] = await Promise.all([getServices(), getIndustries(), getJobs(), getInsights()]);

  const staticRoutes: { path: string; priority: number; freq: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
    { path: "", priority: 1, freq: "weekly" },
    { path: "/about", priority: 0.7, freq: "monthly" },
    { path: "/services", priority: 0.9, freq: "monthly" },
    { path: "/industries", priority: 0.8, freq: "monthly" },
    { path: "/jobs", priority: 0.9, freq: "daily" },
    { path: "/employers", priority: 0.9, freq: "monthly" },
    { path: "/candidates", priority: 0.8, freq: "monthly" },
    { path: "/insights", priority: 0.7, freq: "weekly" },
    { path: "/contact", priority: 0.7, freq: "yearly" },
    { path: "/privacy-policy", priority: 0.2, freq: "yearly" },
    { path: "/terms", priority: 0.2, freq: "yearly" },
    { path: "/cookie-policy", priority: 0.2, freq: "yearly" },
  ];

  return [
    ...staticRoutes.map((r) => ({ url: `${base}${r.path}`, changeFrequency: r.freq, priority: r.priority })),
    ...services.map((s) => ({ url: `${base}/services/${s.slug}`, changeFrequency: "monthly" as const, priority: 0.8 })),
    ...industries.map((i) => ({ url: `${base}/industries/${i.slug}`, changeFrequency: "monthly" as const, priority: 0.6 })),
    ...jobs.map((j) => ({ url: `${base}/jobs/${j.slug}`, lastModified: j.postedAt, changeFrequency: "weekly" as const, priority: 0.7 })),
    ...insights.map((a) => ({ url: `${base}/insights/${a.slug}`, lastModified: a.updatedAt ?? a.publishedAt, changeFrequency: "monthly" as const, priority: 0.6 })),
  ];
}
