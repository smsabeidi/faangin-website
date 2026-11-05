"use client";

import Image from "next/image";
import { Tabs } from "radix-ui";
import { ArrowUpRight, Layers3, MessageSquareText } from "lucide-react";
import "./InterviewTranscript.css";

const turns = [
  { speaker: "Interviewer", time: "00:18", elapsed: "PT18S", text: "Design a notification service for email and push. How would you absorb traffic spikes?" },
  { speaker: "Candidate", time: "00:31", elapsed: "PT31S", text: "Persist the request and an outbox entry in one transaction. Workers process queued jobs; separate pools keep one channel from blocking another." },
  { speaker: "Interviewer", time: "01:04", elapsed: "PT1M4S", text: "A worker crashes after sending, before acknowledging the job. What happens?" },
  { speaker: "Candidate", time: "01:16", elapsed: "PT1M16S", text: "Retry with the same delivery ID and provider idempotency where available. Without it, duplicates remain possible. Use backoff and a dead-letter queue." },
];

const followUps = [
  { topic: "Backpressure", question: "What happens when the queue grows faster than workers can drain it?" },
  { topic: "Provider outages", question: "Which failures should retry, and which are permanent?" },
  { topic: "Observability", question: "How would you track accepted, attempted, delivered, and failed notifications?" },
];

/** Original, authored interview example, rendered as text for clarity at every size. */
export function InterviewTranscript() {
  return (
    <div className="faangin-transcript" data-faangin-transcript>
      <div className="faangin-transcript__sheet">
        <div className="faangin-transcript__toolbar">
          <Image src="/brand/faangin-logo.png" alt="faangin" width={1855} height={848} sizes="74px" className="faangin-transcript__wordmark" />
          <span className="faangin-transcript__toolbarDivider" aria-hidden="true" />
          <span>Interview notes</span>
          <span className="faangin-transcript__example">Example</span>
        </div>
        <div className="faangin-transcript__content">
          <div className="faangin-transcript__round"><Layers3 size={12} aria-hidden="true" />System design <span>Backend engineer</span></div>
          <h3 className="faangin-transcript__title">Notification delivery<br />at scale.</h3>
          <div className="faangin-transcript__context">
            <span className="faangin-transcript__portraits" aria-hidden="true"><i /><i /></span>
            <span>Technical interview <i aria-hidden="true">·</i> Practice excerpt</span>
          </div>
          <Tabs.Root defaultValue="transcript" className="faangin-transcript__tabs">
            <Tabs.List className="faangin-transcript__tabList" aria-label="Example interview notes views">
              <Tabs.Trigger value="summary">Summary</Tabs.Trigger>
              <Tabs.Trigger value="transcript">Transcript</Tabs.Trigger>
              <Tabs.Trigger value="follow-ups">Follow-ups</Tabs.Trigger>
            </Tabs.List>
            <Tabs.Content value="transcript" className="faangin-transcript__panel">
              <ol className="faangin-transcript__conversation">
                {turns.map((turn) => (
                  <li key={turn.time} className="faangin-transcript__turn" data-speaker={turn.speaker.toLowerCase()}>
                    <div className="faangin-transcript__turnHeading"><span>{turn.speaker}</span><time dateTime={turn.elapsed}>{turn.time}</time></div>
                    <p>{turn.text}</p>
                  </li>
                ))}
              </ol>
            </Tabs.Content>
            <Tabs.Content value="summary" className="faangin-transcript__panel">
              <div className="faangin-transcript__summary">
                <span className="faangin-transcript__panelEyebrow">The approach</span>
                <h4>Accept durably.<br />Deliver independently.</h4>
                <p>Store the request and its outbox entry together. A publisher queues delivery jobs; separate worker pools handle email and push.</p>
                <div className="faangin-transcript__summaryRule" />
                <span className="faangin-transcript__panelEyebrow">The trade-off</span>
                <p>Queueing keeps the API responsive, but delivery is eventual. Provider idempotency can make retries safe; without it, duplicate delivery remains possible.</p>
                <div className="faangin-transcript__summaryTags"><span>Durable intake</span><span>Isolated workers</span><span>Explicit trade-offs</span></div>
              </div>
            </Tabs.Content>
            <Tabs.Content value="follow-ups" className="faangin-transcript__panel">
              <div className="faangin-transcript__followUps">
                <span className="faangin-transcript__panelEyebrow">Go one level deeper</span>
                <h4>Be ready for the next question.</h4>
                <ol>
                  {followUps.map((item, index) => (
                    <li key={item.topic}><span className="faangin-transcript__questionNumber">0{index + 1}</span><div><span>{item.topic}</span><p>{item.question}</p></div><ArrowUpRight size={13} aria-hidden="true" /></li>
                  ))}
                </ol>
              </div>
            </Tabs.Content>
          </Tabs.Root>
          <div className="faangin-transcript__takeaway"><MessageSquareText size={15} strokeWidth={1.6} aria-hidden="true" /><div><span>Keep the reasoning.</span><span>Durability, backpressure, and retry trade-offs.</span></div></div>
        </div>
      </div>
    </div>
  );
}
