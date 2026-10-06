import "server-only";
import { revalidatePath } from "next/cache";
import type { z } from "zod";

export type ActionResult<T = undefined> =
  | { ok: true; message?: string; data?: T }
  | { ok: false; error: string; fieldErrors?: Record<string, string> };

export function fail(error: string, fieldErrors?: Record<string, string>): ActionResult<never> {
  return { ok: false, error, fieldErrors };
}

/** Flattens zod issues into { "path.to.field": message } for react-hook-form setError. */
export function zodFieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".");
    if (key && !out[key]) out[key] = issue.message;
  }
  return out;
}

/** Translates MySQL duplicate-key errors into a friendly field error. */
export function dbError(err: unknown, uniqueFields: Record<string, string> = {}): ActionResult<never> {
  const e = err as { cause?: { code?: string; sqlMessage?: string }; code?: string; sqlMessage?: string };
  const code = e?.cause?.code ?? e?.code;
  const msg = e?.cause?.sqlMessage ?? e?.sqlMessage ?? "";
  if (code === "ER_DUP_ENTRY") {
    for (const [col, field] of Object.entries(uniqueFields)) {
      if (msg.includes(col)) return fail("That value is already in use.", { [field]: "Already in use — choose another" });
    }
    return fail("A record with the same unique value already exists.");
  }
  console.error(err);
  return fail("Something went wrong while saving. Please try again.");
}

/**
 * Refreshes admin pages and notifies the public website so cached content is
 * rebuilt (website route: /api/revalidate). Fire-and-forget.
 */
export function revalidateContent(...adminPaths: string[]) {
  for (const p of adminPaths) revalidatePath(p);
  const url = process.env.WEBSITE_REVALIDATE_URL;
  const secret = process.env.WEBSITE_REVALIDATE_SECRET;
  if (url && secret) {
    fetch(url, { method: "POST", headers: { "x-revalidate-secret": secret } }).catch((err) =>
      console.warn("Website revalidation failed:", err?.message),
    );
  }
}

export const nullIfEmpty = (v: string | undefined | null) => (v && v.trim() !== "" ? v.trim() : null);
export const toId = (v: string) => (v && v !== "none" ? Number(v) : null);
