import type { Metadata } from "next";
import Link from "next/link";
import { and, count, desc, eq, like, type SQL } from "drizzle-orm";
import { Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DeleteButton } from "@/components/shared/DeleteButton";
import { EmptyState } from "@/components/shared/EmptyState";
import { ListToolbar } from "@/components/shared/ListToolbar";
import { PageHeader } from "@/components/shared/PageHeader";
import { Pagination, parsePage } from "@/components/shared/Pagination";
import { TableCard } from "@/components/shared/TableCard";
import { db } from "@/db";
import { insightCategories, insights } from "@/db/schema";
import { requireUser } from "@/lib/auth/dal";
import { formatDate } from "@/lib/utils";
import { deleteInsight } from "./actions";

export const metadata: Metadata = { title: "Insights" };
const PAGE_SIZE = 20;

export default async function InsightsPage({ searchParams }: PageProps<"/insights">) {
  await requireUser();
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q.trim() : "";
  const status = sp.status === "draft" || sp.status === "published" ? sp.status : null;
  const page = parsePage(sp.page);
  const where: SQL[] = [];
  if (q) where.push(like(insights.title, `%${q}%`));
  if (status) where.push(eq(insights.status, status));
  const cond = where.length ? and(...where) : undefined;

  const [rows, [{ n }]] = await Promise.all([
    db
      .select({ id: insights.id, title: insights.title, slug: insights.slug, status: insights.status, featured: insights.featured, publishedAt: insights.publishedAt, category: insightCategories.name })
      .from(insights)
      .leftJoin(insightCategories, eq(insights.categoryId, insightCategories.id))
      .where(cond)
      .orderBy(desc(insights.publishedAt))
      .limit(PAGE_SIZE)
      .offset((page - 1) * PAGE_SIZE),
    db.select({ n: count() }).from(insights).where(cond),
  ]);

  return (
    <>
      <PageHeader
        title="Insights"
        description="Articles, guides and reports on /insights."
        actions={
          <>
            <Button variant="outline" asChild>
              <Link href="/content/insight-categories">Categories</Link>
            </Button>
            <Button asChild>
              <Link href="/insights/new">
                <Plus /> New article
              </Link>
            </Button>
          </>
        }
      />
      <ListToolbar placeholder="Search titles" filters={[{ name: "status", label: "Statuses", options: [{ value: "published", label: "Published" }, { value: "draft", label: "Draft" }] }]} />
      {rows.length === 0 ? (
        <EmptyState title="No articles found" />
      ) : (
        <TableCard>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead className="hidden md:table-cell">Category</TableHead>
                <TableHead className="hidden sm:table-cell">Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((a) => (
                <TableRow key={a.id}>
                  <TableCell className="max-w-md">
                    <Link href={`/insights/${a.id}`} className="font-medium hover:underline">
                      {a.title}
                    </Link>
                    {a.featured && <Badge variant="gold" className="ml-2">Featured</Badge>}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{a.category ?? "—"}</TableCell>
                  <TableCell className="hidden sm:table-cell">{formatDate(a.publishedAt)}</TableCell>
                  <TableCell>{a.status === "published" ? <Badge variant="success">Published</Badge> : <Badge variant="warning">Draft</Badge>}</TableCell>
                  <TableCell>
                    <DeleteButton action={deleteInsight.bind(null, a.id)} itemLabel="this article" />
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
