import type { Metadata } from "next";
import { brand } from "@/lib/site-content";

// Keep the preferred host aligned with the existing apex → www redirect.
export const SITE_URL = "https://www.faangin.com";
export const INDEXABLE_PATHS = ["/", "/coding-interview", "/system-design-interview", "/behavioral-interview"] as const;
// Update when these pages receive a substantive content, metadata, or structured-data change.
// A rebuild alone must never make the sitemap claim the content was updated.
export const CONTENT_LAST_UPDATED = "2026-11-05";

export function absoluteUrl(path: string): string {
  return new URL(path, `${SITE_URL}/`).toString();
}

type PageDetails = { title: string; description: string; path: string };

export function pageMetadata({ title, description, path }: PageDetails): Metadata {
  return {
    title,
    description,
    alternates: { canonical: absoluteUrl(path) },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
    },
    openGraph: {
      title,
      description,
      url: absoluteUrl(path),
      siteName: brand.name,
      locale: "en_US",
      type: "website",
      images: [{ url: absoluteUrl("/opengraph-image"), width: 1200, height: 630, alt: "faangin AI copilot for interviews, meetings, and sales calls. Available for Mac and Windows." }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [absoluteUrl("/opengraph-image")],
    },
  };
}

export function makeWebPageSchema({ title, description, path }: PageDetails) {
  return {
    "@type": "WebPage",
    "@id": `${absoluteUrl(path)}#webpage`,
    url: absoluteUrl(path),
    name: title,
    description,
    inLanguage: "en",
    dateModified: CONTENT_LAST_UPDATED,
    isPartOf: { "@id": `${SITE_URL}/#website` },
    publisher: { "@id": `${SITE_URL}/#organization` },
  };
}
