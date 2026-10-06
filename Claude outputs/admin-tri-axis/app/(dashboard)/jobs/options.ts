import "server-only";
import { asc } from "drizzle-orm";
import { db } from "@/db";
import { industries, locations } from "@/db/schema";

export async function getJobOptions() {
  const [locs, inds] = await Promise.all([
    db.select({ id: locations.id, label: locations.label }).from(locations).orderBy(asc(locations.sortOrder), asc(locations.label)),
    db.select({ id: industries.id, label: industries.name }).from(industries).orderBy(asc(industries.sortOrder), asc(industries.name)),
  ]);
  return {
    locations: locs.map((l) => ({ value: String(l.id), label: l.label })),
    industries: inds.map((i) => ({ value: String(i.id), label: i.label })),
  };
}
