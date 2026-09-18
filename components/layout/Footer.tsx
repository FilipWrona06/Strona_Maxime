// components/layout/Footer.tsx
//
// Komponent KLIENCKI — wymusza to podświetlanie bieżącej strony
// (usePathname). Przycisk powrotu na górę wbudowany, bo i tak jesteśmy
// po stronie klienta, więc osobny plik nic nie dawał.
//
// Bez Sanity, bez FadeIn, bez ActiveLinks, bez SocialIcon,
// bez CookieManagerButton. Wszystkie dane z data/site.ts.
//
// Dołożone: dane rejestrowe (adres, KRS, NIP) w tagu <address>.
// To podstawa lokalnego SEO i pierwsza rzecz, którą sprawdza dom kultury
// albo dział zakupów przed zleceniem.

"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import NewsletterForm from "@/components/newsletter/NewsletterForm";
import {
  footerLinks,
  getCopyright,
  isActiveLink,
  legalLinks,
  navLink,
  site,
  socials,
  type SocialPlatform,
} from "@/data/site";

/* Ikony socjali inline — osobny plik nie jest potrzebny przy tak krótkiej
   liście. Gdyby urosła powyżej czterech, warto wydzielić. */
const SOCIAL_PATHS: Record<SocialPlatform, string> = {
  facebook:
    "M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z",
  instagram:
    "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z",
  youtube:
    "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.5 12 3.5 12 3.5s-7.505 0-9.377.55a3.016 3.016 0 0 0-2.122 2.136C0 8.07 0 12 0 12s0 3.93.501 5.814a3.016 3.016 0 0 0 2.122 2.136c1.872.55 9.377.55 9.377.55s7.505 0 9.377-.55a3.016 3.016 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z",
  linkedin:
    "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
  patronite:
    "M7 3h6.5c3.5 0 6.5 2.5 6.5 6.5S17 16 13.5 16H11v5H7V3zm4 9h2.5c1.4 0 2.5-1.1 2.5-2.5S14.9 7 13.5 7H11v5z",
  tiktok:
    "M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 2.22-.71 4.46-2.18 6.08-1.58 1.76-4.07 2.63-6.42 2.15-2.29-.48-4.16-2.12-4.97-4.29-.82-2.22-.51-4.83 1.11-6.68 1.5-1.72 3.86-2.52 6.05-2.16v4.06c-1.02-.27-2.15-.17-3.02.43-.87.61-1.34 1.66-1.25 2.7.09 1.05.74 2.01 1.66 2.44 1.1.52 2.45.39 3.39-.36.94-.74 1.4-1.92 1.42-3.11.05-5.94.02-11.88.02-17.82h.11z",
};

const EVENODD: SocialPlatform[] = ["instagram", "linkedin"];

export default function Footer() {
  const pathname = usePathname();
  const logoClass = site.logo.invert ? "brightness-0 invert" : "";

  return (
    <footer className="bg-raisinBlack relative z-50 w-full overflow-hidden pt-24 lg:pt-32">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-2 left-1/2 z-0 w-full -translate-x-1/2 text-center opacity-[0.03] select-none sm:-bottom-4 lg:-bottom-10"
      >
        <span className="font-montserrat block w-full text-[20vw] leading-none font-black text-white md:text-[22vw]">
          MAXIME
        </span>
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 lg:px-12">
        <div className="grid grid-cols-1 gap-16 border-b border-white/10 pb-16 lg:grid-cols-12 lg:gap-12 lg:pb-24">
          {/* ───── Kolumna 1: marka, kontakt, dane rejestrowe ───── */}
          <div className="flex flex-col items-start lg:col-span-4">
            <Link
              href="/"
              aria-label={`${site.name} — strona główna`}
              className="mb-8 block"
            >
              <Image
                src={site.logo.src}
                alt={site.name}
                width={site.logo.width}
                height={site.logo.height}
                className={`h-10 w-auto lg:h-12 ${logoClass}`}
              />
            </Link>

            <span className="font-youngest text-arylideYellow mb-10 block text-4xl">
              {site.motto}
            </span>

            <p className="font-montserrat mb-8 text-sm leading-relaxed font-light text-white/60">
              {site.tagline}
            </p>

            <div className="mb-8 flex flex-col gap-1">
              <span className="font-montserrat mb-1 text-[0.6rem] font-bold tracking-[0.3em] text-white/40 uppercase">
                Kontakt
              </span>
              <a
                href={`mailto:${site.contact.email}`}
                className="font-montserrat hover:text-arylideYellow text-sm font-light text-white/80 transition-colors"
              >
                {site.contact.email}
              </a>
              <a
                href={`tel:${site.contact.phone}`}
                className="font-montserrat hover:text-arylideYellow text-sm font-light text-white/80 transition-colors"
              >
                {site.contact.phoneDisplay}
              </a>
            </div>

            {/* Adres w <address> daje Google jednoznaczny sygnał NAP,
                a instytucji wszystko, czego potrzebuje do zapytania. */}
            <address className="font-montserrat text-xs leading-relaxed font-light text-white/40 not-italic">
              {site.legal.foundationName}
              <br />
              {site.address.street}
              <br />
              {site.address.postalCode} {site.address.city}
              {site.legal.foundationKrs && (
                <>
                  <br />
                  KRS {site.legal.foundationKrs}
                </>
              )}
              {site.legal.foundationNip && (
                <>
                  <br />
                  NIP {site.legal.foundationNip}
                </>
              )}
            </address>
          </div>

          {/* ───── Kolumna 2: nawigacja ───── */}
          <nav
            aria-label="Menu w stopce"
            className="flex flex-col lg:col-span-3 lg:col-start-6"
          >
            <span className="font-montserrat mb-8 block text-[0.65rem] font-bold tracking-[0.4em] text-white/30 uppercase">
              Eksploruj
            </span>
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
            <span className="font-montserrat mb-8 block text-[0.65rem] font-bold tracking-[0.4em] text-white/30 uppercase">
              Newsletter
            </span>
            <p className="font-montserrat mb-6 text-sm leading-relaxed font-light text-white/60">
              Bądź na bieżąco z nadchodzącymi wydarzeniami.
            </p>

            <NewsletterForm variant="dark" />

            <div className="mt-16">
              <span className="font-montserrat mb-6 block text-[0.65rem] font-bold tracking-[0.4em] text-white/30 uppercase">
                Media społecznościowe
              </span>
              <ul className="flex flex-wrap gap-4">
                {socials.map((social) => (
                  <li key={social.platform}>
                    <a
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className="hover:border-arylideYellow hover:bg-arylideYellow hover:text-raisinBlack flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition-all duration-300 hover:-translate-y-1"
                    >
                      <svg
                        className="h-[1.15rem] w-[1.15rem]"
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
            <span className="font-montserrat text-xs font-light text-white/40">
              {getCopyright()}
            </span>
            <div className="flex flex-wrap items-center justify-center gap-4 lg:justify-start">
              {legalLinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  className="font-montserrat text-[0.65rem] font-medium tracking-widest text-white/30 uppercase transition-colors hover:text-white"
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
              <span className="font-montserrat text-xs font-light text-white/40">
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
                (scroll-behavior w globals.css), dzięki czemu reguła
                prefers-reduced-motion realnie ją wyłącza — "smooth"
                wpisane w JS ignoruje ustawienia systemowe. */}
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0 })}
              aria-label="Wróć na górę strony"
              className="group hover:border-arylideYellow hover:bg-arylideYellow flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 transition-all duration-500"
            >
              <svg
                className="group-hover:text-raisinBlack h-5 w-5 text-white transition-transform duration-500 group-hover:-translate-y-1"
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
