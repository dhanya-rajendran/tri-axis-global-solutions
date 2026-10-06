import type { Metadata } from "next";
import Link from "next/link";
import { asc } from "drizzle-orm";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader } from "@/components/shared/PageHeader";
import { TableCard } from "@/components/shared/TableCard";
import { db } from "@/db";
import { legalPages } from "@/db/schema";
import { requireUser } from "@/lib/auth/dal";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Legal pages" };

export default async function LegalListPage() {
  await requireUser();
  const rows = await db.select().from(legalPages).orderBy(asc(legalPages.title));
  return (
    <>
      <PageHeader title="Legal pages" description="Privacy policy, terms and cookie policy. Have legal counsel review before removing the draft notice." />
      <TableCard>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Page</TableHead>
              <TableHead>URL</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((p) => (
              <TableRow key={p.id}>
                <TableCell>
                  <Link href={`/legal/${p.id}`} className="font-medium hover:underline">
                    {p.title}
                  </Link>
                </TableCell>
                <TableCell className="font-mono text-xs">/{p.slug}</TableCell>
                <TableCell>{formatDate(p.updatedAt)}</TableCell>
                <TableCell>{p.isDraft ? <Badge variant="warning">Draft notice</Badge> : <Badge variant="success">Approved</Badge>}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableCard>
    </>
  );
}
