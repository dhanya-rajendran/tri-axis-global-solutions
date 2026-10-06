"use server";

import { eq } from "drizzle-orm";
import { db } from "@/db";
import { services, type ContentBlock } from "@/db/schema";
import { type ActionResult, dbError, fail, nullIfEmpty, revalidateContent, zodFieldErrors } from "@/lib/actions";
import { requireUser } from "@/lib/auth/dal";
import { toContentBlocks } from "@/lib/content-blocks";
import { serviceSchema } from "@/lib/validators";

export async function saveService(id: number | null, input: unknown): Promise<ActionResult<{ id: number }>> {
  await requireUser();
  const parsed = serviceSchema.safeParse(input);
  if (!parsed.success) return fail("Please fix the highlighted fields.", zodFieldErrors(parsed.error));
  const v = parsed.data;
  const row = {
    title: v.title,
    slug: v.slug,
    shortTitle: v.shortTitle,
    summary: v.summary,
    intro: v.intro,
    icon: v.icon,
    imageUrl: nullIfEmpty(v.imageUrl),
    imageAlt: nullIfEmpty(v.imageAlt),
    ctaLabel: v.ctaLabel,
    category: v.category,
    offerings: v.offerings,
    body: toContentBlocks(v.body) as ContentBlock[],
    sortOrder: v.sortOrder,
    isPublished: v.isPublished,
    seoTitle: nullIfEmpty(v.seoTitle),
    seoDescription: nullIfEmpty(v.seoDescription),
  };
  try {
    let savedId = id;
    if (id) await db.update(services).set(row).where(eq(services.id, id));
    else savedId = (await db.insert(services).values(row).$returningId())[0].id;
    revalidateContent("/services");
    return { ok: true, message: id ? "Service updated" : "Service created", data: { id: savedId! } };
  } catch (err) {
    return dbError(err, { slug: "slug" });
  }
}

export async function deleteService(id: number): Promise<ActionResult> {
  await requireUser();
  try {
    await db.delete(services).where(eq(services.id, id));
    revalidateContent("/services");
    return { ok: true, message: "Service deleted" };
  } catch (err) {
    return dbError(err);
  }
}
