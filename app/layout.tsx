// app/layout.tsx
//
// Root layout. Trzyma WYŁĄCZNIE to, co wspólne dla całego projektu:
// <html>, <body>, fonty, metadane bazowe.
//
// Świadomie NIE ma tu:
//  - Navbara, stopki i popupów → siedzą w (user)/layout.tsx
//  - klas motywu (bg-raisinBlack / text-white) → też w (user), dzięki czemu
//    dołożenie osobnej grupy tras (panel treści) nie wymaga ich odplątywania
//  - JSON-LD organizacji → to treść strony publicznej
//  - deklaracji ikon i grafiki OG → załatwiają je pliki w app/,
//    patrz komentarz na dole

import type { Metadata, Viewport } from "next";
import { Montserrat } from "next/font/google";
import localFont from "next/font/local";

import "./globals.css";

import { isIndexable, site, siteUrl } from "@/data/site";

// Zabezpieczenie przed wdrożeniem z domyślnym adresem. Bez tego brak
// zmiennej środowiskowej przechodzi bez słowa, a canonical i og:url
// w produkcji wskazują na localhost — błąd niewidoczny aż do momentu,
// gdy Google zdąży zaindeksować stronę z niczym.
if (
  process.env.NODE_ENV === "production" &&
  !process.env.NEXT_PUBLIC_SITE_URL
) {
  throw new Error(
    "Brak NEXT_PUBLIC_SITE_URL. Ustaw pełny adres (https://...) przed buildem produkcyjnym.",
  );
}

const montserrat = Montserrat({
  subsets: ["latin", "latin-ext"],
  variable: "--font-montserrat",
  display: "swap",
});

const fontYoungest = localFont({
  src: "../fonts/the-youngest-script.woff2",
  variable: "--font-youngest",
  display: "swap",
  // Dopasowanie metryk fontu zastępczego ogranicza przeskok układu, gdy
  // pismo odręczne podmienia się w wielkim nagłówku hero. Times to tylko
  // przybliżenie — jeśli skok będzie widoczny, rozważ display: "block".
  adjustFontFallback: "Times New Roman",
  fallback: ["Georgia", "serif"],
});

export const viewport: Viewport = {
  // Brandbook: Raisin Black #262626.
  themeColor: "#262626",
  colorScheme: "dark",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: site.title,
    template: site.titleTemplate,
  },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.legalName, url: siteUrl }],
  creator: site.legalName,
  publisher: site.legalName,

  // meta keywords usunięte — Google ignoruje ten tag od 2009 roku.

  robots: isIndexable
    ? {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-video-preview": -1,
          "max-image-preview": "large",
          "max-snippet": -1,
        },
      }
    : { index: false, follow: false, nocache: true },

  openGraph: {
    type: "website",
    locale: site.locale,
    // url pominięty celowo — Next wyliczy go z metadataBase + canonical.
    // images pominięte celowo — bierze je app/opengraph-image.jpg.
    siteName: site.name,
    title: site.title,
    description: site.description,
  },

  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
  },

  // Kod weryfikacyjny z Search Console — wklej przy podpinaniu domeny.
  // verification: { google: "" },

  // Wyłącza automatyczne linkowanie numerów przez iOS. Jawny <a href="tel:">
  // w stopce działa normalnie; chodzi o to, by system nie podkreślał
  // przypadkowych ciągów cyfr w treści.
  formatDetection: { telephone: false },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang={site.lang}>
      <body
        className={`${montserrat.variable} ${fontYoungest.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

/* ─────────────────────────────────────────────────────────────────────
   PLIKI DO DOŁOŻENIA W app/ — Next wygeneruje z nich tagi automatycznie,
   z poprawnymi wymiarami i hashem w nazwie:

     app/icon.svg              sygnet "M" z brandbooka (favicon)
     app/apple-icon.png        180×180, sygnet na tle #262626
     app/opengraph-image.jpg   1200×630, miniatura do social i maili
     app/manifest.ts           nazwa, kolory, ikony — sygnał dla wyników mobilnych
     app/not-found.tsx         własna strona 404
     app/error.tsx             obsługa błędów renderowania

   Po ich dodaniu USUŃ z public/: favicon.ico (jeśli jest) — inaczej
   przeglądarka i tak pobierze go z korzenia domeny.
   ───────────────────────────────────────────────────────────────────── */
