/**
 * TriAxis database schema (MySQL 5.7+ / MariaDB 10.3+).
 * Mirrors the public website's content model (see the website repo `types/`).
 */
import {
  boolean,
  date,
  index,
  int,
  json,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";
import { employmentTypes, enquiryStatuses, enquiryTypes, experienceLevels, featureGroups, jobStatuses } from "@/lib/constants";

export { employmentTypes, enquiryStatuses, enquiryTypes, experienceLevels, featureGroups, jobStatuses };

/* ------------------------------- Shared types ------------------------------ */
export type ContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "list"; items: string[] }
  | { type: "quote"; text: string; cite?: string };

export type Offering = { title: string; description: string; icon: string };
export type WorkingHours = { days: string; hours: string }[];
export type SocialLink = { platform: "linkedin" | "instagram" | "facebook" | "x" | "youtube"; label: string; href: string };
export type LegalSection = { heading: string; paragraphs: string[] };

const id = () => int("id").autoincrement().primaryKey();
const timestamps = {
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
};
const seo = {
  seoTitle: varchar("seo_title", { length: 255 }),
  seoDescription: varchar("seo_description", { length: 320 }),
};
const sortOrder = () => int("sort_order").notNull().default(0);

/* --------------------------------- Admins ---------------------------------- */
export const adminUsers = mysqlTable("admin_users", {
  id: id(),
  name: varchar("name", { length: 120 }).notNull(),
  email: varchar("email", { length: 190 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 100 }).notNull(),
  role: mysqlEnum("role", ["admin", "editor"]).notNull().default("editor"),
  isActive: boolean("is_active").notNull().default(true),
  lastLoginAt: timestamp("last_login_at"),
  ...timestamps,
});

/* ------------------------------ Site settings ------------------------------ */
/** Single row (id = 1). */
export const siteSettings = mysqlTable("site_settings", {
  id: id(),
  name: varchar("name", { length: 160 }).notNull(),
  legalName: varchar("legal_name", { length: 160 }).notNull(),
  shortName: varchar("short_name", { length: 60 }).notNull(),
  tagline: varchar("tagline", { length: 255 }).notNull(),
  description: text("description").notNull(),
  email: varchar("email", { length: 190 }).notNull(),
  careersEmail: varchar("careers_email", { length: 190 }).notNull(),
  phone: varchar("phone", { length: 60 }).notNull(),
  phoneHref: varchar("phone_href", { length: 80 }),
  whatsapp: varchar("whatsapp", { length: 60 }),
  addressLine1: varchar("address_line1", { length: 190 }).notNull(),
  addressLine2: varchar("address_line2", { length: 190 }),
  city: varchar("city", { length: 120 }).notNull(),
  emirate: varchar("emirate", { length: 120 }).notNull(),
  country: varchar("country", { length: 120 }).notNull(),
  countryCode: varchar("country_code", { length: 2 }).notNull(),
  workingHours: json("working_hours").$type<WorkingHours>().notNull(),
  mapEmbedUrl: varchar("map_embed_url", { length: 1000 }),
  social: json("social").$type<SocialLink[]>().notNull(),
  defaultOgImage: varchar("default_og_image", { length: 500 }),
  mission: text("mission"),
  vision: text("vision"),
  updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
});

/* -------------------------------- Services --------------------------------- */
export const services = mysqlTable("services", {
  id: id(),
  slug: varchar("slug", { length: 190 }).notNull().unique(),
  title: varchar("title", { length: 190 }).notNull(),
  shortTitle: varchar("short_title", { length: 80 }).notNull(),
  summary: varchar("summary", { length: 500 }).notNull(),
  intro: text("intro").notNull(),
  icon: varchar("icon", { length: 60 }).notNull(),
  imageUrl: varchar("image_url", { length: 500 }),
  imageAlt: varchar("image_alt", { length: 255 }),
  ctaLabel: varchar("cta_label", { length: 80 }).notNull(),
  category: mysqlEnum("category", ["recruitment", "business"]).notNull(),
  offerings: json("offerings").$type<Offering[]>().notNull(),
  body: json("body").$type<ContentBlock[]>().notNull(),
  ...seo,
  sortOrder: sortOrder(),
  isPublished: boolean("is_published").notNull().default(true),
  ...timestamps,
});

/* ------------------------------- Industries -------------------------------- */
export const industries = mysqlTable("industries", {
  id: id(),
  slug: varchar("slug", { length: 190 }).notNull().unique(),
  name: varchar("name", { length: 160 }).notNull(),
  shortName: varchar("short_name", { length: 80 }),
  icon: varchar("icon", { length: 60 }).notNull(),
  summary: varchar("summary", { length: 500 }).notNull(),
  description: text("description").notNull(),
  roles: json("roles").$type<string[]>().notNull(),
  ...seo,
  sortOrder: sortOrder(),
  isPublished: boolean("is_published").notNull().default(true),
  ...timestamps,
});

/* -------------------------------- Locations -------------------------------- */
export const locations = mysqlTable("locations", {
  id: id(),
  slug: varchar("slug", { length: 120 }).notNull().unique(),
  label: varchar("label", { length: 120 }).notNull(),
  sortOrder: sortOrder(),
  ...timestamps,
});

/* ----------------------------------- Jobs ---------------------------------- */

export const jobs = mysqlTable(
  "jobs",
  {
    id: id(),
    slug: varchar("slug", { length: 190 }).notNull().unique(),
    reference: varchar("reference", { length: 40 }).notNull().unique(),
    title: varchar("title", { length: 190 }).notNull(),
    company: varchar("company", { length: 190 }).notNull(),
    confidential: boolean("confidential").notNull().default(true),
    locationId: int("location_id").references(() => locations.id, { onDelete: "set null" }),
    country: varchar("country", { length: 2 }).notNull().default("AE"),
    employmentType: mysqlEnum("employment_type", employmentTypes).notNull(),
    experienceLevel: mysqlEnum("experience_level", experienceLevels).notNull(),
    experienceYears: varchar("experience_years", { length: 40 }).notNull(),
    industryId: int("industry_id").references(() => industries.id, { onDelete: "set null" }),
    salaryMin: int("salary_min"),
    salaryMax: int("salary_max"),
    salaryCurrency: mysqlEnum("salary_currency", ["AED", "USD"]).default("AED"),
    salaryPeriod: mysqlEnum("salary_period", ["month", "year"]).default("month"),
    summary: varchar("summary", { length: 500 }).notNull(),
    description: json("description").$type<string[]>().notNull(),
    responsibilities: json("responsibilities").$type<string[]>().notNull(),
    requirements: json("requirements").$type<string[]>().notNull(),
    benefits: json("benefits").$type<string[]>().notNull(),
    postedAt: date("posted_at", { mode: "string" }).notNull(),
    closingAt: date("closing_at", { mode: "string" }),
    featured: boolean("featured").notNull().default(false),
    status: mysqlEnum("status", jobStatuses).notNull().default("draft"),
    ...seo,
    ...timestamps,
  },
  (t) => [index("jobs_status_idx").on(t.status), index("jobs_industry_idx").on(t.industryId), index("jobs_location_idx").on(t.locationId)],
);

/* --------------------------------- Insights -------------------------------- */
export const insightCategories = mysqlTable("insight_categories", {
  id: id(),
  slug: varchar("slug", { length: 120 }).notNull().unique(),
  name: varchar("name", { length: 120 }).notNull(),
  sortOrder: sortOrder(),
  ...timestamps,
});

export const insights = mysqlTable(
  "insights",
  {
    id: id(),
    slug: varchar("slug", { length: 190 }).notNull().unique(),
    title: varchar("title", { length: 255 }).notNull(),
    excerpt: varchar("excerpt", { length: 500 }).notNull(),
    imageUrl: varchar("image_url", { length: 500 }),
    imageAlt: varchar("image_alt", { length: 255 }),
    categoryId: int("category_id").references(() => insightCategories.id, { onDelete: "set null" }),
    authorName: varchar("author_name", { length: 120 }).notNull(),
    authorRole: varchar("author_role", { length: 120 }),
    publishedAt: date("published_at", { mode: "string" }).notNull(),
    readingMinutes: int("reading_minutes").notNull().default(5),
    content: json("content").$type<ContentBlock[]>().notNull(),
    featured: boolean("featured").notNull().default(false),
    status: mysqlEnum("status", ["draft", "published"]).notNull().default("draft"),
    downloadLabel: varchar("download_label", { length: 120 }),
    downloadUrl: varchar("download_url", { length: 500 }),
    ...seo,
    ...timestamps,
  },
  (t) => [index("insights_status_idx").on(t.status)],
);

/* -------------------------- Statistics & testimonials ---------------------- */
export const statistics = mysqlTable("statistics", {
  id: id(),
  value: varchar("value", { length: 20 }).notNull(),
  suffix: varchar("suffix", { length: 10 }),
  label: varchar("label", { length: 120 }).notNull(),
  isPlaceholder: boolean("is_placeholder").notNull().default(false),
  highlight: boolean("highlight").notNull().default(false),
  sortOrder: sortOrder(),
  ...timestamps,
});

export const testimonials = mysqlTable("testimonials", {
  id: id(),
  quote: text("quote").notNull(),
  name: varchar("name", { length: 120 }).notNull(),
  role: varchar("role", { length: 120 }).notNull(),
  company: varchar("company", { length: 160 }).notNull(),
  isPlaceholder: boolean("is_placeholder").notNull().default(false),
  isPublished: boolean("is_published").notNull().default(true),
  sortOrder: sortOrder(),
  ...timestamps,
});

/* ------------------------------ Team members ------------------------------- */
export const teamMembers = mysqlTable("team_members", {
  id: id(),
  name: varchar("name", { length: 120 }).notNull(),
  role: varchar("role", { length: 160 }).notNull(),
  bio: text("bio"),
  imageUrl: varchar("image_url", { length: 500 }),
  linkedinUrl: varchar("linkedin_url", { length: 500 }),
  isPublished: boolean("is_published").notNull().default(true),
  sortOrder: sortOrder(),
  ...timestamps,
});

/* ----------------------- Feature lists & process steps --------------------- */
export const features = mysqlTable(
  "features",
  {
    id: id(),
    group: mysqlEnum("group_key", featureGroups).notNull(),
    title: varchar("title", { length: 160 }).notNull(),
    description: varchar("description", { length: 500 }).notNull(),
    icon: varchar("icon", { length: 60 }).notNull(),
    href: varchar("href", { length: 300 }),
    ctaLabel: varchar("cta_label", { length: 80 }),
    sortOrder: sortOrder(),
    isPublished: boolean("is_published").notNull().default(true),
    ...timestamps,
  },
  (t) => [index("features_group_idx").on(t.group)],
);

export const processSteps = mysqlTable("process_steps", {
  id: id(),
  number: varchar("number", { length: 4 }).notNull(),
  title: varchar("title", { length: 80 }).notNull(),
  description: varchar("description", { length: 300 }).notNull(),
  sortOrder: sortOrder(),
  ...timestamps,
});

/* ------------------------------- Legal pages ------------------------------- */
export const legalPages = mysqlTable("legal_pages", {
  id: id(),
  slug: varchar("slug", { length: 120 }).notNull().unique(),
  title: varchar("title", { length: 160 }).notNull(),
  intro: text("intro").notNull(),
  sections: json("sections").$type<LegalSection[]>().notNull(),
  isDraft: boolean("is_draft").notNull().default(true),
  ...timestamps,
});

/* -------------------------------- Enquiries -------------------------------- */

export const enquiries = mysqlTable(
  "enquiries",
  {
    id: id(),
    type: mysqlEnum("type", enquiryTypes).notNull(),
    status: mysqlEnum("status", enquiryStatuses).notNull().default("new"),
    name: varchar("name", { length: 160 }).notNull(),
    email: varchar("email", { length: 190 }).notNull(),
    phone: varchar("phone", { length: 60 }),
    company: varchar("company", { length: 190 }),
    subject: varchar("subject", { length: 190 }),
    message: text("message"),
    /** Type-specific fields (hiring need, positions, current role, experience, preferences …). */
    details: json("details").$type<Record<string, string>>().notNull(),
    jobId: int("job_id").references(() => jobs.id, { onDelete: "set null" }),
    jobReference: varchar("job_reference", { length: 40 }),
    cvFileName: varchar("cv_file_name", { length: 255 }),
    cvUrl: varchar("cv_url", { length: 500 }),
    sourceUrl: varchar("source_url", { length: 500 }),
    ipAddress: varchar("ip_address", { length: 64 }),
    userAgent: varchar("user_agent", { length: 300 }),
    notes: text("notes"),
    ...timestamps,
  },
  (t) => [index("enquiries_type_idx").on(t.type), index("enquiries_status_idx").on(t.status), index("enquiries_created_idx").on(t.createdAt)],
);

/*
 * Note: relational queries (db.query.*.findMany({ with })) are intentionally not used —
 * they rely on LATERAL joins, which MariaDB and MySQL < 8.0.14 do not support.
 * Use explicit joins with the core query builder instead.
 */
