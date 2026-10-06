"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { Form } from "@/components/ui/form";
import { ContentBlocksField, FormSection, IconField, SelectField, SlugField, SwitchField, TextAreaField, TextField } from "@/components/forms/fields";
import { ImageUrlField } from "@/components/forms/ImageUrlField";
import { OfferingsField } from "@/components/forms/OfferingsField";
import { SaveButton } from "@/components/forms/SaveButton";
import { useSaveForm } from "@/components/forms/useSaveForm";
import { serviceSchema } from "@/lib/validators";
import { saveService } from "./actions";

export type ServiceFormValues = z.input<typeof serviceSchema>;

export function ServiceForm({ id, defaults }: { id: number | null; defaults: ServiceFormValues }) {
  const form = useForm<ServiceFormValues, unknown, z.output<typeof serviceSchema>>({ resolver: zodResolver(serviceSchema), defaultValues: defaults });
  const { onSubmit, pending } = useSaveForm(form, (v) => saveService(id, v), (newId) => `/services/${newId}`);
  const c = form.control;
  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="grid gap-6 lg:grid-cols-[1fr_320px]" noValidate>
        <div className="space-y-6">
          <FormSection title="Overview">
            <TextField control={c} name="title" label="Title" />
            <SlugField form={form} name="slug" sourceName="title" prefix="/services/" />
            <div className="grid gap-5 sm:grid-cols-2">
              <TextField control={c} name="shortTitle" label="Short title" description="Used in eyebrows and headings, e.g. “Recruitment”" />
              <TextField control={c} name="ctaLabel" label="Card link label" description="e.g. Explore Recruitment" />
            </div>
            <TextAreaField control={c} name="summary" label="Card summary" rows={2} />
            <TextAreaField control={c} name="intro" label="Page intro" rows={3} />
          </FormSection>
          <FormSection title="What we offer" description="Cards on the service page. The recruitment service’s offerings also power the homepage feature list.">
            <OfferingsField control={c} name="offerings" />
          </FormSection>
          <FormSection title="Body content">
            <ContentBlocksField control={c} name="body" label="Content blocks" />
          </FormSection>
          <FormSection title="SEO" description="Optional">
            <TextField control={c} name="seoTitle" label="SEO title" />
            <TextAreaField control={c} name="seoDescription" label="SEO description" rows={2} />
          </FormSection>
        </div>
        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <FormSection title="Publishing">
            <SwitchField control={c} name="isPublished" label="Published" />
            <SelectField control={c} name="category" label="Category" options={[{ value: "recruitment", label: "Recruitment" }, { value: "business", label: "Business solutions" }]} />
            <IconField control={c} name="icon" label="Icon" />
            <TextField control={c} name="sortOrder" label="Sort order" type="number" description="Lower numbers appear first" />
            <SaveButton pending={pending} isNew={!id} />
          </FormSection>
          <FormSection title="Image">
            <ImageUrlField control={c} name="imageUrl" label="Image URL" />
            <TextField control={c} name="imageAlt" label="Alt text" description="Describe the image for screen readers" />
          </FormSection>
        </aside>
      </form>
    </Form>
  );
}
