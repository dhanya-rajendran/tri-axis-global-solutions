import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegalPage } from "@/components/templates/LegalPage";
import { buildMetadata } from "@/lib/seo/metadata";
import { getLegalPage } from "@/lib/services/api";

export async function generateMetadata(): Promise<Metadata> {
  const doc = await getLegalPage("cookie-policy");
  return buildMetadata({
    title: doc?.title ?? "Cookie Policy",
    description: `${doc?.title ?? "Cookie Policy"} for TriAxis Global Solutions FZE — ${(doc?.intro ?? "").slice(0, 90)}`.slice(0, 160),
    path: "/cookie-policy",
  });
}

export default async function Page() {
  const doc = await getLegalPage("cookie-policy");
  if (!doc) notFound();
  return <LegalPage doc={doc} />;
}
