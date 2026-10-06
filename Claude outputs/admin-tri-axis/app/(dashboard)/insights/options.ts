import "server-only";
import { asc } from "drizzle-orm";
import { db } from "@/db";
import { insightCategories } from "@/db/schema";

export async function getCategoryOptions() {
  const rows = await db.select().from(insightCategories).orderBy(asc(insightCategories.sortOrder));
  return rows.map((r) => ({ value: String(r.id), label: r.name }));
}
