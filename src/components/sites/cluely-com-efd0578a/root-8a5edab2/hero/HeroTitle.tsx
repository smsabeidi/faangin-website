"use client";

import { Children, Fragment, useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, m, useReducedMotion } from "motion/react";
import { useHeroSearch } from "./useHeroSearch";
import { brand } from "@/lib/site-content";

/**
 * Original module 84294 `y`: splits string children into words; each word rises in
 * (CSS `hero-word-rise` keyframes from globals) with a 0.1s stagger plus `delay`.
 */
export function WordRise({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  return (
    <>
      {Children.map(children, (child) =>
        typeof child === "string"
          ? child.split(" ").map((word, index) => (
              <Fragment key={index}>
                <span className="-mb-[0.22em] inline-block overflow-hidden pb-[0.22em] align-bottom">
                  <span
                    className="hero-word-rise inline-block"
                    style={{ animation: `hero-word-rise 0.55s cubic-bezier(0.22, 1, 0.36, 1) ${0.1 * index + delay}s both` }}
                  >
                    {word}
                  </span>
                </span>{" "}
              </Fragment>
            ))
          : child,
      )}
    </>
  );
}

const HERO_CONTEXTS = ["Interviews", "Meetings", "Sales Calls"] as const;

function RotatingHeadline() {
  const [contextIndex, setContextIndex] = useState(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const interval = window.setInterval(() => {
      setContextIndex((index) => (index + 1) % HERO_CONTEXTS.length);
    }, 3000);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <>
      <span className="sr-only">
        Your AI copilot for interviews, meetings, and sales calls
      </span>
      <span aria-hidden="true">
        <WordRise>Your AI copilot for</WordRise>
        <span className="-mb-[0.22em] inline-grid overflow-hidden pb-[0.22em] align-bottom">
          {HERO_CONTEXTS.map((context) => (
            <span key={context} className="invisible col-start-1 row-start-1 whitespace-nowrap">
              {context}
            </span>
          ))}
          <AnimatePresence mode="wait" initial={false}>
            <m.span
              key={contextIndex}
              className="col-start-1 row-start-1 whitespace-nowrap"
              initial={{ opacity: 0, y: reduceMotion ? 0 : 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: reduceMotion ? 0 : -4 }}
              transition={{ duration: reduceMotion ? 0 : 0.18, ease: "easeOut" }}
            >
              {HERO_CONTEXTS[contextIndex]}
            </m.span>
          </AnimatePresence>
        </span>
      </span>
    </>
  );
}

/**
 * Original module 84294 `v`: the hero h1 / hr / h2. Defaults can be overridden with the
 * `?headerText=` and `?subheaderText=` query params.
 */
export default function HeroTitle() {
  const params = useHeroSearch();
  const headerText = params.get("headerText")?.trim();
  const subheaderText = params.get("subheaderText")?.trim()
    || brand.subtitle;

  return (
    <div className="flex flex-col items-center gap-6 lg:gap-5">
      <p className="text-xs font-medium tracking-[0.15em] text-white/90 uppercase">
        faangin for Mac &amp; Windows
      </p>
      <h1
        style={{ fontFamily: "var(--font-eb-garamond)" }}
        className="max-w-[360px] text-center text-[56px] leading-[96%] font-medium tracking-[-1px] text-balance text-white lg:max-w-[760px] lg:text-[80px]"
      >
        {headerText ? <WordRise>{headerText}</WordRise> : <RotatingHeadline />}
      </h1>
      <hr
        className="hero-fade-up hidden h-px w-96 border-none lg:block"
        style={{
          animation: "hero-fade-up 0.5s ease-out 1s both",
          background:
            "linear-gradient(90deg, rgba(255, 255, 255, 0.00) 0%, rgba(255, 255, 255, 0.30) 50%, rgba(255, 255, 255, 0.00) 100%)",
        }}
      />
      <p
        className="hero-fade-up max-w-[560px] text-center leading-[140%] font-medium tracking-[-0.02em] text-white lg:text-[19px]"
        style={{
          animation: "hero-fade-up 0.5s ease-out 1.2s both",
          textShadow:
            "0 112px 31px rgba(0, 0, 0, 0.00), 0 72px 29px rgba(0, 0, 0, 0.00), 0 40px 24px rgba(0, 0, 0, 0.01), 0 18px 18px rgba(0, 0, 0, 0.01), 0 4px 10px rgba(0, 0, 0, 0.01)",
        }}
      >
        {subheaderText}
      </p>
    </div>
  );
}
