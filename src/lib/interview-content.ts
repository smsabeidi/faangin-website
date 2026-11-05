import { proLaunchStatus, proPriceSummary } from "@/lib/pro-pricing";

const interviewPriceDetails = `Faangin Pro includes unlimited AI assistance. The launch price is ${proPriceSummary}.`;
const interviewPreviewDetails = `Explore the free interactive preview today. ${proLaunchStatus}`;

export type InterviewSection = {
  id: string;
  title: string;
  paragraphs: readonly string[];
  bullets?: readonly string[];
};

export type InterviewTopic = {
  slug: "coding-interview" | "system-design-interview" | "behavioral-interview";
  label: string;
  title: string;
  metaTitle: string;
  description: string;
  introduction: string;
  summaries: readonly { title: string; body: string }[];
  sections: readonly InterviewSection[];
};

export const interviewTopics: readonly InterviewTopic[] = [
  {
    slug: "coding-interview",
    label: "Coding interviews",
    title: "AI coding interview copilot",
    metaTitle: "AI Coding Interview Copilot | faangin",
    description: "Compare coding approaches, correctness, complexity, and edge cases with faangin. AI interview guidance for Mac and Windows, with Fast and Smart modes.",
    introduction: "A coding interview answer needs a working approach and a clear explanation. faangin keeps the question, constraints, and follow-ups together so you can examine your reasoning as the problem changes.",
    summaries: [
      { title: "Choose an approach", body: "Make the input constraints explicit before comparing algorithms and data structures." },
      { title: "Explain correctness", body: "State what stays true as the algorithm runs, then test the cases that could break it." },
      { title: "Handle follow-ups", body: "Revisit time, memory, and assumptions when the interviewer adds a constraint." },
    ],
    sections: [
      {
        id: "what-a-copilot-does",
        title: "What does a coding interview copilot help with?",
        paragraphs: [
          "A coding interview copilot provides another way to inspect a proposed solution: compare approaches, check edge cases, and organize an explanation of correctness and complexity. faangin brings that guidance into an interview workspace alongside the original question and follow-up context.",
          "Use the response as something to examine. Verify the assumptions and trace the code yourself before relying on a suggestion. An explanation that sounds plausible still needs to match the problem you were actually asked.",
        ],
      },
      {
        id: "reasoning-checklist",
        title: "Build the answer before writing the code",
        paragraphs: ["A short sequence keeps the discussion specific and gives the interviewer a chance to correct your interpretation early."],
        bullets: [
          "Restate the input and output. Ask about empty inputs, duplicates, ordering, and whether you may modify the input.",
          "Describe a straightforward solution first. Its bottleneck makes the reason for an optimization easier to explain.",
          "Name the invariant or property that makes your chosen approach correct.",
          "Trace a small example and one adversarial case before implementing.",
          "Give time and auxiliary-space costs, including sorting, recursion, and any data structures you introduce.",
        ],
      },
      {
        id: "worked-example",
        title: "Example: merge overlapping intervals",
        paragraphs: [
          "Start by clarifying the interval convention. If intervals are closed, [1, 3] and [3, 5] overlap. If the task uses half-open intervals, touching endpoints may need different treatment. That decision changes the merge condition.",
          "Sort the intervals by start. Keep the current merged interval and scan the remaining intervals. Merge the next interval when it overlaps; otherwise, emit the current interval and start another. The invariant is that emitted intervals are already ordered and cannot overlap any later interval.",
          "Sorting takes O(n log n) time and the scan takes O(n). The result may contain O(n) intervals; the sorting algorithm and language determine any additional sorting space. Check an empty input, a single interval, nested intervals, identical intervals, and intervals that only touch.",
          "If the follow-up says the input is already sorted, the sorting step can be removed. If intervals arrive as a stream out of order, the original one-pass argument no longer applies. Explain which assumption changed before proposing another data structure.",
        ],
      },
      {
        id: "using-faangin",
        title: "Keep the changing constraints in view",
        paragraphs: [
          "faangin is designed for coding, system design, and behavioral interview guidance. Its workspace keeps question context and response guidance together, while overlay controls let you choose the view and placement. The interactive preview shows those controls with authored examples.",
          "For a coding round, keep your current attempt and the latest constraint clear. A useful follow-up is specific: “Does this still work when duplicate values are allowed?” or “Which operation dominates the time cost?” This makes a proposed revision easier to evaluate than an unexplained replacement solution.",
        ],
      },
      {
        id: "price-and-preview",
        title: "Price and current availability",
        paragraphs: [
          interviewPriceDetails,
          interviewPreviewDetails,
        ],
      },
    ],
  },
  {
    slug: "system-design-interview",
    label: "System design interviews",
    title: "AI system design interview copilot",
    metaTitle: "AI System Design Interview Copilot | faangin",
    description: "Work through architecture choices, bottlenecks, and failure modes with faangin's AI system design interview copilot. Available for Mac and Windows.",
    introduction: "A useful design connects requirements to decisions. faangin helps you keep constraints and follow-ups in view while you work through architecture, bottlenecks, failure modes, and the trade-offs behind your answer.",
    summaries: [
      { title: "Set the requirements", body: "Clarify the users, traffic pattern, latency needs, and acceptable failure behavior." },
      { title: "Defend the decisions", body: "Explain why each component belongs and which cost or limitation it introduces." },
      { title: "Test the failure paths", body: "Follow retries, duplicates, overload, and recovery through the whole design." },
    ],
    sections: [
      {
        id: "what-a-copilot-does",
        title: "What does a system design interview copilot help with?",
        paragraphs: [
          "A system design interview copilot helps organize an architecture discussion around requirements, alternatives, and consequences. faangin keeps the question and evolving context in one workspace so you can examine a design as deeper follow-ups arrive.",
          "The useful output is reasoning you can defend: which requirement a component satisfies, what can fail, and what you would measure. A diagram or a list of familiar technologies is only a starting point.",
        ],
      },
      {
        id: "design-checklist",
        title: "Use requirements to choose the architecture",
        paragraphs: ["Before adding infrastructure, identify the decisions the problem actually requires."],
        bullets: [
          "Define the main operation and its success criteria. Separate immediate acknowledgement from completed work.",
          "Estimate the workload using stated assumptions, including peaks and uneven demand. Explain how the estimate affects a decision.",
          "Choose the data model and access patterns before selecting a database label.",
          "Discuss consistency, ordering, latency, and availability where they matter to the user experience.",
          "Walk through overload and dependency failure. Describe backpressure, recovery, and the signals an operator would inspect.",
        ],
      },
      {
        id: "worked-example",
        title: "Example: a notification delivery service",
        paragraphs: [
          "Clarify which channels are needed, whether delivery is urgent, and whether a user may receive duplicate messages. Separate accepting a notification request from delivering it through an external email, push, or messaging provider.",
          "A queue can absorb a burst while workers process requests at a controlled rate. Keep a notification ID and a delivery record so a retried queue message does not automatically create a new logical notification. Check user preferences and expiration before dispatch.",
          "An external provider timeout creates an uncertain outcome: the provider may have accepted the message even though your worker did not receive the response. Discuss provider idempotency support or reconciliation. A local “sent” flag alone cannot guarantee exactly-once delivery across that network boundary.",
          "Then test the design under a provider outage. Bound retries, introduce a delay, isolate exhausted work for inspection, and keep one failing channel from consuming all worker capacity. Measure queue age, delivery latency, failure rate, and duplicate reports. Explain how your choices trade throughput, cost, and timeliness.",
        ],
      },
      {
        id: "using-faangin",
        title: "Turn a follow-up into a design revision",
        paragraphs: [
          "When the interviewer changes a requirement, name the original assumption before changing the architecture. “We now need per-user ordering” leads to a different discussion from “We need the whole system to have one global order.” Keep that distinction visible in your notes.",
          "faangin supports coding, system design, and behavioral interview guidance in the same workspace. Use the preview to explore the guidance panel, hide/show controls, and positioning. Its examples illustrate the interface; they are not live performance measurements or a guarantee that a design is correct.",
        ],
      },
      {
        id: "price-and-preview",
        title: "Price and current availability",
        paragraphs: [
          interviewPriceDetails,
          interviewPreviewDetails,
        ],
      },
    ],
  },
  {
    slug: "behavioral-interview",
    label: "Behavioral interviews",
    title: "AI behavioral interview copilot",
    metaTitle: "AI Behavioral Interview Copilot | faangin",
    description: "Structure behavioral interview answers around your real decisions, ownership, and results with faangin's AI copilot. Download for Mac and Windows.",
    introduction: "Make the work you actually owned easy to understand. faangin helps you keep the question and follow-ups together while you structure an answer around your decisions, trade-offs, and the impact you can substantiate.",
    summaries: [
      { title: "Choose the right story", body: "Match a real example to the question instead of forcing one story into every answer." },
      { title: "Show your ownership", body: "Separate the team's outcome from the decisions and actions you personally took." },
      { title: "Support the result", body: "Use evidence you can explain, then say what you learned or would change." },
    ],
    sections: [
      {
        id: "what-a-copilot-does",
        title: "What does a behavioral interview copilot help with?",
        paragraphs: [
          "A behavioral interview copilot helps you organize an answer and respond to follow-ups without losing the original question. faangin provides guidance for making context, ownership, decisions, and results clear in a technical interview discussion.",
          "The underlying experience must come from you. A suggested structure can make a real example easier to follow; it cannot supply work you did not do, a result you cannot verify, or another person's decisions as your own.",
        ],
      },
      {
        id: "story-checklist",
        title: "Prepare a small set of specific examples",
        paragraphs: ["For each story, record enough detail to handle a second question. A polished opening is less useful if the reasoning disappears under follow-up."],
        bullets: [
          "Situation: name the actual constraint, the people affected, and why the problem mattered.",
          "Responsibility: explain what you were accountable for and where another person's ownership began.",
          "Action: describe a decision you made, the alternatives you considered, and how you worked with others.",
          "Result: state an outcome you can substantiate. Distinguish observed results from estimates or expectations.",
          "Reflection: explain what you learned and one thing you would handle differently.",
        ],
      },
      {
        id: "worked-example",
        title: "Example: explain a disagreement about a launch",
        paragraphs: [
          "For “Tell me about a time you disagreed with a teammate,” choose a real decision with a meaningful trade-off. The answer needs more than a claim that you persuaded someone. Explain what each person was trying to protect, such as a delivery date, reliability, or the ability to reverse a change.",
          "Describe the evidence you brought to the conversation and how it changed the decision. If a staged rollout, a smaller scope, or an explicit rollback condition resolved the disagreement, explain who proposed it and who made the final call. Use only details that belong to your experience.",
          "State the actual result. If you do not have a reliable numerical measure, describe the concrete outcome and its limits instead of inventing a percentage. Credit the other person's contribution and explain what you would repeat or change next time.",
          "Prepare for the follow-ups: “What would your teammate say?”, “What if your proposal had failed?”, and “What did you personally own?” Each asks for a different part of the story. Answer that part directly rather than repeating the full opening.",
        ],
      },
      {
        id: "using-faangin",
        title: "Keep the answer relevant as the discussion changes",
        paragraphs: [
          "An interviewer may move from collaboration to judgment, then from judgment to personal responsibility. Keep the factual story stable while changing which part you explain. A useful note might be the decision, the competing option, the evidence, and your role—not a script to recite word for word.",
          "faangin brings coding, system design, and behavioral guidance into one interview workspace. The free website preview demonstrates panel placement, hide/show controls, and example guidance. Review any suggested wording against your actual experience before using it.",
        ],
      },
      {
        id: "price-and-preview",
        title: "Price and current availability",
        paragraphs: [
          interviewPriceDetails,
          interviewPreviewDetails,
        ],
      },
    ],
  },
];

export function getInterviewTopic(slug: InterviewTopic["slug"]): InterviewTopic {
  const topic = interviewTopics.find(candidate => candidate.slug === slug);
  if (!topic) throw new Error(`Unknown interview topic: ${slug}`);
  return topic;
}
