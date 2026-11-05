"use client";

import { useEffect, useState, type RefObject } from "react";
import { animate, m, motion, useMotionValue } from "motion/react";
import { cn } from "@/lib/utils";
import { CluelyWidget, Message } from "@/components/sites/cluely-com-efd0578a/shared/cluely-widget";
import { StreamingText } from "@/components/sites/cluely-com-efd0578a/shared/streaming-text";

/**
 * Original module 28580 `m` (`f.Ay` in the hero): the Cluely overlay card that springs in
 * over the demo video and becomes draggable (within the frame) once its scale spring has
 * settled and the viewport is at least 768px wide.
 */
export default function HeroOverlay({
  delay = 0,
  dragConstraintsRef,
}: {
  delay?: number;
  dragConstraintsRef?: RefObject<HTMLDivElement | null>;
}) {
  const y = useMotionValue(200);
  const scale = useMotionValue(0.7);
  const opacity = useMotionValue(0);
  const [settled, setSettled] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");
    const update = () => setIsDesktop(mediaQuery.matches);
    update();
    mediaQuery.addEventListener("change", update);
    return () => mediaQuery.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const yAnimation = animate(y, 0, { type: "spring", stiffness: 350, damping: 55, mass: 3.5, delay });
    const scaleAnimation = animate(scale, 1, {
      type: "spring",
      stiffness: 400,
      damping: 60,
      delay,
      onComplete: () => setSettled(true),
    });
    const opacityAnimation = animate(opacity, 1, { duration: 0.2, delay });
    return () => {
      yAnimation.stop();
      scaleAnimation.stop();
      opacityAnimation.stop();
    };
  }, [delay, y, scale, opacity]);

  const draggable = settled && isDesktop && !!dragConstraintsRef;

  return (
    <div className="absolute inset-0 flex items-start justify-center pt-2 lg:pt-10">
      <motion.div
        style={{ y, scale, opacity }}
        drag={draggable}
        dragConstraints={dragConstraintsRef}
        dragMomentum={false}
        dragElastic={0.15}
        className={cn(
          "w-[80%] origin-top sm:w-[70%] md:w-120 md:touch-none lg:w-[45%]",
          draggable && "cursor-grab active:cursor-grabbing",
        )}
      >
        <CluelyWidget>
          <m.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: delay + 0.5, duration: 0.4 }}>
            <Message variant="user">The request timed out. How do you retry safely?</Message>
          </m.div>
          <p className="text-[10px] text-white/60 md:text-xs">System design · Example guidance</p>
          <Message variant="ai">
            <StreamingText delay={delay + 1} className="md:block">
              {
                "A timeout leaves the outcome unknown. Reuse a stable operation ID, define the idempotency contract, and commit the deduplication record with the mutation where possible. Then discuss recovery and how long that record must live. The trade-off is additional state and operational complexity."
              }
            </StreamingText>
          </Message>
        </CluelyWidget>
      </motion.div>
    </div>
  );
}
