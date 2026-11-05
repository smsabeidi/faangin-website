"use client";

import { useState } from "react";
import {
  ArrowUpRight, AudioLines, BrainCircuit, Check, ChevronDown,
  Code2, MessageSquareText, ShieldCheck, Sparkles, Zap,
} from "lucide-react";
import { GradientButton } from "@/components/sites/cluely-com-efd0578a/shared/gradient-button";
import {
  annualSavingsCents, annualSavingsPercent, annualTotalCents, formatPrice,
  proLaunchStatus, proPricing, type BillingPeriod,
} from "@/lib/pro-pricing";
import { proFeatureDetails } from "./PricingSection.config";
import "./PricingSection.css";

const benefits = [
  { icon: Zap, title: "Real-Time AI Copilot", text: "Contextual guidance as conversations unfold." },
  { icon: Code2, title: "Advanced Coding & System Design", text: "Go deeper on solutions and trade-offs." },
  { icon: AudioLines, title: "Hands-Free AI Assistance", text: "Listen, transcribe, and get automatic replies." },
  { icon: MessageSquareText, title: "Interview & Meeting Support", text: "Talking points, recaps, and follow-ups." },
  { icon: BrainCircuit, title: "Fast & Smart Model Options", text: "Choose the mode that fits the moment." },
  { icon: Sparkles, title: "Context-Aware Responses", text: "Clear guidance that follows your discussion." },
];

export default function PricingSection() {
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>("annual");
  const isAnnual = billingPeriod === "annual";
  const monthlyPrice = isAnnual ? proPricing.annualMonthlyCents : proPricing.monthlyCents;
  const trialHref = proPricing.trial.activationHref;

  return (
    <section id="pricing" aria-labelledby="pricing-heading" className="faangin-pricing relative z-10 scroll-mt-24">
      <div className="faangin-pricing-shell">
        <div className="faangin-pricing-intro">
          <h2 id="pricing-heading" className="faangin-pricing-heading">
            One Plan. Every Powerful Feature.
          </h2>
          <p className="faangin-pricing-description">
            Your real-time AI copilot for interviews, coding, meetings, and sales calls.
            Unlimited AI assistance and privacy controls in one Pro subscription.
          </p>
        </div>

        <article
          aria-labelledby="faangin-pro-title"
          className="faangin-pricing-offer"
          data-billing-period={billingPeriod}
        >
          <div className="faangin-pricing-purchase">
            <div className="faangin-pricing-plan-top">
              <h3 id="faangin-pro-title"><Sparkles size={19} aria-hidden="true" />{proPricing.name}</h3>
              {proPricing.availability === "preview" && <span className="faangin-pricing-status">Subscription preview</span>}
            </div>
            <p className="faangin-pricing-plan-line">One workspace. A clearer next move.</p>

            <fieldset className="faangin-pricing-toggle">
              <legend className="sr-only">Billing frequency</legend>
              <label>
                <input type="radio" name="faangin-billing" value="monthly" checked={!isAnnual} onChange={() => setBillingPeriod("monthly")} />
                <span>Monthly</span>
              </label>
              <label>
                <input type="radio" name="faangin-billing" value="annual" checked={isAnnual} onChange={() => setBillingPeriod("annual")} />
                <span>Annually <small>Save {annualSavingsPercent}%</small></span>
              </label>
            </fieldset>

            <div className="faangin-pricing-price-region" aria-live="polite" aria-atomic="true">
              <div className="faangin-pricing-anchor">
                {isAnnual ? <><s>{formatPrice(proPricing.monthlyCents)}</s><span>with monthly billing</span></> : <span>Simple monthly billing</span>}
              </div>
              <div className="faangin-pricing-price">
                <span className="faangin-pricing-amount" key={billingPeriod}>{formatPrice(monthlyPrice)}</span>
                <span className="faangin-pricing-period">/ month</span>
              </div>
              <p className="faangin-pricing-billing">
                {isAnnual ? `${formatPrice(annualTotalCents)} billed annually.` : "Billed monthly."}
              </p>
              <p className="faangin-pricing-saving">
                {isAnnual ? `Save ${formatPrice(annualSavingsCents, 0)} per year compared with monthly billing.` : `Choose annual billing to save ${annualSavingsPercent}%.`}
              </p>
            </div>
            <p className="faangin-pricing-equal"><Check size={15} aria-hidden="true" />Unlimited AI with either billing option.</p>
            <p className="faangin-pricing-availability">{proLaunchStatus}</p>
          </div>

          <div className="faangin-pricing-value">
            <p className="faangin-pricing-eyebrow">Built around your next conversation</p>
            <div className="faangin-pricing-spotlight">
              <span className="faangin-pricing-feature-icon"><ShieldCheck size={23} aria-hidden="true" /></span>
              <div>
                <h4>Undetectable Mode</h4>
                <p>Discreet AI. Built for your workspace.</p>
                <span>Customizable overlay and privacy controls for supported sharing setups. Visibility varies by app and OS.</span>
              </div>
            </div>
            <ul className="faangin-pricing-benefits" aria-label="Verified product capabilities">
              {benefits.map(({ icon: Icon, title, text }) => (
                <li key={title}>
                  <Icon size={19} aria-hidden="true" />
                  <div><h4>{title}</h4><p>{text}</p></div>
                </li>
              ))}
            </ul>
          </div>

          <details className="faangin-pricing-details">
            <summary>See Everything Included<ChevronDown size={18} aria-hidden="true" /></summary>
            <div className="faangin-pricing-details-body">
              <p className="faangin-pricing-details-note">Explore the app’s current capabilities. Pro subscriptions, included AI access, and the free trial are coming soon.</p>
              <ul>
                {proFeatureDetails.map(({ name, benefit, description }) => (
                  <li key={name}><Check size={17} aria-hidden="true" /><div><h4>{name}</h4><p><strong>{benefit}</strong> {description}</p></div></li>
                ))}
              </ul>
            </div>
          </details>

          <div className="faangin-pricing-trial">
            <div>
              <p className="faangin-pricing-eyebrow">{trialHref ? "Your first conversation is on us" : "A little time. A lot more clarity."}</p>
              <h4>Try faangin free</h4>
              <p>{trialHref ? `Experience ${proPricing.trial.minutes} minutes of real AI assistance. No credit card required.` : `Planned at launch: ${proPricing.trial.minutes} minutes of AI assistance. No credit card or personal API key required.`}</p>
              {!trialHref && <span className="faangin-pricing-trial-status">Free-trial activation and included AI access are not available yet.</span>}
            </div>
            <div className="faangin-pricing-trial-action">
              <GradientButton
                label={trialHref ? "Try Faangin Free" : "Explore the interactive demo"}
                href={trialHref ?? "/#demo"}
                variant="blue-gradient"
                rightIcon={<ArrowUpRight size={17} aria-hidden="true" />}
                className="faangin-pricing-cta"
              />
              <p>{trialHref ? `${proPricing.trial.minutes} minutes free · No credit card required` : "See faangin in action while the trial is on its way."}</p>
            </div>
          </div>
          <p className="faangin-pricing-currency">All prices in {proPricing.currency}. Annual billing is charged upfront. One plan, two ways to pay.</p>
        </article>
      </div>
    </section>
  );
}
