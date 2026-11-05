/** Public Pro offer used across the site. */
export const proPricing = {
  name: "FAANGIN PRO",
  currency: "USD",
  monthlyCents: 4_999,
  annualMonthlyCents: 2_999,
  monthsPerYear: 12,
  availability: "preview",
  trial: {
    minutes: 20,
    // Set only after a real no-card, included-AI trial activation path is verified.
    activationHref: null as string | null,
  },
} as const;

export type BillingPeriod = "monthly" | "annual";

export const annualTotalCents = proPricing.annualMonthlyCents * proPricing.monthsPerYear;
export const annualSavingsCents = proPricing.monthlyCents * proPricing.monthsPerYear - annualTotalCents;
export const annualSavingsPercent = Math.round(
  (annualSavingsCents / (proPricing.monthlyCents * proPricing.monthsPerYear)) * 100,
);

export function formatPrice(cents: number, fractionDigits = 2) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: proPricing.currency,
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(cents / 100);
}

export const proPriceSummary =
  `${formatPrice(proPricing.monthlyCents)}/month billed monthly, or ${formatPrice(proPricing.annualMonthlyCents)}/month billed annually (${formatPrice(annualTotalCents)} per year)`;

export const proLaunchStatus =
  `Pro subscriptions and the ${proPricing.trial.minutes}-minute trial are coming soon.`;
