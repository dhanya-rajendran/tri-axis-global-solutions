/** Enquiry entities the admin repository will receive in Phase 2. */
export type EnquiryKind = "contact" | "employer" | "candidate" | "job-application";

export type FieldType = "text" | "email" | "tel" | "number" | "select" | "textarea" | "file";

export interface FormFieldConfig {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  autoComplete?: string;
  options?: { value: string; label: string }[];
  /** Grid span on ≥sm screens. */
  span?: 1 | 2;
  min?: number;
  max?: number;
  maxLength?: number;
  /** File inputs. */
  accept?: string;
  maxSizeMb?: number;
  hint?: string;
}

export interface SubmissionResult {
  ok: boolean;
  /** True when no backend endpoint is configured and the payload was not sent anywhere. */
  mock: boolean;
  message?: string;
}
