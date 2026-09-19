// components/seo/JsonLd.tsx
//
// Wszystko, co dotyczy danych strukturalnych, w jednym pliku:
// renderer + budowanie schematów.
//
// Celowo MAKSYMALNY zestaw pól — łatwiej wyrzucić to, czego klient
// nie potwierdzi, niż dopisywać po fakcie. Każde pole wymagające
// potwierdzenia albo uzupełnienia jest oznaczone komentarzem.
//
// Wszystko spina się przez @id: organizacja ma stały identyfikator,
// a wydarzenia, artykuły i okruszki odwołują się do niej referencją
// zamiast powielać dane.

import { site, siteUrl, socialUrls } from "@/data/site";

/* ═══════════════════════════ RENDERER ═══════════════════════════ */

type JsonLdProps = {
  /** Obiekt schema.org albo tablica obiektów (trafi do @graph). */
  data: Record<string, unknown> | Record<string, unknown>[];
  /** Nonce z CSP, gdy dojdą nagłówki wymagające go dla skryptów inline. */
  nonce?: string;
};

/** JSON.stringify NIE escapuje "<". Dopóki dane są statyczne, nic się nie
 *  dzieje — ale ten komponent obsłuży wydarzenia i artykuły z CMS, gdzie
 *  wystarczy tytuł zawierający </script>, żeby wyjść poza blok skryptu.
 *  Escapujemy też U+2028/U+2029, nielegalne w literałach JS. */
function serialize(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

export default function JsonLd({ data, nonce }: JsonLdProps) {
  const payload = Array.isArray(data)
    ? { "@context": "https://schema.org", "@graph": data }
    : data;

  return (
    <script
      type="application/ld+json"
      nonce={nonce}
      // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD
      dangerouslySetInnerHTML={{ __html: serialize(payload) }}
    />
  );
}

/* ═══════════════════════════ IDENTYFIKATORY ═══════════════════════════ */

export const ORG_ID = `${siteUrl}/#organization`;
export const SITE_ID = `${siteUrl}/#website`;

/** Referencja do organizacji. Używaj w Event.organizer, Article.publisher
 *  i podobnych zamiast wklejać cały obiekt. */
export const orgRef = { "@id": ORG_ID };

/* ═══════════════════════════ ORGANIZACJA ═══════════════════════════ */

export function organizationSchema() {
  return {
    "@type": ["MusicGroup", "NGO"],
    "@id": ORG_ID,

    /* ─── Tożsamość ─── */
    name: site.name,
    legalName: site.legalName,
    alternateName: site.shortName,
    slogan: site.motto,
    // Pełny opis, nie skrócony meta description — w danych strukturalnych
    // nie ma limitu znaków, więc nie ma po co oszczędzać.
    description: site.descriptionLong,
    url: siteUrl,
    foundingDate: site.foundingDate,
    foundingLocation: {
      "@type": "Place",
      name: site.address.city,
    },

    /* ─── Grafika ─── */
    logo: {
      "@type": "ImageObject",
      url: `${siteUrl}${site.logo.src}`,
      width: site.logo.width,
      height: site.logo.height,
    },
    // Zdjęcie zespołu, NIE grafika OG: app/opengraph-image.jpg ma
    // w adresie hash generowany przez Next, więc nie da się go wpisać.
    image: `${siteUrl}/video-poster.webp`,

    /* ─── Kontakt ─── */
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

    location: {
      "@type": "Place",
      name: site.legalName,
      geo: {
        "@type": "GeoCoordinates",
        // DO ZWERYFIKOWANIA: współrzędne wpisane orientacyjnie.
        latitude: site.geo.lat,
        longitude: site.geo.lng,
      },
    },

    // Punkt kontaktu opisany jako miejsce do zamawiania oprawy —
    // to jest realny cel tej strony, nie ogólna infolinia.
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "booking",
        name: "Zamówienia i oprawa wydarzeń",
        email: site.contact.email,
        telephone: site.contact.phone,
        areaServed: "PL",
        availableLanguage: ["pl", "en"],
      },
    ],

    /* ─── Ludzie ───
       DO POTWIERDZENIA U KLIENTA. Powiązanie z dyrygentem to najmocniejszy
       sygnał tożsamości, jaki macie: ma publiczny ślad (POLMIC, Polska
       Filharmonia Kameralna Sopot), a nazwa "Maxime" koliduje z trzema
       innymi podmiotami. Jeśli klient nie chce, usuń oba pola. */
    founder: {
      "@type": "Person",
      name: "Andrzej Mandryka",
      jobTitle: "Dyrygent",
    },
    employee: {
      "@type": "Person",
      name: "Andrzej Mandryka",
      jobTitle: "Pierwszy dyrygent",
    },

    /* ─── Dane rejestrowe ───
       Renderują się dopiero po uzupełnieniu w site.ts. taxID tylko
       jeśli fundacja jest płatnikiem — DO USTALENIA. */
    ...(site.legal.krs
      ? {
          identifier: {
            "@type": "PropertyValue",
            propertyID: "KRS",
            value: site.legal.krs,
          },
        }
      : {}),
    ...(site.legal.nip ? { taxID: site.legal.nip } : {}),

    /* ─── Zasięg i profil ─── */
    areaServed: [
      { "@type": "AdministrativeArea", name: "województwo śląskie" },
      { "@type": "AdministrativeArea", name: "Zagłębie Dąbrowskie" },
      { "@type": "AdministrativeArea", name: "Małopolska" },
    ],
    knowsLanguage: ["pl", "en"],
    genre: [
      "Muzyka klasyczna",
      "Muzyka filmowa",
      "Muzyka rozrywkowa",
      "Operetka",
      "Muzyka patriotyczna",
    ],

    /* ─── Katalog usług ───
       Odwzorowuje ustaloną strukturę oferty. Google nie zrobi z tego
       wyników rozszerzonych, ale to jednoznaczny opis tego, co
       sprzedajecie — przydatne przy zapytaniach typu "orkiestra na galę".
       DO UZGODNIENIA po otrzymaniu treści oferty od klienta. */
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Oprawa muzyczna wydarzeń",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Oprawa muzyczna gali i jubileuszu firmowego",
            serviceType: "Oprawa muzyczna wydarzeń firmowych",
            provider: orgRef,
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Oprawa muzyczna ślubu i uroczystości",
            serviceType: "Oprawa muzyczna ceremonii",
            provider: orgRef,
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Koncerty plenerowe, Dni Miast i festiwale",
            serviceType: "Koncert plenerowy",
            provider: orgRef,
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Koncert muzyki filmowej na zamówienie",
            serviceType: "Koncert tematyczny",
            provider: orgRef,
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Warsztaty muzyczne dla dzieci i szkół",
            serviceType: "Warsztaty edukacyjne",
            provider: orgRef,
          },
        },
      ],
    },

    /* ─── Profile zewnętrzne ───
       Tylko realnie istniejące. Martwe wpisy osłabiają sygnał marki. */
    ...(socialUrls.length > 0 ? { sameAs: socialUrls } : {}),
  };
}

/* ═══════════════════════════ WITRYNA ═══════════════════════════ */

/** Tylko na stronie głównej. Google bierze stąd między innymi nazwę
 *  witryny wyświetlaną w wynikach. */
export function websiteSchema() {
  return {
    "@type": "WebSite",
    "@id": SITE_ID,
    url: siteUrl,
    name: site.name,
    alternateName: site.shortName,
    description: site.descriptionLong,
    inLanguage: site.lang,
    publisher: orgRef,
    copyrightHolder: orgRef,

    // Odkomentuj DOPIERO gdy powstanie wyszukiwarka po serwisie.
    // Deklarowanie akcji, która nie działa, to sygnał fałszywy.
    // potentialAction: {
    //   "@type": "SearchAction",
    //   target: {
    //     "@type": "EntryPoint",
    //     urlTemplate: `${siteUrl}/szukaj?q={search_term_string}`,
    //   },
    //   "query-input": "required name=search_term_string",
    // },
  };
}

/* ═══════════════════════════ OKRUSZKI ═══════════════════════════ */

/** Ścieżkę podajesz BEZ strony głównej — dokleja się sama.
 *  breadcrumbSchema([{ name: "Oferta", path: "/oferta" }]) */
export function breadcrumbSchema(trail: { name: string; path: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "Strona główna", path: "/" }, ...trail].map(
      (item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        item: `${siteUrl}${item.path}`,
      }),
    ),
  };
}

/* ═══════════════════════════ WYDARZENIE ═══════════════════════════ */

type EventInput = {
  name: string;
  slug: string;
  /** ISO 8601 z godziną i strefą, np. "2026-12-20T18:00:00+01:00".
   *  Sama data bez godziny obniża szansę na wynik rozszerzony. */
  startDate: string;
  endDate?: string;
  description?: string;
  image?: string;
  venue?: { name: string; street?: string; city?: string; postalCode?: string };
  /** Adres strony z biletami. Brak = wydarzenie z wstępem wolnym. */
  ticketUrl?: string;
  price?: number;
  isFree?: boolean;
};

/** Do użycia na /wydarzenia/[slug]. To jedyne miejsce w serwisie
 *  z realną szansą na wynik rozszerzony w Google — kalendarz koncertów
 *  jest czymś, czego nikt w waszej okolicy nie oznacza. */
export function eventSchema(e: EventInput) {
  const url = `${siteUrl}/wydarzenia/${e.slug}`;

  return {
    "@type": "MusicEvent",
    "@id": `${url}#event`,
    name: e.name,
    url,
    startDate: e.startDate,
    ...(e.endDate ? { endDate: e.endDate } : {}),
    ...(e.description ? { description: e.description } : {}),
    ...(e.image ? { image: `${siteUrl}${e.image}` } : {}),

    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",

    organizer: orgRef,
    performer: orgRef,

    ...(e.venue
      ? {
          location: {
            "@type": "Place",
            name: e.venue.name,
            address: {
              "@type": "PostalAddress",
              ...(e.venue.street ? { streetAddress: e.venue.street } : {}),
              ...(e.venue.postalCode ? { postalCode: e.venue.postalCode } : {}),
              addressLocality: e.venue.city ?? site.address.city,
              addressCountry: "PL",
            },
          },
        }
      : {}),

    offers: {
      "@type": "Offer",
      url: e.ticketUrl ?? url,
      price: e.isFree ? 0 : (e.price ?? 0),
      priceCurrency: "PLN",
      availability: "https://schema.org/InStock",
      validFrom: new Date().toISOString(),
    },
  };
}
