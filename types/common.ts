/** Shared primitives used across content entities. */

/** Key into the icon registry (components/ui/Icon.tsx). Kept as a string so CMS data stays serialisable. */
export type IconName = string;

export interface ImageAsset {
  src: string;
  alt: string;
  width: number;
  height: number;
  /** True while the file is generated placeholder artwork awaiting approved photography. */
  placeholder?: boolean;
  /** Art-direction brief for the production photo that should replace the placeholder. */
  brief?: string;
}

export interface SeoFields {
  seoTitle?: string;
  seoDescription?: string;
}

export interface Cta {
  label: string;
  href: string;
}

/** Simple rich-text block model — easy to map from a headless CMS / admin editor. */
export type ContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "list"; items: string[] }
  | { type: "quote"; text: string; cite?: string };
