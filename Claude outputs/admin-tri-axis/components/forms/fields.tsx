"use client";

import * as React from "react";
import { useFieldArray, useFormState, type Control, type FieldPath, type FieldValues, type UseFormReturn } from "react-hook-form";
import { ArrowDown, ArrowUp, GripVertical, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { IconPreview, iconNames } from "@/lib/icons";
import { cn, slugify } from "@/lib/utils";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyControl<T extends FieldValues> = Control<T, any, any>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyForm<T extends FieldValues> = UseFormReturn<T, any, any>;

type Base<T extends FieldValues> = {
  control: AnyControl<T>;
  name: FieldPath<T>;
  label: string;
  description?: React.ReactNode;
  className?: string;
};

export function TextField<T extends FieldValues>({
  control,
  name,
  label,
  description,
  className,
  type = "text",
  placeholder,
  autoComplete,
}: Base<T> & { type?: string; placeholder?: string; autoComplete?: string }) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input type={type} placeholder={placeholder} autoComplete={autoComplete} {...field} value={field.value ?? ""} />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export function TextAreaField<T extends FieldValues>({
  control,
  name,
  label,
  description,
  className,
  rows = 4,
  placeholder,
}: Base<T> & { rows?: number; placeholder?: string }) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Textarea rows={rows} placeholder={placeholder} {...field} value={field.value ?? ""} />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export function SelectField<T extends FieldValues>({
  control,
  name,
  label,
  description,
  className,
  options,
  placeholder = "Select…",
  allowNone,
}: Base<T> & { options: { value: string; label: string }[]; placeholder?: string; allowNone?: string }) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel>{label}</FormLabel>
          <Select onValueChange={field.onChange} value={field.value ?? ""}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {allowNone && <SelectItem value="none">{allowNone}</SelectItem>}
              {options.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export function SwitchField<T extends FieldValues>({ control, name, label, description, className }: Base<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("flex flex-row items-center justify-between gap-4 rounded-lg border bg-white p-3", className)}>
          <div className="space-y-0.5">
            <FormLabel>{label}</FormLabel>
            {description && <FormDescription>{description}</FormDescription>}
          </div>
          <FormControl>
            <Switch checked={!!field.value} onCheckedChange={field.onChange} />
          </FormControl>
        </FormItem>
      )}
    />
  );
}

export function IconField<T extends FieldValues>({ control, name, label, description, className }: Base<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel>{label}</FormLabel>
          <Select onValueChange={field.onChange} value={field.value ?? ""}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Choose an icon" />
              </SelectTrigger>
            </FormControl>
            <SelectContent className="max-h-72">
              {iconNames.map((n) => (
                <SelectItem key={n} value={n}>
                  <IconPreview name={n} className="size-4 text-teal" />
                  {n}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

/** Slug input with a "generate from title" helper. */
export function SlugField<T extends FieldValues>({
  form,
  name,
  sourceName,
  label = "Slug",
  prefix,
}: {
  form: AnyForm<T>;
  name: FieldPath<T>;
  sourceName: FieldPath<T>;
  label?: string;
  prefix?: string;
}) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <div className="flex gap-2">
            <FormControl>
              <Input {...field} value={field.value ?? ""} className="font-mono text-xs" />
            </FormControl>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                const src = String(form.getValues(sourceName) ?? "");
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                form.setValue(name, slugify(src) as any, { shouldValidate: true, shouldDirty: true });
              }}
            >
              Generate
            </Button>
          </div>
          {prefix && <FormDescription>URL: {prefix}{String(field.value || "…")}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function MoveButtons({ index, count, move }: { index: number; count: number; move: (a: number, b: number) => void }) {
  return (
    <div className="flex flex-col">
      <button type="button" aria-label="Move up" disabled={index === 0} onClick={() => move(index, index - 1)} className="text-muted-foreground hover:text-foreground disabled:opacity-30">
        <ArrowUp className="size-3.5" />
      </button>
      <button type="button" aria-label="Move down" disabled={index === count - 1} onClick={() => move(index, index + 1)} className="text-muted-foreground hover:text-foreground disabled:opacity-30">
        <ArrowDown className="size-3.5" />
      </button>
    </div>
  );
}

/** Editable list of strings stored as { value }[] in the form. */
export function StringListField<T extends FieldValues>({
  control,
  name,
  label,
  description,
  addLabel = "Add item",
  multiline,
}: Base<T> & { addLabel?: string; multiline?: boolean }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { fields, append, remove, move } = useFieldArray({ control, name: name as any });
  return (
    <div className="space-y-2">
      <div>
        <p className="text-sm font-medium">{label}</p>
        {description && <p className="text-muted-foreground text-xs">{description}</p>}
      </div>
      <div className="space-y-2">
        {fields.map((f, i) => (
          <div key={f.id} className="flex items-start gap-2">
            <GripVertical className="text-muted-foreground mt-2.5 size-4 shrink-0" aria-hidden />
            <FormField
              control={control}
              name={`${name}.${i}.value` as FieldPath<T>}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    {multiline ? <Textarea rows={2} {...field} value={field.value ?? ""} /> : <Input {...field} value={field.value ?? ""} />}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <MoveButtons index={i} count={fields.length} move={move} />
            <Button type="button" variant="ghost" size="icon-sm" aria-label="Remove" onClick={() => remove(i)}>
              <Trash2 className="text-destructive" />
            </Button>
          </div>
        ))}
      </div>
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <Button type="button" variant="outline" size="sm" onClick={() => append({ value: "" } as any)}>
        <Plus /> {addLabel}
      </Button>
      <ArrayRootError control={control} name={name} />
    </div>
  );
}

function ArrayRootError<T extends FieldValues>({ control, name }: { control: AnyControl<T>; name: FieldPath<T> }) {
  // Field-array level errors live at errors.<name>.root (or errors.<name> before registration).
  const { errors } = useFormState({ control, name });
  const err = name.split(".").reduce<unknown>((o, k) => (o as Record<string, unknown> | undefined)?.[k], errors) as
    | { message?: string; root?: { message?: string } }
    | undefined;
  const message = err?.root?.message ?? err?.message;
  return message ? <p className="text-destructive text-xs">{message}</p> : null;
}

/** Rich-text-like editor: ordered blocks of paragraph / heading / list / quote. */
export function ContentBlocksField<T extends FieldValues>({ control, name, label, description }: Base<T>) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { fields, append, remove, move } = useFieldArray({ control, name: name as any });
  return (
    <div className="space-y-3">
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-muted-foreground text-xs">
          {description ?? "Build the content from blocks. For lists, put one item per line."}
        </p>
      </div>
      {fields.map((f, i) => (
        <div key={f.id} className="bg-muted/40 space-y-3 rounded-lg border p-3">
          <div className="flex items-center gap-2">
            <FormField
              control={control}
              name={`${name}.${i}.type` as FieldPath<T>}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger size="sm" className="w-36">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="paragraph">Paragraph</SelectItem>
                    <SelectItem value="heading">Heading</SelectItem>
                    <SelectItem value="list">Bullet list</SelectItem>
                    <SelectItem value="quote">Quote</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            <span className="text-muted-foreground text-xs">Block {i + 1}</span>
            <div className="ml-auto flex items-center gap-1">
              <MoveButtons index={i} count={fields.length} move={move} />
              <Button type="button" variant="ghost" size="icon-sm" aria-label="Remove block" onClick={() => remove(i)}>
                <Trash2 className="text-destructive" />
              </Button>
            </div>
          </div>
          <FormField
            control={control}
            name={`${name}.${i}.text` as FieldPath<T>}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea rows={3} {...field} value={field.value ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      ))}
      <div className="flex flex-wrap gap-2">
        {(["paragraph", "heading", "list", "quote"] as const).map((type) => (
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          <Button key={type} type="button" variant="outline" size="sm" onClick={() => append({ type, text: "" } as any)}>
            <Plus /> {type[0].toUpperCase() + type.slice(1)}
          </Button>
        ))}
      </div>
      <ArrayRootError control={control} name={name} />
    </div>
  );
}

/** Apply a server ActionResult to the form: field errors + toast. Returns ok. */
export function handleActionResult<T extends FieldValues>(
  form: AnyForm<T>,
  result: { ok: true; message?: string } | { ok: false; error: string; fieldErrors?: Record<string, string> },
  successMessage = "Saved",
): boolean {
  if (result.ok) {
    toast.success(result.message ?? successMessage);
    return true;
  }
  if (result.fieldErrors) {
    for (const [k, v] of Object.entries(result.fieldErrors)) form.setError(k as FieldPath<T>, { message: v });
  }
  toast.error(result.error);
  return false;
}

export function FormSection({ title, description, children, className }: { title: string; description?: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={cn("bg-card rounded-xl border p-5 shadow-xs sm:p-6", className)}>
      <div className="mb-5">
        <h2 className="text-base font-semibold">{title}</h2>
        {description && <p className="text-muted-foreground mt-0.5 text-sm">{description}</p>}
      </div>
      <div className="space-y-5">{children}</div>
    </section>
  );
}
