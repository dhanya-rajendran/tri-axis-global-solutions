export type SocialPlatform = "linkedin" | "instagram" | "facebook" | "x" | "youtube";

export interface SocialLink {
  platform: SocialPlatform;
  label: string;
  href: string;
}

export interface Address {
  line1: string;
  line2?: string;
  city: string;
  emirate: string;
  country: string;
  countryCode: string;
  postalCode?: string;
}

export interface SiteSettings {
  name: string;
  legalName: string;
  shortName: string;
  tagline: string;
  description: string;
  url: string;
  locale: string;
  foundingYear: number | null;
  contact: {
    email: string;
    careersEmail: string;
    phone: string;
    /** tel: href once a confirmed number exists. */
    phoneHref: string | null;
    whatsapp: string | null;
    address: Address;
    workingHours: { days: string; hours: string }[];
    /** Google Maps embed URL once the office location is confirmed. */
    mapEmbedUrl: string | null;
  };
  social: SocialLink[];
  defaultOgImage: string;
}
