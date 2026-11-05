"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, AudioLines, ChevronDown, ShieldCheck, Sparkles } from "lucide-react";
import { DownloadButton } from "@/components/sites/cluely-com-efd0578a/shared/download-button";
import {
  comparisonRows,
  comparisonCheckedOn,
  competitorComparisons,
  faanginComparison,
  hasLowestMonthlyPriceShown,
  monthlyDifferenceCents,
  type ComparisonColumn,
  type ComparisonRowId,
} from "@/lib/comparison-content";
import { annualTotalCents, formatPrice, proLaunchStatus, proPriceSummary, proPricing } from "@/lib/pro-pricing";
import "./ComparisonSection.css";

const reasonsToChoose = [
  { icon: Sparkles, title: "Unlimited AI. Included.", description: "Keep getting help as the conversation develops. Unlimited AI assistance is part of the Pro offer." },
  { icon: ShieldCheck, title: "Privacy controls. Included.", description: "A discreet overlay you control, with capture protection for supported sharing setups. No separate privacy tier." },
  { icon: AudioLines, title: "More situations. One workspace.", description: "Coding and system design, interviews and meetings, customer calls and follow-ups—with hands-free guidance." },
];

function displayMoney(cents: number) {
  return formatPrice(cents, cents % 100 === 0 ? 0 : 2);
}

type ColumnHeadingProps = {
  column: ComparisonColumn;
  featured?: boolean;
};

function ColumnHeading({ column, featured = false }: ColumnHeadingProps) {
  const difference = monthlyDifferenceCents(column);
  return (
    <div className="faangin-comparison-column-heading">
      <span className="faangin-comparison-brand">{column.name}</span>
      <span className="faangin-comparison-plan">{column.plan}</span>
      <div className="faangin-comparison-price">
        <span className="faangin-comparison-amount">{displayMoney(column.monthlyCents)}</span>
        <span className="faangin-comparison-interval">{column.interval}</span>
      </div>
      <span className="faangin-comparison-price-note">{column.priceNote}</span>
      {featured ? (
        hasLowestMonthlyPriceShown && <span className="faangin-comparison-price-advantage">Lowest monthly price shown</span>
      ) : (
        <span className="faangin-comparison-price-difference">
          {difference > 0 ? `${displayMoney(difference)} more / month` : difference < 0 ? `${displayMoney(-difference)} less / month` : "Same monthly price"}
          <span className="sr-only"> compared with faangin Pro</span>
        </span>
      )}
      {featured ? (
        <Link href="/#pricing" className="faangin-comparison-source" aria-label="View faangin Pro pricing">
          See Pro pricing <ArrowUpRight size={13} aria-hidden="true" />
        </Link>
      ) : column.sourceUrl ? (
        <a
          href={column.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="faangin-comparison-source"
          aria-label={`${column.name} official pricing (opens in a new tab)`}
        >
          Official pricing <ArrowUpRight size={13} aria-hidden="true" />
        </a>
      ) : null}
    </div>
  );
}

function ComparisonValue({ column, rowId }: { column: ComparisonColumn; rowId: ComparisonRowId }) {
  const cell = column.rows[rowId];

  return (
    <>
      <span className="faangin-comparison-value">{cell.value}</span>
      {cell.detail ? <span className="faangin-comparison-detail">{cell.detail}</span> : null}
    </>
  );
}

export default function ComparisonSection() {
  const instanceId = useId();
  const [selectedId, setSelectedId] = useState(competitorComparisons[0]?.id ?? "");
  const selectedCompetitor = competitorComparisons.find(column => column.id === selectedId) ?? competitorComparisons[0];
  const selectedDifference = selectedCompetitor ? monthlyDifferenceCents(selectedCompetitor) : 0;
  const columns = [faanginComparison, ...competitorComparisons];
  const selectId = `${instanceId}-competitor`;
  const costNoteId = `${instanceId}-cost-note`;
  const evidenceNoteId = `${instanceId}-evidence-note`;

  return (
    <section id="compare" aria-labelledby="comparison-heading" className="faangin-comparison relative z-10 scroll-mt-24">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-10 px-5 md:gap-14 md:px-8">
        <div className="faangin-comparison-intro flex flex-col items-center gap-3 text-center">
          <p className="faangin-comparison-eyebrow">Why choose faangin</p>
          <h2
            id="comparison-heading"
            className="faangin-comparison-heading max-w-240 text-3xl leading-[1.25] font-medium tracking-[-1.28px] text-balance lg:text-5xl xl:text-[56px]"
          >
            Unlimited AI.<br />One powerful plan.
          </h2>
          <p className="faangin-comparison-description max-w-190 text-base leading-relaxed md:text-lg">
            Unlimited AI assistance, privacy controls, and hands-free support for coding, interviews, meetings, and customer conversations. One Pro plan for {formatPrice(proPricing.monthlyCents)} a month.
          </p>
        </div>

        <ul className="faangin-comparison-reasons" aria-label="Why choose faangin">
          {reasonsToChoose.map(({ icon: Icon, title, description }) => (
            <li key={title} className="card-styles">
              <Icon size={23} aria-hidden="true" />
              <div><h3>{title}</h3><p>{description}</p></div>
            </li>
          ))}
        </ul>

        <div className="faangin-comparison-content">
          {selectedCompetitor && (
            <div className="card-styles faangin-comparison-value-banner" aria-live="polite" aria-atomic="true">
              <div>
                <p className="faangin-comparison-value-eyebrow">Your monthly price advantage</p>
                <h3>{selectedDifference > 0 ? `${displayMoney(selectedDifference)} less per month.` : selectedDifference < 0 ? `${displayMoney(-selectedDifference)} more per month.` : "The same monthly price."}</h3>
                <p>Compared with {selectedCompetitor.name} {selectedCompetitor.plan}.</p>
              </div>
              <div className="faangin-comparison-value-proof">
                <strong>faangin Pro {formatPrice(proPricing.monthlyCents)} <span>/ month</span></strong>
                <p>{selectedCompetitor.name} {displayMoney(selectedCompetitor.monthlyCents)}/month · Monthly billing</p>
                {hasLowestMonthlyPriceShown && <span>Lower monthly price than all four selected plans shown.</span>}
              </div>
            </div>
          )}
          <p id={costNoteId} className="faangin-comparison-cost-note">
            <strong>faangin Pro: {formatPrice(proPricing.monthlyCents)}/month, billed monthly.</strong>{" "}
            Or {formatPrice(proPricing.annualMonthlyCents)}/month with {formatPrice(annualTotalCents)} paid annually.
            <span className="faangin-comparison-preview-note">{proLaunchStatus} Explore the demo today.</span>
          </p>

          <div className="card-styles faangin-comparison-surface faangin-comparison-wide">
            <table className="faangin-comparison-table" aria-describedby={`${costNoteId} ${evidenceNoteId}`}>
              <caption className="sr-only">faangin Pro subscription preview and selected monthly plans from four AI tools</caption>
              <colgroup>
                <col className="faangin-comparison-label-column" />
                {columns.map(column => <col key={column.id} />)}
              </colgroup>
              <thead>
                <tr>
                  <th scope="col" className="faangin-comparison-corner">
                    <span>Plan details</span>
                    <span>Monthly plan comparison</span>
                  </th>
                  {columns.map(column => (
                    <th
                      key={column.id}
                      scope="col"
                      className={column.id === faanginComparison.id ? "faangin-comparison-featured" : undefined}
                    >
                      <ColumnHeading column={column} featured={column.id === faanginComparison.id} />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map(row => (
                  <tr key={row.id}>
                    <th scope="row" className="faangin-comparison-row-label">{row.label}</th>
                    {columns.map(column => (
                      <td key={column.id} className={column.id === faanginComparison.id ? "faangin-comparison-featured" : undefined}>
                        <ComparisonValue column={column} rowId={row.id} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {selectedCompetitor ? (
            <div className="faangin-comparison-paired">
              <div className="faangin-comparison-selector">
                <label htmlFor={selectId}>Compare faangin with</label>
                <div className="faangin-comparison-select-wrap">
                  <select id={selectId} value={selectedCompetitor.id} onChange={event => setSelectedId(event.target.value)}>
                    {competitorComparisons.map(column => <option key={column.id} value={column.id}>{column.name}</option>)}
                  </select>
                  <ChevronDown size={18} aria-hidden="true" />
                </div>
              </div>
              <div className="card-styles faangin-comparison-surface">
                <table className="faangin-comparison-table faangin-comparison-paired-table" aria-describedby={`${costNoteId} ${evidenceNoteId}`}>
                  <caption className="sr-only">faangin compared with {selectedCompetitor.name}</caption>
                  <thead>
                    <tr>
                      <th id={`${instanceId}-paired-faangin`} scope="col" className="faangin-comparison-featured">
                        <ColumnHeading column={faanginComparison} featured />
                      </th>
                      <th id={`${instanceId}-paired-competitor`} scope="col">
                        <ColumnHeading column={selectedCompetitor} />
                      </th>
                    </tr>
                  </thead>
                  {comparisonRows.map(row => (
                    <tbody key={row.id}>
                      <tr>
                        <th id={`${instanceId}-paired-${row.id}`} colSpan={2} scope="rowgroup" className="faangin-comparison-row-label">
                          {row.label}
                        </th>
                      </tr>
                      <tr>
                        <td className="faangin-comparison-featured" headers={`${instanceId}-paired-faangin ${instanceId}-paired-${row.id}`}>
                          <ComparisonValue column={faanginComparison} rowId={row.id} />
                        </td>
                        <td headers={`${instanceId}-paired-competitor ${instanceId}-paired-${row.id}`}>
                          <ComparisonValue column={selectedCompetitor} rowId={row.id} />
                        </td>
                      </tr>
                    </tbody>
                  ))}
                </table>
              </div>
            </div>
          ) : null}

          <p id={evidenceNoteId} className="faangin-comparison-evidence-note">
            Selected public plans in USD · Checked {comparisonCheckedOn}. Plans have different features and limits; these are not equivalent bundles. Promotions and terms can change. Vendor privacy claims have not been independently tested. faangin visibility varies by sharing app and OS.
          </p>
        </div>

        <div className="card-styles faangin-comparison-conversion">
          <div className="faangin-comparison-conversion-copy">
            <h3>Unlimited AI. A plan built around you.</h3>
            <p>See the workspace, explore the guidance, and choose the Pro offer that brings it together.</p>
          </div>
          <div className="faangin-comparison-conversion-actions">
            <div className="faangin-comparison-conversion-links">
              <DownloadButton className="faangin-comparison-preview-button" />
              <a href="#pricing" className="faangin-comparison-included-link">See Pro pricing</a>
            </div>
            <p>Pro subscription preview · {proPriceSummary}.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
