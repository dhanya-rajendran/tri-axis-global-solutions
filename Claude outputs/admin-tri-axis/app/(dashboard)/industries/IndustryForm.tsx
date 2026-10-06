"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { Form } from "@/components/ui/form";
import { FormSection, IconField, SlugField, StringListField, SwitchField, TextAreaField, TextField } from "@/components/forms/fields";
import { SaveButton } from "@/components/forms/SaveButton";
import { useSaveForm } from "@/components/forms/useSaveForm";
import { industrySchema } from "@/lib/validators";
import { saveIndustry } from "./actions";

export type IndustryFormValues = z.input<typeof industrySchema>;

export function IndustryForm({ id, defaults }: { id: number | null; defaults: IndustryFormValues }) {
  const form = useForm<IndustryFormValues, unknown, z.output<typeof industrySchema>>({ resolver: zodResolver(industrySchema), defaultValues: defaults });
  const { onSubmit, pending } = useSaveForm(form, (v) => saveIndustry(id, v), (newId) => `/industries/${newId}`);
  const c = form.control;
  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="grid gap-6 lg:grid-cols-[1fr_320px]" noValidate>
        <div className="space-y-6">
          <FormSection title="Industry">
            <TextField control={c} name="name" label="Name" />
            <SlugField form={form} name="slug" sourceName="name" prefix="/industries/" />
            <TextField control={c} name="shortName" label="Short name" description="Optional, for compact grids" />
            <TextAreaField control={c} name="summary" label="Summary" rows={2} />
            <TextAreaField control={c} name="description" label="Description" rows={4} />
            <StringListField control={c} name="roles" label="Roles we recruit" addLabel="Add role" />
          </FormSection>
          <FormSection title="SEO" description="Optional">
            <TextField control={c} name="seoTitle" label="SEO title" />
            <TextAreaField control={c} name="seoDescription" label="SEO description" rows={2} />
          </FormSection>
        </div>
        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <FormSection title="Publishing">
            <SwitchField control={c} name="isPublished" label="Published" />
            <IconField control={c} name="icon" label="Icon" />
            <TextField control={c} name="sortOrder" label="Sort order" type="number" />
            <SaveButton pending={pending} isNew={!id} />
          </FormSection>
        </aside>
      </form>
    </Form>
  );
}
