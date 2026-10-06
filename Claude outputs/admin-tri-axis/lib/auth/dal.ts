import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { adminUsers } from "@/db/schema";
import { SESSION_COOKIE, decrypt } from "./session";

export type CurrentUser = { id: number; name: string; email: string; role: "admin" | "editor" };

/** Verifies the session cookie AND that the user still exists and is active. */
export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  const session = await decrypt((await cookies()).get(SESSION_COOKIE)?.value);
  if (!session) return null;
  const [user] = await db
    .select({ id: adminUsers.id, name: adminUsers.name, email: adminUsers.email, role: adminUsers.role, isActive: adminUsers.isActive })
    .from(adminUsers)
    .where(eq(adminUsers.id, session.userId))
    .limit(1);
  if (!user || !user.isActive) return null;
  return { id: user.id, name: user.name, email: user.email, role: user.role };
});

export async function requireUser(): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

export async function requireAdmin(): Promise<CurrentUser> {
  const user = await requireUser();
  if (user.role !== "admin") redirect("/?denied=1");
  return user;
}
