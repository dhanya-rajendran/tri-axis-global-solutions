"use server";

import { eq } from "drizzle-orm";
import { db } from "@/db";
import { legalPages } from "@/db/schema";
import { type ActionResult, dbError, fail, revalidateContent, zodFieldErrors } from "@/lib/actions";
import { requireUser } from "@/lib/auth/dal";
import { legalSchema } from "@/lib/validators";

export async function saveLegal(id: number, input: unknown): Promise<ActionResult> {
  await requireUser();
  const parsed = legalSchema.safeParse(input);
  if (!parsed.success) return fail("Please fix the highlighted fields.", zodFieldErrors(parsed.error));
  const v = parsed.data;
  try {
    await db
      .update(legalPages)
      .set({
        title: v.title,
        intro: v.intro,
        isDraft: v.isDraft,
        sections: v.sections.map((s) => ({ heading: s.heading, paragraphs: s.body.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean) })),
      })
      .where(eq(legalPages.id, id));
    revalidateContent("/legal");
    return { ok: true, message: "Page saved" };
  } catch (err) {
    return dbError(err);
  }
}
