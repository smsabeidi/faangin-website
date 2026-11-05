export const airSceneModes = ["morning", "day", "evening", "night"] as const;
export type AirSceneMode = (typeof airSceneModes)[number];
type SceneColor = [number, number, number];
type SceneColors = { top: SceneColor; bottom: SceneColor };

export const airScenePalettes = {
  morning: { top: "#c7e9ff", bottom: "#ffeac7" },
  day: { top: "#00b3ff", bottom: "#c7e9ff" },
  evening: { top: "#d4ccff", bottom: "#ffeac7" },
  night: { top: "#0068a8", bottom: "#00a7d1" },
} as const;

function linearColor(hex: string): SceneColor {
  const channel = (offset: number) => {
    const value = parseInt(hex.slice(offset, offset + 2), 16) / 255;
    return value < 0.04045 ? value / 12.92 : Math.pow((value + 0.055) / 1.055, 2.4);
  };
  return [channel(1), channel(3), channel(5)];
}

const linearPalettes = Object.fromEntries(airSceneModes.map(mode => [mode, {
  top: linearColor(airScenePalettes[mode].top),
  bottom: linearColor(airScenePalettes[mode].bottom),
}])) as Record<AirSceneMode, SceneColors>;
const storageKey = "faangin.sky-mode";
const listeners = new Set<() => void>();
let initialized = false;
let selectedMode: AirSceneMode | null = null;
let timer: ReturnType<typeof setInterval> | undefined;
let colorMode: AirSceneMode | undefined;
let transition: { from: SceneColors; to: SceneColors; started: number } | undefined;

export function getAirSceneMode(): AirSceneMode {
  if (!initialized && typeof window !== "undefined") {
    initialized = true;
    try {
      const saved = window.sessionStorage.getItem(storageKey);
      selectedMode = airSceneModes.find(mode => mode === saved) ?? null;
    } catch {
      // The selector still works when browser storage is unavailable.
    }
  }
  if (selectedMode) return selectedMode;
  const now = new Date();
  const time = (now.getHours() * 60 + now.getMinutes()) / 1440;
  return time < 0.23 || time > 0.9 ? "night" : time < 0.35 ? "morning" : time < 0.75 ? "day" : "evening";
}

export function setAirSceneMode(mode: AirSceneMode): void {
  selectedMode = mode;
  initialized = true;
  try {
    window.sessionStorage.setItem(storageKey, mode);
  } catch {
    // Keep the in-memory choice if storage is blocked.
  }
  listeners.forEach(listener => listener());
}

export function subscribeAirSceneMode(listener: () => void): () => void {
  listeners.add(listener);
  if (timer === undefined) {
    let previousMode = getAirSceneMode();
    timer = setInterval(() => {
      const mode = getAirSceneMode();
      if (mode === previousMode) return;
      previousMode = mode;
      listeners.forEach(notify => notify());
    }, 60_000);
  }
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) {
      clearInterval(timer);
      timer = undefined;
    }
  };
}

function sampleColors(now: number): SceneColors {
  if (!transition) return linearPalettes[colorMode ?? getAirSceneMode()];
  const progress = Math.min(1, Math.max(0, (now - transition.started) / 1000));
  const eased = 1 - Math.pow(1 - progress, 5);
  const mixColor = (from: SceneColor, to: SceneColor): SceneColor => [
    from[0] + (to[0] - from[0]) * eased,
    from[1] + (to[1] - from[1]) * eased,
    from[2] + (to[2] - from[2]) * eased,
  ];
  return { top: mixColor(transition.from.top, transition.to.top), bottom: mixColor(transition.from.bottom, transition.to.bottom) };
}

// Both renderers sample one transition, so the sky and meadow stay in sync.
export function getAirSceneColors(reducedMotion: boolean): SceneColors {
  const mode = getAirSceneMode();
  const now = Date.now();
  if (colorMode === undefined) colorMode = mode;
  else if (colorMode !== mode) {
    const from = sampleColors(now);
    colorMode = mode;
    transition = { from, to: linearPalettes[mode], started: now };
  }
  return reducedMotion ? linearPalettes[mode] : sampleColors(now);
}
