/**
 * Config for the small content entities managed on /content/[entity].
 * Client-safe: schemas + field/column definitions only (tables live in entities.server.ts).
 */
import type { z } from "zod";
import { featureGroups, labels } from "@/lib/constants";
import {
  featureSchema,
  insightCategorySchema,
  locationSchema,
  processStepSchema,
  statisticSchema,
  teamMemberSchema,
  testimonialSchema,
} from "@/lib/validators";

export type FieldDef =
  | { name: string; label: string; type: "text" | "number" | "textarea" | "url"; description?: string; span?: 2 }
  | { name: string; label: string; type: "switch"; description?: string; span?: 2 }
  | { name: string; label: string; type: "icon"; span?: 2 }
  | { name: string; label: string; type: "slug"; source: string; span?: 2 }
  | { name: string; label: string; type: "select"; options: { value: string; label: string }[]; span?: 2 };

export type ColumnDef = { key: string; label: string; kind?: "text" | "bool" | "icon" | "badge"; className?: string; map?: Record<string, string> };

export type EntityKey = "locations" | "insight-categories" | "statistics" | "testimonials" | "team" | "features" | "process-steps";

export type EntityConfig = {
  title: string;
  singular: string;
  description: string;
  schema: z.ZodType;
  fields: FieldDef[];
  columns: ColumnDef[];
  defaults: Record<string, unknown>;
  groupBy?: { field: string; options: { value: string; label: string }[] };
};

const order: FieldDef = { name: "sortOrder", label: "Sort order", type: "number", description: "Lower numbers appear first" };

export const entities: Record<EntityKey, EntityConfig> = {
  locations: {
    title: "Locations",
    singular: "location",
    description: "Locations used for jobs and the website’s job search filter.",
    schema: locationSchema,
    fields: [
      { name: "label", label: "Label", type: "text" },
      { name: "slug", label: "Slug", type: "slug", source: "label" },
      order,
    ],
    columns: [{ key: "label", label: "Location" }, { key: "slug", label: "Slug", className: "font-mono text-xs" }, { key: "sortOrder", label: "Order" }],
    defaults: { label: "", slug: "", sortOrder: 10 },
  },
  "insight-categories": {
    title: "Insight categories",
    singular: "category",
    description: "Categories for articles on /insights.",
    schema: insightCategorySchema,
    fields: [
      { name: "name", label: "Name", type: "text" },
      { name: "slug", label: "Slug", type: "slug", source: "name" },
      order,
    ],
    columns: [{ key: "name", label: "Category" }, { key: "slug", label: "Slug", className: "font-mono text-xs" }, { key: "sortOrder", label: "Order" }],
    defaults: { name: "", slug: "", sortOrder: 10 },
  },
  statistics: {
    title: "Statistics",
    singular: "statistic",
    description: "Trust figures in the navy “Trusted by businesses” band.",
    schema: statisticSchema,
    fields: [
      { name: "value", label: "Value", type: "text", description: "e.g. 250" },
      { name: "suffix", label: "Suffix", type: "text", description: "e.g. + or %" },
      { name: "label", label: "Label", type: "text", span: 2 },
      { name: "isPlaceholder", label: "Placeholder", type: "switch", description: "Shows the value in [brackets] until confirmed" },
      { name: "highlight", label: "Highlight in gold", type: "switch" },
      order,
    ],
    columns: [
      { key: "value", label: "Value" },
      { key: "label", label: "Label" },
      { key: "isPlaceholder", label: "Placeholder", kind: "bool" },
      { key: "sortOrder", label: "Order" },
    ],
    defaults: { value: "", suffix: "", label: "", isPlaceholder: false, highlight: false, sortOrder: 10 },
  },
  testimonials: {
    title: "Testimonials",
    singular: "testimonial",
    description: "Client quotes. Only use approved, attributable testimonials.",
    schema: testimonialSchema,
    fields: [
      { name: "quote", label: "Quote", type: "textarea", span: 2 },
      { name: "name", label: "Name", type: "text" },
      { name: "role", label: "Role", type: "text" },
      { name: "company", label: "Company", type: "text", span: 2 },
      { name: "isPublished", label: "Published", type: "switch" },
      { name: "isPlaceholder", label: "Placeholder", type: "switch" },
      order,
    ],
    columns: [
      { key: "name", label: "Name" },
      { key: "company", label: "Company" },
      { key: "isPublished", label: "Published", kind: "bool" },
      { key: "sortOrder", label: "Order" },
    ],
    defaults: { quote: "", name: "", role: "", company: "", isPlaceholder: false, isPublished: true, sortOrder: 10 },
  },
  team: {
    title: "Team members",
    singular: "team member",
    description: "Leadership profiles on the About page.",
    schema: teamMemberSchema,
    fields: [
      { name: "name", label: "Name", type: "text" },
      { name: "role", label: "Role / title", type: "text" },
      { name: "bio", label: "Short bio", type: "textarea", span: 2 },
      { name: "imageUrl", label: "Photo URL", type: "url", span: 2 },
      { name: "linkedinUrl", label: "LinkedIn URL", type: "url", span: 2 },
      { name: "isPublished", label: "Published", type: "switch" },
      order,
    ],
    columns: [
      { key: "name", label: "Name" },
      { key: "role", label: "Role" },
      { key: "isPublished", label: "Published", kind: "bool" },
      { key: "sortOrder", label: "Order" },
    ],
    defaults: { name: "", role: "", bio: "", imageUrl: "", linkedinUrl: "", isPublished: true, sortOrder: 10 },
  },
  features: {
    title: "Feature lists",
    singular: "feature",
    description: "Icon + title + text lists used across the website (Why TriAxis, values, employer & candidate pages).",
    schema: featureSchema,
    fields: [
      { name: "group", label: "List", type: "select", options: featureGroups.map((g) => ({ value: g, label: labels.featureGroup[g] })), span: 2 },
      { name: "title", label: "Title", type: "text" },
      { name: "icon", label: "Icon", type: "icon" },
      { name: "description", label: "Description", type: "textarea", span: 2 },
      { name: "href", label: "Link (optional)", type: "text", description: "Candidate services only, e.g. /jobs" },
      { name: "ctaLabel", label: "Link label (optional)", type: "text" },
      { name: "isPublished", label: "Published", type: "switch" },
      order,
    ],
    columns: [
      { key: "icon", label: "", kind: "icon", className: "w-10" },
      { key: "title", label: "Title" },
      { key: "group", label: "List", kind: "badge", map: labels.featureGroup },
      { key: "isPublished", label: "Published", kind: "bool" },
      { key: "sortOrder", label: "Order" },
    ],
    defaults: { group: "why_triaxis", title: "", description: "", icon: "layers", href: "", ctaLabel: "", isPublished: true, sortOrder: 10 },
    groupBy: { field: "group", options: featureGroups.map((g) => ({ value: g, label: labels.featureGroup[g] })) },
  },
  "process-steps": {
    title: "Process steps",
    singular: "step",
    description: "The numbered “Our Process” timeline. The last step is highlighted in gold.",
    schema: processStepSchema,
    fields: [
      { name: "number", label: "Number", type: "text", description: "e.g. 01" },
      { name: "title", label: "Title", type: "text" },
      { name: "description", label: "Description", type: "textarea", span: 2 },
      order,
    ],
    columns: [{ key: "number", label: "#" }, { key: "title", label: "Title" }, { key: "description", label: "Description" }, { key: "sortOrder", label: "Order" }],
    defaults: { number: "", title: "", description: "", sortOrder: 10 },
  },
};

export const entityKeys = Object.keys(entities) as EntityKey[];
export const isEntityKey = (k: string): k is EntityKey => (entityKeys as string[]).includes(k);
