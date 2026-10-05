# TriAxis Global Solutions — Corporate Website (Phase 1)

Public website for **TriAxis Global Solutions FZE**, a UAE-based recruitment, talent management, procurement, general trading and e-commerce company.

Built with **Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · lucide-react**. No database, no auth, no UI framework.

> Phase 2 (separate repository) will add an admin system/API. This codebase is structured so content and form submissions can be switched to that API without changing UI components.

## Getting started

```bash
npm install
cp .env.example .env.local   # optional
npm run dev                  # http://localhost:3000
npm run lint
npm run build && npm start
```

Node.js 20.9+ is required. Fonts are self-hosted (no network needed at build time).

## Environment variables

| Variable | Purpose | Default |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical URLs, sitemap, Open Graph | `https://www.triaxisglobal.ae` |
| `NEXT_PUBLIC_ALLOW_INDEXING` | `true` only in production — otherwise robots.txt blocks crawling | `false` |
| `NEXT_PUBLIC_FORMS_ENDPOINT` | Admin API base URL for form submissions. Empty = preview/mock mode | empty |

## Project structure

```
app/                     Routes (App Router), metadata, sitemap.ts, robots.ts, icon.svg
  fonts/                 Self-hosted Playfair Display + Inter (OFL)
components/
  layout/                Header, DesktopNav, MobileMenu, Footer
  hero/                  Hero
  jobs/                  JobSearch (reusable: hero + page variants)
  sections/              Homepage / shared sections
  cards/                 ServiceCard, IndustryCard, JobCard, InsightCard, TestimonialCard
  forms/                 EnquiryForm (config-driven) + Contact/Employer/Candidate/JobApplication
  templates/             PageHero, FeatureGrid, ContentBlocks, LegalPage
  ui/                    Button, Container, SectionHeading, Badge, Icon, Logo, Breadcrumbs, SocialIcon
  seo/                   JsonLd
config/site.ts           Site settings (contact details, socials) — single source
lib/
  data/                  Local mock content (services, industries, jobs, insights, statistics, testimonials,
                         navigation, company, legal, images)
  services/api.ts        Content service layer — the ONLY way UI reads content
  services/job-search.ts Local job filtering
  services/submissions.ts Form submission abstraction
  forms/                 Form field configs + validation
  seo/                   Metadata builder + JSON-LD builders
types/                   Typed models for every entity
public/images/           Placeholder artwork (see below)
```

## Design system

All tokens live in `app/globals.css` (`@theme`): navy / gold / teal palette, neutrals, radius, motion and a fluid type scale. Use the generated utilities (`bg-navy`, `text-gold`, `border-line`, `font-serif`, `text-display`, `max-w-site` …) — never raw hex values.

- Headings: Playfair Display (serif) · UI/body: Inter
- Buttons: `primary` (gold), `secondary` (navy), `outline`, `outline-light`, `text`
- Motion: subtle, CSS-only; scroll reveals use `animation-timeline` as progressive enhancement; `prefers-reduced-motion` respected

## Phase 2 integration guide

1. **Content:** reimplement the functions in `lib/services/api.ts` (`getJobs`, `getJobBySlug`, `getServices`, `getIndustries`, `getInsights`, `getInsightBySlug`, `getStatistics`, `getTestimonials`, `getSiteSettings`, …) as API requests returning the same types from `types/`. Pages and components don't change.
2. **Icons:** content references icons by string key (`components/ui/Icon.tsx` registry) so API data stays serialisable.
3. **Rich text:** articles and service bodies use the `ContentBlock[]` model in `types/common.ts`.
4. **Forms:** set `NEXT_PUBLIC_FORMS_ENDPOINT`. Each form POSTs `multipart/form-data` to `${endpoint}/{contact|employer|candidate|job-application}` (CV files included). Field names are defined in `lib/forms/configs.ts`.
5. **Caching:** consider tagged fetches / revalidation for jobs and insights once data is remote. `/jobs/[slug]` and `/insights/[slug]` already allow on-demand rendering of new slugs.

## Placeholders to replace before launch

- **Images:** every file in `public/images/` is original generated placeholder artwork. Replace with licensed photography using the same filenames; briefs and alt text are in `lib/data/images.ts`.
- **Logo:** interim SVG mark in `components/ui/Logo.tsx` and `app/icon.svg`.
- **Contact details:** address, phone, map embed, emails and social URLs in `config/site.ts`.
- **Statistics:** `[000]+` values in `lib/data/statistics.ts`; confirm "12 years" and "10+ industries".
- **Testimonial:** `lib/data/testimonials.ts`.
- **Jobs & insights:** sample data in `lib/data/jobs.ts` and `lib/data/insights.ts`.
- **Leadership team:** `teamMembers` in `lib/data/company.ts` (About page shows placeholders while empty).
- **Legal pages:** draft text in `lib/data/legal.ts` — requires legal review.
- **Salary report download:** `download.href` in `lib/data/insights.ts`.
