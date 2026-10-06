import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { asc } from "drizzle-orm";
import type { MySqlColumn } from "drizzle-orm/mysql-core";
import { PageHeader } from "@/components/shared/PageHeader";
import { db } from "@/db";
import { requireUser } from "@/lib/auth/dal";
import { entities, isEntityKey } from "@/lib/entities";
import { entityTables } from "@/lib/entities.server";
import { EntityManager } from "./EntityManager";

export async function generateMetadata({ params }: PageProps<"/content/[entity]">): Promise<Metadata> {
  const { entity } = await params;
  return { title: isEntityKey(entity) ? entities[entity].title : "Content" };
}

export default async function EntityPage({ params }: PageProps<"/content/[entity]">) {
  await requireUser();
  const { entity } = await params;
  if (!isEntityKey(entity)) notFound();
  const cfg = entities[entity];
  const table = entityTables[entity];
  const rows = (await db
    .select()
    .from(table)
    .orderBy(asc((table as unknown as { sortOrder: MySqlColumn }).sortOrder))) as unknown as ({ id: number } & Record<string, unknown>)[];
  // Strip Date objects (not needed in the client table) to keep props serialisable.
  const plain = rows.map((r) => {
    const copy = { ...r };
    delete copy.createdAt;
    delete copy.updatedAt;
    return copy;
  });
  return (
    <>
      <PageHeader title={cfg.title} description={cfg.description} />
      <EntityManager entityKey={entity} rows={plain} />
    </>
  );
}
