"use client";

import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
import Image from "next/image";
import { useInView, useReducedMotion } from "motion/react";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Code2, Command, GripHorizontal, Sparkles } from "lucide-react";
import { CardDescription } from "./CardDescription";
import "./FollowsEyesCard.css";

type Direction = "up" | "down" | "left" | "right";
type Corner = "top-left" | "top-right" | "bottom-left" | "bottom-right";

const CORNERS: Corner[] = ["top-left", "top-right", "bottom-right", "bottom-left"];
const ARROWS = [
  { direction: "up", Icon: ArrowUp },
  { direction: "down", Icon: ArrowDown },
  { direction: "left", Icon: ArrowLeft },
  { direction: "right", Icon: ArrowRight },
] as const;
const CODE = [
  <><span className="faangin-overlay__keyword">def</span> <span className="faangin-overlay__function">first_repeat</span>(ids):</>,
  <>  seen = <span className="faangin-overlay__function">set</span>()</>,
  <>  <span className="faangin-overlay__keyword">for</span> item <span className="faangin-overlay__keyword">in</span> ids:</>,
  <>    <span className="faangin-overlay__keyword">if</span> item <span className="faangin-overlay__keyword">in</span> seen:</>,
  <>      <span className="faangin-overlay__keyword">return</span> item</>,
  <>    seen.<span className="faangin-overlay__function">add</span>(item)</>,
  <>  <span className="faangin-overlay__keyword">return</span> <span className="faangin-overlay__literal">None</span></>,
];

function nextCorner(current: Corner, direction: Direction): Corner {
  const vertical = direction === "up" ? "top" : direction === "down" ? "bottom" : current.split("-")[0];
  const horizontal = direction === "left" ? "left" : direction === "right" ? "right" : current.split("-")[1];
  return `${vertical}-${horizontal}` as Corner;
}

/** An authored product illustration; no code execution or model request occurs. */
export function FollowsEyesCard({ title, description, hideText }: { title: string; description: string; hideText?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [corner, setCorner] = useState<Corner>("bottom-right");
  const [pressed, setPressed] = useState<Direction | "cycle" | null>(null);
  const [interacted, setInteracted] = useState(false);
  const pulseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const previewStarted = useRef(false);
  const isInView = useInView(ref, { amount: 0.65 });
  const reducedMotion = useReducedMotion();

  const pulse = useCallback((key: Direction | "cycle") => {
    if (pulseTimer.current) clearTimeout(pulseTimer.current);
    setPressed(key);
    pulseTimer.current = setTimeout(() => setPressed(null), 450);
  }, []);

  const move = useCallback((direction: Direction) => {
    setInteracted(true);
    pulse(direction);
    setCorner((current) => nextCorner(current, direction));
  }, [pulse]);

  const cycle = useCallback(() => {
    setInteracted(true);
    pulse("cycle");
    setCorner((current) => CORNERS[(CORNERS.indexOf(current) + 1) % CORNERS.length]);
  }, [pulse]);

  useEffect(() => () => {
    if (pulseTimer.current) clearTimeout(pulseTimer.current);
  }, []);

  // One short introduction, then a stable scene. User input always takes over.
  useEffect(() => {
    if (!isInView || reducedMotion !== false || interacted || previewStarted.current) return;
    const first = setTimeout(() => setCorner("bottom-left"), 1100);
    const last = setTimeout(() => {
      setCorner("bottom-right");
      previewStarted.current = true;
    }, 2700);
    return () => {
      clearTimeout(first);
      clearTimeout(last);
    };
  }, [isInView, reducedMotion, interacted]);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.defaultPrevented || !(event.metaKey || event.ctrlKey) || event.altKey || event.shiftKey) return;
    if (event.target instanceof HTMLElement && event.target.closest("input, textarea, select, [contenteditable]:not([contenteditable='false'])")) return;
    const arrow = ARROWS.find(({ direction }) => `Arrow${direction[0].toUpperCase()}${direction.slice(1)}` === event.key);
    if (!arrow) return;
    event.preventDefault();
    move(arrow.direction);
  };

  return (
    <div>
      <div
        ref={ref}
        role="group"
        tabIndex={0}
        aria-label="Interactive faangin overlay example. Use the arrow buttons, or focus this demo and press Command or Control plus an arrow key."
        onKeyDown={onKeyDown}
        className="card-styles faangin-overlay__surface"
        data-faangin-overlay
      >
        <div className="faangin-overlay__scene">
          <div className="faangin-overlay__windowBar">
            <span className="faangin-overlay__workspaceIcon"><Code2 size={12} aria-hidden="true" /></span>
            <span>Interview workspace</span>
            <span className="faangin-overlay__example">Example</span>
          </div>
          <div className="faangin-overlay__problem">
            <div className="faangin-overlay__eyebrow">CODING ROUND <span>Python</span></div>
            <span className="faangin-overlay__question">Find the first repeated request ID.</span>
            <code className="faangin-overlay__input">{'["r7", "k2", "r7"]'} <span>→</span> {'"r7"'}</code>
          </div>
          <div className="faangin-overlay__editor" aria-label="Python solution using a set to find the first repeated ID in one pass">
            {CODE.map((line, index) => (
              <div className="faangin-overlay__codeLine" key={index}>
                <span className="faangin-overlay__lineNumber" aria-hidden="true">{index + 1}</span>
                <code>{line}</code>
              </div>
            ))}
          </div>
          <div className="faangin-overlay__guidance" data-corner={corner}>
            <div className="faangin-overlay__guidanceBar">
              <Image src="/brand/faangin-logo.png" width={1855} height={848} sizes="58px" alt="faangin" className="faangin-overlay__wordmark" />
              <GripHorizontal size={12} aria-hidden="true" />
              <span><Sparkles size={9} aria-hidden="true" />Hint</span>
            </div>
            <div className="faangin-overlay__answer">
              <span className="faangin-overlay__answerTitle">Check before you add.</span>
              <span>Track IDs in a set. Return the first ID you’ve already seen.</span>
              <div className="faangin-overlay__complexity"><span>O(n) time</span><i aria-hidden="true" /><span>O(n) space</span></div>
            </div>
          </div>
        </div>
        <div className="faangin-overlay__controls">
          <div className="faangin-overlay__controlsLabel"><span>Make room for your thinking.</span><span>Try the arrows</span></div>
          <div className="faangin-overlay__keys">
            <button type="button" aria-label="Move overlay to the next corner" onClick={cycle} className="faangin-overlay__command" data-pressed={pressed !== null || undefined}>
              <Command size={13} aria-hidden="true" /><span>command</span>
            </button>
            <span className="faangin-overlay__plus" aria-hidden="true">+</span>
            {ARROWS.map(({ direction, Icon }) => (
              <button key={direction} type="button" aria-label={`Move overlay ${direction}`} onClick={() => move(direction)} data-pressed={pressed === direction || undefined}>
                <Icon size={21} strokeWidth={1.7} aria-hidden="true" />
              </button>
            ))}
          </div>
        </div>
        <span className="sr-only" role="status">Overlay position: {corner.replace("-", " ")}</span>
      </div>
      {!hideText && <CardDescription title={title} description={description} />}
    </div>
  );
}
