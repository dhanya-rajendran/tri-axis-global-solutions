import type { IconName, SeoFields } from "./common";

export interface Industry extends SeoFields {
  id: string;
  slug: string;
  name: string;
  /** Short label for compact grids. */
  shortName?: string;
  icon: IconName;
  summary: string;
  description: string;
  roles: string[];
  order: number;
}
