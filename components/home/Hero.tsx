// src/components/home/Hero.tsx
//
// Server Component — bez "use client".
//
// Najważniejsza zmiana: H1 przestał być samym mottem.
// Wedle brandbooka "Z pasji do muzyki" to motto, nie nagłówek. Zostaje
// jako dominujący element wizualny, ale nagłówek niesie teraz nazwę
// i lokalizację. Bez tego strona główna nie ma się o co zaczepić
// w wyszukiwarce, a marka "Maxime" koliduje z Orkiestrą Maximus
// i dwiema Fundacjami Maxima.
//
// Świadomie NIE użyłem sr-only do wciśnięcia fraz: tekst ukryty przed
// użytkownikiem, a widoczny dla Google, to ryzyko, którego nie warto
// brać na stronie mającej rankować latami.

import Image from "next/image";
import Link from "next/link";

import BackgroundVideo from "./BackgroundVideo";

export default function Hero() {
  return (
    <section className="bg-raisinBlack relative flex min-h-svh w-full items-center justify-center overflow-hidden">
      <div className="absolute inset-0 h-full w-full">
        {/* Plakat jest elementem LCP — ładowany priorytetowo z serwera.
            alt pusty, bo obraz jest czysto dekoracyjny; opis sceny
            powtarzałby treść nagłówka. */}
        <Image
          src="/video-poster.webp"
          alt=""
          aria-hidden="true"
          fill
          priority
          sizes="100vw"
          quality={70}
          className="object-cover"
        />

        <BackgroundVideo />

        <div className="bg-raisinBlack/30 absolute inset-0 mix-blend-multiply" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(38,38,38,0.85)_100%)]" />
        <div className="from-raisinBlack absolute inset-0 bg-linear-to-t via-transparent to-transparent opacity-95" />
      </div>

      <div className="relative z-10 flex w-full max-w-6xl flex-col items-center justify-center px-4 pt-12 pb-28 text-center sm:py-0">
        <h1 className="animate-fade-in-up mb-4 flex flex-col items-center">
          <span
            className="font-youngest block py-2 text-[4.2rem] leading-[0.85] text-white sm:text-[5.5rem] sm:leading-tight md:text-[8rem] lg:text-[10.5rem]"
            style={{
              textShadow:
                "0 10px 40px rgba(0,0,0,0.8), 0 0 120px rgba(255,255,255,0.15)",
            }}
          >
            Z pasji do muzyki
          </span>
          <span className="font-montserrat mt-2 block text-sm font-light tracking-[0.25em] text-white/70 sm:text-base md:mt-4">
            Orkiestra Maxime, Dąbrowa Górnicza
          </span>
        </h1>

        <p
          className="animate-fade-in-up font-montserrat mb-8 max-w-2xl text-sm leading-relaxed font-light text-white/80 opacity-0 sm:text-base md:mb-10 md:text-lg"
          style={{ animationDelay: "150ms" }}
        >
          Orkiestra symfoniczna i kameralna z Zagłębia. Gramy koncerty, gale,
          jubileusze firmowe i wydarzenia plenerowe — w składzie od kwartetu po
          czterdziestu muzyków.
        </p>

        <div
          className="animate-fade-in-up flex w-full max-w-[20rem] flex-col items-center justify-center gap-4 opacity-0 sm:w-auto sm:max-w-none sm:flex-row sm:gap-8"
          style={{ animationDelay: "300ms" }}
        >
          {/* Pierwsze CTA prowadzi do oferty, czyli do jedynej strony,
              która zarabia. "Zobacz wydarzenia" nie mówiło, co się stanie. */}
          <Link
            href="/oferta"
            className="group bg-arylideYellow font-montserrat text-raisinBlack relative flex w-full items-center justify-center gap-4 overflow-hidden rounded-full px-8 py-4 text-xs font-bold tracking-[0.2em] uppercase transition-all duration-700 hover:scale-[1.03] hover:shadow-[0_0_30px_-10px_rgba(239,203,111,0.6)] sm:w-auto sm:px-12"
          >
            <span className="relative z-10 flex items-center gap-3">
              Zamów oprawę muzyczną
              {/* aria-hidden zamiast <title>Strzałka</title> — poprzednio
                  czytnik ekranu odczytywał "Zobacz wydarzenia Strzałka". */}
              <svg
                aria-hidden="true"
                focusable="false"
                className="h-4 w-4 transition-transform duration-500 ease-out group-hover:translate-x-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </span>
            <div className="absolute inset-0 z-0 h-full w-full -translate-x-full rounded-full bg-white/30 transition-transform duration-700 ease-out group-hover:translate-x-0" />
          </Link>

          <Link
            href="/wydarzenia"
            className="group font-montserrat hover:text-raisinBlack flex w-full items-center justify-center rounded-full border border-white/20 bg-white/5 px-8 py-4 text-xs font-bold tracking-[0.2em] text-white uppercase backdrop-blur-xl transition-all duration-700 hover:scale-[1.03] hover:bg-white sm:w-auto sm:px-12"
          >
            Najbliższe koncerty
          </Link>
        </div>
      </div>

      <div
        aria-hidden="true"
        className="animate-fade-in-up absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-2 opacity-0 md:bottom-8 md:gap-3 [@media(max-height:600px)]:hidden md:[@media(max-height:800px)]:hidden lg:[@media(max-height:900px)]:hidden"
        style={{ animationDelay: "600ms" }}
      >
        <span className="font-montserrat text-[0.55rem] font-semibold tracking-[0.4em] text-white/50 uppercase">
          Odkryj
        </span>
        <div className="relative h-10 w-px overflow-hidden bg-white/10 md:h-16">
          <div className="animate-scroll-line bg-arylideYellow absolute top-0 left-0 h-full w-full" />
        </div>
      </div>
    </section>
  );
}
