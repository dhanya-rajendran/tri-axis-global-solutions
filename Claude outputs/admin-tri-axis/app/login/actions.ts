"use server";

import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { adminUsers } from "@/db/schema";
import { type ActionResult, fail } from "@/lib/actions";
import { createSession, deleteSession } from "@/lib/auth/session";
import { loginSchema } from "@/lib/validators";

// Dummy hash so unknown emails take the same time as wrong passwords.
let dummyHash: string | undefined;
const getDummyHash = async () => (dummyHash ??= await bcrypt.hash("not-a-real-password", 12));

export async function login(input: unknown, next?: string): Promise<ActionResult> {
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) return fail("Enter your email and password.");
  const { email, password } = parsed.data;

  const [user] = await db.select().from(adminUsers).where(eq(adminUsers.email, email)).limit(1);
  const valid = await bcrypt.compare(password, user?.passwordHash ?? (await getDummyHash()));
  if (!user || !valid) return fail("Incorrect email or password.");
  if (!user.isActive) return fail("This account has been deactivated. Contact an administrator.");

  await db.update(adminUsers).set({ lastLoginAt: new Date() }).where(eq(adminUsers.id, user.id));
  await createSession(user.id, user.role);
  redirect(next && next.startsWith("/") && !next.startsWith("//") ? next : "/");
}

export async function logout() {
  await deleteSession();
  redirect("/login");
}
