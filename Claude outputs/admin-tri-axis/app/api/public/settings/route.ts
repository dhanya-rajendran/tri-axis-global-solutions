import { db } from "@/db";
import { siteSettings } from "@/db/schema";
import { json, notFound, publicGet } from "@/lib/public/http";
import { mapSettings } from "@/lib/public/mappers";

export const GET = publicGet(async () => {
  const [row] = await db.select().from(siteSettings).limit(1);
  if (!row) return notFound();
  return json(mapSettings(row, (process.env.WEBSITE_URL ?? "").replace(/\/$/, "")));
});
