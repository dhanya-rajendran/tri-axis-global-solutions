import "server-only";
/**
 * Map DB rows to the exact shapes the public website expects (website repo `types/`).
 */
import type { InferSelectModel } from "drizzle-orm";
import type * as s from "@/db/schema";

const image = (src: string | null, alt: string | null, fallbackAlt: string) =>
  src ? { src, alt: alt ?? fallbackAlt, width: 1200, height: 800 } : { src: "/images/og-default.jpg", alt: fallbackAlt, width: 1200, height: 630, placeholder: true };

const seo = (r: { seoTitle: string | null; seoDescription: string | null }) => ({
  ...(r.seoTitle ? { seoTitle: r.seoTitle } : {}),
  ...(r.seoDescription ? { seoDescription: r.seoDescription } : {}),
});

export function mapSettings(r: InferSelectModel<typeof s.siteSettings>, websiteUrl: string) {
  return {
    name: r.name,
    legalName: r.legalName,
    shortName: r.shortName,
    tagline: r.tagline,
    description: r.description,
    url: websiteUrl,
    locale: "en_AE",
    foundingYear: null,
    contact: {
      email: r.email,
      careersEmail: r.careersEmail,
      phone: r.phone,
      phoneHref: r.phoneHref,
      whatsapp: r.whatsapp,
      address: { line1: r.addressLine1, ...(r.addressLine2 ? { line2: r.addressLine2 } : {}), city: r.city, emirate: r.emirate, country: r.country, countryCode: r.countryCode },
      workingHours: r.workingHours,
      mapEmbedUrl: r.mapEmbedUrl,
    },
    social: r.social,
    defaultOgImage: r.defaultOgImage ?? "/images/og-default.jpg",
    mission: r.mission,
    vision: r.vision,
  };
}

export function mapService(r: InferSelectModel<typeof s.services>) {
  return {
    id: String(r.id),
    slug: r.slug,
    title: r.title,
    shortTitle: r.shortTitle,
    summary: r.summary,
    intro: r.intro,
    icon: r.icon,
    image: image(r.imageUrl, r.imageAlt, r.title),
    ctaLabel: r.ctaLabel,
    offerings: r.offerings,
    body: r.body,
    order: r.sortOrder,
    category: r.category,
    ...seo(r),
  };
}

export function mapIndustry(r: InferSelectModel<typeof s.industries>) {
  return {
    id: String(r.id),
    slug: r.slug,
    name: r.name,
    ...(r.shortName ? { shortName: r.shortName } : {}),
    icon: r.icon,
    summary: r.summary,
    description: r.description,
    roles: r.roles,
    order: r.sortOrder,
    ...seo(r),
  };
}

export type JobRow = InferSelectModel<typeof s.jobs> & { locationSlug: string | null; locationLabel: string | null; industrySlug: string | null };

export function mapJob(r: JobRow) {
  return {
    id: String(r.id),
    slug: r.slug,
    title: r.title,
    company: r.company,
    confidential: r.confidential,
    location: r.locationLabel ?? "UAE",
    locationSlug: r.locationSlug ?? "",
    country: r.country,
    employmentType: r.employmentType,
    experienceLevel: r.experienceLevel,
    experienceYears: r.experienceYears,
    industry: r.industrySlug ?? "",
    ...(r.salaryMin && r.salaryMax ? { salary: { min: r.salaryMin, max: r.salaryMax, currency: r.salaryCurrency ?? "AED", period: r.salaryPeriod ?? "month" } } : {}),
    summary: r.summary,
    description: r.description,
    responsibilities: r.responsibilities,
    requirements: r.requirements,
    benefits: r.benefits,
    postedAt: r.postedAt,
    ...(r.closingAt ? { closingAt: r.closingAt } : {}),
    featured: r.featured,
    status: r.status,
    reference: r.reference,
    ...seo(r),
  };
}

export type InsightRow = InferSelectModel<typeof s.insights> & { categorySlug: string | null; categoryName: string | null };

export function mapInsight(r: InsightRow) {
  return {
    id: String(r.id),
    slug: r.slug,
    title: r.title,
    excerpt: r.excerpt,
    image: image(r.imageUrl, r.imageAlt, r.title),
    category: { slug: r.categorySlug ?? "general", name: r.categoryName ?? "Insights" },
    author: { name: r.authorName, role: r.authorRole ?? "" },
    publishedAt: r.publishedAt,
    updatedAt: r.updatedAt.toISOString().slice(0, 10),
    readingMinutes: r.readingMinutes,
    content: r.content,
    featured: r.featured,
    ...(r.downloadLabel ? { download: { label: r.downloadLabel, href: r.downloadUrl } } : {}),
    ...seo(r),
  };
}
