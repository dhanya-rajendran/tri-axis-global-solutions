import { and, desc, eq, type SQL } from "drizzle-orm";
import { insightCategories, insights } from "@/db/schema";
import { json, publicGet } from "@/lib/public/http";
import { mapInsight } from "@/lib/public/mappers";
import { flattenInsight, insightsQuery } from "@/lib/public/queries";

/** GET /api/public/insights?category=&limit=&featured=1 */
export const GET = publicGet(async (request: Request) => {
  const sp = new URL(request.url).searchParams;
  const conds: SQL[] = [eq(insights.status, "published")];
  const category = sp.get("category");
  if (category) conds.push(eq(insightCategories.slug, category));
  if (sp.get("featured") === "1") conds.push(eq(insights.featured, true));
  const limit = Math.min(Number(sp.get("limit")) || 100, 200);
  const rows = await insightsQuery().where(and(...conds)).orderBy(desc(insights.publishedAt), desc(insights.id)).limit(limit);
  return json(rows.map((r) => mapInsight(flattenInsight(r))));
});
