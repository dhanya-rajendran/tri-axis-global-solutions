"use client";

import { useWatch, type Control, type FieldPath, type FieldValues } from "react-hook-form";
import { TextField } from "./fields";

/**
 * Image URL input with a live preview. Uploads are not enabled yet — paste a
 * full https:// URL or a website path such as /images/hero.jpg.
 */
export function ImageUrlField<T extends FieldValues>({
  control,
  name,
  label,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<T, any, any>;
  name: FieldPath<T>;
  label: string;
}) {
  const value = useWatch({ control, name }) as string | undefined;
  const websiteUrl = process.env.NEXT_PUBLIC_WEBSITE_URL ?? "";
  const src = value?.startsWith("/") ? (websiteUrl ? `${websiteUrl}${value}` : null) : value;
  return (
    <div className="space-y-3">
      <TextField control={control} name={name} label={label} placeholder="https://… or /images/…" description="Paste an image URL, or a path to an image in the website’s /public folder." />
      {value?.startsWith("/") && !websiteUrl && (
        <p className="text-muted-foreground text-xs">Preview unavailable for site paths — set NEXT_PUBLIC_WEBSITE_URL to enable it.</p>
      )}
      {src && (
        <div className="bg-muted aspect-[16/10] overflow-hidden rounded-md border">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt="" className="size-full object-cover" onError={(e) => (e.currentTarget.style.opacity = "0.15")} />
        </div>
      )}
    </div>
  );
}
