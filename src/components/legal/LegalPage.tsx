import Link from "next/link";
import type { LegalDocument } from "@/lib/legal-content";
import "./LegalPage.css";

type LegalPageProps = {
  document: LegalDocument;
};

type LegalTocProps = {
  sections: LegalDocument["sections"];
  slug: LegalDocument["slug"];
};

const policyLinks: readonly { slug: LegalDocument["slug"]; label: string }[] = [
  { slug: "privacy", label: "Privacy policy" },
  { slug: "terms", label: "Terms of service" },
  { slug: "refund", label: "Refund policy" },
];

function LegalToc({ sections, slug }: LegalTocProps) {
  return (
    <ol className="faangin-legal-toc-list">
      {sections.map(section => (
        <li key={section.id}>
          <a href={`#${slug}-section-${section.id}`}>{section.title}</a>
        </li>
      ))}
    </ol>
  );
}

export default function LegalPage({ document }: LegalPageProps) {
  const hasSections = document.sections.length > 0;

  return (
    <div className="faangin-legal-page">
      <header className="faangin-legal-intro">
        <p className="faangin-legal-eyebrow">faangin legal</p>
        <h1 id={`${document.slug}-title`}>{document.title}</h1>
        <p className="faangin-legal-description">{document.description}</p>
        <div className="faangin-legal-document-meta">
          <p>Last updated: {document.updated}</p>
          {document.status === "draft" ? <span className="faangin-legal-draft-badge">Draft</span> : null}
        </div>
      </header>

      <nav className="faangin-legal-policy-nav" aria-label="Legal policies">
        {policyLinks.map(policy => (
          policy.slug === document.slug ? (
            <a key={policy.slug} href="#legal-top" aria-current="page">{policy.label}</a>
          ) : (
            <Link key={policy.slug} href={`/policies/${policy.slug}#legal-top`}>{policy.label}</Link>
          )
        ))}
      </nav>

      {document.summary.length > 0 ? (
        <section className="faangin-legal-summaries" aria-label="Policy overview">
          {document.summary.map((summary, index) => (
            <div key={`${document.slug}-summary-${index}`} className="card-styles faangin-legal-summary-card">
              <h2>{summary.title}</h2>
              <p>{summary.body}</p>
            </div>
          ))}
        </section>
      ) : null}

      <div className={`faangin-legal-reading-layout${hasSections ? " faangin-legal-has-toc" : ""}`}>
        {hasSections ? (
          <>
            <details className="card-styles faangin-legal-mobile-toc">
              <summary>
                On this page
                <span className="faangin-legal-toc-chevron" aria-hidden="true" />
              </summary>
              <nav aria-label="Policy sections"><LegalToc sections={document.sections} slug={document.slug} /></nav>
            </details>
            <aside className="faangin-legal-desktop-toc" aria-labelledby={`${document.slug}-toc-heading`}>
              <div className="card-styles faangin-legal-toc-card">
                <h2 id={`${document.slug}-toc-heading`}>On this page</h2>
                <nav aria-label="Policy sections"><LegalToc sections={document.sections} slug={document.slug} /></nav>
              </div>
            </aside>
          </>
        ) : null}

        <article id={`${document.slug}-content`} aria-labelledby={`${document.slug}-title`} tabIndex={-1} className="card-styles faangin-legal-article">
          {document.sections.map(section => (
            <section key={section.id} className="faangin-legal-section" aria-labelledby={`${document.slug}-section-${section.id}`}>
              <h2 id={`${document.slug}-section-${section.id}`}>{section.title}</h2>
              {section.paragraphs.map((paragraph, index) => <p key={`${section.id}-paragraph-${index}`}>{paragraph}</p>)}
              {section.bullets && section.bullets.length > 0 ? (
                <ul>
                  {section.bullets.map((bullet, index) => <li key={`${section.id}-bullet-${index}`}>{bullet}</li>)}
                </ul>
              ) : null}
            </section>
          ))}
          <footer className="faangin-legal-article-footer">
            <a href={`mailto:${document.contactEmail}`}>{document.contactEmail}</a>
            <a href="#legal-top">Back to top <span aria-hidden="true">↑</span></a>
          </footer>
        </article>
      </div>
    </div>
  );
}
