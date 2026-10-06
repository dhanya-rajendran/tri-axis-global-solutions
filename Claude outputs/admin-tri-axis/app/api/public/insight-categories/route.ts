import { asc } from "drizzle-orm";
import { db } from "@/db";
import { insightCategories } from "@/db/schema";
import { json, publicGet } from "@/lib/public/http";

export const GET = publicGet(async () => {
  const rows = await db.select().from(insightCategories).orderBy(asc(insightCategories.sortOrder));
  return json(rows.map((c) => ({ slug: c.slug, name: c.name })));
});
