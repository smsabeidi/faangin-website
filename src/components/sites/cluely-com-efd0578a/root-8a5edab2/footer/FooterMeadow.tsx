"use client";

import { useEffect, useRef } from "react";

export default function FooterMeadow() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let disposed = false;
    let cleanup: (() => void) | undefined;
    const observer = new IntersectionObserver(entries => {
      if (!entries.some(entry => entry.isIntersecting)) return;
      observer.disconnect();
      void import("@/lib/air-meadow").then(({ mountAirMeadow }) => {
        if (!disposed) cleanup = mountAirMeadow(canvas);
      });
    }, { rootMargin: "600px" });
    observer.observe(canvas);
    return () => {
      disposed = true;
      observer.disconnect();
      cleanup?.();
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none absolute inset-0 z-2 h-full w-full" />;
}
