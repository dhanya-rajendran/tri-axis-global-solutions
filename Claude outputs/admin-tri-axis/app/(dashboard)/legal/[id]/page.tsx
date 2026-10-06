import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { PageHeader } from "@/components/shared/PageHeader";
import { db } from "@/db";
import { legalPages } from "@/db/schema";
import { requireUser } from "@/lib/auth/dal";
import { LegalForm } from "../LegalForm";

export const metadata: Metadata = { title: "Edit legal page" };

export default async function EditLegalPage({ params }: PageProps<"/legal/[id]">) {
  await requireUser();
  const id = Number((await params).id);
  if (!Number.isInteger(id)) notFound();
  const [p] = await db.select().from(legalPages).where(eq(legalPages.id, id)).limit(1);
  if (!p) notFound();
  return (
    <>
      <PageHeader title={p.title} description={`/${p.slug}`} back={{ href: "/legal", label: "Legal pages" }} />
      <LegalForm id={p.id} defaults={{ title: p.title, intro: p.intro, isDraft: p.isDraft, sections: p.sections.map((s) => ({ heading: s.heading, body: s.paragraphs.join("\n\n") })) }} />
    </>
  );
}
