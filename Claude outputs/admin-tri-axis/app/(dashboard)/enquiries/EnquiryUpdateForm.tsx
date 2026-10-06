"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { Form } from "@/components/ui/form";
import { SelectField, TextAreaField } from "@/components/forms/fields";
import { SaveButton } from "@/components/forms/SaveButton";
import { useSaveForm } from "@/components/forms/useSaveForm";
import { enquiryStatuses, labels } from "@/lib/constants";
import { enquiryUpdateSchema } from "@/lib/validators";
import { updateEnquiry } from "./actions";

type Values = z.input<typeof enquiryUpdateSchema>;

export function EnquiryUpdateForm({ id, defaults }: { id: number; defaults: Values }) {
  const form = useForm<Values, unknown, z.output<typeof enquiryUpdateSchema>>({ resolver: zodResolver(enquiryUpdateSchema), defaultValues: defaults });
  const { onSubmit, pending } = useSaveForm(form, (v) => updateEnquiry(id, v));
  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <SelectField control={form.control} name="status" label="Status" options={enquiryStatuses.map((s) => ({ value: s, label: labels.enquiryStatus[s] }))} />
        <TextAreaField control={form.control} name="notes" label="Internal notes" rows={6} description="Only visible to admin users." />
        <SaveButton pending={pending} label="Update" />
      </form>
    </Form>
  );
}
