"use client";
import { jobApplicationFields } from "@/lib/forms/configs";
import { EnquiryForm } from "./EnquiryForm";

export function JobApplicationForm({ jobReference, jobTitle }: { jobReference: string; jobTitle: string }) {
  return (
    <EnquiryForm
      kind="job-application"
      fields={jobApplicationFields}
      columns={1}
      submitLabel="Apply Now"
      hidden={{ jobReference, jobTitle }}
      successTitle="Application received"
      successMessage={`Thank you for applying for ${jobTitle}. We'll be in touch if your profile matches the role.`}
    />
  );
}
