import type { Metadata } from "next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/PageHeader";
import { requireUser } from "@/lib/auth/dal";

export const metadata: Metadata = { title: "API & integration" };

const endpoints: [string, string, string][] = [
  ["GET", "/api/public/settings", "Site settings (company, contact, social, mission/vision)"],
  ["GET", "/api/public/services", "Published services · /services/{slug}"],
  ["GET", "/api/public/industries", "Published industries · /industries/{slug}"],
  ["GET", "/api/public/jobs", "Open jobs · filters: keyword, location, industry, type, experience · /jobs/{slug}"],
  ["GET", "/api/public/job-filters", "Locations, industries, job types and experience levels"],
  ["GET", "/api/public/insights", "Published insights · filters: category, limit · /insights/{slug}"],
  ["GET", "/api/public/insight-categories", "Insight categories"],
  ["GET", "/api/public/statistics", "Trust statistics"],
  ["GET", "/api/public/testimonials", "Published testimonials"],
  ["GET", "/api/public/team", "Published team members"],
  ["GET", "/api/public/features?group=why_triaxis", "Feature lists by group"],
  ["GET", "/api/public/process-steps", "Process timeline"],
  ["GET", "/api/public/legal/{slug}", "Legal page"],
  ["POST", "/api/public/enquiries/{contact|employer|candidate|job-application}", "Form submissions (multipart/form-data)"],
];

export default async function IntegrationPage() {
  await requireUser();
  const base = process.env.NEXT_PUBLIC_ADMIN_URL ?? "https://<admin-domain>";
  return (
    <>
      <PageHeader title="API & integration" description="How the public website reads content and sends form submissions." />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Website environment variables</CardTitle>
            <CardDescription>Set these in the website’s Vercel project.</CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted overflow-x-auto rounded-md p-4 text-xs leading-relaxed">{`ADMIN_API_URL=${base}/api/public
ADMIN_API_KEY=<same value as PUBLIC_API_KEY here>
NEXT_PUBLIC_FORMS_ENDPOINT=${base}/api/public/enquiries
REVALIDATE_SECRET=<same value as WEBSITE_REVALIDATE_SECRET here>`}</pre>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Security</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground space-y-2 text-sm">
            <p>Read endpoints require the <code className="text-foreground">x-api-key</code> header when <code className="text-foreground">PUBLIC_API_KEY</code> is set.</p>
            <p>Form submissions are accepted from origins listed in <code className="text-foreground">CORS_ORIGINS</code>, validated, size-limited and protected by a honeypot field.</p>
            <p>Only published / open records are returned. Drafts never leave the dashboard.</p>
          </CardContent>
        </Card>
      </div>
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Endpoints</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="divide-y text-sm">
            {endpoints.map(([m, p, d]) => (
              <li key={p} className="flex flex-col gap-1 py-2.5 sm:flex-row sm:items-center sm:gap-4">
                <span className={`w-12 font-mono text-xs font-semibold ${m === "GET" ? "text-teal" : "text-gold"}`}>{m}</span>
                <code className="font-mono text-xs">{p}</code>
                <span className="text-muted-foreground sm:ml-auto">{d}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </>
  );
}
