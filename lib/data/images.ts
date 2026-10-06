import type { ImageAsset } from "@/types/common";

/**
 * CENTRAL IMAGE REGISTRY
 * ---------------------------------------------------------------------------
 * Every image used on the site is referenced from here — never by path inside
 * a component. All current files in /public/images are ORIGINAL GENERATED
 * PLACEHOLDER ARTWORK in the brand palette (no third-party stock imagery).
 *
 * To go live: replace each file in /public/images with approved, licensed
 * photography using the SAME filename (or update `src`), keep a similar aspect
 * ratio, update `alt`, and set `placeholder: false`. The `brief` field describes
 * the photograph each slot needs.
 */
const img = (
  file: string,
  width: number,
  height: number,
  alt: string,
  brief: string,
): ImageAsset => ({ src: `/images/${file}`, width, height, alt, brief, placeholder: true });

const banner = (file: string, width: number, height: number): ImageAsset => ({
  src: `/images/${file}`,
  width,
  height,
  alt: "TAG — TriAxis Global Solutions FZE. #TAG us for your recruitment needs: technology, cybersecurity, AI, ELV, engineering and corporate leadership. People, expertise, possibilities.",
  placeholder: false,
});

export const images = {
  /** Approved brand banner (homepage hero). Desktop 8:3, mobile 16:9 crop centred on the logo. */
  heroBanner: {
    desktop: banner("hero-tag-banner.jpg", 2048, 768),
    mobile: banner("hero-tag-banner-mobile.jpg", 1200, 675),
  },
  hero: img(
    "hero-dubai-skyline.jpg",
    2400,
    1200,
    "Dubai skyline at dusk overlooking the water",
    "Wide Dubai skyline at blue hour / dusk, space on the left for headline. Min 2400px wide.",
  ),
  pageHero: img(
    "page-hero-skyline.jpg",
    2400,
    800,
    "UAE city skyline at dusk",
    "Panoramic UAE skyline or business district, dark enough for white text overlay.",
  ),
  cta: img(
    "cta-skyline.jpg",
    2400,
    900,
    "Evening skyline of a UAE business district",
    "Dubai business district at night, low-key exposure for overlay.",
  ),
  journeyEmployers: img(
    "journey-employers.jpg",
    1200,
    800,
    "Business leaders in a meeting in a modern office",
    "Two professionals (UAE context) shaking hands or meeting in a bright glass office.",
  ),
  journeyCandidates: img(
    "journey-candidates.jpg",
    1200,
    800,
    "Confident professional in a modern office",
    "Smiling professional candidate, natural light, corporate setting.",
  ),
  recruitmentFeature: img(
    "recruitment-feature.jpg",
    1000,
    1100,
    "Recruitment consultants meeting with a client",
    "Small team of consultants reviewing candidate profiles together. Portrait orientation.",
  ),
  whyArchitecture: img(
    "why-architecture.jpg",
    1000,
    1200,
    "Glass facade of a modern office tower",
    "Upward architectural shot of a glass tower, cool blue tones. Portrait orientation.",
  ),
  serviceRecruitment: img(
    "service-recruitment.jpg",
    1000,
    640,
    "Interview between a recruiter and a candidate",
    "Professional interview / recruitment meeting.",
  ),
  serviceProcurement: img(
    "service-procurement.jpg",
    1000,
    640,
    "Organised warehouse shelving with stock ready for supply",
    "Procurement / warehouse / supplier sourcing scene.",
  ),
  serviceTrading: img(
    "service-trading.jpg",
    1000,
    640,
    "Shipping containers and cranes at a commercial port",
    "Jebel Ali-style container port with cranes.",
  ),
  serviceEcommerce: img(
    "service-ecommerce.jpg",
    1000,
    640,
    "Online storefront displayed on a laptop",
    "Laptop with e-commerce storefront on a clean desk.",
  ),
  insightCv: img(
    "insight-cv.jpg",
    1000,
    640,
    "CV documents and a pen on a desk",
    "CV / résumé on a desk with laptop.",
  ),
  insightHiring: img(
    "insight-hiring-trends.jpg",
    1000,
    640,
    "Dubai skyline representing the UAE job market",
    "Dubai skyline, daytime or dusk.",
  ),
  insightTechnology: img(
    "insight-technology.jpg",
    1000,
    640,
    "Abstract digital network representing the technology sector",
    "Technology / AI themed visual.",
  ),
  insightSalary: img(
    "insight-salary.jpg",
    1000,
    640,
    "Rising bar chart representing salary growth in AED",
    "Salary / finance report visual.",
  ),
};

export type ImageKey = keyof typeof images;
