"use client";

import { motion, type HTMLMotionProps } from "motion/react";
import { cn } from "@/lib/utils";
import { ParticipantsCard } from "./ParticipantsCard";
import { ScreenShareCard } from "./ScreenShareCard";
import { FollowsEyesCard } from "./FollowsEyesCard";
import CompanyCarousel from "../CompanyCarousel";

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */

type CardProps = { title: string; description: string; hideText?: boolean };

const CARDS: { title: string; description: string }[] = [
  {
    title: "Stay with the interviewer.",
    description: "Keep the question and context at hand while the conversation moves.",
  },
  { title: "Your view. Their view.", description: "An example with only the interview window shared. Check your sharing preview; visibility varies by app and OS." },
  { title: "Put guidance in your line of sight.", description: "Move the overlay to the corner that feels natural to you." },
];

const CARD_COMPONENTS: ((props: CardProps) => React.ReactNode)[] = [ParticipantsCard, ScreenShareCard, FollowsEyesCard];

const WORKSPACES = [
  { name: "Zoom", logo: "/brand/workspaces/zoom.svg" },
  { name: "Slack", logo: "/brand/workspaces/slack.svg" },
  { name: "Webex", logo: "/brand/workspaces/webex.svg" },
  { name: "Microsoft Teams", logo: "/brand/workspaces/microsoft-teams.svg" },
  { name: "Google Meet", logo: "/brand/workspaces/google-meet.svg" },
  { name: "HackerRank", logo: "/brand/workspaces/hackerrank.svg" },
  { name: "CoderPad", logo: "/brand/workspaces/coderpad.svg" },
  { name: "CodeSignal", logo: "/brand/workspaces/codesignal.svg" },
  { name: "Codility", logo: "/brand/workspaces/codility.svg" },
  { name: "HireVue", logo: "/brand/workspaces/hirevue.svg" },
];

/** Shared viewport fade-in (original `K`). */
const fadeIn: Pick<HTMLMotionProps<"div">, "initial" | "whileInView" | "viewport"> = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
};

/* ------------------------------------------------------------------ */
/* Section                                                             */
/* ------------------------------------------------------------------ */

/** "Stay in control of your workspace." — heading, three feature cards, and the "A familiar interview workspace" logo row. */
export default function UndetectabilitySection() {
  return (
    <section id="undetectability" className="relative z-10 scroll-mt-24 overflow-hidden">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="flex flex-col items-center gap-3 text-center">
          <motion.h2
            {...fadeIn}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-block w-fit bg-gradient-to-r from-[#19191D] to-[#626275] bg-clip-text text-3xl leading-[1.25] font-medium tracking-[-1.28px] text-transparent lg:text-5xl xl:text-[56px]"
          >
            Stay in control of your workspace.
          </motion.h2>
          <motion.p
            {...fadeIn}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-150 text-base leading-relaxed text-[#8C929D] md:text-lg"
          >
            Keep guidance close, choose your view, and position the workspace around the way you think.
          </motion.p>
        </div>

        <div
          className={cn(
            "mt-12 md:mt-16",
            "scrollbar-none flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4",
            "lg:grid lg:snap-none lg:grid-cols-3 lg:overflow-visible lg:pb-0",
            "xl:gap-8",
          )}
        >
          {CARDS.map((card, index) => {
            const Card = CARD_COMPONENTS[index];
            return (
              <motion.div
                key={card.title}
                {...fadeIn}
                transition={{ duration: 0.5, delay: 0.3 + 0.15 * index, ease: [0.2, 0, 0, 1] }}
                className="min-w-[85vw] snap-center sm:min-w-[60vw] md:min-w-[45vw] lg:min-w-0"
              >
                <Card title={card.title} description={card.description} />
              </motion.div>
            );
          })}
        </div>

      </div>
      <CompanyCarousel
        id="interview-workspaces"
        title="A familiar interview workspace"
        description="For live conversations, coding rounds, and video interviews."
        items={WORKSPACES}
        label="workspace"
      />
      <CompanyCarousel />
    </section>
  );
}
