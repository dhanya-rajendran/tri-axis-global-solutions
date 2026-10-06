import "server-only";
import type { MySqlTable } from "drizzle-orm/mysql-core";
import { features, insightCategories, locations, processSteps, statistics, teamMembers, testimonials } from "@/db/schema";
import type { EntityKey } from "./entities";

export const entityTables: Record<EntityKey, MySqlTable> = {
  locations,
  "insight-categories": insightCategories,
  statistics,
  testimonials,
  team: teamMembers,
  features,
  "process-steps": processSteps,
};

/** Unique columns per entity → form field (for duplicate-key messages). */
export const entityUnique: Partial<Record<EntityKey, Record<string, string>>> = {
  locations: { slug: "slug" },
  "insight-categories": { slug: "slug" },
};

/** Optional text fields stored as NULL when blank. */
export const entityNullable: Partial<Record<EntityKey, string[]>> = {
  statistics: ["suffix"],
  team: ["bio", "imageUrl", "linkedinUrl"],
  features: ["href", "ctaLabel"],
};
