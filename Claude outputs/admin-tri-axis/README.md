# TriAxis Admin Dashboard

Content management and enquiry inbox for the **TriAxis Global Solutions** public website
([tri-axis-global-solutions](https://github.com/dhanya-rajendran/tri-axis-global-solutions)).

**Stack:** Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · shadcn/ui · React Hook Form + Zod · Drizzle ORM · MySQL / MariaDB

## What it manages

| Area | Website usage |
| --- | --- |
| **Jobs** (+ locations) | Jobs listing, search filters, job detail pages, JobPosting SEO |
| **Services** | Service cards, `/services/*` pages, homepage recruitment feature |
| **Industries** | Industry grid, `/industries/*` pages, job industry filter |
| **Insights** (+ categories) | `/insights` listing & articles |
| **Statistics, testimonials** | “Trusted by businesses” band |
| **Feature lists** | Why TriAxis, company values, employer & candidate page lists |
| **Process steps** | “Our Process” timeline |
| **Team members** | About page leadership section |
| **Legal pages** | Privacy, terms, cookie policy |
| **Site settings** | Company details, contact info, address, hours, map, social links, mission/vision |
| **Enquiries** | Contact, employer, candidate (CV) and job-application submissions — status, notes, CSV export |
| **Admin users** | Admin & editor roles (admins only) |

## Getting started

```bash
npm install
cp .env.example .env.local      # fill in database + AUTH_SECRET
npm run db:migrate              # create tables
SEED_ADMIN_EMAIL=you@company.com SEED_ADMIN_PASSWORD='a-strong-password' npm run db:seed
npm run dev                     # http://localhost:3000 (use -p 3001 if the website runs on 3000)
```

`db:seed` loads the website's launch content (services, industries, sample jobs & insights, settings, etc.)
and creates the first admin. It only fills empty tables, so it's safe to re-run.

### Database notes

- Works with MySQL 5.7+ and MariaDB 10.3+. Relational `with` queries are deliberately avoided
  (they need LATERAL joins that MariaDB doesn't support) — use explicit joins.
- Shared hosting (cPanel) usually blocks remote connections. In cPanel → **Remote MySQL**, add the IPs
  that need access (your own IP for migrations; for Vercel, which has no fixed IP, `%` is required —
  use a strong password and consider a TLS connection, `MYSQL_SSL=true`).
- Schema lives in `db/schema.ts`. After changing it: `npm run db:generate` then `npm run db:migrate`.

## Connecting the website

Set in the **website** project:

```dotenv
ADMIN_API_URL=https://<admin-domain>/api/public
ADMIN_API_KEY=<PUBLIC_API_KEY from this app>
NEXT_PUBLIC_FORMS_ENDPOINT=https://<admin-domain>/api/public/enquiries
REVALIDATE_SECRET=<WEBSITE_REVALIDATE_SECRET from this app>
```

Set in **this** project: `CORS_ORIGINS` (website origins), `WEBSITE_REVALIDATE_URL`, `WEBSITE_REVALIDATE_SECRET`, `PUBLIC_API_KEY`.

After every save the admin calls the website's `/api/revalidate`, so changes appear immediately.
The website falls back to its bundled local data if the API is unreachable.

The full endpoint list is on the **API & integration** page inside the dashboard.

## Security

- Passwords hashed with bcrypt (cost 12); signed, httpOnly session cookies (12 h).
- `proxy.ts` gates every dashboard route; server actions and pages re-check the user and role.
- Form submissions: origin allow-list (CORS), zod validation, size limits, honeypot field, basic rate limiting.
- Read API returns published/open records only; optional API key.
- Deleting enquiries (personal data) is admin-only.

## Known limitations / next steps

- **File uploads are not enabled.** Images are entered as URLs (or website paths like `/images/x.jpg`).
  CV submissions store the **file name only** — see `TODO(storage)` in
  `app/api/public/enquiries/[kind]/route.ts` to add Vercel Blob / S3 storage.
- No email notifications for new enquiries yet.

## Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` / `build` / `start` | Next.js |
| `npm run lint` / `typecheck` | Quality checks |
| `npm run db:generate` | Generate a SQL migration from `db/schema.ts` |
| `npm run db:migrate` | Apply migrations |
| `npm run db:seed` | Seed launch content + first admin |
| `npm run db:studio` | Browse the database (Drizzle Studio) |
