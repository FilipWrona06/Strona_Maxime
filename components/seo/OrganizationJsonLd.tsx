// src/components/seo/OrganizationJsonLd.tsx
//
// Dane strukturalne organizacji. Wersja wyjściowa wysyłała na produkcję
// placeholdery: url "https://www.twojadomena.pl" i sameAs "TwójFanpage".
// To nie jest kosmetyka — podawaliśmy Google nieistniejącą domenę
// jako adres organizacji.
//
// @id pozwala odwoływać się do tej organizacji z innych typów
// (Event.organizer, Article.publisher) bez powielania danych.

import { site, siteUrl, socialUrls } from "@/data/site";

export default function OrganizationJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": ["MusicGroup", "NGO"],
    "@id": `${siteUrl}/#organization`,
    name: site.name,
    legalName: site.legalName,
    alternateName: site.shortName,
    slogan: site.motto,
    url: siteUrl,
    logo: `${siteUrl}/logo.svg`,
    image: `${siteUrl}/og/og-default.jpg`,
    description: site.description,
    foundingDate: site.foundingDate,
    email: site.contact.email,
    telephone: site.contact.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      postalCode: site.address.postalCode,
      addressLocality: site.address.city,
      addressRegion: site.address.region,
      addressCountry: site.address.country,
    },
    areaServed: [
      { "@type": "AdministrativeArea", name: "województwo śląskie" },
      { "@type": "AdministrativeArea", name: "Zagłębie Dąbrowskie" },
    ],
    genre: ["Muzyka klasyczna", "Muzyka filmowa", "Muzyka rozrywkowa"],
    // Tylko realnie istniejące profile. Martwe wpisy w sameAs
    // osłabiają sygnał marki, zamiast go wzmacniać.
    ...(socialUrls.length > 0 ? { sameAs: socialUrls } : {}),
  };

  return (
    <script
      type="application/ld+json"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
