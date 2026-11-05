"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { videos } from "@/components/sites/cluely-com-efd0578a/shared/assets";

/**
 * Original module 84294 `A`: the looping meeting video inside the demo frame.
 * Starts playing `delay` seconds after mount; when it reaches the end it rewinds to 1.5s
 * and plays again (so the intro frames are skipped on every loop).
 */
export default function HeroVideo({ delay = 0, className = "" }: { delay?: number; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      ref.current?.play().catch(() => {});
    }, 1000 * delay);

    const video = ref.current;
    if (!video) return () => clearTimeout(timer);

    const onEnded = () => {
      video.currentTime = Math.min(1.5, Math.max(0, video.duration - 0.1));
      video.play().catch(() => {});
    };
    video.addEventListener("ended", onEnded);
    return () => {
      clearTimeout(timer);
      video.removeEventListener("ended", onEnded);
      video.pause();
    };
  }, [delay]);

  return (
    <video className={cn("aspect-[1.6] h-[80%]", className)} muted playsInline ref={ref}>
      <source src={videos.heroHevc} type='video/mp4; codecs="hvc1"' />
      <source src={videos.heroWebm} type="video/webm" />
    </video>
  );
}
