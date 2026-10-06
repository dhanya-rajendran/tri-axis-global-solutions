import type { Metadata } from "next";
import { Hero } from "@/components/hero/Hero";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { IndustriesSection } from "@/components/sections/IndustriesSection";
import { InsightsSection } from "@/components/sections/InsightsSection";
import { JourneyCards } from "@/components/sections/JourneyCards";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { RecruitmentFeature } from "@/components/sections/RecruitmentFeature";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { TrustSection } from "@/components/sections/TrustSection";
import { WhyTriAxis } from "@/components/sections/WhyTriAxis";
import { buildMetadata } from "@/lib/seo/metadata";
import {
  getFeatures,
  getIndustries,
  getInsights,
  getJobFilterOptions,
  getProcessSteps,
  getServiceBySlug,
  getServices,
  getStatistics,
  getTestimonials,
} from "@/lib/services/api";

export const metadata: Metadata = buildMetadata({
  path: "/",
  description:
    "TriAxis Global Solutions is a UAE recruitment and HR consultancy in Dubai offering recruitment, talent management, procurement, general trading and e-commerce solutions.",
  keywords: [
    "TriAxis Global Solutions",
    "recruitment company UAE",
    "HR consultancy UAE",
    "recruitment agency Dubai",
    "talent management UAE",
    "business solutions UAE",
  ],
});

export default async function HomePage() {
  const [jobOptions, services, recruitment, industries, statistics, testimonials, insights, valuePropositions, processSteps] = await Promise.all([
    getJobFilterOptions(),
    getServices(),
    getServiceBySlug("recruitment-talent-management"),
    getIndustries(),
    getStatistics(),
    getTestimonials(),
    getInsights({ limit: 4 }),
    getFeatures("why_triaxis"),
    getProcessSteps(),
  ]);

  return (
    <>
      <Hero jobOptions={jobOptions} />
      <JourneyCards />
      <ServicesSection services={services} />
      {recruitment && <RecruitmentFeature service={recruitment} />}
      <IndustriesSection industries={industries} />
      <WhyTriAxis items={valuePropositions} />
      <ProcessSection steps={processSteps} />
      <TrustSection statistics={statistics} testimonial={testimonials[0]} />
      <InsightsSection insights={insights} />
      <FinalCTA />
    </>
  );
}
