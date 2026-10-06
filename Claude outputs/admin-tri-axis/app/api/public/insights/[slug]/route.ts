import { and, eq } from "drizzle-orm";
import { insights } from "@/db/schema";
import { json, notFound, publicGet } from "@/lib/public/http";
import { mapInsight } from "@/lib/public/mappers";
import { flattenInsight, insightsQuery } from "@/lib/public/queries";

export const GET = publicGet(async (_req: Request, ctx: RouteContext<"/api/public/insights/[slug]">) => {
  const { slug } = await ctx.params;
  const [row] = await insightsQuery().where(and(eq(insights.slug, slug), eq(insights.status, "published"))).limit(1);
  return row ? json(mapInsight(flattenInsight(row))) : notFound();
});
