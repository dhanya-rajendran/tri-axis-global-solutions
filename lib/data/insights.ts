import type { Insight, InsightCategory } from "@/types/insight";
import { images } from "./images";

/**
 * SAMPLE ARTICLES — editorial placeholders for layout. Replace with approved
 * content from the admin CMS (Phase 2) before launch.
 */
export const insightCategories: InsightCategory[] = [
  { slug: "career-advice", name: "Career Advice" },
  { slug: "hiring-insights", name: "Hiring Insights" },
  { slug: "industry-insights", name: "Industry Insights" },
  { slug: "salary-guide", name: "Salary Guide" },
];

const cat = (slug: string) => insightCategories.find((c) => c.slug === slug)!;
const editorial = { name: "TriAxis Editorial Team", role: "Insights & Research" };

export const insights: Insight[] = [
  {
    id: "ins-001",
    slug: "how-to-build-a-strong-cv-for-2026",
    title: "How to Build a Strong CV for 2026",
    excerpt:
      "What UAE hiring managers look for in a CV today — and the simple changes that help yours reach the shortlist.",
    image: images.insightCv,
    category: cat("career-advice"),
    author: editorial,
    publishedAt: "2026-09-18",
    readingMinutes: 5,
    featured: true,
    seoTitle: "How to Build a Strong CV for 2026 – UAE Career Advice",
    seoDescription: "Practical CV advice for professionals applying for roles in the UAE in 2026.",
    content: [
      {
        type: "paragraph",
        text: "A recruiter typically spends less than a minute on a first read of your CV. In that time, they need to see who you are, what you have achieved and why you fit the role.",
      },
      { type: "heading", text: "Lead with a clear profile" },
      {
        type: "paragraph",
        text: "Open with three or four lines that summarise your experience, specialism and the type of role you want. Tailor this section for every application.",
      },
      { type: "heading", text: "Show results, not just duties" },
      {
        type: "list",
        items: [
          "Quantify achievements where you can — budgets, team size, revenue, savings",
          "Use strong verbs: delivered, led, reduced, launched",
          "Keep each role to five or six focused bullet points",
        ],
      },
      { type: "heading", text: "Get the UAE essentials right" },
      {
        type: "paragraph",
        text: "Include your current location, visa status, notice period and any UAE licences or certifications relevant to your profession. These details help us match you faster.",
      },
    ],
  },
  {
    id: "ins-002",
    slug: "top-hiring-trends-in-the-uae-for-2026",
    title: "Top Hiring Trends in the UAE for 2026",
    excerpt: "Skills-based hiring, Emiratisation and the race for digital talent are reshaping recruitment across the Emirates.",
    image: images.insightHiring,
    category: cat("hiring-insights"),
    author: editorial,
    publishedAt: "2026-09-04",
    readingMinutes: 6,
    featured: true,
    content: [
      {
        type: "paragraph",
        text: "Employers across the UAE are rethinking how they attract and keep talent. Here are the trends we see shaping hiring decisions this year.",
      },
      { type: "heading", text: "Skills over job titles" },
      {
        type: "paragraph",
        text: "More employers are assessing candidates on demonstrated skills rather than titles alone, widening talent pools for hard-to-fill roles.",
      },
      { type: "heading", text: "Emiratisation commitments" },
      {
        type: "paragraph",
        text: "Private-sector Emiratisation targets continue to influence workforce planning, making structured graduate and development programmes more important.",
      },
    ],
  },
  {
    id: "ins-003",
    slug: "technology-sector-outlook-in-the-uae",
    title: "Technology Sector Outlook in the UAE",
    excerpt: "Where demand for technology professionals is growing — and the skills employers are competing for.",
    image: images.insightTechnology,
    category: cat("industry-insights"),
    author: editorial,
    publishedAt: "2026-08-21",
    readingMinutes: 7,
    featured: true,
    content: [
      {
        type: "paragraph",
        text: "Investment in AI, cloud and digital government services continues to drive demand for technology talent across the UAE.",
      },
      { type: "heading", text: "Most in-demand skills" },
      {
        type: "list",
        items: ["Cloud architecture and DevOps", "Data engineering and analytics", "Cyber security", "AI and machine-learning engineering"],
      },
    ],
  },
  {
    id: "ins-004",
    slug: "uae-salary-insights-2026",
    title: "UAE Salary Insights 2026 — Download the Full Report",
    excerpt: "Salary benchmarks and pay trends across our key sectors, to help employers and candidates plan with confidence.",
    image: images.insightSalary,
    category: cat("salary-guide"),
    author: editorial,
    publishedAt: "2026-08-07",
    readingMinutes: 4,
    featured: true,
    download: { label: "Request the full report", href: null },
    content: [
      {
        type: "paragraph",
        text: "Our salary insights bring together market data and placement experience across the sectors we recruit for.",
      },
      {
        type: "paragraph",
        text: "The full report is available on request. Contact our team and we will send you the latest edition.",
      },
    ],
  },
];
