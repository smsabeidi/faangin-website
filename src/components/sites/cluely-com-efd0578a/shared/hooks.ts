"use client";

import { useSyncExternalStore } from "react";
import { detectDownloadPlatform, type DownloadDevice } from "@/lib/download-platform";

export type OS = "MacOS" | "Windows" | undefined;

const subscribeToDevice = () => () => {};
const serverOS = (): OS => undefined;
const serverFalse = () => false;

function readOS(): OS {
  if (typeof navigator === "undefined") return undefined;
  const platform = detectDownloadPlatform(navigator as Navigator & DownloadDevice);
  return platform === "mac" ? "MacOS" : platform === "windows" ? "Windows" : undefined;
}

/** Detect supported desktop platforms without guessing on phones, tablets, or other systems. */
export function useOS(): OS {
  return useSyncExternalStore(subscribeToDevice, readOS, serverOS);
}

function subscribeToNavigation(onChange: () => void) {
  window.addEventListener("popstate", onChange);
  window.addEventListener("hashchange", onChange);
  return () => {
    window.removeEventListener("popstate", onChange);
    window.removeEventListener("hashchange", onChange);
  };
}

function readDesktopCampaign() {
  const { pathname, search } = window.location;
  return pathname === "/" && new URLSearchParams(search).get("desktopCampaign") === "true";
}

/** `/?desktopCampaign=true` flag used by cluely.com to swap in a pulsing CTA. */
export function useDesktopCampaign(): boolean {
  return useSyncExternalStore(subscribeToNavigation, readDesktopCampaign, serverFalse);
}

const readTouchDevice = () => "ontouchstart" in window || navigator.maxTouchPoints > 0;

export function useIsTouchDevice(): boolean {
  return useSyncExternalStore(subscribeToDevice, readTouchDevice, serverFalse);
}
