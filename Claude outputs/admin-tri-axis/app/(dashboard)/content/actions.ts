"use server";

import { eq } from "drizzle-orm";
import type { MySqlColumn } from "drizzle-orm/mysql-core";
import { db } from "@/db";
import { type ActionResult, dbError, fail, revalidateContent, zodFieldErrors } from "@/lib/actions";
import { requireUser } from "@/lib/auth/dal";
import { entities, isEntityKey } from "@/lib/entities";
import { entityNullable, entityTables, entityUnique } from "@/lib/entities.server";

export async function saveEntity(key: string, id: number | null, input: unknown): Promise<ActionResult<{ id: number }>> {
  await requireUser();
  if (!isEntityKey(key)) return fail("Unknown content type");
  const parsed = entities[key].schema.safeParse(input);
  if (!parsed.success) return fail("Please fix the highlighted fields.", zodFieldErrors(parsed.error));
  const row = { ...(parsed.data as Record<string, unknown>) };
  for (const f of entityNullable[key] ?? []) if (typeof row[f] === "string" && !(row[f] as string).trim()) row[f] = null;

  const table = entityTables[key];
  const idCol = (table as unknown as { id: MySqlColumn }).id;
  try {
    let savedId = id;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (id) await db.update(table).set(row as any).where(eq(idCol, id));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    else savedId = ((await db.insert(table).values(row as any).$returningId()) as { id: number }[])[0].id;
    revalidateContent(`/content/${key}`);
    return { ok: true, message: `${entities[key].singular[0].toUpperCase()}${entities[key].singular.slice(1)} saved`, data: { id: savedId! } };
  } catch (err) {
    return dbError(err, entityUnique[key]);
  }
}

export async function deleteEntity(key: string, id: number): Promise<ActionResult> {
  await requireUser();
  if (!isEntityKey(key)) return fail("Unknown content type");
  const table = entityTables[key];
  try {
    await db.delete(table).where(eq((table as unknown as { id: MySqlColumn }).id, id));
    revalidateContent(`/content/${key}`);
    return { ok: true, message: "Deleted" };
  } catch (err) {
    return dbError(err);
  }
}
