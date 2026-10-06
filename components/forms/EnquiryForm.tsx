"use client";

import Link from "next/link";
import { useId, useRef, useState, type FormEvent } from "react";
import { ChevronDown, CircleAlert, CircleCheck, LoaderCircle, Upload } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { validateField, validateForm } from "@/lib/forms/validation";
import { submitEnquiry } from "@/lib/services/submissions";
import { cn } from "@/lib/utils";
import type { EnquiryKind, FormFieldConfig } from "@/types/forms";

interface EnquiryFormProps {
  kind: EnquiryKind;
  fields: FormFieldConfig[];
  submitLabel: string;
  successTitle?: string;
  successMessage?: string;
  /** Extra hidden values sent with the payload (e.g. job reference). */
  hidden?: Record<string, string>;
  columns?: 1 | 2;
  className?: string;
}

type Status = "idle" | "submitting" | "success" | "error";

/**
 * Config-driven, accessible form: labelled fields, inline + summary errors,
 * loading and success states. Submission goes through lib/services/submissions.
 */
export function EnquiryForm({
  kind,
  fields,
  submitLabel,
  successTitle = "Thank you — we've received your details.",
  successMessage = "A member of our team will be in touch shortly.",
  hidden,
  columns = 2,
  className,
}: EnquiryFormProps) {
  const uid = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [serverMessage, setServerMessage] = useState<string>();
  const [mock, setMock] = useState(false);
  const [fileNames, setFileNames] = useState<Record<string, string>>({});

  const fid = (name: string) => `${uid}-${name}`;

  const revalidate = (field: FormFieldConfig) => {
    if (!formRef.current || !(field.name in errors)) return;
    const err = validateField(field, new FormData(formRef.current).get(field.name));
    setErrors((prev) => {
      const next = { ...prev };
      if (err) next[field.name] = err;
      else delete next[field.name];
      return next;
    });
  };

  const onBlur = (field: FormFieldConfig) => {
    if (!formRef.current) return;
    const value = new FormData(formRef.current).get(field.name);
    // Only flag on blur once the user has typed something, to avoid noisy errors.
    if (typeof value === "string" && value.trim() === "" && !(field.name in errors)) return;
    const err = validateField(field, value);
    setErrors((prev) => {
      const next = { ...prev };
      if (err) next[field.name] = err;
      else delete next[field.name];
      return next;
    });
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const found = validateForm(fields, data);
    setErrors(found);
    if (Object.keys(found).length) {
      const first = fields.find((f) => found[f.name]);
      if (first) document.getElementById(fid(first.name))?.focus();
      return;
    }
    if (hidden) Object.entries(hidden).forEach(([k, v]) => data.set(k, v));
    setStatus("submitting");
    setServerMessage(undefined);
    const result = await submitEnquiry(kind, data);
    if (result.ok) {
      setMock(result.mock);
      setStatus("success");
      form.reset();
      setFileNames({});
    } else {
      setStatus("error");
      setServerMessage(result.message);
      if (result.fieldErrors) {
        const known = Object.fromEntries(Object.entries(result.fieldErrors).filter(([k]) => fields.some((f) => f.name === k)));
        setErrors(known);
      }
    }
  };

  if (status === "success") {
    return (
      <div role="status" className={cn("rounded-card border border-teal/30 bg-teal-light p-8", className)}>
        <CircleCheck aria-hidden className="size-8 text-teal" strokeWidth={1.5} />
        <h3 className="mt-4 font-serif text-2xl font-medium text-navy">{successTitle}</h3>
        <p className="mt-2 text-sm text-ink">{successMessage}</p>
        {mock && (
          <p className="mt-4 rounded-sm border border-gold/40 bg-white px-3 py-2 text-xs text-ink">
            Preview mode: no backend is connected yet, so this submission was not sent or stored.
          </p>
        )}
        <Button variant="outline" size="sm" className="mt-6" onClick={() => setStatus("idle")}>
          Submit another
        </Button>
      </div>
    );
  }

  const errorCount = Object.keys(errors).length;

  return (
    <form ref={formRef} noValidate onSubmit={onSubmit} className={className} aria-describedby={`${uid}-req`}>
      <p id={`${uid}-req`} className="mb-5 text-xs text-muted">
        Fields marked <span className="text-danger">*</span> are required.
      </p>

      {errorCount > 0 && (
        <div role="alert" className="mb-6 flex gap-3 rounded-card border border-danger/30 bg-danger/5 p-4 text-sm text-danger">
          <CircleAlert aria-hidden className="mt-0.5 size-4 shrink-0" />
          <p>
            Please correct {errorCount === 1 ? "the highlighted field" : `the ${errorCount} highlighted fields`} below.
          </p>
        </div>
      )}

      {/* Honeypot: hidden from people, often filled by spam bots. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={`${uid}-website`}>Leave this field empty</label>
        <input id={`${uid}-website`} type="text" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div className={cn("grid gap-x-5 gap-y-5", columns === 2 && "sm:grid-cols-2")}>
        {fields.map((field) => {
          const id = fid(field.name);
          const err = errors[field.name];
          const describedBy = [err && `${id}-error`, field.hint && `${id}-hint`].filter(Boolean).join(" ") || undefined;
          const control = cn(
            "w-full rounded-control border bg-white px-3.5 text-sm text-ink placeholder:text-muted/80 transition-colors",
            "focus:border-navy focus:ring-2 focus:ring-gold/40 focus:outline-none",
            err ? "border-danger" : "border-line hover:border-navy/40",
          );
          const common = {
            id,
            name: field.name,
            required: field.required,
            "aria-invalid": err ? true : undefined,
            "aria-describedby": describedBy,
            onBlur: () => onBlur(field),
            onChange: () => revalidate(field),
          } as const;

          return (
            <div key={field.name} className={cn(columns === 2 && field.span === 2 && "sm:col-span-2")}>
              <label htmlFor={id} className="mb-1.5 block text-[13px] font-semibold text-navy">
                {field.label}
                {field.required && (
                  <span className="text-danger" aria-hidden>
                    {" "}
                    *
                  </span>
                )}
              </label>

              {field.type === "textarea" ? (
                <textarea {...common} rows={5} maxLength={field.maxLength} placeholder={field.placeholder} className={cn(control, "py-3")} />
              ) : field.type === "select" ? (
                <div className="relative">
                  <select {...common} defaultValue="" className={cn(control, "h-12 cursor-pointer pr-10")}>
                    <option value="">{field.placeholder ?? "Select"}</option>
                    {field.options?.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown aria-hidden className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted" />
                </div>
              ) : field.type === "file" ? (
                <div
                  className={cn(
                    "relative flex items-center gap-3 rounded-control border border-dashed bg-surface px-4 py-4 transition-colors focus-within:border-navy focus-within:ring-2 focus-within:ring-gold/40",
                    err ? "border-danger" : "border-line hover:border-navy/40",
                  )}
                >
                  <Upload aria-hidden className="size-5 shrink-0 text-teal" strokeWidth={1.5} />
                  <span className="min-w-0 truncate text-sm text-ink">
                    {fileNames[field.name] ?? (
                      <>
                        <span className="font-semibold text-navy">Choose a file</span> or drag it here
                      </>
                    )}
                  </span>
                  <input
                    {...common}
                    type="file"
                    accept={field.accept}
                    className="absolute inset-0 cursor-pointer opacity-0"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      setFileNames((p) => ({ ...p, [field.name]: f?.name ?? "" }));
                      revalidate(field);
                    }}
                  />
                </div>
              ) : (
                <input
                  {...common}
                  type={field.type}
                  inputMode={field.type === "number" ? "numeric" : undefined}
                  min={field.min}
                  max={field.max}
                  maxLength={field.maxLength}
                  autoComplete={field.autoComplete}
                  placeholder={field.placeholder}
                  className={cn(control, "h-12")}
                />
              )}

              {field.hint && !err && (
                <p id={`${id}-hint`} className="mt-1.5 text-xs text-muted">
                  {field.hint}
                </p>
              )}
              {err && (
                <p id={`${id}-error`} className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-danger">
                  <CircleAlert aria-hidden className="size-3.5" /> {err}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {status === "error" && serverMessage && (
        <p role="alert" className="mt-5 text-sm font-medium text-danger">
          {serverMessage}
        </p>
      )}

      <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted">
          By submitting, you agree to our{" "}
          <Link href="/privacy-policy" className="font-medium text-navy underline underline-offset-2">
            Privacy Policy
          </Link>
          .
        </p>
        <Button type="submit" size="lg" arrow={status !== "submitting"} disabled={status === "submitting"} className="sm:min-w-48">
          {status === "submitting" ? (
            <span className="inline-flex items-center gap-2">
              <LoaderCircle aria-hidden className="size-4 animate-spin" /> Sending…
            </span>
          ) : (
            submitLabel
          )}
        </Button>
      </div>
    </form>
  );
}
