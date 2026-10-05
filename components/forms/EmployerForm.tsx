"use client";
import { employerFormFields } from "@/lib/forms/configs";
import { EnquiryForm } from "./EnquiryForm";

export function EmployerForm() {
  return (
    <EnquiryForm
      kind="employer"
      fields={employerFormFields}
      submitLabel="Submit Hiring Enquiry"
      successMessage="One of our consultants will contact you within one business day to discuss your requirements."
    />
  );
}
