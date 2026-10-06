/**
 * POST /api/public/enquiries/{contact|employer|candidate|job-application}
 * Accepts multipart/form-data (or JSON) from the public website's forms.
 *
 * CV files: upload storage is not enabled yet, so only the file NAME is stored.
 * TODO(storage): persist the file (e.g. Vercel Blob / S3) and save its URL in cv_url.
 */
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { enquiries, jobs } from "@/db/schema";
import { enquiryTypes } from "@/lib/constants";
import { corsHeaders } from "@/lib/public/http";

type Kind = (typeof enquiryTypes)[number];

const str = (max: number) => z.string().trim().max(max).optional().default("");
const reqStr = (label: string, max: number) => z.string({ error: `${label} is required` }).trim().min(1, `${label} is required`).max(max);
const email = z.email("Enter a valid email").trim().max(190);
const phone = z.string().trim().max(40).regex(/^[+\d\s()-]*$/, "Enter a valid phone number").optional().default("");

const schemas: Record<Kind, z.ZodObject> = {
  contact: z.object({ name: reqStr("Name", 160), email, phone, company: str(190), subject: reqStr("Subject", 190), message: reqStr("Message", 5000) }),
  employer: z.object({
    name: reqStr("Name", 160), company: reqStr("Company", 190), email, phone: phone.refine((v) => v.length > 0, "Phone is required"),
    hiringNeed: reqStr("Hiring need", 190), positions: z.coerce.number({ error: "Enter the number of positions" }).int().min(1).max(500), message: str(5000),
  }),
  candidate: z.object({
    name: reqStr("Name", 160), email, phone: phone.refine((v) => v.length > 0, "Phone is required"), currentRole: reqStr("Current role", 160),
    experienceYears: z.coerce.number({ error: "Enter years of experience" }).int().min(0).max(60), preferredIndustry: reqStr("Preferred industry", 120), preferredLocation: str(120), message: str(5000),
  }),
  "job-application": z.object({
    name: reqStr("Name", 160), email, phone: phone.refine((v) => v.length > 0, "Phone is required"), message: str(5000),
    jobReference: str(40), jobTitle: str(190),
  }),
};

/* Best-effort per-instance rate limit: 8 submissions / 10 min / IP. */
const hits = new Map<string, number[]>();
function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 10 * 60 * 1000);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > 8;
}

const MAX_CV_BYTES = 4 * 1024 * 1024;
const CV_EXT = /\.(pdf|doc|docx)$/i;

function respond(origin: string | null, body: unknown, status = 200) {
  return Response.json(body, { status, headers: { ...corsHeaders(origin), "Cache-Control": "no-store" } });
}

export async function OPTIONS(request: Request) {
  return new Response(null, { status: 204, headers: corsHeaders(request.headers.get("origin")) });
}

export async function POST(request: Request, ctx: RouteContext<"/api/public/enquiries/[kind]">) {
  const origin = request.headers.get("origin");
  const { kind } = await ctx.params;
  if (!(enquiryTypes as readonly string[]).includes(kind)) return respond(origin, { ok: false, error: "Unknown form" }, 404);

  // Browser requests must come from an allowed origin.
  if (origin && !corsHeaders(origin)["Access-Control-Allow-Origin"]) return respond(origin, { ok: false, error: "Origin not allowed" }, 403);

  const ip = (request.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || "unknown";
  if (rateLimited(ip)) return respond(origin, { ok: false, error: "Too many submissions. Please try again later." }, 429);

  const len = Number(request.headers.get("content-length") ?? 0);
  if (len > 4.5 * 1024 * 1024) return respond(origin, { ok: false, error: "Submission too large (max 4 MB file)." }, 413);

  let fields: Record<string, string> = {};
  let cv: File | null = null;
  try {
    const type = request.headers.get("content-type") ?? "";
    if (type.includes("application/json")) {
      fields = Object.fromEntries(Object.entries(await request.json()).map(([k, v]) => [k, String(v ?? "")]));
    } else {
      const fd = await request.formData();
      for (const [k, v] of fd.entries()) {
        if (typeof v === "string") fields[k] = v;
        else if (k === "cv" && v.size > 0) cv = v;
      }
    }
  } catch {
    return respond(origin, { ok: false, error: "Invalid submission" }, 400);
  }

  // Honeypot: real users never fill this hidden field. Pretend success for bots.
  if (fields.website || fields.company_url) return respond(origin, { ok: true });

  const parsed = schemas[kind as Kind].safeParse(fields);
  if (!parsed.success) {
    const fieldErrors = Object.fromEntries(parsed.error.issues.map((i) => [i.path.join("."), i.message]));
    return respond(origin, { ok: false, error: "Please check the highlighted fields.", fieldErrors }, 422);
  }

  if ((kind === "candidate" || kind === "job-application") && !cv) {
    return respond(origin, { ok: false, error: "Please attach your CV.", fieldErrors: { cv: "CV is required" } }, 422);
  }
  if (cv && (!CV_EXT.test(cv.name) || cv.size > MAX_CV_BYTES)) {
    return respond(origin, { ok: false, error: "CV must be a PDF or Word file under 4 MB.", fieldErrors: { cv: "PDF or Word, max 4 MB" } }, 422);
  }

  const v = parsed.data as Record<string, string | number>;
  const core = new Set(["name", "email", "phone", "company", "subject", "message", "jobReference", "jobTitle"]);
  const details = Object.fromEntries(Object.entries(v).filter(([k, val]) => !core.has(k) && val !== "").map(([k, val]) => [k, String(val)]));
  if (kind === "job-application" && v.jobTitle) details.jobTitle = String(v.jobTitle);

  let jobId: number | null = null;
  if (v.jobReference) {
    const [job] = await db.select({ id: jobs.id }).from(jobs).where(eq(jobs.reference, String(v.jobReference))).limit(1);
    jobId = job?.id ?? null;
  }

  try {
    await db.insert(enquiries).values({
      type: kind as Kind,
      name: String(v.name),
      email: String(v.email).toLowerCase(),
      phone: v.phone ? String(v.phone) : null,
      company: v.company ? String(v.company) : null,
      subject: v.subject ? String(v.subject) : kind === "employer" ? `Hiring: ${v.hiringNeed}` : kind === "job-application" ? `Application: ${v.jobTitle || v.jobReference}` : null,
      message: v.message ? String(v.message) : null,
      details,
      jobId,
      jobReference: v.jobReference ? String(v.jobReference) : null,
      cvFileName: cv?.name.slice(0, 255) ?? null,
      cvUrl: null,
      sourceUrl: (fields.sourceUrl ?? "").slice(0, 500) || null,
      ipAddress: ip.slice(0, 64),
      userAgent: (request.headers.get("user-agent") ?? "").slice(0, 300),
    });
  } catch (err) {
    console.error("[enquiry]", err);
    return respond(origin, { ok: false, error: "We couldn't save your details. Please try again." }, 500);
  }

  return respond(origin, { ok: true });
}
