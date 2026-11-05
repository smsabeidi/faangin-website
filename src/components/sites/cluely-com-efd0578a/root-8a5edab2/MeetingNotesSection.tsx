"use client";

import { motion, useReducedMotion } from "motion/react";

import { DownloadButton } from "@/components/sites/cluely-com-efd0578a/shared/download-button";
import { useDesktopCampaign } from "@/components/sites/cluely-com-efd0578a/shared/hooks";
import { MeetingNotesWorkspace } from "./MeetingNotesWorkspace";

export default function MeetingNotesSection() {
  const desktopCampaign = useDesktopCampaign();
  const reducedMotion = useReducedMotion();

  return (
    <section id="interview-notes" className="mx-auto flex w-full max-w-7xl flex-col items-center gap-10 px-5 md:gap-14 md:px-8">
      <div className="flex flex-col items-center gap-3 text-center">
        {desktopCampaign && (
          <DownloadButton
            className="-mt-4 mb-12 min-h-14 !overflow-hidden !rounded-2xl !px-7 !py-4 !text-lg shadow-2xl shadow-black/25 [&_.blurred-border]:!rounded-2xl [&_svg]:size-6"
          />
        )}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="inline-block w-fit bg-gradient-to-r from-[#19191D] to-[#626275] bg-clip-text text-3xl leading-[1.25] font-medium tracking-[-1.28px] text-transparent lg:text-5xl xl:text-[56px]"
        >
          Turn meetings into clear next steps.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-150 text-base leading-relaxed text-[#8C929D] md:text-lg"
        >
          Revisit the discussion, keep decisions clear, and know what happens next.
        </motion.p>
      </div>
      <motion.div
        initial={reducedMotion ? false : { y: 24, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: reducedMotion ? 0 : 0.5, delay: reducedMotion ? 0 : 0.1 }}
        className="w-full max-w-4xl"
      >
        <MeetingNotesWorkspace />
      </motion.div>
    </section>
  );
}
