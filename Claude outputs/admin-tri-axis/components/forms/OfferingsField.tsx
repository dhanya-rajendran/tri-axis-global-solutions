"use client";

import { useFieldArray, type FieldValues, type Control, type FieldPath } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IconField, TextAreaField, TextField } from "./fields";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function OfferingsField<T extends FieldValues>({ control, name }: { control: Control<T, any, any>; name: FieldPath<T> }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { fields, append, remove } = useFieldArray({ control, name: name as any });
  return (
    <div className="space-y-3">
      {fields.map((f, i) => (
        <div key={f.id} className="bg-muted/40 grid gap-4 rounded-lg border p-4 sm:grid-cols-[1fr_200px_auto]">
          <TextField control={control} name={`${name}.${i}.title` as FieldPath<T>} label="Title" />
          <IconField control={control} name={`${name}.${i}.icon` as FieldPath<T>} label="Icon" />
          <Button type="button" variant="ghost" size="icon-sm" className="mt-6" aria-label="Remove offering" onClick={() => remove(i)}>
            <Trash2 className="text-destructive" />
          </Button>
          <TextAreaField control={control} name={`${name}.${i}.description` as FieldPath<T>} label="Description" rows={2} className="sm:col-span-3" />
        </div>
      ))}
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <Button type="button" variant="outline" size="sm" onClick={() => append({ title: "", description: "", icon: "layers" } as any)}>
        <Plus /> Add offering
      </Button>
    </div>
  );
}
