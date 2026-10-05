"use client";
import { contactFormFields } from "@/lib/forms/configs";
import { EnquiryForm } from "./EnquiryForm";

export function ContactForm() {
  return <EnquiryForm kind="contact" fields={contactFormFields} submitLabel="Send Message" />;
}
