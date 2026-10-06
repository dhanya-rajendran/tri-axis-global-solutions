import type { Metadata } from "next";
import Link from "next/link";
import { count, desc } from "drizzle-orm";
import { Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EmptyState } from "@/components/shared/EmptyState";
import { ListToolbar } from "@/components/shared/ListToolbar";
import { PageHeader } from "@/components/shared/PageHeader";
import { Pagination, parsePage } from "@/components/shared/Pagination";
import { EnquiryStatusBadge } from "@/components/shared/StatusBadge";
import { TableCard } from "@/components/shared/TableCard";
import { db } from "@/db";
import { enquiries } from "@/db/schema";
import { requireUser } from "@/lib/auth/dal";
import { enquiryStatuses, enquiryTypes, labels } from "@/lib/constants";
import { cn, formatDate } from "@/lib/utils";
import { enquiryFilters } from "./query";

export const metadata: Metadata = { title: "Enquiries" };
const PAGE_SIZE = 25;

export default async function EnquiriesPage({ searchParams }: PageProps<"/enquiries">) {
  await requireUser();
  const sp = await searchParams;
  const page = parsePage(sp.page);
  const { cond } = enquiryFilters(sp);
  const [rows, [{ n }]] = await Promise.all([
    db
      .select({ id: enquiries.id, type: enquiries.type, status: enquiries.status, name: enquiries.name, email: enquiries.email, company: enquiries.company, subject: enquiries.subject, jobReference: enquiries.jobReference, createdAt: enquiries.createdAt })
      .from(enquiries)
      .where(cond)
      .orderBy(desc(enquiries.createdAt))
      .limit(PAGE_SIZE)
      .offset((page - 1) * PAGE_SIZE),
    db.select({ n: count() }).from(enquiries).where(cond),
  ]);
  const exportQs = new URLSearchParams(Object.entries(sp).filter(([k, v]) => typeof v === "string" && k !== "page") as [string, string][]).toString();

  return (
    <>
      <PageHeader
        title="Enquiries"
        description="Contact messages, hiring enquiries, CV submissions and job applications from the website."
        actions={
          <Button variant="outline" asChild>
            <a href={`/enquiries/export${exportQs ? `?${exportQs}` : ""}`}>
              <Download /> Export CSV
            </a>
          </Button>
        }
      />
      <ListToolbar
        placeholder="Search name, email, company"
        filters={[
          { name: "type", label: "Types", options: enquiryTypes.map((t) => ({ value: t, label: labels.enquiryType[t] })) },
          { name: "status", label: "Statuses", options: enquiryStatuses.map((s) => ({ value: s, label: labels.enquiryStatus[s] })) },
        ]}
      />
      {rows.length === 0 ? (
        <EmptyState title="No enquiries yet" description="Submissions from the website’s forms will appear here." />
      ) : (
        <TableCard>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>From</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="hidden md:table-cell">Subject</TableHead>
                <TableHead className="hidden sm:table-cell">Received</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((e) => (
                <TableRow key={e.id} className={cn(e.status === "new" && "bg-gold/5")}>
                  <TableCell>
                    <Link href={`/enquiries/${e.id}`} className={cn("hover:underline", e.status === "new" ? "font-semibold" : "font-medium")}>
                      {e.name}
                    </Link>
                    <p className="text-muted-foreground text-xs">{e.email}</p>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{labels.enquiryType[e.type]}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground hidden max-w-xs truncate md:table-cell">{e.subject ?? e.jobReference ?? e.company ?? "—"}</TableCell>
                  <TableCell className="hidden whitespace-nowrap sm:table-cell">{formatDate(e.createdAt, true)}</TableCell>
                  <TableCell>
                    <EnquiryStatusBadge status={e.status} />
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
