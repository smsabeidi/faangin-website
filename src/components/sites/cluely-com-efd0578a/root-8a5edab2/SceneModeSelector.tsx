"use client";

import { useId, useSyncExternalStore } from "react";
import { airSceneModes, getAirSceneMode, setAirSceneMode, subscribeAirSceneMode, type AirSceneMode } from "@/lib/air-scene-mode";
import "./SceneModeSelector.css";

// Original Air icon geometry: source module 60593, documented in air-inc-footer/source/.
function ModeIcon({ mode }: { mode: AirSceneMode }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true">
      {mode === "day" ? (
        <>
          <circle cx="12" cy="12" r="4.95" />
          <path d="M12 4.33V1.51M12 22.49v-2.82M19.67 12h2.82M1.51 12h2.82M17.42 6.58l2-2M4.58 19.42l2-2M17.42 17.42l2 2M4.58 4.58l2 2" />
        </>
      ) : mode === "night" ? (
        <path d="M16.32,16.04c-4.62,0-8.36-3.74-8.36-8.36,0-1.3.31-2.52.83-3.62-2.8,1.35-4.74,4.21-4.74,7.52,0,4.62,3.74,8.36,8.36,8.36,3.32,0,6.17-1.94,7.52-4.74-1.1.53-2.32.83-3.62.83Z" />
      ) : (
        <>
          <path d="M7.13,19.18v-.56c0-2.69,2.18-4.87,4.87-4.87s4.87,2.18,4.87,4.87v.56M19.54 18.62h2.77M1.69 18.62h2.77M17.33 13.28l1.96-1.96M4.71 11.32l1.96 1.96" />
          {mode === "morning" ? <path d="M11.96 11.17V4.34M9.15 6.54l2.81-2.8 2.8 2.8" /> : <path d="M12 2.74v6.83M14.8 7.37 12 10.17 9.2 7.37" />}
        </>
      )}
    </svg>
  );
}

export default function SceneModeSelector() {
  const groupId = useId();
  const mode = useSyncExternalStore(subscribeAirSceneMode, getAirSceneMode, () => null);

  return (
    <fieldset className="air-scene-mode-selector">
      <legend className="sr-only">Sky mode</legend>
      {airSceneModes.map(option => (
        <label key={option} title={`${option[0].toUpperCase()}${option.slice(1)}`} data-selected={mode === option}>
          <input
            className="sr-only"
            type="radio"
            name={`sky-mode-${groupId}`}
            value={option}
            checked={mode === option}
            onChange={() => setAirSceneMode(option)}
          />
          <ModeIcon mode={option} />
          <span className="sr-only">{option[0].toUpperCase()}{option.slice(1)}</span>
        </label>
      ))}
    </fieldset>
  );
}
