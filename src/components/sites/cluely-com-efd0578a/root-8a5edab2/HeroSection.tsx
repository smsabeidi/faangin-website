"use client";

import { LazyMotion, domAnimation, m } from "motion/react";
import { DownloadButton } from "@/components/sites/cluely-com-efd0578a/shared/download-button";
import HeroDemo from "./hero/HeroDemo";
import HeroTitle from "./hero/HeroTitle";

/**
 * Original module 84294 default export (`j`): the `.hero-v2` section — word-rise title,
 * subtitle, download button and actual faangin capture gallery.
 */
export default function HeroSection() {
  return (
    <LazyMotion features={domAnimation}>
      <div className="hero-v2 flex flex-col items-center gap-8 lg:gap-12">
        <div className="relative w-full">
          <section className="flex h-full items-start justify-center px-3 pt-20 lg:pt-32">
            <div className="flex flex-col items-center gap-8">
              <div className="flex flex-col items-center gap-4">
                <HeroTitle />
              </div>
              <m.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 490, damping: 130, delay: 1.3 }}
                id="download-button"
                className="flex flex-col items-center"
              >
                <DownloadButton variant="prominent" showRequirements className="text-white" />
                <p className="mt-3 max-w-[340px] text-center text-xs leading-relaxed text-white/90">
                  Download for your desktop. Sign in to get started.
                </p>
              </m.div>
            </div>
          </section>
        </div>
        <HeroDemo />
      </div>
    </LazyMotion>
  );
}
