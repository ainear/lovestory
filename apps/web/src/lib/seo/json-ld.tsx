/**
 * JSON-LD Structured Data Components (S17-C)
 * Google Rich Results: WebSite, Organization, Event, Product, ItemList
 */

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://7app.online";
const APP_NAME = "LoveStory";

// ── WebSite + Organization (root layout) ──────────────────────────────────────
export function WebSiteJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${APP_URL}/#website`,
        url: APP_URL,
        name: APP_NAME,
        description:
          "Tạo thiệp cưới online đẹp trong 5 phút. 50+ mẫu thiệp, RSVP thông minh, AI Video highlight.",
        inLanguage: "vi",
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${APP_URL}/templates?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "Organization",
        "@id": `${APP_URL}/#organization`,
        name: APP_NAME,
        url: APP_URL,
        logo: {
          "@type": "ImageObject",
          url: `${APP_URL}/icon.svg`,
        },
        sameAs: [],
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "customer support",
          availableLanguage: "Vietnamese",
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ── SoftwareApplication (product page) ────────────────────────────────────────
export function ProductJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: APP_NAME,
    applicationCategory: "LifestyleApplication",
    operatingSystem: "Web",
    url: APP_URL,
    description:
      "Tạo thiệp cưới online đẹp trong 5 phút. 50+ mẫu thiệp miễn phí, RSVP thông minh, AI Video highlight đám cưới.",
    offers: [
      {
        "@type": "Offer",
        name: "Miễn phí",
        price: "0",
        priceCurrency: "VND",
        description: "3 thiệp, 50 RSVP, 100MB lưu trữ",
      },
      {
        "@type": "Offer",
        name: "Basic",
        price: "99000",
        priceCurrency: "VND",
        description: "10 thiệp, RSVP không giới hạn, nhạc nền",
      },
      {
        "@type": "Offer",
        name: "Premium",
        price: "199000",
        priceCurrency: "VND",
        description: "Unlimited thiệp, AI Video, 4K render, domain riêng",
      },
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "1200",
      bestRating: "5",
      worstRating: "1",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ── ItemList (templates gallery page) ─────────────────────────────────────────
export function TemplateListJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Mẫu thiệp cưới online đẹp nhất 2025",
    description:
      "50+ mẫu thiệp cưới online miễn phí và cao cấp. Tùy chỉnh dễ dàng, RSVP thông minh.",
    url: `${APP_URL}/templates`,
    numberOfItems: 50,
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Rose Garden — Thiệp cưới hoa hồng lãng mạn",
        url: `${APP_URL}/templates`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Midnight Romance — Thiệp cưới tối giản sang trọng",
        url: `${APP_URL}/templates`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Golden Hour — Thiệp cưới vàng hoàng gia",
        url: `${APP_URL}/templates`,
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ── Event JSON-LD (individual invitation page — injected client-side) ─────────
export interface InvitationSeoData {
  groomName: string;
  brideName: string;
  weddingDate: string;
  weddingTime?: string;
  venueName: string;
  venueAddress: string;
  slug: string;
}

export function buildInvitationJsonLd(data: InvitationSeoData): string {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: `Đám cưới ${data.groomName} & ${data.brideName}`,
    description: `Thiệp mời đám cưới của ${data.groomName} và ${data.brideName}. RSVP online.`,
    startDate: data.weddingDate,
    url: `${APP_URL}/i/${data.slug}`,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: data.venueName,
      address: {
        "@type": "PostalAddress",
        streetAddress: data.venueAddress,
        addressCountry: "VN",
      },
    },
    organizer: {
      "@type": "Person",
      name: `${data.groomName} & ${data.brideName}`,
    },
    image: `${APP_URL}/og-wedding.jpg`,
  };

  return JSON.stringify(schema);
}
