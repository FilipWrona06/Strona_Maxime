// app/(user)/layout.tsx
//
// Layout strony publicznej: chrome, klasy motywu, skip link.
// Motyw siedzi tutaj, a nie na <body>, żeby dało się później dołożyć
// osobną grupę tras (np. panel treści) bez dziedziczenia stylów.

import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import OrganizationJsonLd from "@/components/seo/OrganizationJsonLd";

// Zgody na cookies wracają, gdy przepiszemy mechanizm od zera:
// import CookieBanner from "@/components/cookies/CookieBanner";
// import GoogleConsent from "@/components/cookies/GoogleConsent";

// Analityka dopiero przed wdrożeniem — Speed Insights zbiera dane
// wyłącznie na Vercelu:
//   npm i @vercel/analytics @vercel/speed-insights
// import { Analytics } from "@vercel/analytics/react";
// import { SpeedInsights } from "@vercel/speed-insights/next";

export default function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="bg-raisinBlack font-montserrat selection:bg-arylideYellow selection:text-raisinBlack flex min-h-svh flex-col text-white">
      <OrganizationJsonLd />

      {/* Pierwszy element w tabulacji — wymóg WCAG przy stałym navbarze. */}
      <a
        href="#tresc"
        className="bg-arylideYellow text-raisinBlack sr-only rounded-full px-6 py-3 text-xs font-bold tracking-widest uppercase focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-200"
      >
        Przejdź do treści
      </a>

      <Navbar />

      {/* JEDYNY <main> w drzewie. Nie dodawaj drugiego w page.tsx. */}
      <main id="tresc" className="grow">
        {children}
      </main>

      <Footer />
    </div>
  );
}
