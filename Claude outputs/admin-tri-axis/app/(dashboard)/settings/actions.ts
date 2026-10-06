"use server";

import { eq } from "drizzle-orm";
import { db } from "@/db";
import { siteSettings } from "@/db/schema";
import { type ActionResult, dbError, fail, nullIfEmpty, revalidateContent, zodFieldErrors } from "@/lib/actions";
import { requireUser } from "@/lib/auth/dal";
import { settingsSchema } from "@/lib/validators";

export async function saveSettings(input: unknown): Promise<ActionResult> {
  await requireUser();
  const parsed = settingsSchema.safeParse(input);
  if (!parsed.success) return fail("Please fix the highlighted fields.", zodFieldErrors(parsed.error));
  const v = parsed.data;
  const row = {
    ...v,
    countryCode: v.countryCode.toUpperCase(),
    phoneHref: nullIfEmpty(v.phoneHref),
    whatsapp: nullIfEmpty(v.whatsapp),
    addressLine2: nullIfEmpty(v.addressLine2),
    mapEmbedUrl: nullIfEmpty(v.mapEmbedUrl),
    defaultOgImage: nullIfEmpty(v.defaultOgImage),
    mission: nullIfEmpty(v.mission),
    vision: nullIfEmpty(v.vision),
  };
  try {
    const [existing] = await db.select({ id: siteSettings.id }).from(siteSettings).limit(1);
    if (existing) await db.update(siteSettings).set(row).where(eq(siteSettings.id, existing.id));
    else await db.insert(siteSettings).values({ id: 1, ...row });
    revalidateContent("/settings");
    return { ok: true, message: "Settings saved" };
  } catch (err) {
    return dbError(err);
  }
}
