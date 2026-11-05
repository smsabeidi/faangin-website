import Link from "next/link";
import { JsonLd } from "@/components/seo/JsonLd";
import { DownloadButton } from "@/components/sites/cluely-com-efd0578a/shared/download-button";
import { interviewTopics, type InterviewTopic } from "@/lib/interview-content";
import { absoluteUrl, makeWebPageSchema } from "@/lib/seo";
import "@/components/legal/LegalPage.css";
import "./InterviewTopicPage.css";

function TopicToc({ topic }: { topic: InterviewTopic }) {
  return (
    <ol className="faangin-legal-toc-list">
      {topic.sections.map(section => (
        <li key={section.id}><a href={`#${section.id}`}>{section.title}</a></li>
      ))}
    </ol>
  );
}

export default function InterviewTopicPage({ topic }: { topic: InterviewTopic }) {
  const pageUrl = absoluteUrl(`/${topic.slug}`);
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        ...makeWebPageSchema({ title: topic.metaTitle, description: topic.description, path: `/${topic.slug}` }),
        breadcrumb: { "@id": `${pageUrl}#breadcrumb` },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${pageUrl}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "faangin", item: absoluteUrl("/") },
          { "@type": "ListItem", position: 2, name: topic.label, item: pageUrl },
        ],
      },
    ],
  };

  return (
    <div className="faangin-legal-page faangin-interview-page">
      <JsonLd data={schema} />
      <nav className="faangin-interview-breadcrumbs" aria-label="Breadcrumb">
        <Link href="/">faangin</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{topic.label}</span>
      </nav>

      <header className="faangin-legal-intro">
        <p className="faangin-legal-eyebrow">faangin interview guidance</p>
        <h1 id="interview-title">{topic.title}</h1>
        <p className="faangin-legal-description">{topic.introduction}</p>
        <div className="faangin-interview-actions">
          <DownloadButton showRequirements />
          <Link href="/#pricing">See pricing</Link>
        </div>
        <p className="faangin-interview-price">Unlimited AI with Pro at launch</p>
      </header>

      <nav className="faangin-legal-policy-nav" aria-label="Interview topics">
        {interviewTopics.map(candidate => (
          <Link
            key={candidate.slug}
            href={`/${candidate.slug}`}
            aria-current={candidate.slug === topic.slug ? "page" : undefined}
          >
            {candidate.label}
          </Link>
        ))}
      </nav>

      <section className="faangin-legal-summaries" aria-label={`${topic.label} overview`}>
        {topic.summaries.map(summary => (
          <div key={summary.title} className="card-styles faangin-legal-summary-card">
            <h2>{summary.title}</h2>
            <p>{summary.body}</p>
          </div>
        ))}
      </section>

      <div className="faangin-legal-reading-layout faangin-legal-has-toc">
        <details className="card-styles faangin-legal-mobile-toc">
          <summary>On this page<span className="faangin-legal-toc-chevron" aria-hidden="true" /></summary>
          <nav aria-label="On this page"><TopicToc topic={topic} /></nav>
        </details>
        <aside className="faangin-legal-desktop-toc" aria-labelledby="interview-toc-heading">
          <div className="card-styles faangin-legal-toc-card">
            <h2 id="interview-toc-heading">On this page</h2>
            <nav aria-label="On this page"><TopicToc topic={topic} /></nav>
          </div>
        </aside>

        <article aria-labelledby="interview-title" className="card-styles faangin-legal-article">
          {topic.sections.map(section => (
            <section key={section.id} className="faangin-legal-section" aria-labelledby={section.id}>
              <h2 id={section.id}>{section.title}</h2>
              {section.paragraphs.map((paragraph, index) => <p key={`${section.id}-${index}`}>{paragraph}</p>)}
              {section.bullets ? (
                <ul>{section.bullets.map(bullet => <li key={bullet}>{bullet}</li>)}</ul>
              ) : null}
            </section>
          ))}
          <footer className="faangin-legal-article-footer">
            <DownloadButton />
            <a href="#interview-top">Back to top <span aria-hidden="true">↑</span></a>
          </footer>
        </article>
      </div>
    </div>
  );
}
