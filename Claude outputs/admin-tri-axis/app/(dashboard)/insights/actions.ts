"use server";

import { eq } from "drizzle-orm";
import { db } from "@/db";
import { insights } from "@/db/schema";
import { type ActionResult, dbError, fail, nullIfEmpty, revalidateContent, toId, zodFieldErrors } from "@/lib/actions";
import { requireUser } from "@/lib/auth/dal";
import { toContentBlocks } from "@/lib/content-blocks";
import { insightSchema } from "@/lib/validators";

export async function saveInsight(id: number | null, input: unknown): Promise<ActionResult<{ id: number }>> {
  await requireUser();
  const parsed = insightSchema.safeParse(input);
  if (!parsed.success) return fail("Please fix the highlighted fields.", zodFieldErrors(parsed.error));
  const v = parsed.data;
  const content = toContentBlocks(v.content);
  if (!content.length) return fail("Add some content.", { content: "Add at least one block with text" });
  const row = {
    title: v.title, slug: v.slug, excerpt: v.excerpt, imageUrl: nullIfEmpty(v.imageUrl), imageAlt: nullIfEmpty(v.imageAlt),
    categoryId: toId(v.categoryId), authorName: v.authorName, authorRole: nullIfEmpty(v.authorRole), publishedAt: v.publishedAt,
    readingMinutes: v.readingMinutes, content, featured: v.featured, status: v.status, downloadLabel: nullIfEmpty(v.downloadLabel),
    downloadUrl: nullIfEmpty(v.downloadUrl), seoTitle: nullIfEmpty(v.seoTitle), seoDescription: nullIfEmpty(v.seoDescription),
  };
  try {
    let savedId = id;
    if (id) await db.update(insights).set(row).where(eq(insights.id, id));
    else savedId = (await db.insert(insights).values(row).$returningId())[0].id;
    revalidateContent("/insights", "/");
    return { ok: true, message: id ? "Article updated" : "Article created", data: { id: savedId! } };
  } catch (err) {
    return dbError(err, { slug: "slug" });
  }
}

export async function deleteInsight(id: number): Promise<ActionResult> {
  await requireUser();
  try {
    await db.delete(insights).where(eq(insights.id, id));
    revalidateContent("/insights", "/");
    return { ok: true, message: "Article deleted" };
  } catch (err) {
    return dbError(err);
  }
}
