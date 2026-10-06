import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/PageHeader";
import { db } from "@/db";
import { siteSettings } from "@/db/schema";
import { requireUser } from "@/lib/auth/dal";
import { SettingsForm } from "./SettingsForm";

export const metadata: Metadata = { title: "Site settings" };

export default async function SettingsPage() {
  await requireUser();
  const [s] = await db.select().from(siteSettings).limit(1);
  return (
    <>
      <PageHeader title="Site settings" description="Company details, contact information and social links used across the website." />
      <SettingsForm
        defaults={{
          name: s?.name ?? "TriAxis Global Solutions", legalName: s?.legalName ?? "", shortName: s?.shortName ?? "", tagline: s?.tagline ?? "",
          description: s?.description ?? "", email: s?.email ?? "", careersEmail: s?.careersEmail ?? "", phone: s?.phone ?? "",
          phoneHref: s?.phoneHref ?? "", whatsapp: s?.whatsapp ?? "", addressLine1: s?.addressLine1 ?? "", addressLine2: s?.addressLine2 ?? "",
          city: s?.city ?? "", emirate: s?.emirate ?? "", country: s?.country ?? "United Arab Emirates", countryCode: s?.countryCode ?? "AE",
          workingHours: s?.workingHours ?? [], mapEmbedUrl: s?.mapEmbedUrl ?? "", social: s?.social ?? [], defaultOgImage: s?.defaultOgImage ?? "",
          mission: s?.mission ?? "", vision: s?.vision ?? "",
        }}
      />
    </>
  );
}
