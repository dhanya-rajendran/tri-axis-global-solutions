import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { Mail, Phone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DeleteButton } from "@/components/shared/DeleteButton";
import { PageHeader } from "@/components/shared/PageHeader";
import { EnquiryStatusBadge } from "@/components/shared/StatusBadge";
import { db } from "@/db";
import { enquiries, jobs } from "@/db/schema";
import { requireUser } from "@/lib/auth/dal";
import { labels } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import { deleteEnquiry } from "../actions";
import { EnquiryUpdateForm } from "../EnquiryUpdateForm";

export const metadata: Metadata = { title: "Enquiry" };

const humanize = (k: string) => k.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase());

export default async function EnquiryPage({ params }: PageProps<"/enquiries/[id]">) {
  const user = await requireUser();
  const id = Number((await params).id);
  if (!Number.isInteger(id)) notFound();
  const [row] = await db
    .select({ e: enquiries, jobTitle: jobs.title })
    .from(enquiries)
    .leftJoin(jobs, eq(enquiries.jobId, jobs.id))
    .where(eq(enquiries.id, id))
    .limit(1);
  if (!row) notFound();
  const e = row.e;

  // Opening a new enquiry marks it as in progress.
  if (e.status === "new") await db.update(enquiries).set({ status: "in_progress" }).where(eq(enquiries.id, id));
  const status = e.status === "new" ? "in_progress" : e.status;

  const fields: [string, string | null | undefined][] = [
    ["Email", e.email],
    ["Phone", e.phone],
    ["Company", e.company],
    ["Subject", e.subject],
    ...Object.entries(e.details ?? {}).map(([k, v]) => [humanize(k), v] as [string, string]),
    ["Job reference", e.jobReference],
    ["CV file", e.cvFileName ? `${e.cvFileName}${e.cvUrl ? "" : " (file not stored — upload storage not enabled)"}` : null],
    ["Submitted from", e.sourceUrl],
  ];

  return (
    <>
      <PageHeader
        title={e.name}
        description={
          <span className="inline-flex flex-wrap items-center gap-2">
            <Badge variant="outline">{labels.enquiryType[e.type]}</Badge>
            <EnquiryStatusBadge status={status} /> Received {formatDate(e.createdAt, true)}
          </span>
        }
        back={{ href: "/enquiries", label: "Enquiries" }}
        actions={
          <>
            <Button variant="outline" asChild>
              <a href={`mailto:${e.email}`}>
                <Mail /> Reply
              </a>
            </Button>
            {e.phone && (
              <Button variant="outline" asChild>
                <a href={`tel:${e.phone.replace(/\s/g, "")}`}>
                  <Phone /> Call
                </a>
              </Button>
            )}
            {user.role === "admin" && <DeleteButton action={deleteEnquiry.bind(null, e.id)} itemLabel="this enquiry" redirectTo="/enquiries" variant="button" />}
          </>
        }
      />
      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="divide-y">
                {fields
                  .filter(([, v]) => v)
                  .map(([k, v]) => (
                    <div key={k} className="grid gap-1 py-2.5 text-sm sm:grid-cols-[180px_1fr]">
                      <dt className="text-muted-foreground">{k}</dt>
                      <dd className="break-words">{v}</dd>
                    </div>
                  ))}
                {row.jobTitle && (
                  <div className="grid gap-1 py-2.5 text-sm sm:grid-cols-[180px_1fr]">
                    <dt className="text-muted-foreground">Job</dt>
                    <dd>
                      <Link href={`/jobs/${e.jobId}`} className="underline">
                        {row.jobTitle}
                      </Link>
                    </dd>
                  </div>
                )}
              </dl>
            </CardContent>
          </Card>
          {e.message && (
            <Card>
              <CardHeader>
                <CardTitle>Message</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{e.message}</p>
              </CardContent>
            </Card>
          )}
        </div>
        <Card className="lg:sticky lg:top-24 lg:self-start">
          <CardHeader>
            <CardTitle>Follow-up</CardTitle>
          </CardHeader>
          <CardContent>
            <EnquiryUpdateForm id={e.id} defaults={{ status, notes: e.notes ?? "" }} />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
