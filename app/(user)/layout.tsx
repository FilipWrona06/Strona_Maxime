// app/(user)/layout.tsx
//
// Layout strony publicznej: chrome, klasy motywu, skip link.
// Motyw siedzi tutaj, a nie na <body>, żeby (studio) go nie dziedziczyło.
//
// Wersja startowa — wpięte jest tylko to, co już istnieje.
// Kolejne elementy odkomentowujemy w miarę pisania komponentów.

import Navbar from "@/components/layout/Navbar";
import OrganizationJsonLd from "@/components/seo/OrganizationJsonLd";

// import Footer from "@/components/layout/Footer";
// import CookieBanner from "@/components/cookies/CookieBanner";
// import GoogleConsent from "@/components/cookies/GoogleConsent";
// import NewsletterPopup from "@/components/newsletter/NewsletterPopup";

// Analityka dopiero przed wdrożeniem — Speed Insights i tak zbiera dane
// wyłącznie na Vercelu, więc lokalnie to martwy import:
//   npm i @vercel/analytics @vercel/speed-insights
// import { Analytics } from "@vercel/analytics/react";
// import { SpeedInsights } from "@vercel/speed-insights/next";

export default function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="bg-raisinBlack font-montserrat selection:bg-arylideYellow selection:text-raisinBlack flex min-h-svh flex-col text-white">
      <OrganizationJsonLd />

      {/* Pierwszy element w tabulacji. Przy stałym navbarze to wymóg
          WCAG 2.4.1, a przy sześciu pozycjach menu realna wygoda. */}
      <a
        href="#tresc"
        className="bg-arylideYellow text-raisinBlack sr-only rounded-full px-6 py-3 text-xs font-bold tracking-widest uppercase focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-200"
      >
        Przejdź do treści
      </a>

      {/* <GoogleConsent /> — musi ładować się przed czymkolwiek,
          co może ustawić cookies */}

      <Navbar />

      {/* JEDYNY <main> w drzewie. Nie dodawaj drugiego w page.tsx. */}
      <main id="tresc" className="grow">
        {children}
      </main>

      {/* <Footer /> */}
      {/* <NewsletterPopup /> */}
      {/* <CookieBanner /> */}
      {/* <SpeedInsights /> */}
      {/* <Analytics /> */}
    </div>
  );
}
