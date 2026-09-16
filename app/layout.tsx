// src/app/layout.tsx
//
// Root layout. Trzyma WYŁĄCZNIE to, co wspólne dla całego projektu:
// <html>, <body>, fonty, metadane bazowe.
//
// Świadomie NIE ma tu:
//  - Navbara, stopki i popupów → siedzą w (user)/layout.tsx
//  - klas motywu (bg-raisinBlack / text-white) → też w (user),
//    inaczej Sanity Studio dziedziczy ciemne tło i selekcję w kolorze marki
//  - JSON-LD organizacji → to treść strony publicznej, nie panelu

import type { Metadata, Viewport } from "next";
import { Montserrat } from "next/font/google";
import localFont from "next/font/local";

import "./globals.css";

import { isIndexable, site, siteUrl } from "@/data/site";

const montserrat = Montserrat({
  subsets: ["latin", "latin-ext"],
  variable: "--font-montserrat",
  display: "swap",
});

const fontYoungest = localFont({
  src: "../fonts/the-youngest-script.woff2",
  variable: "--font-youngest",
  display: "swap",
  // Dopasowanie metryk fontu zastępczego. Bez tego pismo odręczne
  // w nagłówku hero podmienia się z widocznym przeskokiem układu (CLS).
  adjustFontFallback: "Times New Roman",
  fallback: ["Georgia", "serif"],
});

export const viewport: Viewport = {
  // Brandbook: Raisin Black #262626. W poprzedniej wersji było #212121.
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

  // meta keywords usunięte — Google ignoruje ten tag od 2009 roku,
  // a powielony na każdej podstronie tylko rozmywał obraz serwisu.

  alternates: { canonical: "/" },

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
    // url celowo pominięty — Next wyliczy go z metadataBase + canonical,
    // więc nie da się o nim zapomnieć przy zmianie domeny.
    siteName: site.name,
    title: site.title,
    description: site.description,
    images: [
      {
        url: "/og/og-default.jpg",
        width: 1200,
        height: 630,
        alt: `${site.name} — ${site.motto}`,
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
    images: ["/og/og-default.jpg"],
  },

  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-touch-icon.png",
  },

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
