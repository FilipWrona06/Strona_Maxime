// app/sitemap.ts

import type { MetadataRoute } from "next";

import { isIndexable, siteUrl, staticRoutes } from "@/data/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Wersja robocza nie wystawia mapy — robots.ts też jej wtedy nie podaje,
  // więc oba pliki mówią to samo.
  if (!isIndexable) return [];

  // lastModified świadomie pominięte dla stron statycznych. Data z momentu
  // builda znaczyłaby, że regulamin i kontakt zmieniają się przy każdym
  // wdrożeniu — po kilku cyklach Google przestaje wierzyć temu polu,
  // a właśnie przy wydarzeniach będzie ono potrzebne.
  const pages: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${siteUrl}${route.path}`,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  // Po podpięciu CMS dokleić wpisy dynamiczne — tam lastModified ma sens,
  // bo pochodzi z realnej daty edycji:
  //
  // pages.push(...events.map((e) => ({
  //   url: `${siteUrl}/wydarzenia/${e.slug}`,
  //   lastModified: new Date(e.updatedAt),
  //   changeFrequency: "monthly" as const,
  //   priority: 0.7,
  // })));

  return pages;
}
