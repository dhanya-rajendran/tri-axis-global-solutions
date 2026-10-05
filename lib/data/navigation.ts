import type { FooterColumn, NavItem, NavLink } from "@/types/navigation";

export const mainNavigation: NavItem[] = [
  { label: "About Us", href: "/about" },
  {
    label: "Our Services",
    href: "/services",
    children: [
      {
        label: "Recruitment & Talent Management",
        href: "/services/recruitment-talent-management",
        description: "Permanent, contract and executive hiring",
      },
      {
        label: "Procurement Consultancy",
        href: "/services/procurement-consultancy",
        description: "Strategic sourcing and supplier management",
      },
      {
        label: "General Trading",
        href: "/services/general-trading",
        description: "Product sourcing, import and export",
      },
      {
        label: "E-Commerce",
        href: "/services/e-commerce",
        description: "Digital commerce and marketplace solutions",
      },
      { label: "All Services", href: "/services" },
    ],
  },
  {
    label: "Industries",
    href: "/industries",
    children: [
      { label: "Technology & IT", href: "/industries/technology-it" },
      { label: "Engineering", href: "/industries/engineering" },
      { label: "Oil & Gas", href: "/industries/oil-gas" },
      { label: "Healthcare", href: "/industries/healthcare" },
      { label: "Banking & Finance", href: "/industries/banking-finance" },
      { label: "All Industries", href: "/industries" },
    ],
  },
  { label: "Jobs", href: "/jobs" },
  { label: "For Employers", href: "/employers" },
  { label: "Insights", href: "/insights" },
  { label: "Contact", href: "/contact" },
];

export const headerCtas: { findJob: NavLink; hireTalent: NavLink } = {
  findJob: { label: "Find a Job", href: "/jobs" },
  hireTalent: { label: "Hire Talent", href: "/employers#enquiry" },
};

export const footerNavigation: FooterColumn[] = [
  {
    title: "About Us",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Leadership", href: "/about#leadership" },
      { label: "Mission & Vision", href: "/about#mission" },
      { label: "Values", href: "/about#values" },
      { label: "Why TriAxis", href: "/about#why-triaxis" },
    ],
  },
  {
    title: "Recruitment",
    links: [
      { label: "Find Jobs", href: "/jobs" },
      { label: "Submit CV", href: "/candidates#submit-cv" },
      { label: "Hire Talent", href: "/employers#enquiry" },
      { label: "Executive Search", href: "/services/recruitment-talent-management#executive-search" },
      { label: "Talent Management", href: "/services/recruitment-talent-management" },
    ],
  },
  {
    title: "Business Solutions",
    links: [
      { label: "Procurement", href: "/services/procurement-consultancy" },
      { label: "General Trading", href: "/services/general-trading" },
      { label: "E-Commerce", href: "/services/e-commerce" },
    ],
  },
  {
    title: "Industries",
    links: [
      { label: "Technology", href: "/industries/technology-it" },
      { label: "Engineering", href: "/industries/engineering" },
      { label: "Healthcare", href: "/industries/healthcare" },
      { label: "ELV & Security", href: "/industries/elv-security" },
      { label: "All Industries", href: "/industries" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Insights", href: "/insights" },
      { label: "Career Advice", href: "/insights?category=career-advice" },
      { label: "Salary Insights", href: "/insights?category=salary-guide" },
      { label: "Hiring Insights", href: "/insights?category=hiring-insights" },
    ],
  },
];

export const legalNavigation: NavLink[] = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms & Conditions", href: "/terms" },
  { label: "Cookie Policy", href: "/cookie-policy" },
];
