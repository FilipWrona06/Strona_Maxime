// components/layout/Footer.tsx
//
// Komponent KLIENCKI — wymusza to podświetlanie bieżącej strony
// (usePathname). Przycisk powrotu na górę wbudowany.
//
// Treść widoczna na ekranie jest wpisana tutaj. Z site.ts idą wyłącznie
// dane: nazwa podmiotu, adres, kontakt, dane rejestrowe, trasy i profile.

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import NewsletterForm from "@/components/newsletter/NewsletterForm";
import Logo from "@/components/ui/Logo";
import {
  footerLinks,
  getCopyright,
  isActiveLink,
  legalLinks,
  navLink,
  type SocialPlatform,
  site,
  socials,
} from "@/data/site";

/* Ikony socjali inline — osobny plik nie jest tu potrzebny.
   Wszystkie ścieżki w siatce 24×24, źródło: Simple Icons
   (poza Patronite, którego ten zestaw nie zawiera). */
const SOCIAL_PATHS: Record<SocialPlatform, string> = {
  facebook:
    "M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z",
  instagram:
    "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z",
  youtube:
    "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.5 12 3.5 12 3.5s-7.505 0-9.377.55a3.016 3.016 0 0 0-2.122 2.136C0 8.07 0 12 0 12s0 3.93.501 5.814a3.016 3.016 0 0 0 2.122 2.136c1.872.55 9.377.55 9.377.55s7.505 0 9.377-.55a3.016 3.016 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z",
  tiktok:
    "M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z",
  linkedin:
    "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
  patronite:
    "M7 3h6.5c3.5 0 6.5 2.5 6.5 6.5S17 16 13.5 16H11v5H7V3zm4 9h2.5c1.4 0 2.5-1.1 2.5-2.5S14.9 7 13.5 7H11v5z",
};

const EVENODD: SocialPlatform[] = ["instagram", "linkedin"];

/* Korekta optyczna. Siatka jest wspólna, ale znaki różnie ją wypełniają:
   Facebook to pełne koło, więc przy tej samej wysokości wygląda drobniej
   niż ażurowe LinkedIn czy YouTube. Instagram jest punktem odniesienia. */
const SOCIAL_SCALE: Partial<Record<SocialPlatform, string>> = {
  facebook: "scale-125",
  patronite: "scale-110",
};

/** Nagłówki kolumn. Wcześniej były <span>, czyli dla czytnika ekranu
 *  i dla wyszukiwarki nie istniały — mimo że pełnią funkcję nagłówków.
 *  Kontrast podniesiony z white/30 (≈2,4:1) do white/50. */
const COLUMN_HEADING =
  "mb-8 block text-[0.65rem] font-bold tracking-[0.4em] text-white/50 uppercase";

export default function Footer() {
  const pathname = usePathname();

  return (
    <footer className="bg-raisinBlack relative z-50 w-full overflow-hidden pt-24 lg:pt-32">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-2 left-1/2 z-0 w-full -translate-x-1/2 text-center opacity-[0.03] select-none sm:-bottom-4 lg:-bottom-10"
      >
        {/* font-bold zamiast font-black — brandbook przewiduje tylko
            Montserrat Bold i Regular. */}
        <span className="block w-full text-[20vw] leading-none font-bold text-white md:text-[22vw]">
          MAXIME
        </span>
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 lg:px-12">
        {/* md:grid-cols-2 ratuje tablety — bez tego wszystko między
            640 a 1024 px układało się w jeden bardzo długi pasek. */}
        <div className="grid grid-cols-1 gap-16 border-b border-white/10 pb-16 md:grid-cols-2 lg:grid-cols-12 lg:gap-12 lg:pb-24">
          {/* ───── Kolumna 1: marka, kontakt, dane rejestrowe ───── */}
          <div className="flex flex-col items-start md:col-span-2 lg:col-span-4">
            <Link
              href="/"
              aria-label={`${site.name} — strona główna`}
              className="mb-8 block"
            >
              <Logo className="h-10 w-auto text-white lg:h-12" />
            </Link>

            <span className="font-youngest text-arylideYellow mb-10 block text-4xl">
              Z pasji do muzyki
            </span>

            {/* Zdanie widoczne na każdej podstronie — jedno z niewielu
                miejsc, gdzie Google widzi opis działalności poza stroną
                główną. Warto, żeby niosło konkret, nie ogólnik. */}
            <p className="mb-8 max-w-md text-sm leading-relaxed font-light text-white/70">
              Orkiestra symfoniczna i kameralna z Dąbrowy Górniczej. Gramy
              koncerty, gale firmowe, ceremonie i wydarzenia plenerowe na Śląsku
              i w Zagłębiu.
            </p>

            <div className="mb-8 flex flex-col gap-1">
              <span className="mb-1 text-[0.6rem] font-bold tracking-[0.3em] text-white/50 uppercase">
                Kontakt
              </span>
              <a
                href={`mailto:${site.contact.email}`}
                className="hover:text-arylideYellow text-sm font-light text-white/80 transition-colors"
              >
                {site.contact.email}
              </a>
              {/* Telefon większy i mocniejszy niż reszta kolumny: dla
                  event managera to najważniejsza informacja w stopce. */}
              <a
                href={`tel:${site.contact.phone}`}
                className="hover:text-arylideYellow text-base font-medium text-white transition-colors"
              >
                {site.contact.phoneDisplay}
              </a>
            </div>

            {/* Adres w <address> daje Google jednoznaczny sygnał NAP,
                a instytucji wszystko, czego potrzebuje do zapytania. */}
            <address className="text-xs leading-relaxed font-light text-white/60 not-italic">
              {site.legal.name}
              <br />
              {site.address.street}
              <br />
              {site.address.postalCode} {site.address.city}
              {site.legal.krs && (
                <>
                  <br />
                  KRS {site.legal.krs}
                </>
              )}
              {site.legal.nip && (
                <>
                  <br />
                  NIP {site.legal.nip}
                </>
              )}
            </address>
          </div>

          {/* ───── Kolumna 2: nawigacja ───── */}
          <nav
            aria-labelledby="stopka-nawigacja"
            className="flex flex-col lg:col-span-3 lg:col-start-6"
          >
            <h2 id="stopka-nawigacja" className={COLUMN_HEADING}>
              Eksploruj
            </h2>
            <ul className="flex flex-col items-start gap-4">
              {footerLinks.map((link) => {
                const active = isActiveLink(pathname, link);
                return (
                  <li key={link.path}>
                    <Link
                      href={link.path}
                      aria-current={active ? "page" : undefined}
                      className={`${navLink.wrapper} ${navLink.color(active)} text-sm tracking-widest uppercase`}
                    >
                      {link.name}
                      <span
                        aria-hidden="true"
                        className={navLink.underline(active)}
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* ───── Kolumna 3: newsletter i socjale ───── */}
          <div className="flex flex-col lg:col-span-4">
            <h2 className={COLUMN_HEADING}>Newsletter</h2>
            <p className="mb-6 text-sm leading-relaxed font-light text-white/70">
              Bądź na bieżąco z nadchodzącymi wydarzeniami.
            </p>

            <NewsletterForm variant="dark" />

            <div className="mt-16">
              <h2 className={`${COLUMN_HEADING} mb-6`}>
                Media społecznościowe
              </h2>
              <ul className="flex flex-wrap gap-4">
                {socials.map((social) => (
                  <li key={social.platform}>
                    <a
                      href={social.url}
                      target="_blank"
                      // rel="me" potwierdza, że profil należy do tego
                      // samego podmiotu co strona — dodatkowy sygnał
                      // tożsamości obok sameAs w danych strukturalnych.
                      rel="me noopener noreferrer"
                      className="hover:border-arylideYellow hover:bg-arylideYellow hover:text-raisinBlack flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition-[transform,background-color,border-color,color] duration-300 hover:-translate-y-1"
                    >
                      <svg
                        className={`h-4 w-4 ${SOCIAL_SCALE[social.platform] ?? ""}`}
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        aria-hidden="true"
                        focusable="false"
                      >
                        <path
                          d={SOCIAL_PATHS[social.platform]}
                          {...(EVENODD.includes(social.platform)
                            ? {
                                fillRule: "evenodd" as const,
                                clipRule: "evenodd" as const,
                              }
                            : {})}
                        />
                      </svg>
                      {/* Tekst ukryty wizualnie zamiast aria-label:
                          solidniejszy, bo aria-label bywa pomijany przez
                          automatyczne tłumaczenia stron. */}
                      <span className="sr-only">{social.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* ───── Pasek dolny ───── */}
        <div className="flex flex-col items-center justify-between gap-8 py-8 lg:flex-row lg:gap-0">
          <div className="flex flex-col items-center gap-4 lg:items-start lg:gap-2">
            <span className="text-xs font-light text-white/60">
              {getCopyright()}
            </span>
            <div className="flex flex-wrap items-center justify-center gap-4 lg:justify-start">
              {/* Kontrast podniesiony z white/30: to są linki wymagane
                  prawnie, a były najsłabiej widocznym elementem strony. */}
              {legalLinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  className="text-[0.65rem] font-medium tracking-widest text-white/60 uppercase transition-colors hover:text-white"
                >
                  {link.name}
                </Link>
              ))}
              {/* Tu wróci przycisk zarządzania cookies, gdy przepiszemy
                  mechanizm zgód od zera. */}
            </div>
          </div>

          <div className="flex items-center gap-8">
            {site.author.name && (
              <span className="text-xs font-light text-white/60">
                Wykonanie:{" "}
                <a
                  href={site.author.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-arylideYellow font-medium text-white transition-colors"
                >
                  {site.author.name}
                </a>
              </span>
            )}

            {/* Powrót na górę. Płynność przewijania oddana CSS-owi
                (scroll-behavior w globals.css). */}
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0 })}
              aria-label="Wróć na górę strony"
              className="group hover:border-arylideYellow hover:bg-arylideYellow flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 transition-colors duration-300"
            >
              <svg
                className="group-hover:text-raisinBlack h-5 w-5 text-white transition-transform duration-300 group-hover:-translate-y-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
                focusable="false"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 15.75l7.5-7.5 7.5 7.5"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
