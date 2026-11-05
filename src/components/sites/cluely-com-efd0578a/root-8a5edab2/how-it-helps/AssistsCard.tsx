"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, Code2, Expand, ListChecks, MessageSquareText, Sparkles } from "lucide-react";
import { productCaptures } from "@/lib/product-captures";
import "./AssistsCard.css";

const BENEFITS = [
  { Icon: ListChecks, label: "Clear approach" },
  { Icon: Code2, label: "Reviewable code" },
  { Icon: MessageSquareText, label: "Follow-up context" },
];

/** Benefit-led product proof using the user's actual faangin capture. */
export function AssistsCard() {
  const reducedMotion = useReducedMotion();

  return (
    <motion.article
      id="reasoning"
      data-faangin-reasoning
      aria-labelledby="faangin-reasoning-title"
      initial={reducedMotion ? false : { y: 24, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: reducedMotion ? 0 : 0.5, delay: reducedMotion ? 0 : 0.15 }}
      className="faangin-reasoning"
    >
      <div className="faangin-reasoning__intro">
        <span className="faangin-reasoning__eyebrow"><Sparkles size={13} strokeWidth={1.7} aria-hidden="true" />Your interview copilot</span>
        <h3 id="faangin-reasoning-title">Turn the question<br />into a plan.</h3>
        <p>Capture a coding problem and work through the approach, assumptions, and code. Ask a follow-up when you need more depth.</p>
      </div>

      <ul className="faangin-reasoning__benefits" aria-label="How faangin helps">
        {BENEFITS.map(({ Icon, label }) => <li key={label}><Icon size={13} strokeWidth={1.7} aria-hidden="true" /><span>{label}</span></li>)}
      </ul>

      <figure className="faangin-reasoning__proof">
        <a className="faangin-reasoning__capture" href={productCaptures.approach.src} target="_blank" rel="noopener noreferrer" aria-label="Open the actual faangin approach capture at full size in a new tab">
          <Image src={productCaptures.approach.src} alt={productCaptures.approach.alt} width={3024} height={1964} unoptimized draggable={false} className="faangin-reasoning__image" />
          <span className="faangin-reasoning__expand"><Expand size={12} aria-hidden="true" />Full size</span>
        </a>
        <figcaption>Actual faangin capture <span aria-hidden="true">·</span> Python approach</figcaption>
      </figure>

      <div className="faangin-reasoning__footer">
        <Link href="#demo" className="faangin-reasoning__cta">See faangin in action <ArrowUpRight size={16} strokeWidth={1.7} aria-hidden="true" /></Link>
      </div>
    </motion.article>
  );
}
