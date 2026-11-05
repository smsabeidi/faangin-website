import { proLaunchStatus, proPriceSummary } from "@/lib/pro-pricing";

/** Original faangin messaging. Competitive research informs structure, not copied claims. */
export const brand = {
  name: "faangin",
  title: "faangin — AI Interview Copilot for Mac & Windows",
  description:
    "AI guidance for coding, system design, behavioral interviews, and meetings. Download faangin for Apple silicon Mac or Windows x64. Choose Fast or Smart.",
  headline: "Your AI interview copilot.",
  subtitle:
    "Get real-time guidance for coding, behavioral, and system design questions. Hide, show, or move your assistant as the conversation unfolds.",
} as const;

export const faanginFaqs = [
  {
    question: "What does Faangin Pro include?",
    answer:
      "Pro includes unlimited AI assistance for coding, system design, behavioral interviews, and meetings, with hands-free guidance and overlay privacy controls.",
  },
  {
    question: "How much does Faangin Pro cost?",
    answer:
      `Pro is ${proPriceSummary}. Both billing options include unlimited AI. ${proLaunchStatus}`,
  },
  {
    question: "Which AI models can I use?",
    answer:
      "Faangin supplies the AI models for Pro. Choose Fast for quick guidance or Smart for more involved questions on supported requests.",
  },
  {
    question: "Which interviews is faangin built for?",
    answer:
      "Coding, system design, and behavioral rounds. Examine correctness, complexity, and edge cases; work through bottlenecks and failure modes; and make the scope, decisions, and impact of your work clear.",
  },
  {
    question: "How does faangin help during an interview?",
    answer:
      "faangin keeps the question, constraints, and response guidance in one workspace. Compare alternatives, examine weak points, and organize the reasoning behind your answer as follow-ups change the discussion. You decide what to say and how to support it.",
  },
  {
    question: "What are the undetectability tools?",
    answer:
      "faangin includes quick hide/show, a compact overlay, and flexible positioning. The actual app captures show expanded and compact views. Use the comparison slider and the example directional controls in the workspace section to explore those layouts.",
  },
  {
    question: "Is faangin built for experienced engineers?",
    answer:
      "The focus is technical reasoning: explaining design choices, handling deeper constraints, and communicating the scope and impact of work you actually owned. That makes the workspace relevant to experienced engineers as well as candidates preparing for their first technical role.",
  },
  {
    question: "Do I need an API key for Pro?",
    answer:
      "Pro includes managed AI access, so you can use it without a personal API key.",
  },
  {
    question: "Can I try it before buying?",
    answer:
      `Explore actual faangin captures and try the interactive examples for free. ${proLaunchStatus}`,
  },
] as const;
