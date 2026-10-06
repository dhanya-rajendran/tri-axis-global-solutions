import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { services } from "@/db/schema";
import { json, notFound, publicGet } from "@/lib/public/http";
import { mapService } from "@/lib/public/mappers";

export const GET = publicGet(async (_req: Request, ctx: RouteContext<"/api/public/services/[slug]">) => {
  const { slug } = await ctx.params;
  const [row] = await db.select().from(services).where(and(eq(services.slug, slug), eq(services.isPublished, true))).limit(1);
  return row ? json(mapService(row)) : notFound();
});
