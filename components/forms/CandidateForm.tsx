"use client";
import { candidateFormFields } from "@/lib/forms/configs";
import type { Option } from "@/types/job";
import { EnquiryForm } from "./EnquiryForm";

/** TODO(phase-2): CV files are sent with the multipart payload to the admin API; no storage in Phase 1. */
export function CandidateForm({ industries, locations }: { industries: Option[]; locations: Option[] }) {
  return (
    <EnquiryForm
      kind="candidate"
      fields={candidateFormFields(industries, locations)}
      submitLabel="Submit CV"
      successMessage="We'll review your profile and contact you when a suitable opportunity comes up."
    />
  );
}
