import type { Feature, ProcessStep, TeamMember } from "@/types/content";

/** "Why TriAxis" value propositions. */
export const valuePropositions: Feature[] = [
  { id: "vp-expertise", title: "Industry Expertise", description: "Deep understanding of specialist industries.", icon: "layers" },
  { id: "vp-regional", title: "Regional Knowledge", description: "UAE and regional market knowledge and connections.", icon: "map-pin" },
  { id: "vp-quality", title: "Quality Talent", description: "Focused sourcing and rigorous assessment.", icon: "badge-check" },
  { id: "vp-partnerships", title: "Trusted Partnerships", description: "Long-term relationships with clients and candidates.", icon: "handshake" },
  { id: "vp-support", title: "End-to-End Support", description: "Recruitment, procurement, trading and more.", icon: "route" },
  { id: "vp-client", title: "Client First", description: "Solutions tailored around your needs.", icon: "message-circle" },
];

export const processSteps: ProcessStep[] = [
  { id: "ps-1", number: "01", title: "Understand", description: "Understand your business and requirements." },
  { id: "ps-2", number: "02", title: "Search", description: "Identify relevant talent and opportunities." },
  { id: "ps-3", number: "03", title: "Assess", description: "Evaluate candidates against role requirements." },
  { id: "ps-4", number: "04", title: "Shortlist", description: "Present suitable candidates." },
  { id: "ps-5", number: "05", title: "Select", description: "Support interviews and selection." },
  { id: "ps-6", number: "06", title: "Deliver", description: "Onboard and achieve long-term success." },
];

export const companyValues: Feature[] = [
  { id: "val-integrity", title: "Integrity", description: "Honest advice and transparent processes, every time.", icon: "shield-check" },
  { id: "val-partnership", title: "Partnership", description: "We measure success by the relationships we keep.", icon: "handshake" },
  { id: "val-excellence", title: "Excellence", description: "High standards in every search, assessment and delivery.", icon: "award" },
  { id: "val-people", title: "People First", description: "Respect for every client and every candidate.", icon: "users" },
];

export const mission = {
  mission:
    "To connect businesses with the people, expertise and solutions they need to grow — with integrity, speed and care.",
  vision:
    "To be the UAE's most trusted partner for talent, trade and business solutions, known for the quality of our relationships.",
};

/** Leadership team — to be supplied. Section renders a placeholder while empty. */
export const teamMembers: TeamMember[] = [];

/** Employer page content. */
export const employerBenefits: Feature[] = [
  { id: "eb-1", title: "Specialist consultants", description: "Recruiters who understand your sector and its talent market.", icon: "user-search" },
  { id: "eb-2", title: "Speed to shortlist", description: "Pre-assessed candidates presented quickly and clearly.", icon: "clock" },
  { id: "eb-3", title: "Market insight", description: "Salary benchmarking and availability data for informed decisions.", icon: "trending-up" },
  { id: "eb-4", title: "Compliance aware", description: "Guidance on UAE labour, visa and Emiratisation requirements.", icon: "shield-check" },
];

export const employerSolutions: Feature[] = [
  { id: "es-recruitment", title: "Recruitment Solutions", description: "Permanent hiring for single roles or complete teams, managed end to end.", icon: "users" },
  { id: "es-sourcing", title: "Talent Sourcing", description: "Market mapping and direct approach to reach passive candidates.", icon: "search" },
  { id: "es-executive", title: "Executive Search", description: "Confidential, research-led search for senior and board-level appointments.", icon: "crown" },
  { id: "es-temporary", title: "Temporary Staffing", description: "Contract and temporary professionals for projects, peaks and cover.", icon: "clock" },
  { id: "es-workforce", title: "Workforce Solutions", description: "Workforce planning, outsourcing and talent management advice.", icon: "workflow" },
];

/** Candidate page content. */
export const candidateServices: (Feature & { href: string; cta: string })[] = [
  { id: "cs-jobs", title: "Find Jobs", description: "Browse current vacancies across our specialist sectors.", icon: "briefcase", href: "/jobs", cta: "Browse jobs" },
  { id: "cs-cv", title: "Submit CV", description: "Register your CV so we can match you to suitable roles.", icon: "file-text", href: "#submit-cv", cta: "Submit your CV" },
  { id: "cs-guidance", title: "Career Guidance", description: "Advice on CVs, interviews and your next career move.", icon: "graduation-cap", href: "/insights?category=career-advice", cta: "Read career advice" },
  { id: "cs-matching", title: "Talent Matching", description: "We introduce you to opportunities that fit your skills and goals.", icon: "target", href: "#submit-cv", cta: "Get matched" },
];

export const candidateReasons: Feature[] = [
  { id: "cr-1", title: "Access to exclusive roles", description: "Many of our vacancies are not advertised elsewhere.", icon: "badge-check" },
  { id: "cr-2", title: "Honest advice", description: "Clear feedback and realistic guidance at every stage.", icon: "message-circle" },
  { id: "cr-3", title: "Sector specialists", description: "Consultants who understand your profession.", icon: "layers" },
  { id: "cr-4", title: "Free for candidates", description: "We never charge candidates for our recruitment services.", icon: "hand-heart" },
];
