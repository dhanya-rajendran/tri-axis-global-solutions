"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { Form } from "@/components/ui/form";
import { TextField } from "@/components/forms/fields";
import { SaveButton } from "@/components/forms/SaveButton";
import { useSaveForm } from "@/components/forms/useSaveForm";
import { passwordChangeSchema } from "@/lib/validators";
import { changeOwnPassword } from "../users/actions";

export function PasswordForm() {
  const form = useForm<z.input<typeof passwordChangeSchema>, unknown, z.output<typeof passwordChangeSchema>>({
    resolver: zodResolver(passwordChangeSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  });
  const { onSubmit, pending } = useSaveForm(form, async (v) => {
    const res = await changeOwnPassword(v);
    if (res.ok) form.reset({ currentPassword: "", newPassword: "", confirmPassword: "" });
    return res;
  });
  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="max-w-sm space-y-4" noValidate>
        <TextField control={form.control} name="currentPassword" label="Current password" type="password" autoComplete="current-password" />
        <TextField control={form.control} name="newPassword" label="New password" type="password" autoComplete="new-password" description="At least 10 characters." />
        <TextField control={form.control} name="confirmPassword" label="Confirm new password" type="password" autoComplete="new-password" />
        <SaveButton pending={pending} label="Change password" />
      </form>
    </Form>
  );
}
