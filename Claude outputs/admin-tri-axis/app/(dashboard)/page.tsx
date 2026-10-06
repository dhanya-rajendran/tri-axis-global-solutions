import type { Metadata } from "next";
import Link from "next/link";
import { and, count, desc, eq, gte } from "drizzle-orm";
import { ArrowRight, BookOpen, Briefcase, Inbox, Plus, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { EnquiryStatusBadge } from "@/components/shared/StatusBadge";
import { db } from "@/db";
import { enquiries, insights, jobs } from "@/db/schema";
import { requireUser } from "@/lib/auth/dal";
import { labels } from "@/lib/constants";
import { daysAgo, formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const user = await requireUser();
  const since = daysAgo(30);
  const [[openJobs], [newEnq], [enq30], [applications30], [published], recent] = await Promise.all([
    db.select({ n: count() }).from(jobs).where(eq(jobs.status, "open")),
    db.select({ n: count() }).from(enquiries).where(eq(enquiries.status, "new")),
    db.select({ n: count() }).from(enquiries).where(gte(enquiries.createdAt, since)),
    db.select({ n: count() }).from(enquiries).where(and(gte(enquiries.createdAt, since), eq(enquiries.type, "job-application"))),
    db.select({ n: count() }).from(insights).where(eq(insights.status, "published")),
    db.select().from(enquiries).orderBy(desc(enquiries.createdAt)).limit(8),
  ]);

  const stats = [
    { label: "New enquiries", value: newEnq.n, href: "/enquiries?status=new", icon: Inbox, accent: "text-gold" },
    { label: "Enquiries (30 days)", value: enq30.n, href: "/enquiries", icon: Users, accent: "text-teal" },
    { label: "Applications (30 days)", value: applications30.n, href: "/enquiries?type=job-application", icon: Briefcase, accent: "text-teal" },
    { label: "Open jobs", value: openJobs.n, href: "/jobs?status=open", icon: Briefcase, accent: "text-primary" },
    { label: "Published insights", value: published.n, href: "/insights?status=published", icon: BookOpen, accent: "text-primary" },
  ];

  return (
    <>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl">Welcome back, {user.name.split(" ")[0]}</h1>
          <p className="text-muted-foreground mt-1 text-sm">Here’s what’s happening on the TriAxis website.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/insights/new">
              <Plus /> Article
            </Link>
          </Button>
          <Button asChild>
            <Link href="/jobs/new">
              <Plus /> Job
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="group">
            <Card className="gap-2 py-5 transition-shadow group-hover:shadow-md">
              <CardContent className="px-5">
                <s.icon className={`size-5 ${s.accent}`} />
                <p className="mt-3 text-3xl font-semibold tabular-nums">{Number(s.value)}</p>
                <p className="text-muted-foreground text-sm">{s.label}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <Card className="mt-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Latest enquiries</CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/enquiries">
              View all <ArrowRight />
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="px-0">
          {recent.length === 0 ? (
            <p className="text-muted-foreground px-6 text-sm">No enquiries yet. Submissions from the website forms will appear here.</p>
          ) : (
            <Table>
              <TableBody>
                {recent.map((e) => (
                  <TableRow key={e.id}>
                    <TableCell className="pl-6">
                      <Link href={`/enquiries/${e.id}`} className="font-medium hover:underline">
                        {e.name}
                      </Link>
                      <p className="text-muted-foreground text-xs">{e.email}</p>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{labels.enquiryType[e.type]}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground hidden sm:table-cell">{formatDate(e.createdAt, true)}</TableCell>
                    <TableCell className="pr-6 text-right">
                      <EnquiryStatusBadge status={e.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </>
  );
}
