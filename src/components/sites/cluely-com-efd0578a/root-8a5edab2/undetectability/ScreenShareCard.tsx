"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { ChevronsLeftRight, Code2, Sparkles } from "lucide-react";
import { CardDescription } from "./CardDescription";
import "./ScreenShareCard.css";

const CODE = [
  <span key="comment" className="faangin-compare__comment"># Print values without changing links.</span>,
  <><b>def</b> <em>reversePrint</em>(head):</>,
  <>  values = []</>,
  <>  <b>while</b> head:</>,
  <>    values.<em>append</em>(head.data)</>,
  <>    head = head.next</>,
  <>  <b>for</b> value <b>in</b> <em>reversed</em>(values):</>,
  <>    <em>print</em>(value)</>,
];

/** Original window-sharing illustration; both views use the same editor geometry. */
function InterviewWindow({ withGuidance = false }: { withGuidance?: boolean }) {
  return (
    <div className="faangin-compare__scene" aria-hidden="true">
      {withGuidance && <div className="faangin-compare__localFrame" />}
      <div className="faangin-compare__editor">
        <div className="faangin-compare__editorChrome">
          <span className="faangin-compare__traffic"><i /><i /><i /></span>
          <span className="faangin-compare__file"><Code2 size={10} />reversePrint</span>
          <span className="faangin-compare__language">Python</span>
        </div>
        <div className="faangin-compare__editorBody">
          {CODE.map((line, index) => <div className="faangin-compare__code" key={index}><span>{index + 1}</span><code>{line}</code></div>)}
        </div>
      </div>
      {withGuidance && <div className="faangin-compare__assistant">
        <div className="faangin-compare__assistantBar"><Image src="/brand/faangin-logo.png" width={1855} height={848} sizes="50px" alt="" /><Sparkles size={11} /><span>Guidance</span></div>
        <p>Use a stack to print values in reverse.<br />Keep the original links unchanged.</p>
      </div>}
    </div>
  );
}

export function ScreenShareCard({ title, description, hideText }: { title: string; description: string; hideText?: boolean }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const [position, setPosition] = useState(50);
  const [active, setActive] = useState(false);

  const updatePosition = (value: number) => setPosition(Math.max(0, Math.min(100, value)));
  const moveFromPointer = (clientX: number) => {
    if (!stageRef.current) return;
    const { left, width } = stageRef.current.getBoundingClientRect();
    if (width > 0) updatePosition(((clientX - left) / width) * 100);
  };
  const stopDragging = () => { dragging.current = false; setActive(false); };

  return (
    <div>
      <div className="card-styles faangin-compare" data-faangin-capture-comparison>
        <div className="faangin-compare__labels">
          <button type="button" onClick={() => updatePosition(100)} aria-label="Show what you see" data-selected={position === 100 || undefined}>Visible to you</button>
          <button type="button" onClick={() => updatePosition(0)} aria-label="Show what the interviewer sees" data-selected={position === 0 || undefined}>Interviewer’s view</button>
        </div>
        <div ref={stageRef} className="faangin-compare__stage" role="group" aria-label="Illustration of your desktop with faangin guidance and a shared interview window without the separate guidance panel. The interviewer view depends on your sharing setup.">
          <InterviewWindow />
          <div className="faangin-compare__local" style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}><InterviewWindow withGuidance /></div>
          <div className="faangin-compare__divider" style={{ left: `${position}%` }} aria-hidden="true" />
          <div
            className="faangin-compare__handle"
            style={{ left: `${position}%` }}
            data-active={active || undefined}
            role="slider"
            tabIndex={0}
            aria-label="Compare your view and the interviewer view"
            aria-orientation="horizontal"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(position)}
            aria-valuetext={`${Math.round(position)}% your desktop, ${100 - Math.round(position)}% shared interview window`}
            onPointerDown={(event) => {
              if (!event.isPrimary || (event.pointerType === "mouse" && event.button !== 0)) return;
              event.preventDefault();
              event.currentTarget.focus();
              event.currentTarget.setPointerCapture(event.pointerId);
              dragging.current = true;
              setActive(true);
              moveFromPointer(event.clientX);
            }}
            onPointerMove={(event) => { if (dragging.current) moveFromPointer(event.clientX); }}
            onPointerUp={(event) => {
              if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
              stopDragging();
            }}
            onPointerCancel={stopDragging}
            onLostPointerCapture={stopDragging}
            onKeyDown={(event) => {
              const step = event.shiftKey ? 10 : 5;
              const value = event.key === "Home" ? 0 : event.key === "End" ? 100
                : event.key === "ArrowLeft" || event.key === "ArrowDown" ? position - step
                : event.key === "ArrowRight" || event.key === "ArrowUp" ? position + step : null;
              if (value === null) return;
              event.preventDefault();
              updatePosition(value);
            }}
          ><ChevronsLeftRight size={16} strokeWidth={1.7} aria-hidden="true" /></div>
        </div>
        <div className="faangin-compare__caption"><span>Window-only sharing · Illustration</span><span>Drag or tap a view</span></div>
      </div>
      {!hideText && <CardDescription title={title} description={description} />}
    </div>
  );
}
