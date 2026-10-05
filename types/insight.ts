import type { ContentBlock, ImageAsset, SeoFields } from "./common";

export interface InsightCategory {
  slug: string;
  name: string;
}

export interface Author {
  name: string;
  role: string;
}

export interface Insight extends SeoFields {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  image: ImageAsset;
  category: InsightCategory;
  author: Author;
  publishedAt: string; // ISO date
  updatedAt?: string;
  readingMinutes: number;
  content: ContentBlock[];
  featured: boolean;
  /** Optional gated download (e.g. salary report). */
  download?: { label: string; href: string | null };
}
