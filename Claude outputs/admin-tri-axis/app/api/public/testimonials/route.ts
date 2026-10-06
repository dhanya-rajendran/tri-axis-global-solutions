import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { testimonials } from "@/db/schema";
import { json, publicGet } from "@/lib/public/http";

export const GET = publicGet(async () => {
  const rows = await db.select().from(testimonials).where(eq(testimonials.isPublished, true)).orderBy(asc(testimonials.sortOrder));
  return json(rows.map((r) => ({ id: String(r.id), quote: r.quote, name: r.name, role: r.role, company: r.company, placeholder: r.isPlaceholder, order: r.sortOrder })));
});
