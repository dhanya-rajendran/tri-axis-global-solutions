"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { Form } from "@/components/ui/form";
import {
  FormSection, SelectField, SlugField, StringListField, SwitchField, TextAreaField, TextField,
} from "@/components/forms/fields";
import { SaveButton } from "@/components/forms/SaveButton";
import { useSaveForm } from "@/components/forms/useSaveForm";
import { employmentTypes, experienceLevels, jobStatuses, labels } from "@/lib/constants";
import { jobSchema } from "@/lib/validators";
import { saveJob } from "./actions";

export type JobFormValues = z.input<typeof jobSchema>;
type Opt = { value: string; label: string };

export function JobForm({ id, defaults, locations, industries }: { id: number | null; defaults: JobFormValues; locations: Opt[]; industries: Opt[] }) {
  const form = useForm<JobFormValues, unknown, z.output<typeof jobSchema>>({ resolver: zodResolver(jobSchema), defaultValues: defaults });
  const { onSubmit, pending } = useSaveForm(form, (v) => saveJob(id, v), (newId) => `/jobs/${newId}`);

  const c = form.control;
  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="grid gap-6 lg:grid-cols-[1fr_320px]" noValidate>
        <div className="space-y-6">
          <FormSection title="Role">
            <TextField control={c} name="title" label="Job title" />
            <SlugField form={form} name="slug" sourceName="title" prefix="/jobs/" />
            <div className="grid gap-5 sm:grid-cols-2">
              <TextField control={c} name="company" label="Company / descriptor" description="e.g. “Leading Fintech Company” for confidential roles" />
              <TextField control={c} name="reference" label="Reference" description="Unique, e.g. TAX-TEC-011" />
            </div>
            <SwitchField control={c} name="confidential" label="Confidential client" description="Website shows TriAxis as the hiring organisation in search results." />
            <TextAreaField control={c} name="summary" label="Summary" rows={2} description="One or two sentences shown on job cards and at the top of the job page." />
          </FormSection>

          <FormSection title="Details">
            <div className="grid gap-5 sm:grid-cols-2">
              <SelectField control={c} name="industryId" label="Industry" options={industries} allowNone="— None —" />
              <SelectField control={c} name="locationId" label="Location" options={locations} allowNone="— None —" />
              <SelectField control={c} name="employmentType" label="Job type" options={employmentTypes.map((v) => ({ value: v, label: labels.employmentType[v] }))} />
              <SelectField control={c} name="experienceLevel" label="Experience level" options={experienceLevels.map((v) => ({ value: v, label: labels.experienceLevel[v] }))} />
              <TextField control={c} name="experienceYears" label="Experience (display)" description="e.g. 5+ years" />
              <TextField control={c} name="country" label="Country code" description="2 letters, e.g. AE" />
            </div>
            <div className="grid gap-5 sm:grid-cols-4">
              <TextField control={c} name="salaryMin" label="Salary min" type="number" />
              <TextField control={c} name="salaryMax" label="Salary max" type="number" />
              <SelectField control={c} name="salaryCurrency" label="Currency" options={[{ value: "AED", label: "AED" }, { value: "USD", label: "USD" }]} />
              <SelectField control={c} name="salaryPeriod" label="Per" options={[{ value: "month", label: "Month" }, { value: "year", label: "Year" }]} />
            </div>
            <p className="text-muted-foreground -mt-2 text-xs">Leave salary empty to hide it on the website.</p>
          </FormSection>

          <FormSection title="Job description">
            <StringListField control={c} name="description" label="Description paragraphs" addLabel="Add paragraph" multiline />
            <StringListField control={c} name="responsibilities" label="Responsibilities" addLabel="Add responsibility" />
            <StringListField control={c} name="requirements" label="Requirements" addLabel="Add requirement" />
            <StringListField control={c} name="benefits" label="Benefits" addLabel="Add benefit" />
          </FormSection>

          <FormSection title="SEO" description="Optional — defaults to the job title and summary.">
            <TextField control={c} name="seoTitle" label="SEO title" />
            <TextAreaField control={c} name="seoDescription" label="SEO description" rows={2} />
          </FormSection>
        </div>

        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <FormSection title="Publishing">
            <SelectField control={c} name="status" label="Status" options={jobStatuses.map((v) => ({ value: v, label: labels.jobStatus[v] }))} description="Only open jobs appear on the website." />
            <TextField control={c} name="postedAt" label="Posted date" type="date" />
            <TextField control={c} name="closingAt" label="Closing date" type="date" description="Optional" />
            <SwitchField control={c} name="featured" label="Featured" description="Shown first and badged." />
            <SaveButton pending={pending} isNew={!id} label={id ? "Save changes" : "Create job"} />
          </FormSection>
        </aside>
      </form>
    </Form>
  );
}
