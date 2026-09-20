// app/manifest.ts
//
// Next generuje z tego <link rel="manifest"> automatycznie — nie trzeba
// niczego dopisywać w layout.tsx.
//
// Manifest odpowiada za ikonę przy dodaniu strony do ekranu głównego
// telefonu i jest jednym z sygnałów, po których Google buduje wizytówkę
// w wynikach mobilnych.

import type { MetadataRoute } from "next";

import { site } from "@/data/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.title,
    short_name: site.name,
    description: site.description,
    lang: site.lang,
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#262626",
    theme_color: "#262626",
    categories: ["music", "entertainment", "education"],
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      // Wariant "maskable" ma treść w centralnych 80% kafelka. Android
      // przycina ikony do kształtu narzuconego przez producenta — koło,
      // kwadrat z zaokrągleniem, kropla. Bez tej wersji litera zostałaby
      // obcięta na części urządzeń.
      {
        src: "/icon-maskable.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
