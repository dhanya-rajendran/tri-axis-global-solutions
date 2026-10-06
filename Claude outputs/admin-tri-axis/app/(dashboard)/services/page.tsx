import type { Metadata } from "next";
import Link from "next/link";
import { asc } from "drizzle-orm";
import { Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DeleteButton } from "@/components/shared/DeleteButton";
import { EmptyState } from "@/components/shared/EmptyState";
import { PageHeader } from "@/components/shared/PageHeader";
import { PublishedBadge } from "@/components/shared/StatusBadge";
import { TableCard } from "@/components/shared/TableCard";
import { db } from "@/db";
import { services } from "@/db/schema";
import { requireUser } from "@/lib/auth/dal";
import { IconPreview } from "@/lib/icons";
import { deleteService } from "./actions";

export const metadata: Metadata = { title: "Services" };

export default async function ServicesPage() {
  await requireUser();
  const rows = await db.select().from(services).orderBy(asc(services.sortOrder), asc(services.title));
  return (
    <>
      <PageHeader
        title="Services"
        description="Service cards and detail pages (/services/…)."
        actions={
          <Button asChild>
            <Link href="/services/new">
              <Plus /> New service
            </Link>
          </Button>
        }
      />
      {rows.length === 0 ? (
        <EmptyState title="No services yet" />
      ) : (
        <TableCard>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service</TableHead>
                <TableHead className="hidden md:table-cell">Category</TableHead>
                <TableHead className="hidden sm:table-cell">Order</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((s) => (
                <TableRow key={s.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <span className="bg-teal/10 text-teal inline-flex size-9 items-center justify-center rounded-md">
                        <IconPreview name={s.icon} />
                      </span>
                      <div>
                        <Link href={`/services/${s.id}`} className="font-medium hover:underline">
                          {s.title}
                        </Link>
                        <p className="text-muted-foreground text-xs">/services/{s.slug}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden capitalize md:table-cell">
                    <Badge variant="outline">{s.category}</Badge>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">{s.sortOrder}</TableCell>
                  <TableCell>
                    <PublishedBadge published={s.isPublished} />
                  </TableCell>
                  <TableCell>
                    <DeleteButton action={deleteService.bind(null, s.id)} itemLabel={`“${s.title}”`} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableCard>
      )}
    </>
  );
}
