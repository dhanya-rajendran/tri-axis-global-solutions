import type { Metadata } from "next";
import Link from "next/link";
import { asc, count, eq } from "drizzle-orm";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DeleteButton } from "@/components/shared/DeleteButton";
import { PageHeader } from "@/components/shared/PageHeader";
import { PublishedBadge } from "@/components/shared/StatusBadge";
import { TableCard } from "@/components/shared/TableCard";
import { db } from "@/db";
import { industries, jobs } from "@/db/schema";
import { requireUser } from "@/lib/auth/dal";
import { IconPreview } from "@/lib/icons";
import { deleteIndustry } from "./actions";

export const metadata: Metadata = { title: "Industries" };

export default async function IndustriesPage() {
  await requireUser();
  const rows = await db
    .select({ id: industries.id, name: industries.name, slug: industries.slug, icon: industries.icon, sortOrder: industries.sortOrder, isPublished: industries.isPublished, jobCount: count(jobs.id) })
    .from(industries)
    .leftJoin(jobs, eq(jobs.industryId, industries.id))
    .groupBy(industries.id)
    .orderBy(asc(industries.sortOrder), asc(industries.name));
  return (
    <>
      <PageHeader
        title="Industries"
        description="Industry grid, industry pages and the job search industry filter."
        actions={
          <Button asChild>
            <Link href="/industries/new">
              <Plus /> New industry
            </Link>
          </Button>
        }
      />
      <TableCard>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Industry</TableHead>
              <TableHead className="hidden sm:table-cell">Jobs</TableHead>
              <TableHead className="hidden sm:table-cell">Order</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-12" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((i) => (
              <TableRow key={i.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <span className="bg-primary/5 text-primary inline-flex size-9 items-center justify-center rounded-md">
                      <IconPreview name={i.icon} />
                    </span>
                    <div>
                      <Link href={`/industries/${i.id}`} className="font-medium hover:underline">
                        {i.name}
                      </Link>
                      <p className="text-muted-foreground text-xs">/industries/{i.slug}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  <Link href={`/jobs?industry=${i.id}`} className="hover:underline">
                    {i.jobCount}
                  </Link>
                </TableCell>
                <TableCell className="hidden sm:table-cell">{i.sortOrder}</TableCell>
                <TableCell>
                  <PublishedBadge published={i.isPublished} />
                </TableCell>
                <TableCell>
                  <DeleteButton action={deleteIndustry.bind(null, i.id)} itemLabel={`“${i.name}”`} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableCard>
    </>
  );
}
