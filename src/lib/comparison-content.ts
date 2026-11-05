/** Public monthly offers verified 2026-10-30. Official source links travel with each column. */
import {
  annualSavingsCents,
  annualTotalCents,
  formatPrice,
  proPricing,
} from "@/lib/pro-pricing";

export const comparisonCheckedOn = "Oct 30, 2026";
export type ComparisonRowId = "workspace" | "privacy" | "billing" | "usage" | "free" | "alternatives";

export type ComparisonColumn = {
  id: string;
  name: string;
  plan: string;
  monthlyCents: number;
  interval: string;
  priceNote: string;
  sourceUrl?: string;
  rows: Record<ComparisonRowId, { value: string; detail?: string }>;
};

export const comparisonRows: readonly { id: ComparisonRowId; label: string }[] = [
  { id: "workspace", label: "Where it helps" },
  { id: "privacy", label: "Discreet workspace" },
  { id: "billing", label: "Billing & commitment" },
  { id: "usage", label: "AI access & limits" },
  { id: "free", label: "Try it first" },
  { id: "alternatives", label: "Other billing options" },
];

export const faanginComparison: ComparisonColumn = {
  id: "faangin",
  name: "faangin Pro",
  plan: "Pro · subscription preview",
  monthlyCents: proPricing.monthlyCents,
  interval: "/ month · billed monthly",
  priceNote: "Unlimited AI + privacy controls",
  rows: {
    workspace: { value: "One copilot across your day", detail: "Coding, system design, interviews, meetings, and customer conversations, with hands-free guidance." },
    privacy: { value: "Privacy controls included in Pro", detail: "A customizable overlay and capture exclusion for supported sharing apps and OS setups." },
    billing: { value: "One plan. Two billing options.", detail: "The same unlimited AI offer and core features, whether you choose monthly or annual billing." },
    // Unlimited AI is the product owner's confirmed Pro offer; activation remains a preview.
    usage: { value: "Unlimited AI assistance", detail: "Included in the Pro offer across supported coding and conversation workflows." },
    free: { value: "Explore the demo today", detail: `${proPricing.trial.minutes}-minute no-card AI trial planned at launch.` },
    alternatives: { value: `${formatPrice(proPricing.annualMonthlyCents)}/month, billed annually`, detail: `${formatPrice(annualTotalCents)} upfront. Save ${formatPrice(annualSavingsCents, 0)} per year versus monthly billing.` },
  },
};

export const competitorComparisons: readonly ComparisonColumn[] = [
  {
    id: "cluely",
    name: "Cluely",
    plan: "Pro + Undetectability",
    monthlyCents: 14_999,
    interval: "/ month · billed monthly",
    priceNote: "Pro features + screen-share privacy",
    sourceUrl: "https://cluely.com/pricing",
    rows: {
      workspace: { value: "Meetings and live calls", detail: "AI guidance and meeting notes." },
      privacy: { value: "Capture privacy included", detail: "Screen-sharing privacy is advertised for this selected plan." },
      billing: { value: "Monthly subscription" },
      usage: { value: "Unlimited AI responses", detail: "All Pro features and meeting notes are included, as advertised." },
      free: { value: "Free Starter plan", detail: "Limited responses and meeting notes." },
      alternatives: { value: "See current billing options", detail: "Check official pricing for the selected tier and its current terms." },
    },
  },
  {
    id: "final-round-ai",
    name: "Final Round AI",
    plan: "Monthly Plan",
    monthlyCents: 15_000,
    interval: "/ month · billed monthly",
    priceNote: "Monthly plan rate",
    sourceUrl: "https://www.finalroundai.com/subscription-simple?from=homepage-pricing-pro-card",
    rows: {
      workspace: { value: "Interviews and preparation", detail: "Live copilot, question bank, and interview reports." },
      privacy: { value: "Stealth mode advertised", detail: "Listed on paid plans." },
      billing: { value: "Monthly subscription" },
      usage: { value: "Unlimited Interview Copilot", detail: "Advertised with standard models on the Monthly Plan." },
      free: { value: "Free preparation tools", detail: "Basic reports and prep management. Live sessions require Pro; no free trial is advertised." },
      alternatives: { value: "Quarterly and annual plans", detail: "$83.33/month billed quarterly or $25/month billed annually. Verify the upfront total before purchase." },
    },
  },
  {
    id: "lockedin-ai",
    name: "LockedIn AI",
    plan: "Unlimited General · monthly",
    monthlyCents: 5_499,
    interval: "/ month · billed monthly",
    priceNote: "Displayed promotional price",
    sourceUrl: "https://www.lockedinai.com/pricing",
    rows: {
      workspace: { value: "Interviews, meetings, and mocks", detail: "Coding, online assessments, document uploads, and reports." },
      privacy: { value: "Pro upgrade required", detail: "Stealth Mode and Duo are in the currently displayed $119.99/month Pro offer." },
      billing: { value: "Monthly subscription", detail: "Displayed promotion; the page lists $109.98 as the standard General monthly price." },
      usage: { value: "Unlimited sessions", detail: "Advertised interview and mock sessions, with up to two hours per interview." },
      free: { value: "Free access with limits", detail: "Five-minute sessions, up to 60 minutes per day, with one-minute pauses between sessions." },
      alternatives: { value: "Other commitments available", detail: "Three-month billing, credits, and lifetime offers are listed. Check the plan features and upfront total." },
    },
  },
  {
    id: "interview-coder",
    name: "Interview Coder",
    plan: "Monthly Pro",
    monthlyCents: 29_900,
    interval: "/ month · billed monthly",
    priceNote: "Currently displayed offer",
    sourceUrl: "https://www.interviewcoder.co/#pricing",
    rows: {
      workspace: { value: "Multiple interview formats", detail: "Coding, system design, and audio guidance." },
      privacy: { value: "Capture privacy advertised", detail: "The vendor markets invisibility features; compatibility was not independently tested." },
      billing: { value: "Monthly subscription", detail: "Cancellation at any time is advertised." },
      usage: { value: "1,000 credits per month", detail: "Paid access includes the vendor’s AI models." },
      free: { value: "Free app download", detail: "Explore the app; AI features require a paid plan." },
      alternatives: { value: "Lifetime Pro: $799 once", detail: "A different commitment from the selected monthly plan." },
    },
  },
];

/** Compare monthly billing only; annual equivalents never enter this calculation. */
export function monthlyDifferenceCents(column: ComparisonColumn) {
  return column.monthlyCents - faanginComparison.monthlyCents;
}

export const hasLowestMonthlyPriceShown = competitorComparisons.every(column => monthlyDifferenceCents(column) > 0);
