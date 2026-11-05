"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { mountAirSky } from "@/lib/air-sky";
import { airScenePalettes, getAirSceneMode, subscribeAirSceneMode } from "@/lib/air-scene-mode";

export default function HeroSky() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mode = useSyncExternalStore(subscribeAirSceneMode, getAirSceneMode, () => null);
  const palette = mode ? airScenePalettes[mode] : null;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    return mountAirSky(canvas);
  }, []);

  return (
    <div className="air-sky-background" aria-hidden="true" data-sky-mode={mode ?? undefined} style={palette ? { background: `linear-gradient(180deg, ${palette.top}, ${palette.bottom})` } : undefined}>
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
}
