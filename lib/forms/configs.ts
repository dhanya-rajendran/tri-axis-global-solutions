import type { FormFieldConfig } from "@/types/forms";
import type { Option } from "@/types/job";

/**
 * Form definitions. Field names are the payload keys the Phase 2 admin API
 * will receive — keep them stable.
 */
export const contactFormFields: FormFieldConfig[] = [
  { name: "name", label: "Full name", type: "text", required: true, autoComplete: "name", placeholder: "Your name" },
  { name: "email", label: "Email", type: "email", required: true, autoComplete: "email", placeholder: "you@company.com" },
  { name: "phone", label: "Phone", type: "tel", autoComplete: "tel", placeholder: "+971 50 123 4567" },
  { name: "company", label: "Company", type: "text", autoComplete: "organization", placeholder: "Company name (optional)" },
  {
    name: "subject",
    label: "Subject",
    type: "select",
    required: true,
    span: 2,
    placeholder: "Select a subject",
    options: [
      { value: "hiring", label: "Hiring talent" },
      { value: "job-seeking", label: "Looking for a job" },
      { value: "procurement", label: "Procurement consultancy" },
      { value: "trading", label: "General trading" },
      { value: "ecommerce", label: "E-commerce" },
      { value: "other", label: "Other enquiry" },
    ],
  },
  { name: "message", label: "Message", type: "textarea", required: true, span: 2, maxLength: 2000, placeholder: "How can we help?" },
];

export const employerFormFields: FormFieldConfig[] = [
  { name: "name", label: "Full name", type: "text", required: true, autoComplete: "name", placeholder: "Your name" },
  { name: "company", label: "Company", type: "text", required: true, autoComplete: "organization", placeholder: "Company name" },
  { name: "email", label: "Work email", type: "email", required: true, autoComplete: "email", placeholder: "you@company.com" },
  { name: "phone", label: "Phone", type: "tel", required: true, autoComplete: "tel", placeholder: "+971 50 123 4567" },
  { name: "hiringNeed", label: "Position / hiring need", type: "text", required: true, placeholder: "e.g. Senior Project Engineer" },
  { name: "positions", label: "Number of positions", type: "number", required: true, min: 1, max: 500, placeholder: "1" },
  { name: "message", label: "Message", type: "textarea", span: 2, maxLength: 2000, placeholder: "Tell us about the role, timeline and location." },
];

export const candidateFormFields = (industries: Option[], locations: Option[]): FormFieldConfig[] => [
  { name: "name", label: "Full name", type: "text", required: true, autoComplete: "name", placeholder: "Your name" },
  { name: "email", label: "Email", type: "email", required: true, autoComplete: "email", placeholder: "you@email.com" },
  { name: "phone", label: "Phone", type: "tel", required: true, autoComplete: "tel", placeholder: "+971 50 123 4567" },
  { name: "currentRole", label: "Current role", type: "text", required: true, autoComplete: "organization-title", placeholder: "e.g. Finance Manager" },
  { name: "experienceYears", label: "Years of experience", type: "number", required: true, min: 0, max: 50, placeholder: "e.g. 6" },
  { name: "preferredIndustry", label: "Preferred industry", type: "select", required: true, placeholder: "Select an industry", options: industries },
  { name: "preferredLocation", label: "Preferred location", type: "select", placeholder: "Any location", options: locations, span: 2 },
  { name: "cv", label: "CV", type: "file", required: true, span: 2, accept: ".pdf,.doc,.docx", maxSizeMb: 4, hint: "PDF or Word, max 4 MB." },
  { name: "message", label: "Message", type: "textarea", span: 2, maxLength: 2000, placeholder: "Anything else we should know? (optional)" },
];

export const jobApplicationFields: FormFieldConfig[] = [
  { name: "name", label: "Full name", type: "text", required: true, autoComplete: "name", placeholder: "Your name", span: 2 },
  { name: "email", label: "Email", type: "email", required: true, autoComplete: "email", placeholder: "you@email.com", span: 2 },
  { name: "phone", label: "Phone", type: "tel", required: true, autoComplete: "tel", placeholder: "+971 50 123 4567", span: 2 },
  { name: "cv", label: "CV", type: "file", required: true, span: 2, accept: ".pdf,.doc,.docx", maxSizeMb: 4, hint: "PDF or Word, max 4 MB." },
  { name: "message", label: "Cover note", type: "textarea", span: 2, maxLength: 1500, placeholder: "Why are you a good fit? (optional)" },
];
