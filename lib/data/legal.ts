import type { LegalDocument } from "@/types/content";
import { siteConfig } from "@/config/site";

/**
 * DRAFT LEGAL TEXT — structural placeholder only. Must be reviewed and
 * approved by qualified legal counsel before publication.
 */
const updatedAt = "2026-10-01";

export const legalDocuments: Record<"privacy" | "terms" | "cookies", LegalDocument> = {
  privacy: {
    slug: "privacy-policy",
    title: "Privacy Policy",
    updatedAt,
    intro: `This policy explains how ${siteConfig.legalName} collects, uses and protects personal information when you use our website or services.`,
    sections: [
      { heading: "Information we collect", paragraphs: ["We collect information you provide when you submit an enquiry, apply for a role or send us your CV, such as your name, contact details, employment history and qualifications."] },
      { heading: "How we use your information", paragraphs: ["We use your information to respond to enquiries, provide recruitment and business services, match candidates with opportunities, and meet our legal obligations."] },
      { heading: "Sharing your information", paragraphs: ["With your consent, we share candidate information with prospective employers. We do not sell personal information."] },
      { heading: "Data retention and security", paragraphs: ["We keep personal information only for as long as necessary and apply appropriate technical and organisational safeguards."] },
      { heading: "Your rights", paragraphs: [`You may request access to, correction of or deletion of your personal information by contacting ${siteConfig.contact.email}.`] },
    ],
  },
  terms: {
    slug: "terms",
    title: "Terms & Conditions",
    updatedAt,
    intro: `These terms govern your use of the ${siteConfig.name} website.`,
    sections: [
      { heading: "Use of this website", paragraphs: ["You agree to use this website lawfully and not to misuse its content or functionality."] },
      { heading: "Job listings", paragraphs: ["Vacancies are published in good faith and may change or close without notice. Listing a role does not guarantee an interview or offer."] },
      { heading: "Intellectual property", paragraphs: [`All content on this website is owned by or licensed to ${siteConfig.legalName} unless otherwise stated.`] },
      { heading: "Limitation of liability", paragraphs: ["Information on this website is provided for general purposes and does not constitute professional advice."] },
      { heading: "Governing law", paragraphs: ["These terms are governed by the laws of the United Arab Emirates."] },
    ],
  },
  cookies: {
    slug: "cookie-policy",
    title: "Cookie Policy",
    updatedAt,
    intro: "This policy explains how we use cookies and similar technologies on our website.",
    sections: [
      { heading: "What are cookies?", paragraphs: ["Cookies are small text files stored on your device that help websites function and understand how they are used."] },
      { heading: "Cookies we use", paragraphs: ["We use strictly necessary cookies to operate the site. Analytics cookies will only be used with your consent once enabled."] },
      { heading: "Managing cookies", paragraphs: ["You can control or delete cookies through your browser settings."] },
    ],
  },
};
