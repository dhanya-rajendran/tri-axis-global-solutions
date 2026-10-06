import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { DeleteButton } from "@/components/shared/DeleteButton";
import { PageHeader } from "@/components/shared/PageHeader";
import { db } from "@/db";
import { insights } from "@/db/schema";
import { requireUser } from "@/lib/auth/dal";
import { fromContentBlocks } from "@/lib/content-blocks";
import { deleteInsight } from "../actions";
import { InsightForm } from "../InsightForm";
import { getCategoryOptions } from "../options";

export const metadata: Metadata = { title: "Edit article" };

export default async function EditInsightPage({ params }: PageProps<"/insights/[id]">) {
  await requireUser();
  const id = Number((await params).id);
  if (!Number.isInteger(id)) notFound();
  const [a] = await db.select().from(insights).where(eq(insights.id, id)).limit(1);
  if (!a) notFound();
  return (
    <>
      <PageHeader
        title={a.title}
        back={{ href: "/insights", label: "Insights" }}
        actions={<DeleteButton action={deleteInsight.bind(null, a.id)} itemLabel="this article" redirectTo="/insights" variant="button" />}
      />
      <InsightForm
        id={a.id}
        categories={await getCategoryOptions()}
        defaults={{
          title: a.title, slug: a.slug, excerpt: a.excerpt, imageUrl: a.imageUrl ?? "", imageAlt: a.imageAlt ?? "",
          categoryId: a.categoryId ? String(a.categoryId) : "none", authorName: a.authorName, authorRole: a.authorRole ?? "",
          publishedAt: a.publishedAt, readingMinutes: a.readingMinutes, content: fromContentBlocks(a.content), featured: a.featured,
          status: a.status, downloadLabel: a.downloadLabel ?? "", downloadUrl: a.downloadUrl ?? "", seoTitle: a.seoTitle ?? "", seoDescription: a.seoDescription ?? "",
        }}
      />
    </>
  );
}
