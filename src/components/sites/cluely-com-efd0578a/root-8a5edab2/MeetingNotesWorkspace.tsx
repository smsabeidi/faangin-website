"use client";

import { useState } from "react";
import Image from "next/image";
import { Tabs } from "radix-ui";
import { CalendarDays, Check, Copy, FileText, MessageSquareText, Users } from "lucide-react";
import "./MeetingNotesWorkspace.css";

const actionItems = [
  { owner: "Maya", detail: "Gather onboarding feedback and the updated retention report." },
  { owner: "Alex", detail: "Share a simpler onboarding prototype before the next review." },
  { owner: "Jordan", detail: "Schedule a dashboard walkthrough with the customer’s operations team." },
];

const transcript = [
  { speaker: "Maya", initials: "MY", time: "09:12", text: "The team asked for a dashboard walkthrough. I’ll gather their onboarding feedback." },
  { speaker: "Jordan", initials: "JD", time: "09:13", text: "I’ll schedule it with their operations team. Adoption is still uneven." },
  { speaker: "Maya", initials: "MY", time: "09:14", text: "The retention report is incomplete, so we shouldn’t draw conclusions yet. I’ll bring the updated version." },
  { speaker: "Alex", initials: "AX", time: "09:15", text: "Let’s prioritize simpler onboarding next sprint. I’ll share a prototype before our next review." },
  { speaker: "Jordan", initials: "JD", time: "09:16", text: "Agreed. After the walkthrough, we’ll review adoption and retention together." },
];

const meetingChats = [
  { question: "What did we decide?", answer: "Prioritize simpler onboarding next sprint, then review adoption and retention after the dashboard walkthrough." },
  { question: "Who owns the follow-ups?", answer: "Maya owns feedback and the retention report. Alex owns the onboarding prototype. Jordan owns scheduling the walkthrough." },
];

const EXAMPLE_NOTES = `# Quarterly planning with Northstar
Example meeting · Maya, Alex and Jordan · 28 minutes

## Action items
- Maya: Gather onboarding feedback and the updated retention report.
- Alex: Share a simpler onboarding prototype before the next review.
- Jordan: Schedule a dashboard walkthrough with the customer's operations team.

## Challenges & risks
- Dashboard adoption remains uneven across the team.
- The retention report is incomplete; confirm the trend before changing plans.

## Key decisions
- Prioritize simpler onboarding in the next sprint.
- Review adoption and retention after the walkthrough.
`;

/** Original illustrative meeting, with authored notes, transcript and sample Q&A. */
export function MeetingNotesWorkspace() {
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "failed">("idle");
  const [activeChat, setActiveChat] = useState(0);

  const copyNotes = async () => {
    try {
      await navigator.clipboard.writeText(EXAMPLE_NOTES);
      setCopyStatus("copied");
    } catch {
      setCopyStatus("failed");
    }
  };

  return (
    <div className="faangin-notes" data-faangin-notes-workspace>
      <div className="faangin-notes__window">
        <div className="faangin-notes__toolbar">
          <Image src="/brand/faangin-logo.png" width={1855} height={848} sizes="78px" alt="faangin" className="faangin-notes__wordmark" />
          <span className="faangin-notes__toolbarRule" aria-hidden="true" />
          <span>Meeting notes</span>
          <span className="faangin-notes__example">Example meeting</span>
        </div>
        <div className="faangin-notes__document">
          <div className="faangin-notes__eyebrow"><CalendarDays size={13} aria-hidden="true" />Quarterly review <span>28 min</span></div>
          <h3>Quarterly planning with Northstar</h3>
          <div className="faangin-notes__meta">
            <span className="faangin-notes__avatars" aria-hidden="true"><span>MY</span><span>AX</span><span>JD</span></span>
            <span>Maya, Alex &amp; Jordan</span><span aria-hidden="true">·</span><span>Team meeting</span>
          </div>

          <Tabs.Root defaultValue="notes">
            <div className="faangin-notes__tools">
              <Tabs.List className="faangin-notes__tabs" aria-label="Example meeting workspace views">
                <Tabs.Trigger value="notes"><FileText size={12} aria-hidden="true" />Notes</Tabs.Trigger>
                <Tabs.Trigger value="transcript"><Users size={12} aria-hidden="true" />Transcript</Tabs.Trigger>
                <Tabs.Trigger value="chats"><MessageSquareText size={12} aria-hidden="true" />Chats</Tabs.Trigger>
              </Tabs.List>
              <button type="button" onClick={copyNotes} className="faangin-notes__copy" aria-label="Copy example meeting notes">
                {copyStatus === "copied" ? <Check size={13} aria-hidden="true" /> : <Copy size={13} aria-hidden="true" />}<span>{copyStatus === "copied" ? "Copied" : "Copy notes"}</span>
              </button>
            </div>

            <Tabs.Content value="notes" className="faangin-notes__panel">
              <div className="faangin-notes__section">
                <h4>Action items</h4>
                <ul className="faangin-notes__actions">
                  {actionItems.map((item) => <li key={item.owner}><span className="faangin-notes__checkbox" aria-hidden="true" /><p>{item.detail}</p><span className="faangin-notes__owner">{item.owner}</span></li>)}
                </ul>
              </div>
              <div className="faangin-notes__section">
                <h4>Challenges &amp; risks</h4>
                <ul className="faangin-notes__bullets"><li>Dashboard adoption remains uneven across the team.</li><li>The retention report is incomplete; confirm the trend before changing plans.</li></ul>
              </div>
              <div className="faangin-notes__section">
                <h4>Key decisions</h4>
                <ul className="faangin-notes__bullets"><li>Prioritize simpler onboarding in the next sprint.</li><li>Review adoption and retention after the walkthrough.</li></ul>
              </div>
            </Tabs.Content>

            <Tabs.Content value="transcript" className="faangin-notes__panel">
              <div className="faangin-notes__panelHeading"><span>From the discussion</span><h4>The context behind the plan.</h4></div>
              <ol className="faangin-notes__transcript">
                {transcript.map((turn, index) => <li key={index}><span className="faangin-notes__speakerAvatar" aria-hidden="true">{turn.initials}</span><div><div className="faangin-notes__speaker"><span>{turn.speaker}</span><time>{turn.time}</time></div><p>{turn.text}</p></div></li>)}
              </ol>
            </Tabs.Content>

            <Tabs.Content value="chats" className="faangin-notes__panel">
              <div className="faangin-notes__panelHeading"><span>Example meeting Q&amp;A</span><h4>Get back to what matters.</h4></div>
              <div className="faangin-notes__prompts" role="group" aria-label="Example meeting questions">
                {meetingChats.map((chat, index) => <button type="button" key={chat.question} aria-pressed={activeChat === index} onClick={() => setActiveChat(index)}>{chat.question}</button>)}
              </div>
              <div className="faangin-notes__conversation" aria-live="polite" aria-atomic="true">
                <div className="faangin-notes__chatQuestion">{meetingChats[activeChat].question}</div>
                <div className="faangin-notes__chatAnswer"><span>faangin <span>· From these notes</span></span><p>{meetingChats[activeChat].answer}</p></div>
              </div>
            </Tabs.Content>
          </Tabs.Root>

          <div className="faangin-notes__footer"><span>Illustrative meeting workspace</span><span role="status" data-error={copyStatus === "failed" || undefined}>{copyStatus === "copied" ? "Example meeting notes copied to clipboard." : copyStatus === "failed" ? "Clipboard unavailable. Open Notes to select the example text." : "Decisions, context, and next steps. Together."}</span></div>
        </div>
      </div>
    </div>
  );
}
