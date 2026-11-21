import { siteConfig } from "./site-config";

export interface FaqItem {
  question: string;
  answer: string;
}

export function buildWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        name: siteConfig.fullName,
        url: siteConfig.url,
        description: siteConfig.description,
      },
      {
        "@type": "Organization",
        name: siteConfig.fullName,
        url: siteConfig.url,
        logo: `${siteConfig.url}/icon`,
      },
    ],
  };
}

export function buildToolSchema({
  name,
  description,
  path,
  faqs = [],
}: {
  name: string;
  description: string;
  path: string;
  faqs?: FaqItem[];
}) {
  const graph: Record<string, unknown>[] = [
    {
      "@type": "WebApplication",
      name,
      description,
      url: `${siteConfig.url}${path}`,
      applicationCategory: "MultimediaApplication",
      operatingSystem: "Any",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      publisher: {
        "@type": "Organization",
        name: siteConfig.fullName,
        url: siteConfig.url,
      },
    },
  ];

  if (faqs.length > 0) {
    graph.push({
      "@type": "FAQPage",
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    });
  }

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}

export function buildArticleSchema({
  title,
  description,
  slug,
  date,
}: {
  title: string;
  description: string;
  slug: string;
  date: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    datePublished: date,
    dateModified: date,
    mainEntityOfPage: `${siteConfig.url}/blog/${slug}`,
    author: {
      "@type": "Organization",
      name: siteConfig.fullName,
      url: siteConfig.url,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.fullName,
      url: siteConfig.url,
    },
  };
}
