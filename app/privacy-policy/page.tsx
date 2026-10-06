import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegalPage } from "@/components/templates/LegalPage";
import { buildMetadata } from "@/lib/seo/metadata";
import { getLegalPage } from "@/lib/services/api";

export async function generateMetadata(): Promise<Metadata> {
  const doc = await getLegalPage("privacy-policy");
  return buildMetadata({
    title: doc?.title ?? "Privacy Policy",
    description: `${doc?.title ?? "Privacy Policy"} for TriAxis Global Solutions FZE — ${(doc?.intro ?? "").slice(0, 90)}`.slice(0, 160),
    path: "/privacy-policy",
  });
}

export default async function Page() {
  const doc = await getLegalPage("privacy-policy");
  if (!doc) notFound();
  return <LegalPage doc={doc} />;
}
