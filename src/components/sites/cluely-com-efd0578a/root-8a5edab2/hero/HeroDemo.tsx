"use client";

import Image from "next/image";
import { Tabs } from "radix-ui";
import { Expand } from "lucide-react";
import { productCaptures } from "@/lib/product-captures";
import "./HeroDemo.css";

const VIEWS = ["capture", "approach", "code", "compact"] as const;

/** Actual product captures, selected manually; this gallery does not simulate app output. */
export default function HeroDemo() {
  return (
    <div id="demo" className="faangin-real-demo" data-faangin-real-demo>
      <Tabs.Root defaultValue="code" className="faangin-real-demo__gallery">
        <div className="faangin-real-demo__header">
          <div className="faangin-real-demo__eyebrow"><span aria-hidden="true" />Actual faangin captures</div>
          <Tabs.List className="faangin-real-demo__tabs" aria-label="Actual faangin app captures">
            {VIEWS.map((view) => <Tabs.Trigger value={view} key={view}>{productCaptures[view].label}</Tabs.Trigger>)}
          </Tabs.List>
        </div>
        {VIEWS.map((view) => {
          const capture = productCaptures[view];
          return (
            <Tabs.Content key={view} value={view} className="faangin-real-demo__panel">
              <figure>
                <div className="faangin-real-demo__frame">
                  <a href={capture.src} target="_blank" rel="noopener noreferrer" className="faangin-real-demo__imageLink" aria-label={`Open full-size ${capture.label.toLowerCase()} capture in a new tab`}>
                    <Image
                      src={capture.src}
                      alt={capture.alt}
                      width={capture.width}
                      height={capture.height}
                      unoptimized
                      loading={view === "code" ? "eager" : "lazy"}
                      draggable={false}
                      className="faangin-real-demo__image"
                      data-browser-chrome={capture.browserChrome || undefined}
                    />
                    <span className="faangin-real-demo__expand"><Expand size={13} aria-hidden="true" />View full size</span>
                  </a>
                </div>
                <figcaption className="faangin-real-demo__caption"><span>HackerRank practice</span><p>{capture.description}</p></figcaption>
              </figure>
            </Tabs.Content>
          );
        })}
      </Tabs.Root>
    </div>
  );
}
