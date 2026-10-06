/**
 * Zod schemas shared by client forms (react-hook-form) and server actions.
 * Schemas describe the FORM shape; server actions map them to DB rows.
 */
import { z } from "zod";
import { employmentTypes, enquiryStatuses, experienceLevels, featureGroups, jobStatuses } from "@/lib/constants";

const req = (label: string, max = 255) => z.string().trim().min(1, `${label} is required`).max(max, `${label} is too long (max ${max})`);
const opt = (max = 255) => z.string().trim().max(max, `Too long (max ${max})`);
export const slugSchema = z
  .string()
  .trim()
  .min(1, "Slug is required")
  .max(180)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and hyphens only");
const urlOrPath = z
  .string()
  .trim()
  .max(500)
  .refine((v) => v === "" || v.startsWith("/") || /^https?:\/\//i.test(v), "Use a full URL (https://…) or a site path (/images/…)");
const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use a valid date");

/** RHF field arrays need objects, so string lists are { value }[] in forms. */
export const stringListSchema = (label: string, min = 0) =>
  z
    .array(z.object({ value: z.string().trim().max(500) }))
    .transform((rows) => rows.map((r) => r.value).filter(Boolean))
    .refine((rows) => rows.length >= min, `Add at least ${min} ${label.toLowerCase()}`);

export const toListField = (items: string[] | null | undefined) => (items ?? []).map((value) => ({ value }));

export const seoSchema = {
  seoTitle: opt(255),
  seoDescription: opt(320),
};

/* ------------------------------- Content blocks ---------------------------- */
export const contentBlockSchema = z.object({
  type: z.enum(["paragraph", "heading", "list", "quote"]),
  text: z.string().trim().max(10000),
  cite: z.string().trim().max(200).optional(),
});
export type ContentBlockForm = z.infer<typeof contentBlockSchema>;

/* ---------------------------------- Auth ----------------------------------- */
export const loginSchema = z.object({
  email: z.email("Enter a valid email").trim().toLowerCase(),
  password: z.string().min(1, "Password is required"),
});

/* ---------------------------------- Jobs ----------------------------------- */
export const jobSchema = z
  .object({
    title: req("Title", 190),
    slug: slugSchema,
    reference: req("Reference", 40),
    company: req("Company", 190),
    confidential: z.boolean(),
    locationId: z.string(),
    industryId: z.string(),
    country: z.string().trim().length(2, "Use a 2-letter country code"),
    employmentType: z.enum(employmentTypes),
    experienceLevel: z.enum(experienceLevels),
    experienceYears: req("Experience", 40),
    salaryMin: z.string().regex(/^\d*$/, "Numbers only"),
    salaryMax: z.string().regex(/^\d*$/, "Numbers only"),
    salaryCurrency: z.enum(["AED", "USD"]),
    salaryPeriod: z.enum(["month", "year"]),
    summary: req("Summary", 500),
    description: stringListSchema("Description paragraph", 1),
    responsibilities: stringListSchema("Responsibility", 1),
    requirements: stringListSchema("Requirement", 1),
    benefits: stringListSchema("Benefit"),
    postedAt: isoDate,
    closingAt: z.union([isoDate, z.literal("")]),
    featured: z.boolean(),
    status: z.enum(jobStatuses),
    ...seoSchema,
  })
  .refine((v) => !v.salaryMin || !v.salaryMax || Number(v.salaryMax) >= Number(v.salaryMin), {
    path: ["salaryMax"],
    message: "Max salary must be greater than min",
  })
  .refine((v) => !v.closingAt || v.closingAt >= v.postedAt, { path: ["closingAt"], message: "Closing date must be after posted date" });

/* -------------------------------- Services --------------------------------- */
export const serviceSchema = z.object({
  title: req("Title", 190),
  slug: slugSchema,
  shortTitle: req("Short title", 80),
  summary: req("Summary", 500),
  intro: req("Intro", 5000),
  icon: req("Icon", 60),
  imageUrl: urlOrPath,
  imageAlt: opt(255),
  ctaLabel: req("CTA label", 80),
  category: z.enum(["recruitment", "business"]),
  offerings: z.array(z.object({ title: req("Offering title", 160), description: req("Offering description", 500), icon: req("Icon", 60) })),
  body: z.array(contentBlockSchema),
  sortOrder: z.coerce.number<string | number>().int().min(0).max(9999),
  isPublished: z.boolean(),
  ...seoSchema,
});

/* ------------------------------- Industries -------------------------------- */
export const industrySchema = z.object({
  name: req("Name", 160),
  slug: slugSchema,
  shortName: opt(80),
  icon: req("Icon", 60),
  summary: req("Summary", 500),
  description: req("Description", 5000),
  roles: stringListSchema("Role"),
  sortOrder: z.coerce.number<string | number>().int().min(0).max(9999),
  isPublished: z.boolean(),
  ...seoSchema,
});

/* --------------------------------- Insights -------------------------------- */
export const insightSchema = z.object({
  title: req("Title", 255),
  slug: slugSchema,
  excerpt: req("Excerpt", 500),
  imageUrl: urlOrPath,
  imageAlt: opt(255),
  categoryId: z.string(),
  authorName: req("Author", 120),
  authorRole: opt(120),
  publishedAt: isoDate,
  readingMinutes: z.coerce.number<string | number>().int().min(1).max(120),
  content: z.array(contentBlockSchema).min(1, "Add at least one content block"),
  featured: z.boolean(),
  status: z.enum(["draft", "published"]),
  downloadLabel: opt(120),
  downloadUrl: urlOrPath,
  ...seoSchema,
});

/* ------------------------------- Legal pages ------------------------------- */
export const legalSchema = z.object({
  title: req("Title", 160),
  intro: req("Intro", 5000),
  isDraft: z.boolean(),
  sections: z
    .array(z.object({ heading: req("Heading", 200), body: req("Section text", 20000) }))
    .min(1, "Add at least one section"),
});

/* ------------------------------ Site settings ------------------------------ */
export const settingsSchema = z.object({
  name: req("Site name", 160),
  legalName: req("Legal name", 160),
  shortName: req("Short name", 60),
  tagline: req("Tagline", 255),
  description: req("Description", 2000),
  email: z.email("Enter a valid email"),
  careersEmail: z.email("Enter a valid email"),
  phone: req("Phone", 60),
  phoneHref: opt(80),
  whatsapp: opt(60),
  addressLine1: req("Address", 190),
  addressLine2: opt(190),
  city: req("City", 120),
  emirate: req("Emirate", 120),
  country: req("Country", 120),
  countryCode: z.string().trim().length(2, "2-letter code"),
  workingHours: z.array(z.object({ days: req("Days", 60), hours: req("Hours", 60) })),
  mapEmbedUrl: urlOrPath,
  social: z.array(
    z.object({
      platform: z.enum(["linkedin", "instagram", "facebook", "x", "youtube"]),
      label: req("Label", 60),
      href: z.url("Enter a full URL"),
    }),
  ),
  defaultOgImage: urlOrPath,
  mission: opt(2000),
  vision: opt(2000),
});

/* --------------------------------- Enquiries ------------------------------- */
export const enquiryUpdateSchema = z.object({
  status: z.enum(enquiryStatuses),
  notes: opt(10000),
});

/* ------------------------------- Admin users ------------------------------- */
export const userSchema = z.object({
  name: req("Name", 120),
  email: z.email("Enter a valid email").trim().toLowerCase(),
  role: z.enum(["admin", "editor"]),
  isActive: z.boolean(),
  password: z.string().max(200).refine((v) => v === "" || v.length >= 10, "Use at least 10 characters"),
});

export const passwordChangeSchema = z
  .object({
    currentPassword: z.string().min(1, "Enter your current password"),
    newPassword: z.string().min(10, "Use at least 10 characters").max(200),
    confirmPassword: z.string(),
  })
  .refine((v) => v.newPassword === v.confirmPassword, { path: ["confirmPassword"], message: "Passwords don't match" });

/* --------------------------- Simple content entities ----------------------- */
export const locationSchema = z.object({ label: req("Label", 120), slug: slugSchema, sortOrder: z.coerce.number<string | number>().int().min(0).max(9999) });
export const insightCategorySchema = z.object({ name: req("Name", 120), slug: slugSchema, sortOrder: z.coerce.number<string | number>().int().min(0).max(9999) });
export const statisticSchema = z.object({
  value: req("Value", 20),
  suffix: opt(10),
  label: req("Label", 120),
  isPlaceholder: z.boolean(),
  highlight: z.boolean(),
  sortOrder: z.coerce.number<string | number>().int().min(0).max(9999),
});
export const testimonialSchema = z.object({
  quote: req("Quote", 2000),
  name: req("Name", 120),
  role: req("Role", 120),
  company: req("Company", 160),
  isPlaceholder: z.boolean(),
  isPublished: z.boolean(),
  sortOrder: z.coerce.number<string | number>().int().min(0).max(9999),
});
export const teamMemberSchema = z.object({
  name: req("Name", 120),
  role: req("Role", 160),
  bio: opt(2000),
  imageUrl: urlOrPath,
  linkedinUrl: urlOrPath,
  isPublished: z.boolean(),
  sortOrder: z.coerce.number<string | number>().int().min(0).max(9999),
});
export const featureSchema = z.object({
  group: z.enum(featureGroups),
  title: req("Title", 160),
  description: req("Description", 500),
  icon: req("Icon", 60),
  href: opt(300),
  ctaLabel: opt(80),
  isPublished: z.boolean(),
  sortOrder: z.coerce.number<string | number>().int().min(0).max(9999),
});
export const processStepSchema = z.object({
  number: req("Number", 4),
  title: req("Title", 80),
  description: req("Description", 300),
  sortOrder: z.coerce.number<string | number>().int().min(0).max(9999),
});
