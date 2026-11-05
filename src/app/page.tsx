import SiteHeader from "@/components/sites/cluely-com-efd0578a/root-8a5edab2/SiteHeader";
import HeroSection from "@/components/sites/cluely-com-efd0578a/root-8a5edab2/HeroSection";
import HeroSky from "@/components/sites/cluely-com-efd0578a/root-8a5edab2/hero/HeroSky";
import SceneModeSelector from "@/components/sites/cluely-com-efd0578a/root-8a5edab2/SceneModeSelector";
import HowItHelpsSection from "@/components/sites/cluely-com-efd0578a/root-8a5edab2/HowItHelpsSection";
import MeetingNotesSection from "@/components/sites/cluely-com-efd0578a/root-8a5edab2/MeetingNotesSection";
import UndetectabilitySection from "@/components/sites/cluely-com-efd0578a/root-8a5edab2/undetectability/UndetectabilitySection";
import TranscriptionSection from "@/components/sites/cluely-com-efd0578a/root-8a5edab2/TranscriptionSection";
import FaqSection from "@/components/sites/cluely-com-efd0578a/root-8a5edab2/FaqSection";
import PricingSection from "@/components/sites/cluely-com-efd0578a/root-8a5edab2/PricingSection";
import ComparisonSection from "@/components/sites/cluely-com-efd0578a/root-8a5edab2/ComparisonSection";
import CtaSection from "@/components/sites/cluely-com-efd0578a/root-8a5edab2/CtaSection";
import SiteFooter from "@/components/sites/cluely-com-efd0578a/root-8a5edab2/SiteFooter";
import { structuredData } from "@/components/sites/cluely-com-efd0578a/root-8a5edab2/structured-data";
import { SectionDivider } from "@/components/sites/cluely-com-efd0578a/shared/section-divider";
import { JsonLd } from "@/components/seo/JsonLd";
import { pageMetadata } from "@/lib/seo";
import { brand } from "@/lib/site-content";

export const metadata = pageMetadata({ title: brand.title, description: brand.description, path: "/" });

export default function Home() {
  return (
    <div id="top" className="air-sky-page relative isolate flex grow flex-col">
      <HeroSky />
      <SceneModeSelector />
      <SiteHeader />
      <div className="grow">
        <JsonLd data={structuredData} />
        <main className="air-sky-content relative flex flex-col gap-12 overflow-hidden md:gap-24 md:overflow-visible lg:gap-32">
          <HeroSection />
          <SectionDivider />
          <HowItHelpsSection />
          <SectionDivider />
          <MeetingNotesSection />
          <SectionDivider />
          <UndetectabilitySection />
          <SectionDivider />
          <TranscriptionSection />
          <SectionDivider />
          <PricingSection />
          <SectionDivider />
          <ComparisonSection />
          <SectionDivider />
          <FaqSection className="!py-0" />
          <CtaSection />
        </main>
      </div>
      <SiteFooter />
    </div>
  );
}
