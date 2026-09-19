// app/(user)/layout.tsx
//
// Layout strony publicznej: chrome, klasy motywu, skip link.
// Motyw siedzi tutaj, a nie na <body>, żeby dało się później dołożyć
// osobną grupę tras (np. panel treści) bez dziedziczenia stylów.
//
// UZUPEŁNIENIE W globals.css: html { background-color: var(--color-raisinBlack) }
// Bez tego przy przewinięciu poza zakres na iOS i w ułamku sekundy
// przed wczytaniem CSS widać domyślną biel przeglądarki.

import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import JsonLd, { organizationSchema } from "@/components/seo/JsonLd";

// Zgody na cookies wracają, gdy przepiszemy mechanizm od zera:
// import CookieBanner from "@/components/cookies/CookieBanner";
// import GoogleConsent from "@/components/cookies/GoogleConsent";

// Analityka dopiero przed wdrożeniem — Speed Insights zbiera dane
// wyłącznie na Vercelu:
//   pnpm add @vercel/analytics @vercel/speed-insights
// import { Analytics } from "@vercel/analytics/react";
// import { SpeedInsights } from "@vercel/speed-insights/next";

export default function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="bg-raisinBlack font-montserrat selection:bg-arylideYellow selection:text-raisinBlack flex min-h-svh flex-col text-white">
      <JsonLd data={organizationSchema()} />

      {/* Pierwszy element w tabulacji — wymóg WCAG 2.4.1 przy stałym
          navbarze. focus:fixed, NIE focus:absolute: bez pozycjonowanego
          rodzica element absolutny przewija się razem ze stroną, więc
          po przescrollowaniu link pojawiałby się poza widokiem. */}
      <a
        href="#tresc"
        className="bg-arylideYellow text-raisinBlack sr-only rounded-full px-6 py-3 text-xs font-bold tracking-widest uppercase focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-200"
      >
        Przejdź do treści
      </a>

      <Navbar />

      {/* JEDYNY <main> w drzewie. Nie dodawaj drugiego w page.tsx.
          tabIndex={-1} sprawia, że skip link realnie przenosi FOKUS,
          a nie tylko widok — bez tego użytkownik klawiatury kolejnym
          Tabem wracał do nawigacji zamiast wejść w treść. */}
      <main id="tresc" tabIndex={-1} className="grow focus:outline-none">
        {children}
      </main>

      <Footer />
    </div>
  );
}
