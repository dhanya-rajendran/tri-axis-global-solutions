import { eq } from "drizzle-orm";
import { db } from "@/db";
import { legalPages } from "@/db/schema";
import { json, notFound, publicGet } from "@/lib/public/http";

export const GET = publicGet(async (_req: Request, ctx: RouteContext<"/api/public/legal/[slug]">) => {
  const { slug } = await ctx.params;
  const [r] = await db.select().from(legalPages).where(eq(legalPages.slug, slug)).limit(1);
  if (!r) return notFound();
  return json({ slug: r.slug, title: r.title, updatedAt: r.updatedAt.toISOString().slice(0, 10), intro: r.intro, sections: r.sections, isDraft: r.isDraft });
});
