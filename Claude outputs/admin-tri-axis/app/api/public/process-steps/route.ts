import { asc } from "drizzle-orm";
import { db } from "@/db";
import { processSteps } from "@/db/schema";
import { json, publicGet } from "@/lib/public/http";

export const GET = publicGet(async () => {
  const rows = await db.select().from(processSteps).orderBy(asc(processSteps.sortOrder));
  return json(rows.map((r) => ({ id: String(r.id), number: r.number, title: r.title, description: r.description })));
});
