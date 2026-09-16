// src/app/sitemap.ts

import type { MetadataRoute } from "next";

import { siteUrl, staticRoutes } from "@/data/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const pages: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${siteUrl}${route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  // Po podpięciu Sanity dokleić tutaj wpisy dynamiczne:
  //
  // const events = await client.fetch(groq`*[_type == "event"]{ slug, _updatedAt }`);
  // pages.push(...events.map((e) => ({
  //   url: `${siteUrl}/wydarzenia/${e.slug.current}`,
  //   lastModified: new Date(e._updatedAt),
  //   changeFrequency: "monthly" as const,
  //   priority: 0.7,
  // })));

  return pages;
}
