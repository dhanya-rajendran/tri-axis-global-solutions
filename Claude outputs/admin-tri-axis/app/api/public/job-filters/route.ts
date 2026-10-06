import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { industries, locations } from "@/db/schema";
import { employmentTypes, experienceLevels, labels } from "@/lib/constants";
import { json, publicGet } from "@/lib/public/http";

export const GET = publicGet(async () => {
  const [locs, inds] = await Promise.all([
    db.select().from(locations).orderBy(asc(locations.sortOrder), asc(locations.label)),
    db.select().from(industries).where(eq(industries.isPublished, true)).orderBy(asc(industries.sortOrder), asc(industries.name)),
  ]);
  return json({
    locations: locs.map((l) => ({ value: l.slug, label: l.label })),
    industries: inds.map((i) => ({ value: i.slug, label: i.name })),
    types: employmentTypes.map((t) => ({ value: t, label: labels.employmentType[t] })),
    experience: experienceLevels.map((e) => ({ value: e, label: labels.experienceLevel[e] })),
  });
});
