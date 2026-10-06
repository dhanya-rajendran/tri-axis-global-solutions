import { and, asc, eq, type SQL } from "drizzle-orm";
import { db } from "@/db";
import { features } from "@/db/schema";
import { featureGroups } from "@/lib/constants";
import { json, publicGet } from "@/lib/public/http";

/** GET /api/public/features?group=why_triaxis — omit group to get every list keyed by group. */
export const GET = publicGet(async (request: Request) => {
  const group = new URL(request.url).searchParams.get("group");
  const conds: SQL[] = [eq(features.isPublished, true)];
  if (group && (featureGroups as readonly string[]).includes(group)) conds.push(eq(features.group, group as (typeof featureGroups)[number]));
  const rows = await db.select().from(features).where(and(...conds)).orderBy(asc(features.sortOrder));
  const mapped = rows.map((r) => ({
    id: String(r.id), group: r.group, title: r.title, description: r.description, icon: r.icon,
    ...(r.href ? { href: r.href } : {}), ...(r.ctaLabel ? { cta: r.ctaLabel } : {}),
  }));
  if (group) return json(mapped);
  const byGroup = Object.fromEntries(featureGroups.map((g) => [g, mapped.filter((m) => m.group === g)]));
  return json(byGroup);
});
