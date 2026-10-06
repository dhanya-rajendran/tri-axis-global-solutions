import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegalPage } from "@/components/templates/LegalPage";
import { buildMetadata } from "@/lib/seo/metadata";
import { getLegalPage } from "@/lib/services/api";

export async function generateMetadata(): Promise<Metadata> {
  const doc = await getLegalPage("terms");
  return buildMetadata({
    title: doc?.title ?? "Terms & Conditions",
    description: `${doc?.title ?? "Terms & Conditions"} for TriAxis Global Solutions FZE — ${(doc?.intro ?? "").slice(0, 90)}`.slice(0, 160),
    path: "/terms",
  });
}

export default async function Page() {
  const doc = await getLegalPage("terms");
  if (!doc) notFound();
  return <LegalPage doc={doc} />;
}
