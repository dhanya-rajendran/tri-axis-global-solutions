import { siteConfig } from "@/config/site";
import type { Insight } from "@/types/insight";
import type { Job } from "@/types/job";
import { absoluteUrl } from "./metadata";

/* Structured data builders (schema.org). All values come from typed data. */

const sameAs = siteConfig.social.map((s) => s.href);
const isPlaceholder = (v: string) => v.startsWith("[");

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": absoluteUrl("/#organization"),
    name: siteConfig.name,
    legalName: siteConfig.legalName,
    url: siteConfig.url,
    logo: absoluteUrl("/images/logo-tag.png"),
    slogan: siteConfig.tagline,
    description: siteConfig.description,
    email: siteConfig.contact.email,
    sameAs,
    areaServed: { "@type": "Country", name: "United Arab Emirates" },
  };
}

export function localBusinessJsonLd() {
  const { address, phone, email } = siteConfig.contact;
  return {
    "@context": "https://schema.org",
    "@type": "EmploymentAgency",
    "@id": absoluteUrl("/#localbusiness"),
    name: siteConfig.name,
    url: siteConfig.url,
    image: absoluteUrl(siteConfig.defaultOgImage),
    email,
    ...(isPlaceholder(phone) ? {} : { telephone: phone }),
    address: {
      "@type": "PostalAddress",
      ...(isPlaceholder(address.line1) ? {} : { streetAddress: address.line1 }),
      ...(isPlaceholder(address.city) ? {} : { addressLocality: address.city }),
      ...(isPlaceholder(address.emirate) ? {} : { addressRegion: address.emirate }),
      addressCountry: address.countryCode,
    },
    // Keep in sync with siteConfig.contact.workingHours
    openingHours: "Mo-Fr 09:00-18:00",
    parentOrganization: { "@id": absoluteUrl("/#organization") },
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

const employmentTypeMap: Record<Job["employmentType"], string> = {
  "full-time": "FULL_TIME",
  "part-time": "PART_TIME",
  contract: "CONTRACTOR",
  temporary: "TEMPORARY",
};

export function jobPostingJsonLd(job: Job) {
  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: [job.summary, ...job.description, "Responsibilities:", ...job.responsibilities, "Requirements:", ...job.requirements]
      .map((p) => `<p>${p}</p>`)
      .join(""),
    identifier: { "@type": "PropertyValue", name: siteConfig.name, value: job.reference },
    datePosted: job.postedAt,
    ...(job.closingAt ? { validThrough: `${job.closingAt}T23:59:59+04:00` } : {}),
    employmentType: employmentTypeMap[job.employmentType],
    hiringOrganization: job.confidential
      ? { "@type": "Organization", name: siteConfig.name, sameAs: siteConfig.url }
      : { "@type": "Organization", name: job.company },
    jobLocation: {
      "@type": "Place",
      address: { "@type": "PostalAddress", addressLocality: job.location, addressCountry: job.country },
    },
    ...(job.salary
      ? {
          baseSalary: {
            "@type": "MonetaryAmount",
            currency: job.salary.currency,
            value: { "@type": "QuantitativeValue", minValue: job.salary.min, maxValue: job.salary.max, unitText: job.salary.period.toUpperCase() },
          },
        }
      : {}),
    url: absoluteUrl(`/jobs/${job.slug}`),
  };
}

export function articleJsonLd(article: Insight) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.seoDescription ?? article.excerpt,
    image: [absoluteUrl(article.image.src)],
    datePublished: article.publishedAt,
    dateModified: article.updatedAt ?? article.publishedAt,
    author: { "@type": "Organization", name: article.author.name },
    publisher: { "@id": absoluteUrl("/#organization") },
    mainEntityOfPage: absoluteUrl(`/insights/${article.slug}`),
    articleSection: article.category.name,
  };
}
