import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { industries } from "@/db/schema";
import { json, publicGet } from "@/lib/public/http";
import { mapIndustry } from "@/lib/public/mappers";

export const GET = publicGet(async () => {
  const rows = await db.select().from(industries).where(eq(industries.isPublished, true)).orderBy(asc(industries.sortOrder), asc(industries.name));
  return json(rows.map(mapIndustry));
});
