"use client";

import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FormSection, SwitchField, TextAreaField, TextField } from "@/components/forms/fields";
import { SaveButton } from "@/components/forms/SaveButton";
import { useSaveForm } from "@/components/forms/useSaveForm";
import { legalSchema } from "@/lib/validators";
import { saveLegal } from "./actions";

export type LegalFormValues = z.input<typeof legalSchema>;

export function LegalForm({ id, defaults }: { id: number; defaults: LegalFormValues }) {
  const form = useForm<LegalFormValues, unknown, z.output<typeof legalSchema>>({ resolver: zodResolver(legalSchema), defaultValues: defaults });
  const { onSubmit, pending } = useSaveForm(form, (v) => saveLegal(id, v));
  const { fields, append, remove } = useFieldArray({ control: form.control, name: "sections" });
  const c = form.control;
  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="grid gap-6 lg:grid-cols-[1fr_300px]" noValidate>
        <div className="space-y-6">
          <FormSection title="Page">
            <TextField control={c} name="title" label="Title" />
            <TextAreaField control={c} name="intro" label="Introduction" rows={3} />
          </FormSection>
          <FormSection title="Sections" description="Separate paragraphs with a blank line.">
            {fields.map((f, i) => (
              <div key={f.id} className="bg-muted/40 space-y-3 rounded-lg border p-4">
                <div className="flex items-end gap-2">
                  <TextField control={c} name={`sections.${i}.heading`} label={`Section ${i + 1} heading`} className="flex-1" />
                  <Button type="button" variant="ghost" size="icon" aria-label="Remove section" onClick={() => remove(i)}>
                    <Trash2 className="text-destructive" />
                  </Button>
                </div>
                <TextAreaField control={c} name={`sections.${i}.body`} label="Text" rows={5} />
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={() => append({ heading: "", body: "" })}>
              <Plus /> Add section
            </Button>
          </FormSection>
        </div>
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <FormSection title="Publishing">
            <SwitchField control={c} name="isDraft" label="Draft notice" description="Shows “Draft for review” on the website until legal counsel approves the text." />
            <SaveButton pending={pending} />
          </FormSection>
        </aside>
      </form>
    </Form>
  );
}
