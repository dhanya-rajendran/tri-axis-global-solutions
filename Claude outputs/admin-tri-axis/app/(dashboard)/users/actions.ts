"use server";

import bcrypt from "bcryptjs";
import { and, count, eq, ne } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { adminUsers } from "@/db/schema";
import { type ActionResult, dbError, fail, zodFieldErrors } from "@/lib/actions";
import { requireAdmin, requireUser } from "@/lib/auth/dal";
import { passwordChangeSchema, userSchema } from "@/lib/validators";

async function activeAdminsExcluding(id: number) {
  const [r] = await db
    .select({ n: count() })
    .from(adminUsers)
    .where(and(eq(adminUsers.role, "admin"), eq(adminUsers.isActive, true), ne(adminUsers.id, id)));
  return Number(r.n);
}

export async function saveUser(id: number | null, input: unknown): Promise<ActionResult<{ id: number }>> {
  const me = await requireAdmin();
  const parsed = userSchema.safeParse(input);
  if (!parsed.success) return fail("Please fix the highlighted fields.", zodFieldErrors(parsed.error));
  const v = parsed.data;
  if (!id && !v.password) return fail("Set a password for the new user.", { password: "Password is required for new users" });
  if (id && (v.role !== "admin" || !v.isActive) && (await activeAdminsExcluding(id)) === 0)
    return fail("There must always be at least one active admin.");
  if (id === me.id && !v.isActive) return fail("You can't deactivate your own account.");

  const row = {
    name: v.name,
    email: v.email,
    role: v.role,
    isActive: v.isActive,
    ...(v.password ? { passwordHash: await bcrypt.hash(v.password, 12) } : {}),
  };
  try {
    let savedId = id;
    if (id) await db.update(adminUsers).set(row).where(eq(adminUsers.id, id));
    else savedId = (await db.insert(adminUsers).values({ ...row, passwordHash: row.passwordHash! }).$returningId())[0].id;
    revalidatePath("/users");
    return { ok: true, message: id ? "User updated" : "User created", data: { id: savedId! } };
  } catch (err) {
    return dbError(err, { email: "email" });
  }
}

export async function deleteUser(id: number): Promise<ActionResult> {
  const me = await requireAdmin();
  if (id === me.id) return fail("You can't delete your own account.");
  if ((await activeAdminsExcluding(id)) === 0) return fail("There must always be at least one active admin.");
  await db.delete(adminUsers).where(eq(adminUsers.id, id));
  revalidatePath("/users");
  return { ok: true, message: "User deleted" };
}

export async function changeOwnPassword(input: unknown): Promise<ActionResult> {
  const me = await requireUser();
  const parsed = passwordChangeSchema.safeParse(input);
  if (!parsed.success) return fail("Please fix the highlighted fields.", zodFieldErrors(parsed.error));
  const [u] = await db.select({ hash: adminUsers.passwordHash }).from(adminUsers).where(eq(adminUsers.id, me.id)).limit(1);
  if (!u || !(await bcrypt.compare(parsed.data.currentPassword, u.hash)))
    return fail("Current password is incorrect.", { currentPassword: "Incorrect password" });
  await db.update(adminUsers).set({ passwordHash: await bcrypt.hash(parsed.data.newPassword, 12) }).where(eq(adminUsers.id, me.id));
  return { ok: true, message: "Password changed" };
}
