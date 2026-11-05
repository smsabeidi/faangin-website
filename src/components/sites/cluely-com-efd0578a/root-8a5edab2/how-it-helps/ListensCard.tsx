"use client";

import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { motion, useInView } from "motion/react";

import { ActionChips, ChatInput } from "@/components/sites/cluely-com-efd0578a/shared/cluely-widget";

type Bar = { id: number; height: number };

const BAR_COUNT = 48;
/** px per second the waveform scrolls to the left */
const SCROLL_SPEED = 60;
/** ms before bars, scroll offset and timer reset */
const RESET_MS = 30_000;
/** cap on per-frame delta so a backgrounded tab doesn't jump on return */
const MAX_FRAME_MS = 100;

let nextBarId = 0;

function createBars(): Bar[] {
  return Array.from({ length: BAR_COUNT }, () => ({ id: nextBarId++, height: 8 }));
}

function createBar(t: number): Bar {
  const f = Math.max(
    0,
    Math.min(
      1,
      (0.35 * Math.sin(0.7 * t) + 0.25 * Math.sin(0.4 * t) + 0.2 * Math.sin(1.1 * t) + 0.2) *
        (0.4 + 0.6 * Math.abs(Math.sin(3.8 * t) * Math.cos(2.5 * t))) *
        (0.7 + 0.3 * Math.sin(7.3 * t)) *
        (0.75 + 0.25 * Math.random()),
    ),
  );
  return { id: nextBarId++, height: 5 + 95 * f };
}

function formatTimer(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
}

/**
 * Drives the live waveform while the card is in view.
 * Bars live in a ref (source of truth) and are mirrored into state via flushSync;
 * the scroll offset and timer text are written straight to the DOM through refs.
 */
function useWaveform(isInView: boolean) {
  const [bars, setBars] = useState<Bar[]>(createBars);
  const barsRef = useRef<Bar[]>(bars);
  const offsetRef = useRef(0);
  const waveElRef = useRef<HTMLDivElement | null>(null);
  const timeRef = useRef(0);
  const elapsedRef = useRef(0);
  const timerElRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    if (!isInView) return;

    const step = (waveElRef.current?.offsetWidth ?? 400) / 45;
    let last = performance.now();
    let lastSecond = -1;
    let frame = 0;

    const tick = (now: number) => {
      const dt = Math.min(now - last, MAX_FRAME_MS);
      last = now;
      timeRef.current += dt / 1000;
      offsetRef.current += (dt / 1000) * SCROLL_SPEED;

      const shift = Math.floor(offsetRef.current / step);
      if (shift > 0) {
        offsetRef.current -= shift * step;
        const fresh: Bar[] = [];
        for (let i = 0; i < shift; i++) {
          fresh.push(createBar(timeRef.current + 0.05 * i));
        }
        barsRef.current = [...barsRef.current.slice(shift), ...fresh];
        flushSync(() => setBars(barsRef.current));
      }

      if (waveElRef.current) {
        waveElRef.current.style.transform = `translateX(-${offsetRef.current}px)`;
      }

      elapsedRef.current += dt;
      if (elapsedRef.current >= RESET_MS) {
        elapsedRef.current = 0;
        timeRef.current = 0;
        offsetRef.current = 0;
        barsRef.current = createBars();
        flushSync(() => setBars(barsRef.current));
        if (waveElRef.current) {
          waveElRef.current.style.transform = "translateX(0px)";
        }
      }

      const second = Math.floor(elapsedRef.current / 1000);
      if (second !== lastSecond) {
        lastSecond = second;
        if (timerElRef.current) {
          timerElRef.current.textContent = formatTimer(elapsedRef.current);
        }
      }

      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [isInView]);

  return { bars, waveElRef, timerElRef };
}

export function ListensCard() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });
  const { bars, waveElRef, timerElRef } = useWaveform(isInView);

  return (
    <motion.div
      ref={ref}
      initial={{ y: 32, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ type: "spring", stiffness: 400, damping: 30, delay: 0.1 }}
      style={{
        background:
          "radial-gradient(167.08% 140.48% at 79.5% 0%, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0.00) 100%), radial-gradient(120.74% 124.92% at 7.26% 100%, #497EE9 0%, #749CFF 100%)",
        backgroundBlendMode: "overlay, normal",
        boxShadow:
          "1.899px 1.77px 8.174px 0 rgba(255, 255, 255, 0.13) inset, 1.007px 0.939px 4.087px 0 rgba(255, 255, 255, 0.13) inset",
      }}
      className="relative flex flex-col justify-between gap-4 rounded-4xl p-7 text-white lg:p-8 xl:p-10"
    >
      <div className="flex flex-1 flex-col gap-4">
        <h3 className="text-[26px] leading-tight font-medium tracking-[-0.5px] lg:text-28">
          faangin{" "}
          <span className="-mx-0.5 inline-flex -translate-y-0.5 items-center gap-1 rounded-[110.25px] bg-white/20 px-2 py-0 align-middle shadow-[2.093px_1.951px_9.012px_0_rgba(255,255,255,0.5)_inset,1.111px_1.035px_4.506px_0_rgba(255,255,255,0.5)_inset] backdrop-blur-3xl">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="19" viewBox="0 0 14 19" fill="none">
              <line x1="1" y1="6.06653" x2="1" y2="12.9332" stroke="white" strokeWidth="2" strokeLinecap="round" />
              <line x1="5" y1="1" x2="5" y2="18" stroke="white" strokeWidth="2" strokeLinecap="round" />
              <line x1="9" y1="4.79993" x2="9" y2="14.1999" stroke="white" strokeWidth="2" strokeLinecap="round" />
              <line x1="13" y1="8.59973" x2="13" y2="11.6664" stroke="white" strokeWidth="2" strokeLinecap="round" />
            </svg>
            follows
          </span>{" "}
          the conversation
        </h3>
        <p className="max-w-120 text-15 text-white lg:text-18">
          Keep the original question, constraints, and follow-ups in view as the discussion evolves.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col items-center gap-1">
          <span
            ref={timerElRef}
            className="text-36 leading-none font-semibold tracking-[-0.21px] text-white/60 tabular-nums lg:text-[42px]"
          >
            00:00
          </span>
          <div className="flex items-center gap-1.5">
            <span className="size-1.5 animate-pulse rounded-full bg-red-400" />
            <span className="text-sm tracking-wide text-white/60 lg:text-base">Live context</span>
          </div>
        </div>
        <div className="overflow-hidden">
          <div
            ref={waveElRef}
            className="flex h-24 w-full items-center justify-between will-change-transform lg:h-28"
          >
            {bars.map((bar) => (
              <div
                key={bar.id}
                className="w-1.5 shrink-0 rounded-full"
                style={{
                  height: `${bar.height}%`,
                  backgroundColor: `rgba(255, 255, 255, ${0.3 + (bar.height / 100) * 0.4})`,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="mb-6 rounded-xl bg-[#21232a]/50 p-3 px-7 backdrop-blur-sm lg:mb-8">
        <ActionChips className="mb-2 [&_span]:text-[10px]!" />
        <ChatInput />
      </div>

      <div aria-hidden="true" className="pointer-events-none absolute bottom-0 left-0 h-51 lg:h-56 w-full rounded-b-4xl bg-[linear-gradient(354deg,rgba(255,255,255,0.02)_7.62%,rgba(255,255,255,0.01)_89.04%)] opacity-70 backdrop-blur-sm" />
    </motion.div>
  );
}
