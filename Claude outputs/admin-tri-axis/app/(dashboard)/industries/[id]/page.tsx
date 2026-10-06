import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { DeleteButton } from "@/components/shared/DeleteButton";
import { PageHeader } from "@/components/shared/PageHeader";
import { db } from "@/db";
import { industries } from "@/db/schema";
import { requireUser } from "@/lib/auth/dal";
import { toListField } from "@/lib/validators";
import { deleteIndustry } from "../actions";
import { IndustryForm } from "../IndustryForm";

export const metadata: Metadata = { title: "Edit industry" };

export default async function EditIndustryPage({ params }: PageProps<"/industries/[id]">) {
  await requireUser();
  const id = Number((await params).id);
  if (!Number.isInteger(id)) notFound();
  const [i] = await db.select().from(industries).where(eq(industries.id, id)).limit(1);
  if (!i) notFound();
  return (
    <>
      <PageHeader
        title={i.name}
        back={{ href: "/industries", label: "Industries" }}
        actions={<DeleteButton action={deleteIndustry.bind(null, i.id)} itemLabel={`“${i.name}”`} redirectTo="/industries" variant="button" />}
      />
      <IndustryForm
        id={i.id}
        defaults={{
          name: i.name, slug: i.slug, shortName: i.shortName ?? "", icon: i.icon, summary: i.summary, description: i.description,
          roles: toListField(i.roles), sortOrder: i.sortOrder, isPublished: i.isPublished, seoTitle: i.seoTitle ?? "", seoDescription: i.seoDescription ?? "",
        }}
      />
    </>
  );
}
