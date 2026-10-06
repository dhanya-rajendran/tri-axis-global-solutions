/** Enum values shared by the DB schema, validators and UI (safe for client bundles). */
export const employmentTypes = ["full-time", "part-time", "contract", "temporary"] as const;
export const experienceLevels = ["entry", "mid", "senior", "executive"] as const;
export const jobStatuses = ["open", "closed", "draft"] as const;
export const enquiryTypes = ["contact", "employer", "candidate", "job-application"] as const;
export const enquiryStatuses = ["new", "in_progress", "closed", "spam"] as const;
export const featureGroups = [
  "why_triaxis",
  "company_values",
  "employer_benefits",
  "employer_solutions",
  "candidate_services",
  "candidate_reasons",
] as const;

export const labels = {
  employmentType: { "full-time": "Full-time", "part-time": "Part-time", contract: "Contract", temporary: "Temporary" },
  experienceLevel: { entry: "Entry level (0–2 yrs)", mid: "Mid level (3–6 yrs)", senior: "Senior (7+ yrs)", executive: "Executive / Leadership" },
  jobStatus: { open: "Open", closed: "Closed", draft: "Draft" },
  enquiryType: { contact: "Contact", employer: "Employer", candidate: "Candidate", "job-application": "Job application" },
  enquiryStatus: { new: "New", in_progress: "In progress", closed: "Closed", spam: "Spam" },
  featureGroup: {
    why_triaxis: "Why TriAxis (home & about)",
    company_values: "Company values (about)",
    employer_benefits: "Employer benefits",
    employer_solutions: "Employer solutions",
    candidate_services: "Candidate services",
    candidate_reasons: "Why candidates choose us",
  },
} as const;
