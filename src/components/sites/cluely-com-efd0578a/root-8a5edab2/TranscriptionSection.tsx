"use client";

import Link from "next/link";
import { motion } from "motion/react";

import { DownloadButton } from "@/components/sites/cluely-com-efd0578a/shared/download-button";
import { useDesktopCampaign } from "@/components/sites/cluely-com-efd0578a/shared/hooks";
import { InterviewTranscript } from "./InterviewTranscript";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
} as const;

export default function TranscriptionSection() {
  const desktopCampaign = useDesktopCampaign();

  return (
    <div id="interview-support" className="w-full pt-20">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-x-18 lg:flex-row">
        <motion.div
          {...fadeIn}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="faangin-transcript__placement"
        >
          <InterviewTranscript />
        </motion.div>
        <div className="mx-20 flex flex-col gap-y-20 lg:mx-0">
          {desktopCampaign && (
            <DownloadButton
                  className="-mt-8 mb-6 min-h-14 !w-max !overflow-hidden !rounded-2xl !px-7 !py-4 !text-lg !whitespace-nowrap shadow-2xl shadow-black/25 [&_.blurred-border]:!rounded-2xl [&_svg]:size-6"
            />
          )}
          <motion.h2
            {...fadeIn}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="bg-gradient-to-r from-[#19191D] to-[#31343E] bg-clip-text text-3xl leading-[1.25] font-medium tracking-[-1.28px] text-transparent lg:text-5xl"
          >
            Built for technical depth.
          </motion.h2>
          <div className="-mt-10 flex flex-col gap-y-8 lg:mt-0">
            <motion.div {...fadeIn} transition={{ duration: 0.5, delay: 0.25 }} className="flex flex-col items-start lg:flex-row">
              <div className="mt-4 text-5xl lg:w-48 lg:shrink-0">Code</div>
              <div className="flex flex-col gap-y-3">
                <Link href="/coding-interview" className="text-4xl font-light underline-offset-4 hover:underline focus-visible:underline">Coding rounds</Link>
                <span className="text-lg text-zinc-500/70 lg:max-w-112.5">
                  Explain correctness and complexity. Examine edge cases and how the approach changes as constraints grow.
                </span>
              </div>
            </motion.div>
            <div className="h-[1px] w-full bg-zinc-200/50" />
            <motion.div {...fadeIn} transition={{ duration: 0.5, delay: 0.35 }} className="flex flex-col items-start lg:flex-row">
              <div className="mt-5 text-5xl lg:w-48 lg:shrink-0">
                Story
              </div>
              <div className="flex flex-col gap-y-3">
                <Link href="/behavioral-interview" className="text-4xl font-light underline-offset-4 hover:underline focus-visible:underline">Behavioral answers</Link>
                <span className="text-lg text-zinc-500/70">
                  Show the scope you owned, the decisions you made, and the impact you can substantiate.
                </span>
              </div>
            </motion.div>
            <div className="h-[1px] w-full bg-zinc-200/50" />
            <motion.div {...fadeIn} transition={{ duration: 0.5, delay: 0.45 }} className="flex flex-col items-start lg:flex-row">
              <div className="mt-5 text-5xl lg:w-48 lg:shrink-0">Design</div>
              <div className="flex flex-col gap-y-3">
                <Link href="/system-design-interview" className="text-4xl font-light underline-offset-4 hover:underline focus-visible:underline">System design</Link>
                <span className="text-lg text-zinc-500/70">
                  Work through bottlenecks, failure modes, and operational trade-offs. Explain why the design fits the requirements.
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
