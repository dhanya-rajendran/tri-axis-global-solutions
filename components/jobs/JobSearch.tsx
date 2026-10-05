"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useId, useState, useTransition, type FormEvent, type ReactNode } from "react";
import { ArrowRight, Briefcase, ChevronDown, Gauge, Layers, LoaderCircle, MapPin, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import type { JobFilterOptions, JobFilters } from "@/types/job";

interface JobSearchProps {
  options: JobFilterOptions;
  initial?: JobFilters;
  /** "hero" = floating navy panel (homepage); "page" = light panel (jobs listing). */
  variant?: "hero" | "page";
  showExperience?: boolean;
  title?: string;
  className?: string;
}

/**
 * Reusable job search. Serialises filters to the /jobs query string, which the
 * jobs page passes to getJobs() — the same contract a future API will honour.
 */
export function JobSearch({ options, initial = {}, variant = "hero", showExperience = false, title, className }: JobSearchProps) {
  const router = useRouter();
  const id = useId();
  const [pending, startTransition] = useTransition();
  const [values, setValues] = useState<Required<JobFilters>>({
    keyword: initial.keyword ?? "",
    location: initial.location ?? "",
    industry: initial.industry ?? "",
    type: initial.type ?? "",
    experience: initial.experience ?? "",
  });

  const set = (key: keyof JobFilters) => (value: string) => setValues((v) => ({ ...v, [key]: value }));

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    Object.entries(values).forEach(([k, v]) => {
      if (v.trim()) params.set(k, v.trim());
    });
    const qs = params.toString();
    startTransition(() => router.push(`/jobs${qs ? `?${qs}` : ""}#results`));
  };

  const hero = variant === "hero";
  const selectSpan = showExperience ? "sm:col-span-3 lg:col-span-1" : "sm:col-span-2 lg:col-span-1";

  return (
    <section
      aria-labelledby={`${id}-title`}
      className={cn(
        "rounded-card",
        hero ? "bg-navy-800 p-5 text-white shadow-[0_30px_60px_-30px_rgba(7,27,54,0.8)] sm:p-7 lg:px-9 lg:py-8" : "border border-line bg-white p-5 sm:p-6",
        className,
      )}
    >
      <h2 id={`${id}-title`} className={cn("font-serif font-medium", hero ? "text-2xl text-white sm:text-[26px]" : "text-xl text-navy")}>
        {title ?? "Find Your Next Opportunity"}
      </h2>

      <form role="search" onSubmit={onSubmit} className="mt-5">
        <div
          className={cn(
            "grid gap-px overflow-hidden rounded-control bg-line",
            showExperience ? "sm:grid-cols-6 lg:grid-cols-[1.6fr_repeat(4,1fr)_auto]" : "sm:grid-cols-6 lg:grid-cols-[1.7fr_repeat(3,1fr)_auto]",
            hero ? "lg:rounded-card lg:bg-line lg:p-0" : "border border-line",
          )}
        >
          <Field id={`${id}-keyword`} label="Job title or keyword" icon={<Search className="size-4" />} className="sm:col-span-6 lg:col-span-1">
            <input
              id={`${id}-keyword`}
              type="search"
              name="keyword"
              value={values.keyword}
              onChange={(e) => set("keyword")(e.target.value)}
              placeholder="Job title or keyword"
              autoComplete="off"
              className={inputClass}
            />
          </Field>
          <SelectField id={`${id}-location`} className={selectSpan} label="Location" icon={<MapPin className="size-4" />} value={values.location} onChange={set("location")} placeholder="All locations" options={options.locations} />
          <SelectField id={`${id}-industry`} className={selectSpan} label="Industry" icon={<Layers className="size-4" />} value={values.industry} onChange={set("industry")} placeholder="All industries" options={options.industries} />
          <SelectField id={`${id}-type`} className={selectSpan} label="Job type" icon={<Briefcase className="size-4" />} value={values.type} onChange={set("type")} placeholder="All job types" options={options.types} />
          {showExperience && (
            <SelectField id={`${id}-experience`} className={selectSpan} label="Experience" icon={<Gauge className="size-4" />} value={values.experience} onChange={set("experience")} placeholder="Any level" options={options.experience} />
          )}
          <div className="bg-white p-1.5 sm:col-span-6 lg:col-span-1">
            <button
              type="submit"
              disabled={pending}
              className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-control bg-gold px-6 text-sm font-semibold whitespace-nowrap text-navy transition-colors hover:bg-gold-light disabled:opacity-70"
            >
              {pending ? <LoaderCircle aria-hidden className="size-4 animate-spin" /> : null}
              Search Jobs
              <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>
      </form>

      {hero && (
        <p className="mt-4 text-[13px] text-white/75">
          Can&apos;t find the right opportunity?{" "}
          <Link href="/candidates#submit-cv" className="inline-flex items-center gap-1 font-semibold text-white hover:text-gold-light">
            Submit your CV <ArrowRight aria-hidden className="size-3.5" />
          </Link>
        </p>
      )}
    </section>
  );
}

const inputClass =
  "h-[3.75rem] w-full bg-transparent pr-3 pl-10 text-sm text-ink placeholder:text-muted focus:outline-none";

function Field({ id, label, icon, children, className }: { id: string; label: string; icon: ReactNode; children: ReactNode; className?: string }) {
  return (
    <div className={cn("relative bg-white focus-within:ring-2 focus-within:ring-gold focus-within:ring-inset", className)}>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <span aria-hidden className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-muted">
        {icon}
      </span>
      {children}
    </div>
  );
}

function SelectField({
  className,
  id,
  label,
  icon,
  value,
  onChange,
  placeholder,
  options,
}: {
  className?: string;
  id: string;
  label: string;
  icon: ReactNode;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  options: { value: string; label: string }[];
}) {
  return (
    <Field id={id} label={label} icon={icon} className={className}>
      <select id={id} value={value} onChange={(e) => onChange(e.target.value)} className={cn(inputClass, "cursor-pointer pr-9", !value && "text-muted")}>
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown aria-hidden className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted" />
    </Field>
  );
}
