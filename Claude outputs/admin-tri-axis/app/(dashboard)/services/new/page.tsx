import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/PageHeader";
import { requireUser } from "@/lib/auth/dal";
import { ServiceForm } from "../ServiceForm";

export const metadata: Metadata = { title: "New service" };

export default async function NewServicePage() {
  await requireUser();
  return (
    <>
      <PageHeader title="New service" back={{ href: "/services", label: "Services" }} />
      <ServiceForm
        id={null}
        defaults={{
          title: "", slug: "", shortTitle: "", summary: "", intro: "", icon: "layers", imageUrl: "", imageAlt: "", ctaLabel: "",
          category: "business", offerings: [], body: [], sortOrder: 10, isPublished: false, seoTitle: "", seoDescription: "",
        }}
      />
    </>
  );
}
