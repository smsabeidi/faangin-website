"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { animate, motion, useMotionValue, useReducedMotion } from "motion/react";
import { images } from "./assets";

const EASE: [number, number, number, number] = [0.77, 0, 0.175, 1];

/** Shimmer sweep that starts off the left edge of its (relative, overflow-hidden) parent. */
export function ShimmerLeft({ repeatDelay = 6 }: { repeatDelay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const reduceMotion = useReducedMotion();
  useEffect(() => {
    const parent = ref.current?.parentElement;
    if (!parent || reduceMotion) return;
    let stop = () => {};
    const start = () => {
      stop();
      x.set(0);
      if (parent.clientWidth) {
        const controls = animate(x, parent.clientWidth + 64, { duration: 0.6, ease: EASE, repeat: Infinity, repeatDelay });
        stop = () => controls.stop();
      }
    };
    const observer = new ResizeObserver(start);
    observer.observe(parent);
    return () => { observer.disconnect(); stop(); };
  }, [repeatDelay, x, reduceMotion]);
  return (
    <motion.div ref={ref} aria-hidden style={{ x }} className="pointer-events-none absolute -top-4 -left-12 h-[153px] w-[54px] opacity-40">
      <Image src={images.shimmer} alt="" fill sizes="54px" />
    </motion.div>
  );
}

/** Variant used inside the mobile drawer's "Send Link" button (starts further right). */
export function ShimmerRight() {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const reduceMotion = useReducedMotion();
  useEffect(() => {
    const parent = ref.current?.parentElement;
    if (!parent || reduceMotion) return;
    let stop = () => {};
    const start = () => {
      stop();
      x.set(0);
      if (parent.clientWidth) {
        const controls = animate(x, parent.clientWidth + 64, { duration: 0.6, ease: EASE, repeat: Infinity, repeatDelay: 6 });
        stop = () => controls.stop();
      }
    };
    const observer = new ResizeObserver(start);
    observer.observe(parent);
    return () => { observer.disconnect(); stop(); };
  }, [x, reduceMotion]);
  return (
    <motion.div ref={ref} aria-hidden style={{ x }} className="pointer-events-none absolute -top-4 left-28 h-[153px] w-[54px] opacity-40">
      <Image src={images.shimmer} alt="" fill sizes="54px" />
    </motion.div>
  );
}
