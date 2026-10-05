import type { SiteSettings } from "@/types/site";

/**
 * Central site settings.
 *
 * Phase 2: this object maps 1:1 to the "Site Settings" entity in the admin
 * repository. `getSiteSettings()` in lib/services/api.ts is the only consumer
 * the UI should use, so swapping to an API response requires no UI changes.
 *
 * Values wrapped in [brackets] are placeholders awaiting confirmed details.
 */
export const siteConfig: SiteSettings = {
  name: "TriAxis Global Solutions",
  legalName: "TriAxis Global Solutions FZE",
  shortName: "TriAxis",
  tagline: "Connecting Talent, Trade & Technology",
  description:
    "TriAxis Global Solutions is a UAE-based recruitment, talent management and business solutions company connecting employers with the people, expertise and supply partners they need to grow.",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.triaxisglobal.ae").replace(/\/$/, ""),
  locale: "en_AE",
  foundingYear: null,
  contact: {
    email: "info@triaxisglobal.ae",
    careersEmail: "careers@triaxisglobal.ae",
    phone: "[+971 58 58 72 058]",
    phoneHref: null,
    whatsapp: null,
    address: {
      line1: "[Office address]",
      city: "[City]",
      emirate: "[Emirate]",
      country: "United Arab Emirates",
      countryCode: "AE",
    },
    workingHours: [
      { days: "Monday – Friday", hours: "9:00 AM – 6:00 PM" },
      { days: "Saturday – Sunday", hours: "Closed" },
    ],
    mapEmbedUrl: null,
  },
  social: [
    { platform: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com/" },
    { platform: "instagram", label: "Instagram", href: "https://www.instagram.com/" },
    { platform: "facebook", label: "Facebook", href: "https://www.facebook.com/" },
  ],
  defaultOgImage: "/images/og-default.jpg",
};
