"use client";

import { useSyncExternalStore } from "react";

function subscribe(onChange: () => void) {
  window.addEventListener("popstate", onChange);
  return () => window.removeEventListener("popstate", onChange);
}

const getSnapshot = () => window.location.search;
const getServerSnapshot = () => "";

/** Keep the initial server/client render equal while reading optional campaign copy. */
export function useHeroSearch() {
  const search = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return new URLSearchParams(search);
}
