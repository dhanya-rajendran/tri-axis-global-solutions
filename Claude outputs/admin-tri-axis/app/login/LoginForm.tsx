"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { TextField } from "@/components/forms/fields";
import { loginSchema } from "@/lib/validators";
import { login } from "./actions";

export function LoginForm({ next }: { next?: string }) {
  const [pending, start] = useTransition();
  const [error, setError] = useState<string>();
  const form = useForm<z.input<typeof loginSchema>>({ resolver: zodResolver(loginSchema), defaultValues: { email: "", password: "" } });

  const onSubmit = form.handleSubmit((values) => {
    setError(undefined);
    start(async () => {
      const res = await login(values, next);
      if (res && !res.ok) setError(res.error);
    });
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        {error && (
          <p role="alert" className="bg-destructive/10 text-destructive rounded-md px-3 py-2 text-sm">
            {error}
          </p>
        )}
        <TextField control={form.control} name="email" label="Email" type="email" autoComplete="username" />
        <TextField control={form.control} name="password" label="Password" type="password" autoComplete="current-password" />
        <Button type="submit" className="w-full" size="lg" disabled={pending}>
          {pending && <LoaderCircle className="animate-spin" />} Sign in
        </Button>
      </form>
    </Form>
  );
}
