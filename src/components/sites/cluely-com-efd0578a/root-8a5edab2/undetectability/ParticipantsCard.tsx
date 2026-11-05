"use client";

import Image from "next/image";
import { Mic, MicOff, Sparkles, UsersRound, Video } from "lucide-react";
import { CardDescription } from "./CardDescription";
import "./ParticipantsCard.css";

const participants = [
  { name: "Alex Morgan", role: "Candidate · You", portrait: 0 },
  { name: "Jordan Lee", role: "Technical interviewer", portrait: 1, speaking: true },
  { name: "Taylor Chen", role: "Engineering manager", portrait: 2 },
  { name: "Sam Rivera", role: "Panel interviewer", portrait: 3 },
];

/** Original, illustrative faangin artwork; no meeting or identity detection occurs. */
export function ParticipantsCard({ title, description, hideText }: { title: string; description: string; hideText?: boolean }) {
  return (
    <div>
      <div
        className="card-styles faangin-participants__surface"
        data-faangin-participants
        role="img"
        aria-label="faangin illustration: four example interview participants with a separate interview guidance panel."
      >
        <div className="faangin-participants__panel">
          <div className="faangin-participants__header">
            <span className="faangin-participants__roomIcon"><Video size={15} strokeWidth={1.8} aria-hidden="true" /></span>
            <div className="faangin-participants__roomTitle">
              <span>Interview room</span>
              <span className="faangin-participants__participantCount"><UsersRound size={10} aria-hidden="true" />4 participants</span>
            </div>
            <span className="faangin-participants__example">Example</span>
          </div>
          <div className="faangin-participants__roster">
            {participants.map((participant) => (
              <div key={participant.name} className="faangin-participants__participant" data-speaking={participant.speaking || undefined}>
                <span className="faangin-participants__avatar" data-portrait={participant.portrait} aria-hidden="true" />
                <div className="faangin-participants__identity">
                  <span className="faangin-participants__name">{participant.name}</span>
                  <span className="faangin-participants__role">{participant.role}</span>
                </div>
                <span className="faangin-participants__activity">
                  {participant.speaking ? (
                    <>
                      <span className="faangin-participants__levels" aria-hidden="true"><i /><i /><i /></span>
                      <span>Speaking</span>
                    </>
                  ) : participant.portrait === 0 ? <Mic size={13} aria-hidden="true" /> : <MicOff size={13} aria-hidden="true" />}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="faangin-participants__assistant">
          <Image src="/brand/faangin-logo.png" alt="" width={1855} height={848} sizes="82px" className="faangin-participants__wordmark" />
          <span className="faangin-participants__assistantDivider" aria-hidden="true" />
          <div className="faangin-participants__assistantCopy">
            <span>Interview copilot</span>
            <span>Your context, close by.</span>
          </div>
          <Sparkles size={16} strokeWidth={1.6} className="faangin-participants__sparkle" aria-hidden="true" />
        </div>
      </div>
      {!hideText && <CardDescription title={title} description={description} />}
    </div>
  );
}
