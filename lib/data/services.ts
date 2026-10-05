import type { Service } from "@/types/service";
import { images } from "./images";

/** Phase 1 local content. Phase 2: served by the admin API via getServices(). */
export const services: Service[] = [
  {
    id: "svc-recruitment",
    slug: "recruitment-talent-management",
    title: "Recruitment & Talent Management",
    shortTitle: "Recruitment",
    summary: "Permanent, contract, executive search and talent solutions.",
    intro:
      "We help employers across the UAE find, assess and keep the people who move their business forward — from a single specialist hire to a complete project team.",
    icon: "users",
    image: images.serviceRecruitment,
    ctaLabel: "Explore Recruitment",
    category: "recruitment",
    order: 1,
    seoTitle: "Recruitment & Talent Management in the UAE",
    seoDescription:
      "Permanent recruitment, contract staffing, executive search and talent management for employers across Dubai and the UAE.",
    offerings: [
      {
        title: "Permanent Recruitment",
        description: "Long-term talent acquisition for roles that shape your business.",
        icon: "user-check",
      },
      {
        title: "Contract & Temporary Staffing",
        description: "Flexible workforce solutions for projects, peaks and cover.",
        icon: "clock",
      },
      {
        title: "Executive Search",
        description: "Discreet, research-led search for leadership and senior appointments.",
        icon: "crown",
      },
      {
        title: "Talent Management",
        description: "Developing and retaining high-performing people.",
        icon: "trending-up",
      },
      {
        title: "Workforce Consulting",
        description: "Aligning workforce strategy with business objectives.",
        icon: "target",
      },
    ],
    body: [
      { type: "heading", text: "How we recruit" },
      {
        type: "paragraph",
        text: "Every search starts with a conversation about your business, team and the outcomes the role must deliver. We then map the market, approach active and passive candidates, and assess each one against the brief before you see a shortlist.",
      },
      {
        type: "list",
        items: [
          "Dedicated consultant for each assignment",
          "Structured competency and culture-fit assessment",
          "Salary benchmarking for the UAE market",
          "Offer management and onboarding support",
        ],
      },
    ],
  },
  {
    id: "svc-procurement",
    slug: "procurement-consultancy",
    title: "Procurement Consultancy",
    shortTitle: "Procurement",
    summary: "Strategic sourcing, supplier management and cost optimisation.",
    intro:
      "We help organisations buy better — identifying reliable suppliers, negotiating sound terms and building procurement processes that reduce cost and risk.",
    icon: "package",
    image: images.serviceProcurement,
    ctaLabel: "Explore Procurement",
    category: "business",
    order: 2,
    seoTitle: "Procurement Consultancy in the UAE",
    seoDescription:
      "Strategic sourcing, supplier evaluation and procurement process improvement for UAE businesses.",
    offerings: [
      {
        title: "Strategic Sourcing",
        description: "Category analysis and sourcing strategies aligned to your goals.",
        icon: "compass",
      },
      {
        title: "Supplier Management",
        description: "Supplier identification, evaluation and performance reviews.",
        icon: "handshake",
      },
      {
        title: "Cost Optimisation",
        description: "Spend analysis and negotiation to reduce total cost of ownership.",
        icon: "banknote",
      },
      {
        title: "Process Improvement",
        description: "Clear, compliant procurement policies and workflows.",
        icon: "workflow",
      },
    ],
    body: [
      { type: "heading", text: "Our approach" },
      {
        type: "paragraph",
        text: "We review how your organisation buys today, identify where value is being lost and put practical improvements in place — working alongside your team rather than handing over a report.",
      },
    ],
  },
  {
    id: "svc-trading",
    slug: "general-trading",
    title: "General Trading",
    shortTitle: "Trading",
    summary: "Product sourcing, import & export, distribution and B2B trading.",
    intro:
      "From the UAE, we source and supply products for businesses across the region — managing suppliers, logistics partners and documentation so goods arrive on time and to specification.",
    icon: "globe",
    image: images.serviceTrading,
    ctaLabel: "Explore Trading",
    category: "business",
    order: 3,
    seoTitle: "General Trading Company in the UAE",
    seoDescription:
      "Product sourcing, import and export, and B2B distribution from the UAE to the wider region.",
    offerings: [
      {
        title: "Product Sourcing",
        description: "Access to vetted manufacturers and suppliers.",
        icon: "search",
      },
      {
        title: "Import & Export",
        description: "Coordination of shipping, customs and documentation.",
        icon: "ship",
      },
      {
        title: "Distribution",
        description: "Reliable B2B supply for regional customers.",
        icon: "truck",
      },
      {
        title: "Quality Assurance",
        description: "Specification checks before goods are dispatched.",
        icon: "badge-check",
      },
    ],
    body: [
      { type: "heading", text: "Trading with confidence" },
      {
        type: "paragraph",
        text: "We act as a single point of contact for sourcing and supply, keeping you informed at every stage from order to delivery.",
      },
    ],
  },
  {
    id: "svc-ecommerce",
    slug: "e-commerce",
    title: "E-Commerce",
    shortTitle: "E-Commerce",
    summary: "Digital commerce, marketplace solutions and online retail.",
    intro:
      "We help brands and distributors sell online in the UAE and GCC — from marketplace onboarding to fulfilment partners and day-to-day storefront operations.",
    icon: "shopping-cart",
    image: images.serviceEcommerce,
    ctaLabel: "Explore E-Commerce",
    category: "business",
    order: 4,
    seoTitle: "E-Commerce Solutions in the UAE",
    seoDescription:
      "Marketplace onboarding, online retail operations and digital commerce support for UAE and GCC brands.",
    offerings: [
      {
        title: "Marketplace Solutions",
        description: "Listing, onboarding and account management on leading regional marketplaces.",
        icon: "store",
      },
      {
        title: "Online Retail Operations",
        description: "Catalogue, pricing and order management.",
        icon: "shopping-bag",
      },
      {
        title: "Fulfilment Partnerships",
        description: "Connecting you with warehousing and last-mile partners.",
        icon: "boxes",
      },
      {
        title: "Growth Support",
        description: "Performance reporting and practical growth plans.",
        icon: "trending-up",
      },
    ],
    body: [
      { type: "heading", text: "Selling online in the region" },
      {
        type: "paragraph",
        text: "We combine trading know-how with digital commerce experience, so your products are sourced, listed and delivered through one joined-up partner.",
      },
    ],
  },
];
