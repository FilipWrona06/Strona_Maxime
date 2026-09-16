// components/home/BackgroundVideo.tsx
//
// Wideo tła. Plakat (Image w Hero) zostaje elementem LCP, wideo dociąga
// się po zakończeniu ładowania strony, żeby nie konkurować o pasmo.
//
// Zmiany po testach:
//  - zdjęta blokada prefers-reduced-motion. Wideo leci zawsze; samą
//    animację najazdu (animate-cinematic-zoom) i tak wygasza reguła
//    w globals.css, więc efekt wjazdu kamery znika, a obraz zostaje.
//  - preload="none" usunięte — Chrome potrafił brać to dosłownie
//    i wstrzymywać autoodtwarzanie.
//  - jawne wywołanie play() po zamontowaniu; niektóre przeglądarki
//    nie startują same, gdy src zostaje podstawiony po hydracji.
//
// Do zrobienia poza kodem: wytnij ścieżkę audio z obu plików mp4.
// Wideo i tak jest muted, a sama ścieżka to kilkanaście procent rozmiaru.

"use client";

import { useEffect, useRef, useState } from "react";

type NetworkInformation = { saveData?: boolean };

export default function BackgroundVideo() {
  const [src, setSrc] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Jedyny warunek, jaki zostaje: tryb oszczędzania danych.
    // Ktoś na limitowanym pakiecie nie powinien pobierać kilku megabajtów tła.
    const connection = (
      navigator as Navigator & { connection?: NetworkInformation }
    ).connection;
    if (connection?.saveData) return;

    const load = () => {
      const isMobile = window.matchMedia("(max-width: 767px)").matches;
      setSrc(isMobile ? "/bg-video-mobile.mp4" : "/bg-video.mp4");
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
    if (!src) return;
    const video = videoRef.current;
    if (!video) return;

    // play() zwraca obietnicę, która potrafi odrzucić np. przy
    // polityce oszczędzania energii. Wtedy zostaje sam plakat pod spodem.
    video.play().catch(() => {});
  }, [src]);

  if (!src) return null;

  return (
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
      src={src}
    />
  );
}
