// components/home/Hero.tsx
//
// Hero z wbudowanym wideo tła. Konsekwencja scalenia: cały hero jest
// komponentem klienckim, więc H1, akapit i przyciski też trafiają
// do bundla i podlegają hydracji. Jeśli kiedyś LCP na komórce zacznie
// uwierać, wydzielenie samego <video> z powrotem cofa ten koszt.
//
// Cała treść widoczna na ekranie jest wpisana tutaj — site.ts trzyma
// dane o organizacji i konfigurację, nie copy.
//
// Nagłówek: "Z pasji do muzyki" to wedle brandbooka motto, nie tytuł.
// Zostaje dominantą wizualną, ale H1 niesie też nazwę i miasto — bez tego
// strona główna nie ma się o co zaczepić w wyszukiwarce, a marka "Maxime"
// koliduje z Orkiestrą Maximus i dwiema Fundacjami Maxima.

"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type NetworkInformation = { saveData?: boolean };

export default function Hero() {
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  // Wideo dociągane po załadowaniu strony, żeby nie konkurowało
  // o pasmo z plakatem, który jest elementem LCP.
  useEffect(() => {
    const connection = (
      navigator as Navigator & { connection?: NetworkInformation }
    ).connection;
    if (connection?.saveData) return;

    const load = () => {
      // Sprawdzane raz, przy pierwszym ładowaniu. Po obrocie telefonu
      // źródło się nie zmieni — świadomie, bo podmiana w locie
      // przerywałaby odtwarzanie i kosztowała drugie pobranie.
      const isMobile = window.matchMedia("(max-width: 767px)").matches;
      setVideoSrc(isMobile ? "/bg-video-mobile.mp4" : "/bg-video.mp4");
    };

    const schedule = () => {
      if (typeof window.requestIdleCallback === "function") {
        window.requestIdleCallback(load, { timeout: 2000 });
      } else {
        window.setTimeout(load, 800);
      }
    };

    if (document.readyState === "complete") {
      schedule();
      return;
    }

    window.addEventListener("load", schedule, { once: true });
    return () => window.removeEventListener("load", schedule);
  }, []);

  // Autoodtwarzanie bywa ignorowane, gdy src pojawia się po hydracji.
  useEffect(() => {
    if (!videoSrc) return;
    videoRef.current?.play().catch(() => {
      // Odrzucenie (np. tryb oszczędzania energii) zostawia sam plakat.
    });
  }, [videoSrc]);

  // Przewinięcie do sekcji pod hero. Liczone z wysokości samego hero,
  // więc działa niezależnie od tego, co pod nim stoi — nie wymaga
  // kotwicy w komponencie, którego jeszcze nie ma.
  const scrollToContent = () => {
    const height = sectionRef.current?.offsetHeight ?? window.innerHeight;
    window.scrollTo({ top: height });
  };

  return (
    <section
      ref={sectionRef}
      className="bg-raisinBlack relative flex min-h-svh w-full items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0 h-full w-full">
        {/* Element LCP. alt pusty, bo obraz jest dekoracyjny —
            opis sceny powtarzałby treść nagłówka. */}
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

        {videoSrc && (
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            aria-hidden="true"
            tabIndex={-1}
            className="animate-cinematic-zoom absolute inset-0 h-full w-full object-cover"
            src={videoSrc}
          />
        )}

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
          <span className="mt-2 block text-sm font-light tracking-[0.25em] text-white/70 sm:text-base md:mt-4">
            Orkiestra Maxime, Dąbrowa Górnicza
          </span>
        </h1>

        <p
          className="animate-fade-in-up mb-8 max-w-2xl text-sm leading-relaxed font-light text-white/80 opacity-0 sm:text-base md:mb-10 md:text-lg"
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
              która zarabia. */}
          <Link
            href="/oferta"
            className="group bg-arylideYellow text-raisinBlack relative flex w-full items-center justify-center gap-4 overflow-hidden rounded-full px-8 py-4 text-xs font-bold tracking-[0.2em] uppercase transition-[transform,box-shadow] duration-300 hover:scale-[1.03] hover:shadow-[0_0_30px_-10px_rgba(239,203,111,0.6)] sm:w-auto sm:px-12"
          >
            <span className="relative z-10 flex items-center gap-3">
              Zamów oprawę muzyczną
              {/* aria-hidden zamiast <title> — inaczej czytnik ekranu
                  odczytuje "Zamów oprawę muzyczną Strzałka". */}
              <svg
                aria-hidden="true"
                focusable="false"
                className="h-4 w-4 transition-transform duration-300 ease-out group-hover:translate-x-2"
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
            <div className="absolute inset-0 z-0 h-full w-full -translate-x-full rounded-full bg-white/30 transition-transform duration-500 ease-out group-hover:translate-x-0" />
          </Link>

          <Link
            href="/wydarzenia"
            className="hover:text-raisinBlack flex w-full items-center justify-center rounded-full border border-white/20 bg-white/5 px-8 py-4 text-xs font-bold tracking-[0.2em] text-white uppercase backdrop-blur-xl transition-[transform,background-color,color] duration-300 hover:scale-[1.03] hover:bg-white sm:w-auto sm:px-12"
          >
            Najbliższe koncerty
          </Link>
        </div>
      </div>

      {/* Był to element ozdobny, choć wyglądał na klikalny —
          strzałka i animowana kreska to typowa afordancja przewijania.
          Teraz faktycznie przewija. */}
      <button
        type="button"
        onClick={scrollToContent}
        aria-label="Przewiń do treści strony"
        className="animate-fade-in-up absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-2 opacity-0 md:bottom-8 md:gap-3 [@media(max-height:600px)]:hidden md:[@media(max-height:800px)]:hidden lg:[@media(max-height:900px)]:hidden"
        style={{ animationDelay: "600ms" }}
      >
        <span
          aria-hidden="true"
          className="text-[0.55rem] font-semibold tracking-[0.4em] text-white/50 uppercase transition-colors duration-300 hover:text-white"
        >
          Odkryj
        </span>
        <div
          aria-hidden="true"
          className="relative h-10 w-px overflow-hidden bg-white/10 md:h-16"
        >
          <div className="animate-scroll-line bg-arylideYellow absolute top-0 left-0 h-full w-full" />
        </div>
      </button>
    </section>
  );
}
