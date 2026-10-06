import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { DeleteButton } from "@/components/shared/DeleteButton";
import { PageHeader } from "@/components/shared/PageHeader";
import { db } from "@/db";
import { services } from "@/db/schema";
import { requireUser } from "@/lib/auth/dal";
import { fromContentBlocks } from "@/lib/content-blocks";
import { deleteService } from "../actions";
import { ServiceForm } from "../ServiceForm";

export const metadata: Metadata = { title: "Edit service" };

export default async function EditServicePage({ params }: PageProps<"/services/[id]">) {
  await requireUser();
  const id = Number((await params).id);
  if (!Number.isInteger(id)) notFound();
  const [s] = await db.select().from(services).where(eq(services.id, id)).limit(1);
  if (!s) notFound();
  return (
    <>
      <PageHeader
        title={s.title}
        back={{ href: "/services", label: "Services" }}
        actions={<DeleteButton action={deleteService.bind(null, s.id)} itemLabel={`“${s.title}”`} redirectTo="/services" variant="button" />}
      />
      <ServiceForm
        id={s.id}
        defaults={{
          title: s.title, slug: s.slug, shortTitle: s.shortTitle, summary: s.summary, intro: s.intro, icon: s.icon,
          imageUrl: s.imageUrl ?? "", imageAlt: s.imageAlt ?? "", ctaLabel: s.ctaLabel, category: s.category,
          offerings: s.offerings, body: fromContentBlocks(s.body), sortOrder: s.sortOrder, isPublished: s.isPublished,
          seoTitle: s.seoTitle ?? "", seoDescription: s.seoDescription ?? "",
        }}
      />
    </>
  );
}
