// src/app/robots.ts

import type { MetadataRoute } from "next";

import { isIndexable, siteUrl } from "@/data/site";

export default function robots(): MetadataRoute.Robots {
  // Dopóki działamy na domenie vercelowej, blokujemy wszystko.
  // Inaczej Google zaindeksuje wersję roboczą i przy przenosinach
  // zostaniemy z duplikatami — dokładnie to zabiło poprzednią wersję.
  if (!isIndexable) {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }

  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/studio", "/api/"] }],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
