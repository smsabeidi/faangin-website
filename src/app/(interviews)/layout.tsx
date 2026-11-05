import type { ReactNode } from "react";
import SiteHeader from "@/components/sites/cluely-com-efd0578a/root-8a5edab2/SiteHeader";
import SiteFooter from "@/components/sites/cluely-com-efd0578a/root-8a5edab2/SiteFooter";
import HeroSky from "@/components/sites/cluely-com-efd0578a/root-8a5edab2/hero/HeroSky";
import SceneModeSelector from "@/components/sites/cluely-com-efd0578a/root-8a5edab2/SceneModeSelector";

export default function InterviewLayout({ children }: { children: ReactNode }) {
  return (
    <div id="interview-top" className="air-sky-page relative isolate flex grow flex-col">
      <a href="#interview-content" className="faangin-legal-skip-link">Skip to interview guidance</a>
      <HeroSky />
      <SceneModeSelector />
      <SiteHeader />
      <main id="interview-content" tabIndex={-1} className="relative grow pt-16">{children}</main>
      <SiteFooter backToTopHref="#interview-top" />
    </div>
  );
}
