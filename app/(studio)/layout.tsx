// src/app/(studio)/layout.tsx
//
// Layout panelu Sanity. Celowo pusty: Studio ma własne style i nie może
// dziedziczyć ciemnego tła, selekcji w kolorze marki ani chrome serwisu.
// Dlatego klasy motywu siedzą w (user)/layout.tsx, a nie na <body>.
//
// Plik zacznie mieć znaczenie dopiero po podpięciu Sanity —
// do tego czasu może zostać w repo bez trasy /studio.

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Panel treści",
  // Panel nie ma prawa trafić do wyników wyszukiwania.
  robots: { index: false, follow: false, nocache: true },
};

export default function StudioLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
