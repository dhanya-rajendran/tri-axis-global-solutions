/**
 * Seeds the database with the website's launch content and creates the first
 * admin account. Safe to re-run: each table is only seeded when it is empty,
 * and the admin is only created if that email doesn't exist yet.
 *
 * Usage:
 *   SEED_ADMIN_EMAIL=you@company.com SEED_ADMIN_PASSWORD='StrongPass!23' npm run db:seed
 */
import { config } from "dotenv";
import bcrypt from "bcryptjs";
import { count, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import type { MySqlTable } from "drizzle-orm/mysql-core";
import mysql from "mysql2/promise";
import * as s from "../db/schema";
import data from "../db/seed-data.json";

config({ path: process.env.ENV_FILE ?? ".env.local" });

type AnyRecord = Record<string, unknown>;

async function main() {
  const connection = await mysql.createConnection({
    host: process.env.MYSQL_HOST,
    port: Number(process.env.MYSQL_PORT ?? 3306),
    database: process.env.MYSQL_DATABASE,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    ssl: process.env.MYSQL_SSL === "true" ? { rejectUnauthorized: false } : undefined,
  });
  const db = drizzle(connection, { schema: s, mode: "default" });

  const isEmpty = async (table: MySqlTable) => {
    const [row] = await db.select({ n: count() }).from(table);
    return Number(row.n) === 0;
  };
  const seedIfEmpty = async (label: string, table: MySqlTable, rows: AnyRecord[]) => {
    if (!rows.length) return;
    if (!(await isEmpty(table))) return console.log(`• ${label}: already has data, skipped`);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await db.insert(table).values(rows as any);
    console.log(`✓ ${label}: ${rows.length} rows`);
  };

  /* Site settings */
  const sc = data.siteConfig;
  await seedIfEmpty("site_settings", s.siteSettings, [
    {
      id: 1,
      name: sc.name,
      legalName: sc.legalName,
      shortName: sc.shortName,
      tagline: sc.tagline,
      description: sc.description,
      email: sc.contact.email,
      careersEmail: sc.contact.careersEmail,
      phone: sc.contact.phone,
      phoneHref: sc.contact.phoneHref,
      whatsapp: sc.contact.whatsapp,
      addressLine1: sc.contact.address.line1,
      city: sc.contact.address.city,
      emirate: sc.contact.address.emirate,
      country: sc.contact.address.country,
      countryCode: sc.contact.address.countryCode,
      workingHours: sc.contact.workingHours,
      mapEmbedUrl: sc.contact.mapEmbedUrl,
      social: sc.social,
      defaultOgImage: sc.defaultOgImage,
      mission: data.company.mission.mission,
      vision: data.company.mission.vision,
    },
  ]);

  /* Services */
  await seedIfEmpty(
    "services",
    s.services,
    data.services.map((x) => ({
      slug: x.slug,
      title: x.title,
      shortTitle: x.shortTitle,
      summary: x.summary,
      intro: x.intro,
      icon: x.icon,
      imageUrl: x.image.src,
      imageAlt: x.image.alt,
      ctaLabel: x.ctaLabel,
      category: x.category,
      offerings: x.offerings,
      body: x.body,
      seoTitle: x.seoTitle,
      seoDescription: x.seoDescription,
      sortOrder: x.order,
    })),
  );

  /* Industries */
  await seedIfEmpty(
    "industries",
    s.industries,
    data.industries.map((x) => ({
      slug: x.slug,
      name: x.name,
      shortName: x.shortName ?? null,
      icon: x.icon,
      summary: x.summary,
      description: x.description,
      roles: x.roles,
      seoTitle: x.seoTitle,
      seoDescription: x.seoDescription,
      sortOrder: x.order,
    })),
  );

  /* Locations */
  await seedIfEmpty(
    "locations",
    s.locations,
    data.locations.map((x, i) => ({ slug: x.value, label: x.label, sortOrder: i + 1 })),
  );

  /* Jobs (resolve location / industry ids) */
  if (await isEmpty(s.jobs)) {
    const locs = await db.select().from(s.locations);
    const inds = await db.select().from(s.industries);
    const rows = data.jobs.map((j) => ({
      slug: j.slug,
      reference: j.reference,
      title: j.title,
      company: j.company,
      confidential: j.confidential,
      locationId: locs.find((l) => l.slug === j.locationSlug)?.id ?? null,
      country: j.country,
      employmentType: j.employmentType as (typeof s.employmentTypes)[number],
      experienceLevel: j.experienceLevel as (typeof s.experienceLevels)[number],
      experienceYears: j.experienceYears,
      industryId: inds.find((i) => i.slug === j.industry)?.id ?? null,
      salaryMin: j.salary?.min ?? null,
      salaryMax: j.salary?.max ?? null,
      salaryCurrency: (j.salary?.currency as "AED" | "USD") ?? "AED",
      salaryPeriod: (j.salary?.period as "month" | "year") ?? "month",
      summary: j.summary,
      description: j.description,
      responsibilities: j.responsibilities,
      requirements: j.requirements,
      benefits: j.benefits,
      postedAt: j.postedAt,
      closingAt: j.closingAt ?? null,
      featured: j.featured,
      status: j.status as (typeof s.jobStatuses)[number],
    }));
    await db.insert(s.jobs).values(rows);
    console.log(`✓ jobs: ${rows.length} rows (sample data)`);
  } else console.log("• jobs: already has data, skipped");

  /* Insight categories + insights */
  await seedIfEmpty(
    "insight_categories",
    s.insightCategories,
    data.insightCategories.map((c, i) => ({ slug: c.slug, name: c.name, sortOrder: i + 1 })),
  );
  if (await isEmpty(s.insights)) {
    const cats = await db.select().from(s.insightCategories);
    const rows = data.insights.map((a) => ({
      slug: a.slug,
      title: a.title,
      excerpt: a.excerpt,
      imageUrl: a.image.src,
      imageAlt: a.image.alt,
      categoryId: cats.find((c) => c.slug === a.category.slug)?.id ?? null,
      authorName: a.author.name,
      authorRole: a.author.role,
      publishedAt: a.publishedAt,
      readingMinutes: a.readingMinutes,
      content: a.content as s.ContentBlock[],
      featured: a.featured,
      status: "published" as const,
      downloadLabel: (a as AnyRecord & { download?: { label: string } }).download?.label ?? null,
      seoTitle: (a as AnyRecord & { seoTitle?: string }).seoTitle ?? null,
      seoDescription: (a as AnyRecord & { seoDescription?: string }).seoDescription ?? null,
    }));
    await db.insert(s.insights).values(rows);
    console.log(`✓ insights: ${rows.length} rows (sample data)`);
  } else console.log("• insights: already has data, skipped");

  /* Statistics, testimonials */
  await seedIfEmpty(
    "statistics",
    s.statistics,
    data.statistics.map((x) => ({
      value: x.value,
      suffix: (x as AnyRecord & { suffix?: string }).suffix ?? null,
      label: x.label,
      isPlaceholder: Boolean((x as AnyRecord & { placeholder?: boolean }).placeholder),
      highlight: Boolean((x as AnyRecord & { highlight?: boolean }).highlight),
      sortOrder: x.order,
    })),
  );
  await seedIfEmpty(
    "testimonials",
    s.testimonials,
    data.testimonials.map((t) => ({
      quote: t.quote,
      name: t.name,
      role: t.role,
      company: t.company,
      isPlaceholder: Boolean(t.placeholder),
      sortOrder: t.order,
    })),
  );

  /* Features & process */
  const groups: [keyof typeof data.company, (typeof s.featureGroups)[number]][] = [
    ["valuePropositions", "why_triaxis"],
    ["companyValues", "company_values"],
    ["employerBenefits", "employer_benefits"],
    ["employerSolutions", "employer_solutions"],
    ["candidateServices", "candidate_services"],
    ["candidateReasons", "candidate_reasons"],
  ];
  const featureRows = groups.flatMap(([key, group]) =>
    (data.company[key] as (AnyRecord & { title: string; description: string; icon: string; href?: string; cta?: string })[]).map((f, i) => ({
      group,
      title: f.title,
      description: f.description,
      icon: f.icon,
      href: f.href ?? null,
      ctaLabel: f.cta ?? null,
      sortOrder: i + 1,
    })),
  );
  await seedIfEmpty("features", s.features, featureRows);
  await seedIfEmpty(
    "process_steps",
    s.processSteps,
    data.company.processSteps.map((p, i) => ({ number: p.number, title: p.title, description: p.description, sortOrder: i + 1 })),
  );

  /* Legal pages */
  await seedIfEmpty(
    "legal_pages",
    s.legalPages,
    Object.values(data.legalDocuments).map((d) => ({ slug: d.slug, title: d.title, intro: d.intro, sections: d.sections, isDraft: true })),
  );

  /* First admin */
  const email = process.env.SEED_ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.SEED_ADMIN_PASSWORD;
  if (email && password) {
    if (password.length < 10) throw new Error("SEED_ADMIN_PASSWORD must be at least 10 characters");
    const existing = await db.select({ id: s.adminUsers.id }).from(s.adminUsers).where(eq(s.adminUsers.email, email));
    if (existing.length) console.log(`• admin ${email} already exists`);
    else {
      await db.insert(s.adminUsers).values({
        name: process.env.SEED_ADMIN_NAME ?? "Administrator",
        email,
        passwordHash: await bcrypt.hash(password, 12),
        role: "admin",
      });
      console.log(`✓ admin user created: ${email}`);
    }
  } else {
    console.log("• No SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD set — no admin user created");
  }

  await connection.end();
  console.log("Done.");
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
