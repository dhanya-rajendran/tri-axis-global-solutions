import type { Metadata } from "next";
import { asc } from "drizzle-orm";
import { PageHeader } from "@/components/shared/PageHeader";
import { db } from "@/db";
import { adminUsers } from "@/db/schema";
import { requireAdmin } from "@/lib/auth/dal";
import { formatDate } from "@/lib/utils";
import { UsersManager } from "./UsersManager";

export const metadata: Metadata = { title: "Admin users" };

export default async function UsersPage() {
  const me = await requireAdmin();
  const rows = await db
    .select({ id: adminUsers.id, name: adminUsers.name, email: adminUsers.email, role: adminUsers.role, isActive: adminUsers.isActive, lastLoginAt: adminUsers.lastLoginAt })
    .from(adminUsers)
    .orderBy(asc(adminUsers.name));
  return (
    <>
      <PageHeader title="Admin users" description="People who can sign in to this dashboard." />
      <UsersManager meId={me.id} users={rows.map((r) => ({ ...r, lastLoginAt: r.lastLoginAt ? formatDate(r.lastLoginAt, true) : null }))} />
    </>
  );
}
