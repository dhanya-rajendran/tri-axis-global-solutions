import { and, eq, ne } from "drizzle-orm";
import { jobs } from "@/db/schema";
import { json, notFound, publicGet } from "@/lib/public/http";
import { mapJob } from "@/lib/public/mappers";
import { flattenJob, jobsQuery } from "@/lib/public/queries";

/** Open and closed jobs are returned (closed pages can show "no longer available"); drafts never are. */
export const GET = publicGet(async (_req: Request, ctx: RouteContext<"/api/public/jobs/[slug]">) => {
  const { slug } = await ctx.params;
  const [row] = await jobsQuery().where(and(eq(jobs.slug, slug), ne(jobs.status, "draft"))).limit(1);
  return row ? json(mapJob(flattenJob(row)), { maxAge: 30 }) : notFound();
});
