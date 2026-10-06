"use client";

import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FormSection, SelectField, TextAreaField, TextField } from "@/components/forms/fields";
import { SaveButton } from "@/components/forms/SaveButton";
import { useSaveForm } from "@/components/forms/useSaveForm";
import { settingsSchema } from "@/lib/validators";
import { saveSettings } from "./actions";

export type SettingsFormValues = z.input<typeof settingsSchema>;

export function SettingsForm({ defaults }: { defaults: SettingsFormValues }) {
  const form = useForm<SettingsFormValues, unknown, z.output<typeof settingsSchema>>({ resolver: zodResolver(settingsSchema), defaultValues: defaults });
  const { onSubmit, pending } = useSaveForm(form, saveSettings);
  const hours = useFieldArray({ control: form.control, name: "workingHours" });
  const social = useFieldArray({ control: form.control, name: "social" });
  const c = form.control;
  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="grid gap-6 lg:grid-cols-[1fr_300px]" noValidate>
        <div className="space-y-6">
          <FormSection title="Company">
            <div className="grid gap-5 sm:grid-cols-2">
              <TextField control={c} name="name" label="Site name" />
              <TextField control={c} name="legalName" label="Legal name" />
              <TextField control={c} name="shortName" label="Short name" />
              <TextField control={c} name="tagline" label="Tagline" />
            </div>
            <TextAreaField control={c} name="description" label="Default meta description" rows={3} />
            <TextField control={c} name="defaultOgImage" label="Default social share image" description="URL or website path, e.g. /images/og-default.jpg" />
          </FormSection>
          <FormSection title="Contact details" description="Shown in the footer, contact page and structured data.">
            <div className="grid gap-5 sm:grid-cols-2">
              <TextField control={c} name="email" label="General email" type="email" />
              <TextField control={c} name="careersEmail" label="Careers email" type="email" />
              <TextField control={c} name="phone" label="Phone (display)" />
              <TextField control={c} name="phoneHref" label="Phone link" description="e.g. tel:+97140000000" />
              <TextField control={c} name="whatsapp" label="WhatsApp number" />
            </div>
          </FormSection>
          <FormSection title="Office address">
            <div className="grid gap-5 sm:grid-cols-2">
              <TextField control={c} name="addressLine1" label="Address line 1" className="sm:col-span-2" />
              <TextField control={c} name="addressLine2" label="Address line 2" className="sm:col-span-2" />
              <TextField control={c} name="city" label="City" />
              <TextField control={c} name="emirate" label="Emirate" />
              <TextField control={c} name="country" label="Country" />
              <TextField control={c} name="countryCode" label="Country code" />
            </div>
            <TextField control={c} name="mapEmbedUrl" label="Google Maps embed URL" description="From Google Maps → Share → Embed a map → copy the src URL." />
          </FormSection>
          <FormSection title="Working hours">
            {hours.fields.map((f, i) => (
              <div key={f.id} className="flex items-end gap-2">
                <TextField control={c} name={`workingHours.${i}.days`} label="Days" className="flex-1" />
                <TextField control={c} name={`workingHours.${i}.hours`} label="Hours" className="flex-1" />
                <Button type="button" variant="ghost" size="icon" aria-label="Remove" onClick={() => hours.remove(i)}>
                  <Trash2 className="text-destructive" />
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={() => hours.append({ days: "", hours: "" })}>
              <Plus /> Add row
            </Button>
          </FormSection>
          <FormSection title="Social links">
            {social.fields.map((f, i) => (
              <div key={f.id} className="grid items-end gap-2 sm:grid-cols-[150px_1fr_2fr_auto]">
                <SelectField
                  control={c}
                  name={`social.${i}.platform`}
                  label="Platform"
                  options={["linkedin", "instagram", "facebook", "x", "youtube"].map((p) => ({ value: p, label: p[0].toUpperCase() + p.slice(1) }))}
                />
                <TextField control={c} name={`social.${i}.label`} label="Label" />
                <TextField control={c} name={`social.${i}.href`} label="URL" />
                <Button type="button" variant="ghost" size="icon" aria-label="Remove" onClick={() => social.remove(i)}>
                  <Trash2 className="text-destructive" />
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={() => social.append({ platform: "linkedin", label: "LinkedIn", href: "" })}>
              <Plus /> Add link
            </Button>
          </FormSection>
          <FormSection title="About page">
            <TextAreaField control={c} name="mission" label="Mission" rows={3} />
            <TextAreaField control={c} name="vision" label="Vision" rows={3} />
          </FormSection>
        </div>
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <FormSection title="Save">
            <p className="text-muted-foreground text-sm">Changes appear on the website after it refreshes its cache (usually within a few minutes, or immediately if revalidation is configured).</p>
            <SaveButton pending={pending} />
          </FormSection>
        </aside>
      </form>
    </Form>
  );
}
