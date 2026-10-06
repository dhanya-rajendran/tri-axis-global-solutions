import { asc } from "drizzle-orm";
import { db } from "@/db";
import { statistics } from "@/db/schema";
import { json, publicGet } from "@/lib/public/http";

export const GET = publicGet(async () => {
  const rows = await db.select().from(statistics).orderBy(asc(statistics.sortOrder));
  return json(
    rows.map((r) => ({
      id: String(r.id), value: r.value, ...(r.suffix ? { suffix: r.suffix } : {}), label: r.label,
      placeholder: r.isPlaceholder, highlight: r.highlight, order: r.sortOrder,
    })),
  );
});
