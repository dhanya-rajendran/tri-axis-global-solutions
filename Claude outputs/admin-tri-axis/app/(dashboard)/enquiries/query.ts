import "server-only";
import { and, eq, like, or, type SQL } from "drizzle-orm";
import { enquiries } from "@/db/schema";
import { enquiryStatuses, enquiryTypes } from "@/lib/constants";

export function enquiryFilters(sp: Record<string, string | string[] | undefined>) {
  const q = typeof sp.q === "string" ? sp.q.trim() : "";
  const type = typeof sp.type === "string" && (enquiryTypes as readonly string[]).includes(sp.type) ? (sp.type as (typeof enquiryTypes)[number]) : null;
  const status = typeof sp.status === "string" && (enquiryStatuses as readonly string[]).includes(sp.status) ? (sp.status as (typeof enquiryStatuses)[number]) : null;
  const where: SQL[] = [];
  if (q) where.push(or(like(enquiries.name, `%${q}%`), like(enquiries.email, `%${q}%`), like(enquiries.company, `%${q}%`))!);
  if (type) where.push(eq(enquiries.type, type));
  if (status) where.push(eq(enquiries.status, status));
  return { cond: where.length ? and(...where) : undefined, q, type, status };
}
