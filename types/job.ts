import type { SeoFields } from "./common";

export type EmploymentType = "full-time" | "part-time" | "contract" | "temporary";
export type ExperienceLevel = "entry" | "mid" | "senior" | "executive";

export interface SalaryRange {
  min: number;
  max: number;
  currency: "AED" | "USD";
  period: "month" | "year";
}

export interface Job extends SeoFields {
  id: string;
  slug: string;
  title: string;
  /** Hiring company name, or a confidential descriptor. */
  company: string;
  confidential: boolean;
  location: string;
  /** Slug from lib/data/locations (city / emirate). */
  locationSlug: string;
  country: string;
  employmentType: EmploymentType;
  experienceLevel: ExperienceLevel;
  experienceYears: string;
  /** Industry slug — joins to Industry.slug. */
  industry: string;
  salary?: SalaryRange;
  summary: string;
  description: string[];
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
  postedAt: string; // ISO date
  closingAt?: string; // ISO date
  featured: boolean;
  status: "open" | "closed" | "draft";
  reference: string;
}

/** Search parameters accepted by getJobs(). Mirrors the query string on /jobs. */
export interface JobFilters {
  keyword?: string;
  location?: string;
  industry?: string;
  type?: EmploymentType | "";
  experience?: ExperienceLevel | "";
}

export interface Option {
  value: string;
  label: string;
}

export interface JobFilterOptions {
  locations: Option[];
  industries: Option[];
  types: Option[];
  experience: Option[];
}
