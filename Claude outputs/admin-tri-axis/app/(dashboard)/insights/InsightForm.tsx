"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { Form } from "@/components/ui/form";
import { ContentBlocksField, FormSection, SelectField, SlugField, SwitchField, TextAreaField, TextField } from "@/components/forms/fields";
import { ImageUrlField } from "@/components/forms/ImageUrlField";
import { SaveButton } from "@/components/forms/SaveButton";
import { useSaveForm } from "@/components/forms/useSaveForm";
import { insightSchema } from "@/lib/validators";
import { saveInsight } from "./actions";

export type InsightFormValues = z.input<typeof insightSchema>;

export function InsightForm({ id, defaults, categories }: { id: number | null; defaults: InsightFormValues; categories: { value: string; label: string }[] }) {
  const form = useForm<InsightFormValues, unknown, z.output<typeof insightSchema>>({ resolver: zodResolver(insightSchema), defaultValues: defaults });
  const { onSubmit, pending } = useSaveForm(form, (v) => saveInsight(id, v), (newId) => `/insights/${newId}`);
  const c = form.control;
  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="grid gap-6 lg:grid-cols-[1fr_320px]" noValidate>
        <div className="space-y-6">
          <FormSection title="Article">
            <TextField control={c} name="title" label="Title" />
            <SlugField form={form} name="slug" sourceName="title" prefix="/insights/" />
            <TextAreaField control={c} name="excerpt" label="Excerpt" rows={2} description="Shown on cards and under the title." />
            <ContentBlocksField control={c} name="content" label="Content" />
          </FormSection>
          <FormSection title="Download (optional)" description="For gated reports such as salary guides.">
            <div className="grid gap-5 sm:grid-cols-2">
              <TextField control={c} name="downloadLabel" label="Button label" placeholder="Request the full report" />
              <TextField control={c} name="downloadUrl" label="File URL" description="Leave empty to link to the contact page" />
            </div>
          </FormSection>
          <FormSection title="SEO" description="Optional">
            <TextField control={c} name="seoTitle" label="SEO title" />
            <TextAreaField control={c} name="seoDescription" label="SEO description" rows={2} />
          </FormSection>
        </div>
        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <FormSection title="Publishing">
            <SelectField control={c} name="status" label="Status" options={[{ value: "draft", label: "Draft" }, { value: "published", label: "Published" }]} />
            <TextField control={c} name="publishedAt" label="Publish date" type="date" />
            <SelectField control={c} name="categoryId" label="Category" options={categories} allowNone="— None —" />
            <SwitchField control={c} name="featured" label="Featured" />
            <SaveButton pending={pending} isNew={!id} />
          </FormSection>
          <FormSection title="Author">
            <TextField control={c} name="authorName" label="Author name" />
            <TextField control={c} name="authorRole" label="Author role" />
            <TextField control={c} name="readingMinutes" label="Reading time (minutes)" type="number" />
          </FormSection>
          <FormSection title="Image">
            <ImageUrlField control={c} name="imageUrl" label="Image URL" />
            <TextField control={c} name="imageAlt" label="Alt text" />
          </FormSection>
        </aside>
      </form>
    </Form>
  );
}
