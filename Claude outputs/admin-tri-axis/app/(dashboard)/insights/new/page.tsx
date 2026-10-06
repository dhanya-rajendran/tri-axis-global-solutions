import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/PageHeader";
import { requireUser } from "@/lib/auth/dal";
import { InsightForm } from "../InsightForm";
import { getCategoryOptions } from "../options";

export const metadata: Metadata = { title: "New article" };

export default async function NewInsightPage() {
  const user = await requireUser();
  return (
    <>
      <PageHeader title="New article" back={{ href: "/insights", label: "Insights" }} />
      <InsightForm
        id={null}
        categories={await getCategoryOptions()}
        defaults={{
          title: "", slug: "", excerpt: "", imageUrl: "", imageAlt: "", categoryId: "none", authorName: "TriAxis Editorial Team",
          authorRole: user.name ? "Insights & Research" : "", publishedAt: new Date().toISOString().slice(0, 10), readingMinutes: 5,
          content: [{ type: "paragraph", text: "" }], featured: false, status: "draft", downloadLabel: "", downloadUrl: "", seoTitle: "", seoDescription: "",
        }}
      />
    </>
  );
}
