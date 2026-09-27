// app/not-found.tsx
//
// Własna strona 404. Domyślna strona Next nie ma navbara, stopki ani
// żadnego śladu marki — a trafia się na nią po starych linkach,
// literówkach i po migracji, dopóki nie wejdą przekierowania.
//
// UWAGA: ten plik leży w app/, nie w app/(user)/, więc NIE dziedziczy
// chrome z SiteLayout. To celowe — Next renderuje not-found z poziomu
// root layoutu, gdy adres nie pasuje do żadnej grupy tras. Dlatego
// klasy motywu są tu powtórzone.

import type { Metadata } from "next";
import Link from "next/link";

import { mainLinks, site } from "@/data/site";

export const metadata: Metadata = {
  title: "Nie znaleziono strony",
  // Strona błędu nie ma czego wnosić do indeksu.
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="bg-raisinBlack font-montserrat selection:bg-arylideYellow selection:text-raisinBlack flex min-h-svh flex-col items-center justify-center px-6 text-center text-white">
      <span className="font-youngest text-arylideYellow mb-4 block text-[clamp(4rem,14vw,9rem)] leading-none">
        404
      </span>

      <h1 className="mb-4 text-[clamp(1.25rem,3vw,1.75rem)] font-light">
        Tej strony u nas nie ma
      </h1>

      <p className="mb-10 max-w-md text-sm leading-relaxed font-light text-white/70">
        Adres mógł się zmienić albo zawiera literówkę. Poniżej są miejsca, w
        których na pewno coś znajdziesz.
      </p>

      <Link
        href="/"
        className="bg-arylideYellow text-raisinBlack mb-10 rounded-full px-10 py-4 text-[0.72rem] font-bold tracking-[0.18em] uppercase transition-transform duration-300 hover:scale-[1.03]"
      >
        Wróć na stronę główną
      </Link>

      {/* Linki wewnętrzne ze strony błędu pomagają robotowi wrócić
          do właściwej struktury zamiast utknąć w ślepym zaułku. */}
      <nav aria-label="Nawigacja zapasowa">
        <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
          {mainLinks.map((link) => (
            <li key={link.path}>
              <Link
                href={link.path}
                className="hover:text-arylideYellow text-[0.65rem] font-medium tracking-[0.2em] text-white/60 uppercase transition-colors"
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <p className="mt-12 text-xs font-light text-white/40">
        {site.name} ·{" "}
        <a
          href={`mailto:${site.contact.email}`}
          className="hover:text-arylideYellow underline-offset-4 transition-colors hover:underline"
        >
          {site.contact.email}
        </a>
      </p>
    </div>
  );
}
