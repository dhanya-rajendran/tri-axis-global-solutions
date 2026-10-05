import type { ContentBlock, IconName, ImageAsset, SeoFields } from "./common";

export interface ServiceOffering {
  title: string;
  description: string;
  icon: IconName;
}

export interface Service extends SeoFields {
  id: string;
  slug: string;
  title: string;
  shortTitle: string;
  /** Card copy. */
  summary: string;
  /** Detail page intro. */
  intro: string;
  icon: IconName;
  image: ImageAsset;
  ctaLabel: string;
  offerings: ServiceOffering[];
  body: ContentBlock[];
  order: number;
  category: "recruitment" | "business";
}
