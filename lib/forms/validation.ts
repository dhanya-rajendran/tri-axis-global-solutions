import type { FormFieldConfig } from "@/types/forms";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE = /^\+?[\d\s()-]{7,20}$/;

/** Returns an error message, or null when the value is valid. */
export function validateField(field: FormFieldConfig, value: FormDataEntryValue | null): string | null {
  if (field.type === "file") {
    const file = value instanceof File && value.size > 0 ? value : null;
    if (!file) return field.required ? `Please attach your ${field.label.toLowerCase()}.` : null;
    if (field.maxSizeMb && file.size > field.maxSizeMb * 1024 * 1024) return `File must be smaller than ${field.maxSizeMb} MB.`;
    if (field.accept) {
      const allowed = field.accept.split(",").map((s) => s.trim().toLowerCase());
      const ext = `.${file.name.split(".").pop()?.toLowerCase()}`;
      if (!allowed.includes(ext)) return `Accepted formats: ${allowed.join(", ")}.`;
    }
    return null;
  }

  const v = typeof value === "string" ? value.trim() : "";
  if (!v) return field.required ? `${field.label} is required.` : null;
  if (field.type === "email" && !EMAIL.test(v)) return "Please enter a valid email address.";
  if (field.type === "tel" && (!PHONE.test(v) || v.replace(/\D/g, "").length < 7)) return "Please enter a valid phone number, e.g. +971 50 123 4567.";
  if (field.type === "number") {
    const n = Number(v);
    if (!Number.isFinite(n)) return "Please enter a number.";
    if (field.min !== undefined && n < field.min) return `Must be at least ${field.min}.`;
    if (field.max !== undefined && n > field.max) return `Must be ${field.max} or less.`;
  }
  if (field.maxLength && v.length > field.maxLength) return `Please keep this under ${field.maxLength} characters.`;
  return null;
}

export function validateForm(fields: FormFieldConfig[], data: FormData): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const f of fields) {
    const err = validateField(f, data.get(f.name));
    if (err) errors[f.name] = err;
  }
  return errors;
}
