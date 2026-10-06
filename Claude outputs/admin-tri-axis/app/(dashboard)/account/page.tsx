import type { Metadata } from "next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/PageHeader";
import { requireUser } from "@/lib/auth/dal";
import { PasswordForm } from "./PasswordForm";

export const metadata: Metadata = { title: "Account" };

export default async function AccountPage() {
  const user = await requireUser();
  return (
    <>
      <PageHeader title="Account" description={`${user.name} · ${user.email} · ${user.role}`} />
      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>Change password</CardTitle>
          <CardDescription>Use a strong password you don’t use elsewhere.</CardDescription>
        </CardHeader>
        <CardContent>
          <PasswordForm />
        </CardContent>
      </Card>
    </>
  );
}
