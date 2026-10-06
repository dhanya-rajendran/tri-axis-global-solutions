import { desc } from "drizzle-orm";
import { db } from "@/db";
import { enquiries } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth/dal";
import { enquiryFilters } from "../query";

const csvCell = (v: unknown) => {
  const s = v == null ? "" : typeof v === "object" ? JSON.stringify(v) : String(v);
  // Neutralise spreadsheet formula injection and escape quotes.
  const safe = /^[=+\-@]/.test(s) ? `'${s}` : s;
  return `"${safe.replace(/"/g, '""')}"`;
};

export async function GET(request: Request) {
  const user = await getCurrentUser();
  if (!user) return new Response("Unauthorized", { status: 401 });
  const sp = Object.fromEntries(new URL(request.url).searchParams);
  const { cond } = enquiryFilters(sp);
  const rows = await db.select().from(enquiries).where(cond).orderBy(desc(enquiries.createdAt)).limit(5000);
  const header = ["id", "type", "status", "name", "email", "phone", "company", "subject", "message", "details", "jobReference", "cvFileName", "createdAt", "notes"];
  const lines = [header.join(","), ...rows.map((r) => header.map((h) => csvCell(r[h as keyof typeof r])).join(","))];
  return new Response("﻿" + lines.join("\r\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="triaxis-enquiries-${new Date().toISOString().slice(0, 10)}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
