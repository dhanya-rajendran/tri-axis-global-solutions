/**
 * FORM SUBMISSION SERVICE
 * ---------------------------------------------------------------------------
 * All forms submit through `submitEnquiry()`. Phase 2: set
 * NEXT_PUBLIC_FORMS_ENDPOINT to the admin API base URL (e.g.
 * https://admin-api.example.com/v1/enquiries). The payload is POSTed as
 * multipart/form-data to `${endpoint}/${kind}` so CV uploads work unchanged.
 *
 * Until an endpoint is configured, submissions run in MOCK MODE: nothing is
 * sent or stored, and the result is flagged `mock: true` so the UI can say so.
 */
import type { EnquiryKind, SubmissionResult } from "@/types/forms";

const endpoint = process.env.NEXT_PUBLIC_FORMS_ENDPOINT?.replace(/\/$/, "");

export const isMockSubmission = !endpoint;

export async function submitEnquiry(kind: EnquiryKind, data: FormData): Promise<SubmissionResult> {
  data.set("enquiryType", kind);
  data.set("submittedAt", new Date().toISOString());
  data.set("sourceUrl", typeof window !== "undefined" ? window.location.href : "");

  if (!endpoint) {
    // TODO(phase-2): remove once the admin API endpoint is available.
    await new Promise((resolve) => setTimeout(resolve, 700));
    if (process.env.NODE_ENV !== "production") {
      console.info(`[mock submission] ${kind}`, Object.fromEntries(data.entries()));
    }
    return { ok: true, mock: true };
  }

  try {
    const res = await fetch(`${endpoint}/${kind}`, { method: "POST", body: data });
    if (!res.ok) return { ok: false, mock: false, message: "We couldn't send your details. Please try again." };
    return { ok: true, mock: false };
  } catch {
    return { ok: false, mock: false, message: "Network error. Please check your connection and try again." };
  }
}
