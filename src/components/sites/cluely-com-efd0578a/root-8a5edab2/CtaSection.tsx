"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, LazyMotion, domAnimation, m, useInView } from "motion/react";

import { images } from "@/components/sites/cluely-com-efd0578a/shared/assets";
import { DownloadButton } from "@/components/sites/cluely-com-efd0578a/shared/download-button";
import { cn } from "@/lib/utils";

const TITLE = "Be ready to explain why.";
const DESCRIPTION = "Keep the constraints, alternatives, and trade-offs in view.";

/* ---------- section (original module 13090) ---------- */

export default function CtaSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);
  const [toggled, setToggled] = useState(false);
  const [wasInView, setWasInView] = useState(false);
  const inView = useInView(ref, { amount: 0.9 });

  // Entering view (≥90%) immediately activates both keys. The original did this with
  // setState inside the effect below; expressed here as a render-phase adjustment so the
  // React Compiler lint (`set-state-in-effect`) passes — same frame, same semantics.
  if (inView !== wasInView) {
    setWasInView(inView);
    if (inView) {
      setStarted(true);
      setToggled(true);
    }
  }

  useEffect(() => {
    if (!inView) return;
    const interval = setInterval(() => {
      setToggled((value) => !value);
    }, 7000);
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [inView]);

  const active = started && toggled;

  return (
    <LazyMotion features={domAnimation}>
      <div
        className={cn("relative z-20 overflow-x-hidden pt-32 pb-16 md:pt-[174px] md:pb-[160px] lg:pb-[210px] xl:pt-[220px]")}
        ref={ref}
      >
        <div className="relative mx-auto w-full max-w-7xl px-5 md:px-8">
          <div className="max-w-[575px] md:max-w-[492px] lg:max-w-[575px]">
            <h3 className="inline text-[20px] leading-tight font-medium -tracking-[0.04em] text-foreground sm:block sm:text-[28px] md:text-[24px] lg:text-[28px]">
              {TITLE}{" "}
            </h3>
            <p className="inline gradient-text bg-[linear-gradient(96.56deg,_#667799_21.01%,#94A0B8_34.62%,#667799_47.64%,#667799_69.29%,#94A0B8_79.76%,#667799_90.35%)] text-[20px] leading-tight font-medium -tracking-[0.04em] sm:block sm:text-[28px] md:text-[24px] lg:text-[28px]">
              {DESCRIPTION}
            </p>
            <div className="mt-5 flex flex-col gap-3 md:mt-6 lg:mt-7 xl:mt-7">
              <DownloadButton variant="prominent" showRequirements />
              <p className="max-w-96 text-sm leading-relaxed text-[#8C929D]">
                Download Faangin on your desktop, then sign in to get started.
              </p>
            </div>
          </div>

          {/* command key */}
          <div className="pointer-events-none absolute top-17 right-28 hidden w-40 md:block lg:top-19 lg:right-48 lg:w-61 xl:top-20 xl:right-63 xl:w-66">
            <div className="absolute top-0 left-0">
              <Image src={images.commandBtn} alt="" width={280} height={238} />
            </div>
            <AnimatePresence mode="wait">
              <m.div
                key={active ? "command-active-btn" : "command-btn"}
                className="absolute top-0 left-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: active ? 1 : 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeIn" }}
              >
                <Image src={images.commandActive} alt="" width={280} height={238} />
              </m.div>
            </AnimatePresence>
          </div>

          {/* return key */}
          <div className="pointer-events-none absolute -top-8 right-2 hidden aspect-square w-36 md:block lg:-top-15 lg:w-54 xl:-top-16 xl:right-13 xl:w-60">
            <div className="absolute top-0 left-0">
              <Image src={images.returnActive} alt="" width={238} height={238} />
            </div>
            <AnimatePresence mode="wait">
              <m.div
                key={active ? "return-active-btn" : "return-btn"}
                className="absolute top-0 left-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: active ? 1 : 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeIn" }}
              >
                <Image src={images.returnBtn} alt="" width={238} height={238} />
              </m.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </LazyMotion>
  );
}
