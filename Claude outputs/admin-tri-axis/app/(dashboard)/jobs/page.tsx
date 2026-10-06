import type { Metadata } from "next";
import Link from "next/link";
import { and, asc, count, desc, eq, like, or, type SQL } from "drizzle-orm";
import { Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DeleteButton } from "@/components/shared/DeleteButton";
import { EmptyState } from "@/components/shared/EmptyState";
import { ListToolbar } from "@/components/shared/ListToolbar";
import { PageHeader } from "@/components/shared/PageHeader";
import { Pagination, parsePage } from "@/components/shared/Pagination";
import { JobStatusBadge } from "@/components/shared/StatusBadge";
import { TableCard } from "@/components/shared/TableCard";
import { db } from "@/db";
import { industries, jobs, locations } from "@/db/schema";
import { requireUser } from "@/lib/auth/dal";
import { jobStatuses, labels } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import { deleteJob } from "./actions";

export const metadata: Metadata = { title: "Jobs" };
const PAGE_SIZE = 20;

export default async function JobsPage({ searchParams }: PageProps<"/jobs">) {
  await requireUser();
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q.trim() : "";
  const status = typeof sp.status === "string" && (jobStatuses as readonly string[]).includes(sp.status) ? (sp.status as (typeof jobStatuses)[number]) : null;
  const industry = typeof sp.industry === "string" ? Number(sp.industry) : NaN;
  const page = parsePage(sp.page);

  const where: SQL[] = [];
  if (q) where.push(or(like(jobs.title, `%${q}%`), like(jobs.reference, `%${q}%`), like(jobs.company, `%${q}%`))!);
  if (status) where.push(eq(jobs.status, status));
  if (Number.isInteger(industry)) where.push(eq(jobs.industryId, industry));
  const cond = where.length ? and(...where) : undefined;

  const [rows, [{ n }], inds] = await Promise.all([
    db
      .select({
        id: jobs.id, title: jobs.title, reference: jobs.reference, status: jobs.status, featured: jobs.featured,
        employmentType: jobs.employmentType, postedAt: jobs.postedAt, industry: industries.name, location: locations.label,
      })
      .from(jobs)
      .leftJoin(industries, eq(jobs.industryId, industries.id))
      .leftJoin(locations, eq(jobs.locationId, locations.id))
      .where(cond)
      .orderBy(desc(jobs.postedAt), desc(jobs.id))
      .limit(PAGE_SIZE)
      .offset((page - 1) * PAGE_SIZE),
    db.select({ n: count() }).from(jobs).where(cond),
    db.select({ id: industries.id, name: industries.name }).from(industries).orderBy(asc(industries.sortOrder)),
  ]);

  return (
    <>
      <PageHeader
        title="Jobs"
        description="Vacancies shown on the website’s Jobs pages. Only jobs with status “Open” are public."
        actions={
          <Button asChild>
            <Link href="/jobs/new">
              <Plus /> New job
            </Link>
          </Button>
        }
      />
      <ListToolbar
        placeholder="Search title, reference, company"
        filters={[
          { name: "status", label: "Statuses", options: jobStatuses.map((s) => ({ value: s, label: labels.jobStatus[s] })) },
          { name: "industry", label: "Industries", options: inds.map((i) => ({ value: String(i.id), label: i.name })) },
        ]}
      />
      {rows.length === 0 ? (
        <EmptyState title="No jobs found" description={q || status ? "Try different filters." : "Create your first vacancy."} />
      ) : (
        <TableCard>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Job</TableHead>
                <TableHead className="hidden md:table-cell">Industry</TableHead>
                <TableHead className="hidden lg:table-cell">Location</TableHead>
                <TableHead className="hidden sm:table-cell">Posted</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((j) => (
                <TableRow key={j.id}>
                  <TableCell>
                    <Link href={`/jobs/${j.id}`} className="font-medium hover:underline">
                      {j.title}
                    </Link>
                    <div className="text-muted-foreground mt-0.5 flex items-center gap-2 text-xs">
                      {j.reference} · {labels.employmentType[j.employmentType]}
                      {j.featured && <Badge variant="gold">Featured</Badge>}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{j.industry ?? "—"}</TableCell>
                  <TableCell className="hidden lg:table-cell">{j.location ?? "—"}</TableCell>
                  <TableCell className="hidden sm:table-cell">{formatDate(j.postedAt)}</TableCell>
                  <TableCell>
                    <JobStatusBadge status={j.status} />
                  </TableCell>
                  <TableCell>
                    <DeleteButton action={deleteJob.bind(null, j.id)} itemLabel={`“${j.title}”`} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableCard>
      )}
      <Pagination page={page} pageSize={PAGE_SIZE} total={Number(n)} searchParams={sp} />
    </>
  );
}
