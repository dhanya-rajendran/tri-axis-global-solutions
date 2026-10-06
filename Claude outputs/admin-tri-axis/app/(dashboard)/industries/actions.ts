"use server";

import { eq } from "drizzle-orm";
import { db } from "@/db";
import { industries } from "@/db/schema";
import { type ActionResult, dbError, fail, nullIfEmpty, revalidateContent, zodFieldErrors } from "@/lib/actions";
import { requireUser } from "@/lib/auth/dal";
import { industrySchema } from "@/lib/validators";

export async function saveIndustry(id: number | null, input: unknown): Promise<ActionResult<{ id: number }>> {
  await requireUser();
  const parsed = industrySchema.safeParse(input);
  if (!parsed.success) return fail("Please fix the highlighted fields.", zodFieldErrors(parsed.error));
  const v = parsed.data;
  const row = {
    name: v.name, slug: v.slug, shortName: nullIfEmpty(v.shortName), icon: v.icon, summary: v.summary, description: v.description,
    roles: v.roles, sortOrder: v.sortOrder, isPublished: v.isPublished, seoTitle: nullIfEmpty(v.seoTitle), seoDescription: nullIfEmpty(v.seoDescription),
  };
  try {
    let savedId = id;
    if (id) await db.update(industries).set(row).where(eq(industries.id, id));
    else savedId = (await db.insert(industries).values(row).$returningId())[0].id;
    revalidateContent("/industries");
    return { ok: true, message: id ? "Industry updated" : "Industry created", data: { id: savedId! } };
  } catch (err) {
    return dbError(err, { slug: "slug" });
  }
}

export async function deleteIndustry(id: number): Promise<ActionResult> {
  await requireUser();
  try {
    await db.delete(industries).where(eq(industries.id, id));
    revalidateContent("/industries", "/jobs");
    return { ok: true, message: "Industry deleted. Jobs in this industry now have no industry set." };
  } catch (err) {
    return dbError(err);
  }
}
