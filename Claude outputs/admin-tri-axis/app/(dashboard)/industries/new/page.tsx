import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/PageHeader";
import { requireUser } from "@/lib/auth/dal";
import { IndustryForm } from "../IndustryForm";

export const metadata: Metadata = { title: "New industry" };

export default async function NewIndustryPage() {
  await requireUser();
  return (
    <>
      <PageHeader title="New industry" back={{ href: "/industries", label: "Industries" }} />
      <IndustryForm id={null} defaults={{ name: "", slug: "", shortName: "", icon: "layers", summary: "", description: "", roles: [{ value: "" }], sortOrder: 100, isPublished: true, seoTitle: "", seoDescription: "" }} />
    </>
  );
}
