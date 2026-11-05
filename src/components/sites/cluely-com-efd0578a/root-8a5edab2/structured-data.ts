import { brand, faanginFaqs } from "@/lib/site-content";
import { SITE_URL, absoluteUrl, makeWebPageSchema } from "@/lib/seo";

export const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: brand.name,
      url: absoluteUrl("/"),
      logo: {
        "@type": "ImageObject",
        "@id": `${SITE_URL}/#logo`,
        url: absoluteUrl("/brand/faangin-mark.png"),
        contentUrl: absoluteUrl("/brand/faangin-mark.png"),
        width: 512,
        height: 512,
        caption: brand.name,
      },
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: absoluteUrl("/"),
      name: brand.name,
      alternateName: ["Faangin", "faangin.com"],
      inLanguage: "en",
      description: brand.description,
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
    makeWebPageSchema({ title: brand.title, description: brand.description, path: "/" }),
    {
      "@type": "FAQPage",
      "@id": `${SITE_URL}/#faq`,
      url: absoluteUrl("/#faq"),
      isPartOf: { "@id": `${SITE_URL}/#webpage` },
      mainEntity: faanginFaqs.map(({ question, answer }) => ({
        "@type": "Question",
        name: question,
        acceptedAnswer: { "@type": "Answer", text: answer },
      })),
    },
  ],
};
