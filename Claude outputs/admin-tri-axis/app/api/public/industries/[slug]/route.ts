import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { industries } from "@/db/schema";
import { json, notFound, publicGet } from "@/lib/public/http";
import { mapIndustry } from "@/lib/public/mappers";

export const GET = publicGet(async (_req: Request, ctx: RouteContext<"/api/public/industries/[slug]">) => {
  const { slug } = await ctx.params;
  const [row] = await db.select().from(industries).where(and(eq(industries.slug, slug), eq(industries.isPublished, true))).limit(1);
  return row ? json(mapIndustry(row)) : notFound();
});
