import type { IconName } from "./common";

/** Generic icon + title + text item (value propositions, benefits, etc.). */
export interface Feature {
  id: string;
  title: string;
  description: string;
  icon: IconName;
}

export interface ProcessStep {
  id: string;
  number: string;
  title: string;
  description: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio?: string;
  image?: string;
  order: number;
}

export interface LegalDocument {
  slug: string;
  title: string;
  updatedAt: string;
  intro: string;
  sections: { heading: string; paragraphs: string[] }[];
}
