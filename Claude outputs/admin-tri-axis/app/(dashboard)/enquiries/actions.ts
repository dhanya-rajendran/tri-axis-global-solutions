"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { enquiries } from "@/db/schema";
import { type ActionResult, dbError, fail, nullIfEmpty, zodFieldErrors } from "@/lib/actions";
import { requireAdmin, requireUser } from "@/lib/auth/dal";
import { enquiryUpdateSchema } from "@/lib/validators";

export async function updateEnquiry(id: number, input: unknown): Promise<ActionResult> {
  await requireUser();
  const parsed = enquiryUpdateSchema.safeParse(input);
  if (!parsed.success) return fail("Please fix the highlighted fields.", zodFieldErrors(parsed.error));
  try {
    await db.update(enquiries).set({ status: parsed.data.status, notes: nullIfEmpty(parsed.data.notes) }).where(eq(enquiries.id, id));
    revalidatePath("/enquiries");
    revalidatePath("/");
    return { ok: true, message: "Enquiry updated" };
  } catch (err) {
    return dbError(err);
  }
}

/** Deleting personal data is restricted to admins. */
export async function deleteEnquiry(id: number): Promise<ActionResult> {
  await requireAdmin();
  try {
    await db.delete(enquiries).where(eq(enquiries.id, id));
    revalidatePath("/enquiries");
    return { ok: true, message: "Enquiry deleted" };
  } catch (err) {
    return dbError(err);
  }
}
