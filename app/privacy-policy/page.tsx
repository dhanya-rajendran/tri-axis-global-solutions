import type { Metadata } from "next";
import { LegalPage } from "@/components/templates/LegalPage";
import { legalDocuments } from "@/lib/data/legal";
import { buildMetadata } from "@/lib/seo/metadata";

const doc = legalDocuments.privacy;

export const metadata: Metadata = buildMetadata({
  title: doc.title,
  description: `${doc.title} for TriAxis Global Solutions FZE — ${doc.intro.slice(0, 90)}`.slice(0, 160),
  path: "/privacy-policy",
});

export default function Page() {
  return <LegalPage doc={doc} />;
}
