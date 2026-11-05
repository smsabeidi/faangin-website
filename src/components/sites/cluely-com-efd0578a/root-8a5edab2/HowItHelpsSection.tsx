"use client";

import { motion } from "motion/react";

import { AssistsCard } from "./how-it-helps/AssistsCard";
import { ListensCard } from "./how-it-helps/ListensCard";

export default function HowItHelpsSection() {
  return (
    <div id="how-it-works" className="mx-auto flex w-full max-w-7xl flex-col items-center gap-11 px-5 md:px-8 lg:items-stretch">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="inline-block w-fit bg-gradient-to-r from-[#19191D] to-[#626275] bg-clip-text text-3xl leading-[1.25] font-medium tracking-[-1.28px] text-transparent lg:text-5xl xl:text-[56px]"
      >
        Stay precise when the questions get harder.
      </motion.h2>
      <div className="mx-auto grid w-full max-w-125 grid-cols-1 gap-6 lg:max-w-full lg:grid-cols-2 lg:gap-7">
        <ListensCard />
        <AssistsCard />
      </div>
    </div>
  );
}
