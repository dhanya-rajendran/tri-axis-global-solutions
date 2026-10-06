"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import type { FieldValues, UseFormReturn } from "react-hook-form";
import { handleActionResult } from "./fields";

type Result = { ok: true; message?: string; data?: { id: number } } | { ok: false; error: string; fieldErrors?: Record<string, string> };

/**
 * Standard submit handler: calls the server action, maps errors to fields,
 * shows a toast, and navigates to the edit page after create.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useSaveForm<TIn extends FieldValues, TOut>(form: UseFormReturn<TIn, any, TOut>, save: (values: TOut) => Promise<Result>, editPath?: (id: number) => string) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const onSubmit = form.handleSubmit(
    () =>
      start(async () => {
        // Send the raw form values: the server action re-validates them with the
        // same schema (which expects the form shape, not the transformed output).
        const res = await save(form.getValues() as unknown as TOut);
        if (handleActionResult(form, res) && res.ok) {
          form.reset(form.getValues());
          if (editPath && res.data?.id && !window.location.pathname.endsWith(`/${res.data.id}`)) router.replace(editPath(res.data.id));
          else router.refresh();
        }
      }),
    () => setTimeout(() => document.querySelector<HTMLElement>("[aria-invalid=true]")?.focus(), 0),
  );
  return { onSubmit, pending };
}
