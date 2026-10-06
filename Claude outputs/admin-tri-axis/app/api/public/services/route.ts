import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { services } from "@/db/schema";
import { json, publicGet } from "@/lib/public/http";
import { mapService } from "@/lib/public/mappers";

export const GET = publicGet(async () => {
  const rows = await db.select().from(services).where(eq(services.isPublished, true)).orderBy(asc(services.sortOrder));
  return json(rows.map(mapService));
});
