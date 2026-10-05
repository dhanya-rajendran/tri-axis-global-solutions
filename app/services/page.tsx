import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { RecruitmentFeature } from "@/components/sections/RecruitmentFeature";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { PageHero } from "@/components/templates/PageHero";
import { ButtonLink } from "@/components/ui/Button";
import { processSteps } from "@/lib/data/company";
import { breadcrumbJsonLd } from "@/lib/seo/jsonld";
import { buildMetadata } from "@/lib/seo/metadata";
import { getServiceBySlug, getServices } from "@/lib/services/api";

export const metadata: Metadata = buildMetadata({
  title: "Our Services",
  description:
    "Recruitment and talent management, procurement consultancy, general trading and e-commerce solutions for businesses in the UAE.",
  path: "/services",
});

export default async function ServicesPage() {
  const [services, recruitment] = await Promise.all([getServices(), getServiceBySlug("recruitment-talent-management")]);
  return (
    <>
      <PageHero
        eyebrow="Our Services"
        title="End-to-end solutions for growing businesses"
        description="Recruitment, procurement, trading and e-commerce — delivered by one accountable partner in the UAE."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Services" }]}
      >
        <ButtonLink href="/contact" variant="primary" arrow>
          Discuss your requirements
        </ButtonLink>
      </PageHero>
      <ServicesSection services={services} showAllLink={false} />
      {recruitment && <RecruitmentFeature service={recruitment} />}
      <div className="border-t border-line">
        <ProcessSection steps={processSteps} />
      </div>
      <FinalCTA />
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Services", path: "/services" }])} />
    </>
  );
}
