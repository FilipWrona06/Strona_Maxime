// app/robots.ts

import type { MetadataRoute } from "next";

import { isIndexable, siteUrl } from "@/data/site";

export default function robots(): MetadataRoute.Robots {
  // Wersja robocza: roboty MUSZĄ móc wejść, żeby zobaczyć nagłówek
  // X-Robots-Tag: noindex z next.config.ts. Disallow: "/" dawałby
  // pozorne bezpieczeństwo — zabrania czytać, nie zabrania indeksować,
  // więc zalinkowany adres mógłby trafić do wyników jako pusty rekord,
  // którego Google nie ma prawa sprawdzić ani skorygować.
  if (!isIndexable) {
    return { rules: [{ userAgent: "*", allow: "/" }] };
  }

  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/"] }],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
