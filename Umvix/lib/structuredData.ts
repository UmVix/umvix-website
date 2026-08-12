import { absoluteUrl, getActiveProfiles, siteConfig } from "@/lib/metadata";

/**
 * Schema.org JSON-LD builders.
 *
 * Everything here is derived from `siteConfig` so the entity Google sees
 * (name, logo, description, contact details, official profiles) can never
 * drift from what the site itself renders. Stable `@id` values let the graph
 * cross-reference nodes instead of repeating them on every page.
 */

export const ORGANIZATION_ID = absoluteUrl("/#organization");
export const WEBSITE_ID = absoluteUrl("/#website");

/** Services Umvix actually offers, mirroring the /services page. */
const SERVICES = [
  {
    name: "Web Development",
    description:
      "Custom Next.js and React web applications, e-commerce builds, headless CMS integrations, and performance-optimised marketing sites.",
  },
  {
    name: "Mobile App Development",
    description:
      "Native iOS and Android apps plus cross-platform React Native and Flutter builds, including backend and API integration.",
  },
  {
    name: "AI Chatbot Development",
    description:
      "Custom LLM assistants trained on your knowledge base for customer support, lead qualification, and multi-channel messaging.",
  },
  {
    name: "AI Automation & Workflows",
    description:
      "Automated business workflows built with Zapier, Make.com, and custom Python services to remove repetitive manual work.",
  },
  {
    name: "Custom Dashboards & SaaS Development",
    description:
      "SaaS platforms, admin dashboards, real-time data visualisation, and analytics products built for scale.",
  },
];

function postalAddresses() {
  return siteConfig.offices.map((office) => ({
    "@type": "PostalAddress",
    streetAddress: office.streetAddress,
    addressLocality: office.addressLocality,
    ...("postalCode" in office ? { postalCode: office.postalCode } : {}),
    addressCountry: office.addressCountry,
  }));
}

export function organizationSchema() {
  const sameAs = getActiveProfiles().map((profile) => profile.href);
  const addresses = postalAddresses();

  return {
    "@type": "Organization",
    "@id": ORGANIZATION_ID,
    name: siteConfig.name,
    // The social profiles are branded "UmVix"; declaring it here tells Google
    // the two spellings are the same entity.
    alternateName: "UmVix",
    legalName: siteConfig.legalName,
    url: absoluteUrl("/"),
    description: siteConfig.longDescription,
    slogan: "Ideas First. Ship Bold. Scale Up.",
    logo: {
      "@type": "ImageObject",
      "@id": absoluteUrl("/#logo"),
      url: absoluteUrl(siteConfig.logo),
      contentUrl: absoluteUrl(siteConfig.logo),
      caption: siteConfig.name,
    },
    image: { "@id": absoluteUrl("/#logo") },
    email: siteConfig.email,
    telephone: siteConfig.phoneE164,
    address: addresses,
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "sales",
        email: siteConfig.email,
        telephone: siteConfig.phoneE164,
        availableLanguage: ["English"],
        areaServed: "Worldwide",
        url: absoluteUrl("/contact"),
      },
    ],
    knowsAbout: [
      "Web development",
      "Mobile app development",
      "Artificial intelligence",
      "AI chatbots",
      "Business process automation",
      "SaaS development",
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: `${siteConfig.name} Services`,
      itemListElement: SERVICES.map((service) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: service.name,
          description: service.description,
          provider: { "@id": ORGANIZATION_ID },
        },
      })),
    },
    ...(sameAs.length > 0 ? { sameAs } : {}),
  };
}

export function websiteSchema() {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: absoluteUrl("/"),
    name: siteConfig.name,
    description: siteConfig.description,
    inLanguage: "en",
    publisher: { "@id": ORGANIZATION_ID },
  };
}

type PageSchemaOptions = {
  /** Path such as "/about". Use "" for the homepage. */
  path: string;
  name: string;
  description: string;
  /** Schema.org page type; defaults to a generic WebPage. */
  type?: "WebPage" | "AboutPage" | "ContactPage" | "CollectionPage";
  /** Breadcrumb trail after Home, e.g. [{ name: "About", path: "/about" }]. */
  breadcrumb?: { name: string; path: string }[];
};

function breadcrumbSchema(path: string, trail: { name: string; path: string }[]) {
  const items = [{ name: "Home", path: "/" }, ...trail];

  return {
    "@type": "BreadcrumbList",
    "@id": `${absoluteUrl(path)}#breadcrumb`,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path === "/" ? "/" : item.path),
    })),
  };
}

/**
 * Full JSON-LD graph for a page: the page node plus its breadcrumb, both
 * referencing the site-wide Organization and WebSite nodes emitted in the
 * root layout.
 */
export function pageGraph({
  path,
  name,
  description,
  type = "WebPage",
  breadcrumb = [],
}: PageSchemaOptions) {
  const url = absoluteUrl(path);

  const page: Record<string, unknown> = {
    "@type": type,
    "@id": `${url}#webpage`,
    url,
    name,
    description,
    inLanguage: "en",
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": ORGANIZATION_ID },
    primaryImageOfPage: { "@id": absoluteUrl("/#logo") },
  };

  const graph: Record<string, unknown>[] = [page];

  if (breadcrumb.length > 0) {
    page.breadcrumb = { "@id": `${url}#breadcrumb` };
    graph.push(breadcrumbSchema(path, breadcrumb));
  }

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}

/** Site-wide graph rendered once in the root layout. */
export function siteGraph() {
  return {
    "@context": "https://schema.org",
    "@graph": [organizationSchema(), websiteSchema()],
  };
}
